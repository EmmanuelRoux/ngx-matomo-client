import { EnvironmentInjector, PLATFORM_ID, Provider } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatomoHolder } from '../holder';
import { provideMatomo, withScriptFactory } from '../ngx-matomo-providers';
import {
  MATOMO_CONFIGURATION,
  MatomoConfiguration,
  MatomoConsentMode,
  MatomoInitializationMode,
} from './configuration';
import { ALREADY_INITIALIZED_ERROR, ALREADY_INJECTED_ERROR } from './errors';
import { MatomoInitializerService } from './matomo-initializer.service';
import { MatomoTracker } from './matomo-tracker.service';
import {
  createDefaultMatomoScriptElement,
  MATOMO_SCRIPT_FACTORY,
  MatomoScriptFactory,
} from './script-factory';

declare var window: MatomoHolder;

describe('MatomoInitializerService', () => {
  function instantiate(
    config: MatomoConfiguration,
    providers: Provider[] = []
  ): MatomoInitializerService {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: MATOMO_CONFIGURATION,
          useValue: config,
        },
        ...providers,
      ],
    });

    return TestBed.inject(MatomoInitializerService);
  }

  beforeEach(() => delete (window as Partial<MatomoHolder>)._paq);

  it('should register _paq global once', () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: MATOMO_CONFIGURATION,
          useValue: {},
        },
      ],
    })
      .inject(EnvironmentInjector)
      .runInContext(() => {
        // Given
        let paq: MatomoHolder['_paq'];
        expect(window._paq).toBeUndefined();

        // When
        new MatomoInitializerService();
        // Then
        expect(window._paq).toEqual([]);
        paq = window._paq;

        // When
        new MatomoInitializerService();
        // Then
        expect(window._paq).toEqual([]);
        expect(window._paq).toBe(paq);
      });
  });

  it('should track initial page view with manual configuration', () => {
    // Given
    const service = instantiate({
      mode: MatomoInitializationMode.MANUAL,
      trackAppInitialLoad: true,
      enableLinkTracking: false,
    });
    const tracker = TestBed.inject(MatomoTracker);

    spyOn(tracker, 'trackPageView');

    // When
    service.initialize();

    // Then
    expect(tracker.trackPageView).toHaveBeenCalledOnceWith();
  });

  it('should enable link tracking with manual configuration', () => {
    // Given
    const service = instantiate({
      mode: MatomoInitializationMode.MANUAL,
      trackAppInitialLoad: false,
      enableLinkTracking: true,
    });
    const tracker = TestBed.inject(MatomoTracker);

    spyOn(tracker, 'enableLinkTracking');

    // When
    service.initialize();

    // Then
    expect(tracker.enableLinkTracking).toHaveBeenCalledOnceWith(false);
  });

  it('should enable link tracking using pseudo-clicks with manual configuration', () => {
    // Given
    const service = instantiate({
      mode: MatomoInitializationMode.MANUAL,
      trackAppInitialLoad: false,
      enableLinkTracking: 'enable-pseudo',
    });
    const tracker = TestBed.inject(MatomoTracker);

    spyOn(tracker, 'enableLinkTracking');

    // When
    service.initialize();

    // Then
    expect(tracker.enableLinkTracking).toHaveBeenCalledOnceWith(true);
  });

  it('should set Do Not Track setting if enabled', () => {
    // Given
    const service = instantiate({
      mode: MatomoInitializationMode.MANUAL,
      acceptDoNotTrack: true,
      trackAppInitialLoad: true,
      enableLinkTracking: false,
    });
    const tracker = TestBed.inject(MatomoTracker);

    spyOn(tracker, 'trackPageView');
    spyOn(tracker, 'setDoNotTrack');

    // When
    service.initialize();

    // Then
    expect(tracker.trackPageView).toHaveBeenCalledOnceWith();
    expect(tracker.setDoNotTrack).toHaveBeenCalledOnceWith(true);
    expect(tracker.setDoNotTrack).toHaveBeenCalledBefore(tracker.trackPageView);
  });

  it('should require tracking consent if setting if enabled', () => {
    // Given
    const service = instantiate({
      mode: MatomoInitializationMode.MANUAL,
      requireConsent: MatomoConsentMode.TRACKING,
      trackAppInitialLoad: true,
      enableLinkTracking: false,
    });
    const tracker = TestBed.inject(MatomoTracker);

    spyOn(tracker, 'trackPageView');
    spyOn(tracker, 'requireConsent');

    // When
    service.initialize();

    // Then
    expect(tracker.trackPageView).toHaveBeenCalledOnceWith();
    expect(tracker.requireConsent).toHaveBeenCalledOnceWith();
    expect(tracker.requireConsent).toHaveBeenCalledBefore(tracker.trackPageView);
  });

  it('should require cookie consent if setting if enabled', () => {
    // Given
    const service = instantiate({
      mode: MatomoInitializationMode.MANUAL,
      requireConsent: MatomoConsentMode.COOKIE,
      trackAppInitialLoad: true,
      enableLinkTracking: false,
    });
    const tracker = TestBed.inject(MatomoTracker);

    spyOn(tracker, 'trackPageView');
    spyOn(tracker, 'requireCookieConsent');

    // When
    service.initialize();

    // Then
    expect(tracker.trackPageView).toHaveBeenCalledOnceWith();
    expect(tracker.requireCookieConsent).toHaveBeenCalledOnceWith();
    expect(tracker.requireCookieConsent).toHaveBeenCalledBefore(tracker.trackPageView);
  });

  it('should enable JS errors tracking if enabled', () => {
    // Given
    const service = instantiate({
      mode: MatomoInitializationMode.MANUAL,
      trackAppInitialLoad: true,
      enableJSErrorTracking: true,
    });
    const tracker = TestBed.inject(MatomoTracker);

    spyOn(tracker, 'trackPageView');
    spyOn(tracker, 'enableJSErrorTracking');

    // When
    service.initialize();

    // Then
    expect(tracker.trackPageView).toHaveBeenCalledTimes(1);
    expect(tracker.enableJSErrorTracking).toHaveBeenCalledTimes(1);
    expect(tracker.enableJSErrorTracking).toHaveBeenCalledBefore(tracker.trackPageView);
  });

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

  it('should inject script automatically with simple configuration', () => {
    // Given
    let injectedScript: HTMLScriptElement | undefined;
    const service = instantiate({
      siteId: 'fakeSiteId',
      trackerUrl: 'http://fakeTrackerUrl',
    });
    const tracker = TestBed.inject(MatomoTracker);

    spyOn(tracker, 'setTrackerUrl');
    spyOn(tracker, 'setSiteId');
    setUpScriptInjection(script => (injectedScript = script));

    // When
    service.initialize();

    // Then
    expectInjectedScript(injectedScript, 'http://fakeTrackerUrl/matomo.js');
    expect(tracker.setTrackerUrl).toHaveBeenCalledOnceWith('http://fakeTrackerUrl/matomo.php');
    expect(tracker.setSiteId).toHaveBeenCalledOnceWith('fakeSiteId');
  });

  it('should inject script automatically with site id as number', () => {
    // Given
    let injectedScript: HTMLScriptElement | undefined;
    const service = instantiate({
      siteId: 99,
      trackerUrl: 'http://fakeTrackerUrl',
    });
    const tracker = TestBed.inject(MatomoTracker);

    spyOn(tracker, 'setTrackerUrl');
    spyOn(tracker, 'setSiteId');
    setUpScriptInjection(script => (injectedScript = script));

    // When
    service.initialize();

    // Then
    expectInjectedScript(injectedScript, 'http://fakeTrackerUrl/matomo.js');
    expect(tracker.setTrackerUrl).toHaveBeenCalledOnceWith('http://fakeTrackerUrl/matomo.php');
    expect(tracker.setSiteId).toHaveBeenCalledOnceWith('99');
  });

  it('should inject script automatically with custom script url', () => {
    // Given
    let injectedScript: HTMLScriptElement | undefined;
    const service = instantiate({
      siteId: 'fakeSiteId',
      trackerUrl: 'http://fakeTrackerUrl',
      scriptUrl: 'http://myCustomScriptUrl',
    });

    setUpScriptInjection(script => (injectedScript = script));

    // When
    service.initialize();

    // Then
    expectInjectedScript(injectedScript, 'http://myCustomScriptUrl');
  });

  it('should inject script with embedded tracker configuration', () => {
    // Given
    let injectedScript: HTMLScriptElement | undefined;
    const service = instantiate({
      scriptUrl: 'http://myCustomScript.js',
    });
    const tracker = TestBed.inject(MatomoTracker);

    spyOn(tracker, 'setTrackerUrl');
    spyOn(tracker, 'setSiteId');

    setUpScriptInjection(script => (injectedScript = script));

    // When
    service.initialize();

    // Then
    expectInjectedScript(injectedScript, 'http://myCustomScript.js');
    expect(tracker.setTrackerUrl).not.toHaveBeenCalled();
    expect(tracker.setSiteId).not.toHaveBeenCalled();
  });

  it('should inject script automatically with multiple trackers', () => {
    // Given
    let injectedScript: HTMLScriptElement | undefined;
    const service = instantiate({
      trackers: [
        { siteId: 'site1', trackerUrl: 'http://fakeTrackerUrl1' },
        { siteId: 'site2', trackerUrl: 'http://fakeTrackerUrl2/' }, // Should work with trailing slash
        { siteId: 'site3', trackerUrl: 'http://fakeTrackerUrl3' },
      ],
    });
    const tracker = TestBed.inject(MatomoTracker);

    spyOn(tracker, 'setTrackerUrl');
    spyOn(tracker, 'setSiteId');
    spyOn(tracker, 'addTracker');
    setUpScriptInjection(script => (injectedScript = script));

    // When
    service.initialize();

    // Then
    expectInjectedScript(injectedScript, 'http://fakeTrackerUrl1/matomo.js');
    expect(tracker.setTrackerUrl).toHaveBeenCalledOnceWith('http://fakeTrackerUrl1/matomo.php');
    expect(tracker.setSiteId).toHaveBeenCalledOnceWith('site1');
    expect(tracker.addTracker).toHaveBeenCalledWith('http://fakeTrackerUrl2/matomo.php', 'site2');
    expect(tracker.addTracker).toHaveBeenCalledWith('http://fakeTrackerUrl3/matomo.php', 'site3');
    expect(tracker.addTracker).toHaveBeenCalledTimes(2);
  });

  it('should append custom tracker suffix if configured, matomo.php otherwise', () => {
    // Given
    let injectedScript: HTMLScriptElement | undefined;
    const service = instantiate({
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
    const tracker = TestBed.inject(MatomoTracker);

    spyOn(tracker, 'setTrackerUrl');
    spyOn(tracker, 'setSiteId');
    spyOn(tracker, 'addTracker');
    setUpScriptInjection(script => (injectedScript = script));

    // When
    service.initialize();

    // Then
    expectInjectedScript(injectedScript, 'http://fakeTrackerUrl1/matomo.js');
    expect(tracker.setTrackerUrl).toHaveBeenCalledOnceWith('http://fakeTrackerUrl1');
    expect(tracker.setSiteId).toHaveBeenCalledOnceWith('site1');
    expect(tracker.addTracker).toHaveBeenCalledWith(
      'http://fakeTrackerUrl2/custom-tracker.php',
      'site2'
    );
    expect(tracker.addTracker).toHaveBeenCalledWith('http://fakeTrackerUrl3/matomo.php', 'site3');
    expect(tracker.addTracker).toHaveBeenCalledTimes(2);
  });

  it('should do nothing when disabled', () => {
    // Given
    let injectedScript: HTMLScriptElement | undefined;
    const service = instantiate({
      disabled: true,
      siteId: 'fakeSiteId',
      trackerUrl: 'http://fakeTrackerUrl',
    });

    setUpScriptInjection(script => (injectedScript = script));

    // When
    service.initialize();
    service.initializeTracker({ trackerUrl: '', siteId: '' });

    // Then
    expect(injectedScript).toBeUndefined();
    expect(window._paq).toBeUndefined();
  });

  it('should do nothing when platform is not browser', () => {
    // Given
    let injectedScript: HTMLScriptElement | undefined;
    // See here: https://github.com/angular/angular/blob/b66e479cdb1e474a29ff676f10a5fcc3d7eae799/packages/common/src/platform_id.ts
    const serverPlatform = 'server';
    const service = instantiate(
      {
        disabled: false,
        siteId: 'fakeSiteId',
        trackerUrl: 'http://fakeTrackerUrl',
      },
      [{ provide: PLATFORM_ID, useValue: serverPlatform }]
    );

    setUpScriptInjection(script => (injectedScript = script));

    // When
    service.initialize();

    // Then
    expect(injectedScript).toBeUndefined();
    expect(window._paq).toBeUndefined();
  });

  it('should create custom script tag', () => {
    // Given
    let injectedScript: HTMLScriptElement | undefined;

    TestBed.configureTestingModule({
      providers: [
        {
          provide: MATOMO_CONFIGURATION,
          useValue: {
            siteId: 1,
            trackerUrl: '',
            scriptUrl: '/fake/script/url',
          } as MatomoConfiguration,
        },
        {
          provide: MATOMO_SCRIPT_FACTORY,
          useValue: ((scriptUrl, document) => {
            const script = createDefaultMatomoScriptElement(scriptUrl, document);

            script.setAttribute('data-cookieconsent', 'statistics');

            return script;
          }) as MatomoScriptFactory,
        },
      ],
    });

    const service = TestBed.inject(MatomoInitializerService);

    setUpScriptInjection(script => (injectedScript = script));

    // When
    service.initialize();

    // Then
    expect(injectedScript?.src).toMatch('^(.+://[^/]+)?/fake/script/url$');
    expect(injectedScript?.dataset.cookieconsent).toEqual('statistics');
  });

  it('should create custom script tag with forRoot factory', () => {
    // Given
    let injectedScript: HTMLScriptElement | undefined;

    setUpScriptInjection(script => (injectedScript = script));

    TestBed.configureTestingModule({
      providers: [
        provideMatomo(
          {
            siteId: 1,
            trackerUrl: '',
            scriptUrl: '/fake/script/url',
          } as MatomoConfiguration,
          withScriptFactory((scriptUrl, document) => {
            const script = createDefaultMatomoScriptElement(scriptUrl, document);

            script.setAttribute('data-cookieconsent', 'statistics');

            return script;
          })
        ),
      ],
    });

    // Inject service to trigger initialization on module init
    TestBed.inject(MatomoInitializerService);

    // Then
    expect(injectedScript?.src).toMatch('^(.+://[^/]+)?/fake/script/url$');
    expect(injectedScript?.dataset.cookieconsent).toEqual('statistics');
  });

  it('should defer script injection until tracker configuration is provided', () => {
    // Given
    let injectedScript: HTMLScriptElement | undefined;
    const service = instantiate({
      mode: MatomoInitializationMode.AUTO_DEFERRED,
      trackAppInitialLoad: true,
    });
    const tracker = TestBed.inject(MatomoTracker);

    spyOn(tracker, 'setTrackerUrl');
    spyOn(tracker, 'setSiteId');
    spyOn(tracker, 'trackPageView');
    setUpScriptInjection(script => (injectedScript = script));

    // When
    service.initialize();
    // Then
    expect(injectedScript).toBeFalsy();
    expect(tracker.setTrackerUrl).not.toHaveBeenCalled();
    expect(tracker.setSiteId).not.toHaveBeenCalled();
    // Pre-init actions must run
    expect(tracker.trackPageView).toHaveBeenCalledOnceWith();

    // When
    service.initializeTracker({
      siteId: 'fakeSiteId',
      trackerUrl: 'http://fakeTrackerUrl',
    });

    // Then
    expectInjectedScript(injectedScript, 'http://fakeTrackerUrl/matomo.js');
    expect(tracker.setTrackerUrl).toHaveBeenCalledOnceWith('http://fakeTrackerUrl/matomo.php');
    expect(tracker.setSiteId).toHaveBeenCalledOnceWith('fakeSiteId');
  });

  it('should map deprecated init() method to initialize()', () => {
    // Given
    const service = instantiate({
      trackerUrl: '',
      siteId: '',
    });

    spyOn(service, 'initialize');

    // When
    service.init();

    // Then
    expect(service.initialize).toHaveBeenCalledOnceWith();
  });

  it('should throw an error when initialized trackers more than once', () => {
    // Given
    const service = instantiate({
      mode: MatomoInitializationMode.AUTO_DEFERRED,
    });

    // When
    service.initializeTracker({ trackerUrl: '', siteId: '' });

    // Then
    expect(() => service.initializeTracker({ trackerUrl: '', siteId: '' })).toThrowError(
      ALREADY_INJECTED_ERROR
    );
  });

  it('should throw an error when initialized more than once', () => {
    // Given
    const service = instantiate({
      trackerUrl: '',
      siteId: '',
    });

    // When
    service.initialize();

    // Then
    expect(() => service.initialize()).toThrowError(ALREADY_INITIALIZED_ERROR);
  });
});
