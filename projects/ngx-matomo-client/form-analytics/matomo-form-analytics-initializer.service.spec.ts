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
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import {
  MatomoConfiguration,
  MatomoFeature,
  MatomoTracker,
  provideMatomo,
} from 'ngx-matomo-client/core';
import { BehaviorSubject } from 'rxjs';
import { MatomoTestingTracker, provideTestingTracker } from '../core/testing/testing-tracker';
import { MatomoFormAnalyticsConfiguration } from './configuration';
import { withFormAnalytics } from './providers';

describe('MatomoFormAnalyticsInitializer', () => {
  const injectedScriptSpyToken = new InjectionToken<WritableSignal<HTMLScriptElement | undefined>>(
    'injectedScriptSpyToken',
  );

  async function setUp(
    formAnalyticsConfig: MatomoFormAnalyticsConfiguration,
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
        provideMatomo(config, withFormAnalytics(formAnalyticsConfig), ...features),
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

  it('should inject default script', async () => {
    // Given
    await setUp(
      {
        loadScript: true,
      },
      {
        siteId: 42,
        trackerUrl: 'http://test.localhost',
      },
    );

    // Then
    expectInjectedScript('http://test.localhost/plugins/FormAnalytics/tracker.min.js');
  });

  it('should inject script from custom url', async () => {
    // Given
    await setUp(
      {
        loadScript: 'http://custom.test.url/script.js',
      },
      {
        siteId: 42,
        trackerUrl: 'http://test.localhost',
      },
    );

    // Then
    expectInjectedScript('http://custom.test.url/script.js');
  });

  it('should throw when trying to inject default script without tracker configuration', async () => {
    // Given
    let handleError: (error: unknown) => void;
    const caughtError = new Promise(resolve => (handleError = resolve));

    await setUp(
      {
        loadScript: true,
      },
      {
        mode: 'manual',
      },
      [
        {
          provide: ErrorHandler,
          useFactory: (): ErrorHandler => ({ handleError }),
        },
      ],
    );

    // Then
    await expectAsync(caughtError).toBeResolvedTo(
      new Error(
        'Cannot resolve default matomo FormAnalytics plugin script url. ' +
          'Please explicitly provide `loadScript` configuration property instead of `true`',
      ),
    );
    expectNoInjectedScript();
  });

  it('should rescan for forms after each page track', async () => {
    // Given
    const { tracker, service } = await setUp({}, { mode: 'manual' });

    expect(tracker.callsAfterInit).toEqual([]);

    service.trackPageView();

    expect(tracker.callsAfterInit).toEqual([
      ['trackPageView', undefined],
      ['FormAnalytics::scanForForms', undefined],
    ]);

    service.trackPageView();

    expect(tracker.callsAfterInit).toEqual([
      ['trackPageView', undefined],
      ['FormAnalytics::scanForForms', undefined],
      ['trackPageView', undefined],
      ['FormAnalytics::scanForForms', undefined],
    ]);
  });

  it('should rescan for forms after each page track with delay', fakeAsync(() => {
    // Given
    setUp(
      {
        autoScanDelay: 42,
      },
      { mode: 'manual' },
    );

    const tracker = TestBed.inject(MatomoTestingTracker);
    const client = TestBed.inject(MatomoTracker);

    tick();
    expect(tracker!).toBeDefined();

    // When
    client.trackPageView();
    tick();
    // Then
    expect(tracker!.callsAfterInit).toEqual([['trackPageView', undefined]]);

    // When
    tick(42);
    // Then
    expect(tracker!.callsAfterInit).toEqual([
      ['trackPageView', undefined],
      ['FormAnalytics::scanForForms', undefined],
    ]);
  }));

  it('should disable form analytics', async () => {
    // Given
    const { tracker } = await setUp(
      {
        disabled: true,
      },
      { mode: 'manual', enableLinkTracking: false },
      [],
    );

    expect(tracker.calls).toEqual([
      ['trackPageView', undefined],
      ['FormAnalytics::disableFormAnalytics'],
    ]);
  });

  it('should implicitly disable form analytics when not running in browser', async () => {
    // Given
    const { tracker, service } = await setUp({}, { mode: 'manual' }, [
      { provide: PLATFORM_ID, useValue: ɵPLATFORM_SERVER_ID },
    ]);

    expect(tracker.calls).toEqual([]);

    // When
    service.trackPageView();
    // Then
    expect(tracker.calls).toEqual([['trackPageView', undefined]]);
  });
});
