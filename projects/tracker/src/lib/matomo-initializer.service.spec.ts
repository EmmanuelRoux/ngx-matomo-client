import {TestBed} from '@angular/core/testing';
import {InternalMatomoConfiguration, MATOMO_CONFIGURATION, MatomoConfiguration, MatomoInitializationMode} from './configuration';
import {MatomoHolder} from './holder';
import {MatomoInitializerService} from './matomo-initializer.service';

declare var window: MatomoHolder;

describe('MatomoInitializerService', () => {

  function instantiate(config: MatomoConfiguration): MatomoInitializerService {
    TestBed.configureTestingModule({
      providers: [{
        provide: MATOMO_CONFIGURATION,
        useValue: config,
      }],
    });

    return TestBed.inject(MatomoInitializerService);
  }

  beforeEach(() => delete (window as Partial<MatomoHolder>)._paq);

  it('should register _paq global once', () => {
    // Given
    let paq: MatomoHolder['_paq'];
    expect(window._paq).toBeUndefined();

    // When
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    new MatomoInitializerService({} as InternalMatomoConfiguration);
    // Then
    expect(window._paq).toEqual([]);
    paq = window._paq;

    // When
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    new MatomoInitializerService({} as InternalMatomoConfiguration);
    // Then
    expect(window._paq).toEqual([]);
    expect(window._paq).toBe(paq); // should not
  });

  it('should track initial page view with manual configuration', () => {
    // Given
    const service = instantiate({
      mode: MatomoInitializationMode.MANUAL,
      trackAppInitialLoad: true,
      enableLinkTracking: false,
    });

    // When
    service.init();

    // Then
    expect(window._paq).toEqual([['trackPageView']]);
  });

  it('should track initial page view and enable link tracking with manual configuration', () => {
    // Given
    const service = instantiate({
      mode: MatomoInitializationMode.MANUAL,
      trackAppInitialLoad: true,
      enableLinkTracking: true,
    });

    // When
    service.init();

    // Then
    expect(window._paq).toEqual([['trackPageView'], ['enableLinkTracking']]);
  });

  it('should set Do Not Track setting if enabled', () => {
    // Given
    const service = instantiate({
      mode: MatomoInitializationMode.MANUAL,
      acceptDoNotTrack: true,
    });

    // When
    service.init();

    // Then
    expect(window._paq).toEqual([['setDoNotTrack', true]]);
  });

  function setUpScriptInjection(cb: (injectedScript: HTMLScriptElement) => void): void {
    const mockContainer = jasmine.createSpyObj<HTMLElement>('FakeContainer', ['insertBefore']);
    const mockExistingScript = jasmine.createSpyObj<HTMLScriptElement>('FakeExistingScript', [], {
      parentNode: mockContainer,
      parentElement: mockContainer,
    });

    mockContainer.insertBefore.and.callFake((script) => {
      cb(script as unknown as HTMLScriptElement);
      return script;
    });

    spyOn(window.document, 'getElementsByTagName').and.returnValue([mockExistingScript] as unknown as HTMLCollectionOf<Element>);
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

    setUpScriptInjection(script => injectedScript = script);

    // When
    service.init();

    // Then
    expectInjectedScript(injectedScript, 'http://fakeTrackerUrl/matomo.js');
    expect(window._paq).toEqual([
      ['setTrackerUrl', 'http://fakeTrackerUrl/matomo.php'],
      ['setSiteId', 'fakeSiteId'],
    ]);
  });

  it('should inject script automatically with site id as number', () => {
    // Given
    let injectedScript: HTMLScriptElement | undefined;
    const service = instantiate({
      siteId: 99,
      trackerUrl: 'http://fakeTrackerUrl',
    });

    setUpScriptInjection(script => injectedScript = script);

    // When
    service.init();

    // Then
    expectInjectedScript(injectedScript, 'http://fakeTrackerUrl/matomo.js');
    expect(window._paq).toEqual([
      ['setTrackerUrl', 'http://fakeTrackerUrl/matomo.php'],
      ['setSiteId', '99'],
    ]);
  });

  it('should inject script automatically with custom script url', () => {
    // Given
    let injectedScript: HTMLScriptElement | undefined;
    const service = instantiate({
      siteId: 'fakeSiteId',
      trackerUrl: 'http://fakeTrackerUrl',
      scriptUrl: 'http://myCustomScriptUrl',
    });

    setUpScriptInjection(script => injectedScript = script);

    // When
    service.init();

    // Then
    expectInjectedScript(injectedScript, 'http://myCustomScriptUrl');
  });

  it('should inject script automatically with multiple trackers', () => {
    // Given
    let injectedScript: HTMLScriptElement | undefined;
    const service = instantiate({
      trackers: [
        {siteId: 'site1', trackerUrl: 'http://fakeTrackerUrl1'},
        {siteId: 'site2', trackerUrl: 'http://fakeTrackerUrl2/'}, // Should work with trailing slash
        {siteId: 'site3', trackerUrl: 'http://fakeTrackerUrl3'},
      ],
    });

    setUpScriptInjection(script => injectedScript = script);

    // When
    service.init();

    // Then
    expectInjectedScript(injectedScript, 'http://fakeTrackerUrl1/matomo.js');
    expect(window._paq).toEqual([
      ['setTrackerUrl', 'http://fakeTrackerUrl1/matomo.php'],
      ['setSiteId', 'site1'],
      ['addTracker', 'http://fakeTrackerUrl2/matomo.php', 'site2'],
      ['addTracker', 'http://fakeTrackerUrl3/matomo.php', 'site3'],
    ]);
  });

});
