import { ɵPLATFORM_SERVER_ID } from '@angular/common';
import {
  ApplicationInitStatus,
  ErrorHandler,
  InjectionToken,
  PLATFORM_ID,
  Provider,
  Signal,
  WritableSignal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TestBed } from '@angular/core/testing';
import {
  MatomoConfiguration,
  MatomoFeature,
  MatomoTracker,
  provideMatomo,
  ɵMatomoTestingTracker as MatomoTestingTracker,
  ɵprovideTestingTracker as provideTestingTracker,
} from 'ngx-matomo-client/core';
import { BehaviorSubject } from 'rxjs';
import { MatomoAbTestingConfiguration } from './configuration';
import { withAbTesting } from './providers';

describe('MatomoAbTestingInitializer', () => {
  const injectedScriptSpyToken = new InjectionToken<WritableSignal<HTMLScriptElement | undefined>>(
    'injectedScriptSpyToken',
  );

  async function setUp(
    abTestingConfig: MatomoAbTestingConfiguration,
    config: MatomoConfiguration,
    providers: Provider[] = [],
    features: MatomoFeature[] = [],
  ): Promise<{
    tracker: MatomoTestingTracker;
    service: MatomoTracker;
    injectedScript: Signal<HTMLScriptElement | undefined>;
  }> {
    const injectedScript = new BehaviorSubject<HTMLScriptElement | undefined>(undefined);

    TestBed.resetTestingModule();

    TestBed.configureTestingModule({
      providers: [
        provideMatomo(config, withAbTesting(abTestingConfig), ...features),
        provideTestingTracker(),
        ...providers,
        {
          provide: injectedScriptSpyToken,
          useFactory: () => toSignal(injectedScript),
        },
      ],
    });

    setUpScriptInjection(script => injectedScript.next(script));

    // https://github.com/angular/angular/issues/24218
    await TestBed.inject(ApplicationInitStatus).donePromise;

    return {
      service: TestBed.inject(MatomoTracker),
      tracker: TestBed.inject(MatomoTestingTracker),
      injectedScript: TestBed.inject(injectedScriptSpyToken),
    };
  }

  function setUpScriptInjection(cb: (injectedScript: HTMLScriptElement) => void): void {
    const mockContainer = jasmine.createSpyObj<HTMLElement>('FakeContainer', ['insertBefore']);
    const mockExistingScript = jasmine.createSpyObj<HTMLScriptElement>('FakeExistingScript', [], {
      parentNode: mockContainer,
      parentElement: mockContainer,
    });

    mockContainer.insertBefore.and.callFake(script => {
      cb(script as unknown as HTMLScriptElement);
      return script;
    });

    const getElementsByTagNameSpy = jasmine.isSpy(window.document.getElementsByTagName)
      ? (window.document.getElementsByTagName as jasmine.Spy<Document['getElementsByTagName']>)
      : spyOn(window.document, 'getElementsByTagName');

    // Not a perfect spy, as the actual returned value is an Array, not an HTMLCollection
    getElementsByTagNameSpy.and.returnValue([
      mockExistingScript,
    ] as unknown as HTMLCollectionOf<Element>);
  }

  function expectInjectedScript(expectedUrl: string): void {
    const script = TestBed.inject(injectedScriptSpyToken)();

    expect(script).toBeTruthy();
    expect(script?.type).toEqual('text/javascript');
    expect(script?.async).toBeTrue();
    expect(script?.defer).toBeTrue();
    expect(script?.src?.toLowerCase()).toMatch(expectedUrl.toLowerCase()); // script url may be lowercased by browser
  }

  function expectNoInjectedScript(): void {
    const script = TestBed.inject(injectedScriptSpyToken)();

    expect(script).toBeUndefined();
  }

  it('should not inject any script by default', async () => {
    // Given
    const { tracker } = await setUp({}, { mode: 'manual' });

    // Then
    expectNoInjectedScript();
    expect(tracker.callsAfterInit).toEqual([]);
  });

  it('should inject default script', async () => {
    // Given
    await setUp({ loadScript: true }, { siteId: 42, trackerUrl: 'http://test.localhost' });

    // Then
    expectInjectedScript('http://test.localhost/plugins/AbTesting/tracker.min.js');
  });

  it('should inject script from custom url', async () => {
    // Given
    await setUp(
      { loadScript: 'http://custom.test.url/script.js' },
      { siteId: 42, trackerUrl: 'http://test.localhost' },
    );

    // Then
    expectInjectedScript('http://custom.test.url/script.js');
  });

  it('should throw when trying to inject default script without tracker configuration', async () => {
    // Given
    let resolveCaughtError: (error: unknown) => void;
    const caughtError = new Promise(resolve => (resolveCaughtError = resolve));

    await setUp({ loadScript: true }, { mode: 'manual' }, [
      {
        provide: ErrorHandler,
        useValue: {
          handleError: error => resolveCaughtError(error),
        } satisfies ErrorHandler,
      },
    ]);

    // Then
    await expectAsync(caughtError).toBeResolvedTo(
      new Error(
        'Cannot resolve default matomo AbTesting plugin script url. ' +
          'Please explicitly provide `loadScript` configuration property instead of `true`',
      ),
    );
    expectNoInjectedScript();
  });

  it('should not inject script when Matomo is disabled', async () => {
    // Given
    await setUp(
      { loadScript: true },
      { siteId: 42, trackerUrl: 'http://test.localhost', disabled: true },
    );

    // Then
    expectNoInjectedScript();
  });

  it('should not inject script when not running in browser', async () => {
    // Given
    await setUp({ loadScript: true }, { siteId: 42, trackerUrl: 'http://test.localhost' }, [
      { provide: PLATFORM_ID, useValue: ɵPLATFORM_SERVER_ID },
    ]);

    // Then
    expectNoInjectedScript();
  });
});
