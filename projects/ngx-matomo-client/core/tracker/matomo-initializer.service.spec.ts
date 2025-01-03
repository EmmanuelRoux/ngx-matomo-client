import {
  ApplicationInitStatus,
  InjectionToken,
  PLATFORM_ID,
  Provider,
  Signal,
  WritableSignal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { MatomoHolder } from '../holder';
import { MatomoFeature, provideMatomo, withScriptFactory } from '../providers';
import { MatomoTestingTracker, provideTestingTracker } from '../testing/testing-tracker';
import { MATOMO_ROUTER_ENABLED, MatomoConfiguration, MatomoConsentMode } from './configuration';
import { ALREADY_INITIALIZED_ERROR, ALREADY_INJECTED_ERROR } from './errors';
import { MatomoInitializerService } from './matomo-initializer.service';
import { createDefaultMatomoScriptElement } from './script-factory';

declare let window: MatomoHolder;

describe('MatomoInitializerService', () => {
  const injectedScriptSpyToken = new InjectionToken<WritableSignal<HTMLScriptElement | undefined>>(
    'injectedScriptSpyToken',
  );

  async function setUp(
    config: MatomoConfiguration,
    providers: Provider[] = [],
    features: MatomoFeature[] = [],
  ): Promise<{
    tracker: MatomoTestingTracker;
    service: MatomoInitializerService;
    injectedScript: Signal<HTMLScriptElement | undefined>;
  }> {
    const injectedScript = new BehaviorSubject<HTMLScriptElement | undefined>(undefined);

    TestBed.resetTestingModule();

    TestBed.configureTestingModule({
      providers: [
        provideMatomo(config, ...features),
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
      service: TestBed.inject(MatomoInitializerService),
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

  beforeEach(() => delete (window as Partial<MatomoHolder>)._paq);

  it('should register _paq global once', async () => {
    expect(window._paq).toBeUndefined();

    await setUp({ mode: 'manual' });

    const paq = window._paq;

    expect(window._paq).toEqual([]);

    await setUp({ mode: 'manual' });

    expect(window._paq).toEqual([]);
    expect(window._paq).toBe(paq);
  });

  it('should track initial page view by default', async () => {
    // Given
    const { tracker } = await setUp({
      mode: 'manual',
      enableLinkTracking: false,
    });

    // Then
    expect(tracker.calls).toEqual([['trackPageView', undefined]]);
  });

  it('should not track initial page view by default if router is enabled', async () => {
    // Given
    const { tracker } = await setUp(
      {
        mode: 'manual',
        enableLinkTracking: false,
      },
      [{ provide: MATOMO_ROUTER_ENABLED, useValue: true }],
    );

    // Then
    expect(tracker.calls).not.toEqual(
      jasmine.arrayContaining([jasmine.arrayContaining(['trackPageView'])]),
    );
  });

  it('should manually force track initial page view no matter router is enabled', async () => {
    // Given
    const { tracker } = await setUp(
      {
        mode: 'manual',
        trackAppInitialLoad: true,
        enableLinkTracking: false,
      },
      [{ provide: MATOMO_ROUTER_ENABLED, useValue: true }],
    );

    // Then
    expect(tracker.calls).toEqual([['trackPageView', undefined]]);
  });

  it('should not track initial page view with manual configuration, no matter router enabled', async () => {
    // Given
    const { tracker } = await setUp({
      mode: 'manual',
      enableLinkTracking: false,
      trackAppInitialLoad: false,
    });

    // Then
    expect(tracker.calls).not.toEqual(
      jasmine.arrayContaining([jasmine.arrayContaining(['trackPageView'])]),
    );
  });

  it('should enable link tracking with manual configuration', async () => {
    // Given
    const { tracker } = await setUp({
      mode: 'manual',
      trackAppInitialLoad: false,
      enableLinkTracking: true,
    });

    // Then
    expect(tracker.calls).toEqual([['enableLinkTracking', false]]);
  });

  it('should enable link tracking using pseudo-clicks with manual configuration', async () => {
    // Given
    const { tracker } = await setUp({
      mode: 'manual',
      trackAppInitialLoad: false,
      enableLinkTracking: 'enable-pseudo',
    });

    // Then
    expect(tracker.calls).toEqual([['enableLinkTracking', true]]);
  });

  it('should set Do Not Track setting if enabled', async () => {
    // Given
    const { tracker } = await setUp({
      mode: 'manual',
      acceptDoNotTrack: true,
      trackAppInitialLoad: true,
      enableLinkTracking: false,
    });

    // Then
    // Note: 'setDoNotTrack' should be called BEFORE 'trackPageView'
    expect(tracker.calls).toEqual([
      ['setDoNotTrack', true],
      ['trackPageView', undefined],
    ]);
  });

  it('should disable campaign parameters if enabled', async () => {
    // Given
    const { tracker } = await setUp({
      mode: 'manual',
      disableCampaignParameters: true,
      trackAppInitialLoad: true,
      enableLinkTracking: false,
    });

    // Then
    // Note: 'disableCampaignParameters' should be called BEFORE 'trackPageView'
    expect(tracker.calls).toEqual([['disableCampaignParameters'], ['trackPageView', undefined]]);
  });

  (['tracking', MatomoConsentMode.TRACKING] as const).forEach(requireConsent => {
    it('should require tracking consent if setting is enabled', async () => {
      // Given
      const { tracker } = await setUp({
        mode: 'manual',
        trackAppInitialLoad: true,
        enableLinkTracking: false,
        requireConsent,
      });

      // Then
      // Note: 'requireConsent' should be called BEFORE 'trackPageView'
      expect(tracker.calls).toEqual([['requireConsent'], ['trackPageView', undefined]]);
    });
  });

  (['cookie', MatomoConsentMode.COOKIE] as const).forEach(requireConsent => {
    it('should require cookie consent if setting is enabled', async () => {
      // Given
      const { tracker } = await setUp({
        mode: 'manual',
        trackAppInitialLoad: true,
        enableLinkTracking: false,
        requireConsent,
      });

      // Then
      // Note: 'requireCookieConsent' should be called BEFORE 'trackPageView'
      expect(tracker.calls).toEqual([['requireCookieConsent'], ['trackPageView', undefined]]);
    });
  });

  (['none', MatomoConsentMode.NONE, undefined] as const).forEach(requireConsent => {
    it(`should not require any consent if setting is not enabled (${requireConsent})`, async () => {
      // Given
      const { tracker } = await setUp({
        mode: 'manual',
        trackAppInitialLoad: true,
        enableLinkTracking: false,
        requireConsent,
      });

      // Then
      // Note: 'requireConsent' should be called BEFORE 'trackPageView'
      expect(tracker.calls).toEqual([['trackPageView', undefined]]);
      expect(tracker.calls).not.toEqual(
        jasmine.objectContaining([jasmine.arrayContaining(['requireConsent'])]),
      );
      expect(tracker.calls).not.toEqual(
        jasmine.objectContaining([jasmine.arrayContaining(['requireCookieConsent'])]),
      );
    });
  });

  it('should enable JS errors tracking if enabled', async () => {
    // Given
    const { tracker } = await setUp({
      mode: 'manual',
      trackAppInitialLoad: true,
      enableJSErrorTracking: true,
      enableLinkTracking: false,
    });

    // Then
    // Note: 'enableJSErrorTracking' should be called BEFORE 'trackPageView'
    expect(tracker.calls).toEqual([['enableJSErrorTracking'], ['trackPageView', undefined]]);
  });

  it('should inject script automatically with simple configuration', async () => {
    // Given
    const { tracker } = await setUp({
      siteId: 'fakeSiteId',
      trackerUrl: 'http://fakeTrackerUrl',
      enableLinkTracking: false,
    });

    // Then
    expectInjectedScript('http://fakeTrackerUrl/matomo.js');
    expect(tracker.calls).toEqual([
      ['trackPageView', undefined],
      ['setTrackerUrl', 'http://fakeTrackerUrl/matomo.php'],
      ['setSiteId', 'fakeSiteId'],
    ]);
  });

  it('should inject script automatically with site id as number', async () => {
    // Given
    const { tracker } = await setUp({
      siteId: 99,
      trackerUrl: 'http://fakeTrackerUrl',
      enableLinkTracking: false,
    });

    // Then
    expectInjectedScript('http://fakeTrackerUrl/matomo.js');
    expect(tracker.calls).toEqual([
      ['trackPageView', undefined],
      ['setTrackerUrl', 'http://fakeTrackerUrl/matomo.php'],
      ['setSiteId', '99'],
    ]);
  });

  it('should inject script automatically with custom script url', async () => {
    // Given
    await setUp({
      siteId: 'fakeSiteId',
      trackerUrl: 'http://fakeTrackerUrl',
      scriptUrl: 'http://myCustomScriptUrl',
    });

    // Then
    expectInjectedScript('http://myCustomScriptUrl');
  });

  it('should inject script with embedded tracker configuration', async () => {
    // Given
    const { tracker } = await setUp({
      scriptUrl: 'http://myCustomScript.js',
    });

    // Then
    expectInjectedScript('http://myCustomScript.js');
    expect(tracker.calls).not.toEqual(
      jasmine.arrayContaining([jasmine.arrayContaining(['setTrackerUrl'])]),
    );
    expect(tracker.calls).not.toEqual(
      jasmine.arrayContaining([jasmine.arrayContaining(['setSiteId'])]),
    );
  });

  it('should inject script automatically with multiple trackers', async () => {
    // Given
    const { tracker } = await setUp({
      enableLinkTracking: false,
      trackers: [
        { siteId: 'site1', trackerUrl: 'http://fakeTrackerUrl1' },
        { siteId: 'site2', trackerUrl: 'http://fakeTrackerUrl2/' }, // Should work with trailing slash
        { siteId: 'site3', trackerUrl: 'http://fakeTrackerUrl3' },
      ],
    });

    // Then
    expectInjectedScript('http://fakeTrackerUrl1/matomo.js');
    expect(tracker.calls).toEqual([
      ['trackPageView', undefined],
      ['setTrackerUrl', 'http://fakeTrackerUrl1/matomo.php'],
      ['setSiteId', 'site1'],
      ['addTracker', 'http://fakeTrackerUrl2/matomo.php', 'site2'],
      ['addTracker', 'http://fakeTrackerUrl3/matomo.php', 'site3'],
    ]);
  });

  it('should append custom tracker suffix if configured, matomo.php otherwise', async () => {
    // Given
    const { tracker } = await setUp({
      enableLinkTracking: false,
      trackers: [
        { siteId: 'site1', trackerUrl: 'http://fakeTrackerUrl1', trackerUrlSuffix: '' },
        {
          siteId: 'site2',
          trackerUrl: 'http://fakeTrackerUrl2',
          trackerUrlSuffix: '/custom-tracker.php',
        },
        { siteId: 'site3', trackerUrl: 'http://fakeTrackerUrl3' },
      ],
    });

    // Then
    expectInjectedScript('http://fakeTrackerUrl1/matomo.js');

    expect(tracker.calls).toEqual([
      ['trackPageView', undefined],
      ['setTrackerUrl', 'http://fakeTrackerUrl1'],
      ['setSiteId', 'site1'],
      ['addTracker', 'http://fakeTrackerUrl2/custom-tracker.php', 'site2'],
      ['addTracker', 'http://fakeTrackerUrl3/matomo.php', 'site3'],
    ]);
  });

  it('should do nothing when disabled', async () => {
    // Given
    const { service } = await setUp({
      disabled: true,
      siteId: 'fakeSiteId',
      trackerUrl: 'http://fakeTrackerUrl',
    });

    // When
    service.initializeTracker({ trackerUrl: '', siteId: '' });

    // Then
    expectNoInjectedScript();
    expect(window._paq).toBeUndefined();
  });

  it('should do nothing when platform is not browser', async () => {
    // Given
    // See here: https://github.com/angular/angular/blob/b66e479cdb1e474a29ff676f10a5fcc3d7eae799/packages/common/src/platform_id.ts
    const serverPlatform = 'server';

    const { service } = await setUp(
      {
        disabled: false,
        siteId: 'fakeSiteId',
        trackerUrl: 'http://fakeTrackerUrl',
      },
      [{ provide: PLATFORM_ID, useValue: serverPlatform }],
    );

    // When
    service.initializeTracker({ trackerUrl: '', siteId: '' });

    // Then
    expectNoInjectedScript();
    expect(window._paq).toBeUndefined();
  });

  it('should create custom script tag', async () => {
    // Given
    const { injectedScript } = await setUp(
      {
        siteId: 1,
        trackerUrl: '',
        scriptUrl: '/fake/script/url',
      },
      [],
      [
        withScriptFactory((scriptUrl, document) => {
          const script = createDefaultMatomoScriptElement(scriptUrl, document);

          script.setAttribute('data-cookieconsent', 'statistics');

          return script;
        }),
      ],
    );

    // Then
    expect(injectedScript()?.src).toMatch('^(.+://[^/]+)?/fake/script/url$');
    expect(injectedScript()?.dataset.cookieconsent).toEqual('statistics');
  });

  it('should create custom script tag with forRoot factory', async () => {
    // Given
    const { injectedScript } = await setUp(
      {
        siteId: 1,
        trackerUrl: '',
        scriptUrl: '/fake/script/url',
      },
      [],
      [
        withScriptFactory((scriptUrl, document) => {
          const script = createDefaultMatomoScriptElement(scriptUrl, document);

          script.setAttribute('data-cookieconsent', 'statistics');

          return script;
        }),
      ],
    );

    // Then
    expect(injectedScript()?.src).toMatch('^(.+://[^/]+)?/fake/script/url$');
    expect(injectedScript()?.dataset.cookieconsent).toEqual('statistics');
  });

  it('should defer script injection until tracker configuration is provided', async () => {
    // Given
    const { tracker, service } = await setUp({
      mode: 'deferred',
      trackAppInitialLoad: true,
      enableLinkTracking: false,
    });

    // Then
    expectNoInjectedScript();
    expect(tracker.calls).toEqual([['trackPageView', undefined]]);

    // When
    service.initializeTracker({
      siteId: 'fakeSiteId',
      trackerUrl: 'http://fakeTrackerUrl',
    });

    // Then
    expectInjectedScript('http://fakeTrackerUrl/matomo.js');
    expect(tracker.calls).toEqual([
      ['trackPageView', undefined],
      ['setTrackerUrl', 'http://fakeTrackerUrl/matomo.php'],
      ['setSiteId', 'fakeSiteId'],
    ]);
  });

  it('should map deprecated init() method to initialize()', async () => {
    // Given
    const { service } = await setUp({
      trackerUrl: '',
      siteId: '',
    });

    spyOn(service, 'initialize');

    // When
    service.init();

    // Then
    expect(service.initialize).toHaveBeenCalledOnceWith();
  });

  it('should throw an error when initialized trackers more than once', async () => {
    // Given
    const { service } = await setUp({
      mode: 'deferred',
    });

    // When
    service.initializeTracker({ trackerUrl: '', siteId: '' });

    // Then
    expect(() => service.initializeTracker({ trackerUrl: '', siteId: '' })).toThrowError(
      ALREADY_INJECTED_ERROR,
    );
  });

  it('should throw an error when initialized more than once', async () => {
    // Given
    const { service } = await setUp({
      trackerUrl: '',
      siteId: '',
    });

    // Then
    expect(() => service.initialize()).toThrowError(ALREADY_INITIALIZED_ERROR);
  });
});
