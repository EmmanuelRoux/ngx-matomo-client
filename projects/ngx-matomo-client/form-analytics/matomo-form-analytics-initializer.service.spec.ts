import { Provider } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import {
  AutoMatomoConfiguration,
  InternalMatomoConfiguration,
  MATOMO_CONFIGURATION,
  MatomoInitializationMode,
  MatomoTracker,
  ɵASYNC_INTERNAL_MATOMO_CONFIGURATION as ASYNC_INTERNAL_MATOMO_CONFIGURATION,
  ɵDEFERRED_INTERNAL_MATOMO_CONFIGURATION as DEFERRED_INTERNAL_MATOMO_CONFIGURATION,
} from 'ngx-matomo-client/core';
import { EMPTY, Observable, Subject } from 'rxjs';
import {
  MATOMO_FORM_ANALYTICS_CONFIGURATION,
  MatomoFormAnalyticsConfiguration,
} from './configuration';
import { MatomoFormAnalyticsInitializer } from './matomo-form-analytics-initializer.service';
import { MatomoFormAnalytics } from './matomo-form-analytics.service';

describe('MatomoFormAnalyticsInitializer', () => {
  async function instantiate(
    formAnalyticsConfig: MatomoFormAnalyticsConfiguration,
    config: Partial<InternalMatomoConfiguration>,
    providers: Provider[] = [],
    pageViewTracked: Observable<void> = EMPTY,
  ): Promise<MatomoFormAnalyticsInitializer> {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: MATOMO_CONFIGURATION,
          useValue: config,
        },
        {
          provide: MATOMO_FORM_ANALYTICS_CONFIGURATION,
          useValue: formAnalyticsConfig,
        },
        {
          provide: MatomoTracker,
          useValue: jasmine.createSpyObj<MatomoTracker>('MatomoTracker', [], {
            pageViewTracked,
          }),
        },
        {
          provide: MatomoFormAnalytics,
          useValue: jasmine.createSpyObj<MatomoFormAnalytics>('MatomoFormAnalytics', [
            'scanForForms',
            'disableFormAnalytics',
          ]),
        },
        ...providers,
      ],
    });

    TestBed.inject(DEFERRED_INTERNAL_MATOMO_CONFIGURATION).markReady({} as AutoMatomoConfiguration);
    await TestBed.inject(ASYNC_INTERNAL_MATOMO_CONFIGURATION);

    return TestBed.inject(MatomoFormAnalyticsInitializer);
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

    spyOn(window.document, 'getElementsByTagName').and.returnValue([
      mockExistingScript,
    ] as unknown as HTMLCollectionOf<Element>);
  }

  function expectInjectedScript(script: HTMLScriptElement | undefined, expectedUrl: string): void {
    expect(script).toBeTruthy();
    expect(script?.type).toEqual('text/javascript');
    expect(script?.async).toBeTrue();
    expect(script?.defer).toBeTrue();
    expect(script?.src.toLowerCase()).toMatch(expectedUrl.toLowerCase()); // script url may be lowercased by browser
  }

  it('should inject default script', async () => {
    // Given
    let injectedScript: HTMLScriptElement | undefined;
    const initializer = await instantiate(
      {
        loadScript: true,
      },
      {
        siteId: 42,
        trackerUrl: 'http://test.localhost',
      },
    );

    setUpScriptInjection(script => (injectedScript = script));

    // When
    await initializer.initialize();

    // Then
    expectInjectedScript(
      injectedScript,
      'http://test.localhost/plugins/FormAnalytics/tracker.min.js',
    );
  });

  it('should inject script from custom url', async () => {
    // Given
    let injectedScript: HTMLScriptElement | undefined;
    const initializer = await instantiate(
      {
        loadScript: 'http://custom.test.url/script.js',
      },
      {
        siteId: 42,
        trackerUrl: 'http://test.localhost',
      },
    );

    setUpScriptInjection(script => (injectedScript = script));

    // When
    await initializer.initialize();

    // Then
    expectInjectedScript(injectedScript, 'http://custom.test.url/script.js');
  });

  it('should throw when trying to inject default script without tracker configuration', async () => {
    // Given
    let injectedScript: HTMLScriptElement | undefined;
    const initializer = await instantiate(
      {
        loadScript: true,
      },
      {
        mode: MatomoInitializationMode.MANUAL,
      },
    );

    setUpScriptInjection(script => (injectedScript = script));

    // When
    await expectAsync(initializer.initialize()).toBeRejected();

    // Then
    expect(injectedScript).toBeUndefined();
  });

  it('should rescan for forms after each page track', async () => {
    // Given
    const pageViewTracked = new Subject<void>();
    const initializer = await instantiate({}, {}, [], pageViewTracked);
    const formAnalytics = TestBed.inject(MatomoFormAnalytics);

    await initializer.initialize();
    expect(formAnalytics.scanForForms).not.toHaveBeenCalled();

    // When
    pageViewTracked.next();
    // Then
    expect(formAnalytics.scanForForms).toHaveBeenCalledTimes(1);

    // When
    pageViewTracked.next();
    // Then
    expect(formAnalytics.scanForForms).toHaveBeenCalledTimes(2);
  });

  it('should rescan for forms after each page track with delay', fakeAsync(() => {
    // Given
    const pageViewTracked = new Subject<void>();
    let initializer!: MatomoFormAnalyticsInitializer;
    instantiate(
      {
        autoScanDelay: 42,
      },
      {},
      [],
      pageViewTracked,
    ).then(res => (initializer = res));

    tick();
    expect(initializer).toBeDefined();

    const formAnalytics = TestBed.inject(MatomoFormAnalytics);

    initializer.initialize();

    // When
    pageViewTracked.next();
    tick();
    // Then
    expect(formAnalytics.scanForForms).not.toHaveBeenCalled();

    // When
    tick(42);
    // Then
    expect(formAnalytics.scanForForms).toHaveBeenCalledTimes(1);
  }));

  it('should disable form analytics', async () => {
    // Given
    const initializer = await instantiate(
      {
        disabled: true,
      },
      {},
      [],
    );
    const formAnalytics = TestBed.inject(MatomoFormAnalytics);

    await initializer.initialize();
    expect(formAnalytics.disableFormAnalytics).toHaveBeenCalledTimes(1);
  });
});
