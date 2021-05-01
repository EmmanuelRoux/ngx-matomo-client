import {fakeAsync, TestBed, tick} from '@angular/core/testing';
import {Event, NavigationEnd, Router} from '@angular/router';
import {MATOMO_CONFIGURATION, MatomoConfiguration, MatomoTracker} from '@ngx-matomo/tracker';
import {of, Subject} from 'rxjs';
import {MATOMO_ROUTER_CONFIGURATION, MatomoRouterConfiguration} from './configuration';
import {MatomoRouter} from './matomo-router.service';
import {MATOMO_PAGE_TITLE_PROVIDER, PageTitleProvider} from './page-title-providers';
import {MATOMO_PAGE_URL_PROVIDER, PageUrlProvider} from './page-url-provider';

describe('MatomoRouter', () => {
  let routerEvents: Subject<Event>;
  let nextEventId: number;

  function instantiate(routerConfig: MatomoRouterConfiguration, config: Pick<MatomoConfiguration, 'enableLinkTracking'>): MatomoRouter {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Router,
          useValue: jasmine.createSpyObj<Router>('Router', [], {events: routerEvents}),
        },
        {
          provide: MATOMO_CONFIGURATION,
          useValue: config,
        },
        {
          provide: MATOMO_ROUTER_CONFIGURATION,
          useValue: routerConfig,
        },
        {
          provide: MATOMO_PAGE_TITLE_PROVIDER,
          useValue: jasmine.createSpyObj<PageTitleProvider>('PageTitleProvider', {
            getCurrentPageTitle: of('Custom page title'),
          }),
        },
        {
          provide: MATOMO_PAGE_URL_PROVIDER,
          useValue: jasmine.createSpyObj<PageUrlProvider>('PageUrlProvider', {
            getCurrentPageUrl: of('/custom-url'),
          }),
        },
        {
          provide: MatomoTracker,
          useValue: jasmine.createSpyObj<MatomoTracker>('MatomoTracker',
            ['setCustomUrl', 'trackPageView', 'enableLinkTracking', 'setReferrerUrl'],
          ),
        },
      ],
    });

    return TestBed.inject(MatomoRouter);
  }

  function triggerEvent(url: string): void {
    const id = nextEventId++;

    routerEvents.next(new NavigationEnd(id, url, url));
  }

  beforeEach(() => {
    nextEventId = 0;
    routerEvents = new Subject<Event>();
  });

  it('should track page view with default options', fakeAsync(() => {
    // Given
    const service = instantiate({}, {enableLinkTracking: false});
    const tracker = TestBed.inject(MatomoTracker) as jasmine.SpyObj<MatomoTracker>;

    // Referrer url should be called only AFTER trackPageView
    tracker.setReferrerUrl.and.callFake(() => {
      expect(tracker.trackPageView).toHaveBeenCalled();
    });

    // When
    service.init();
    triggerEvent('/');
    tick(); // Tracking is asynchronous by default

    // Then
    expect(tracker.setCustomUrl).toHaveBeenCalledWith('/custom-url');
    expect(tracker.trackPageView).toHaveBeenCalledWith('Custom page title');
    expect(tracker.setReferrerUrl).toHaveBeenCalledWith('/custom-url');
  }));

  it('should track page view without page title', fakeAsync(() => {
    // Given
    const service = instantiate({usePageTitle: false}, {enableLinkTracking: false});
    const tracker = TestBed.inject(MatomoTracker) as jasmine.SpyObj<MatomoTracker>;

    // Referrer url should be called only AFTER trackPageView
    tracker.setReferrerUrl.and.callFake(() => {
      expect(tracker.trackPageView).toHaveBeenCalled();
    });

    // When
    service.init();
    triggerEvent('/');
    // Then
    expect(tracker.setCustomUrl).not.toHaveBeenCalled();
    expect(tracker.trackPageView).not.toHaveBeenCalled();
    expect(tracker.setReferrerUrl).not.toHaveBeenCalled();

    // When
    tick();
    // Then
    expect(tracker.setCustomUrl).toHaveBeenCalledWith('/custom-url');
    expect(tracker.trackPageView).toHaveBeenCalled();
    expect(tracker.trackPageView.calls.argsFor(0)[0]).toBeUndefined();
    expect(tracker.setReferrerUrl).toHaveBeenCalledWith('/custom-url');
  }));

  it('should track page view synchronously', fakeAsync(() => {
    // Given
    const service = instantiate({delay: -1}, {enableLinkTracking: false});
    const tracker = TestBed.inject(MatomoTracker) as jasmine.SpyObj<MatomoTracker>;

    // Referrer url should be called only AFTER trackPageView
    tracker.setReferrerUrl.and.callFake(() => {
      expect(tracker.trackPageView).toHaveBeenCalled();
    });

    // When
    service.init();
    triggerEvent('/');

    // Then
    expect(tracker.setCustomUrl).toHaveBeenCalledWith('/custom-url');
    expect(tracker.trackPageView).toHaveBeenCalledWith('Custom page title');
    expect(tracker.setReferrerUrl).toHaveBeenCalledWith('/custom-url');
  }));

  it('should track page view with some delay', fakeAsync(() => {
    // Given
    const service = instantiate({delay: 42}, {enableLinkTracking: false});
    const tracker = TestBed.inject(MatomoTracker) as jasmine.SpyObj<MatomoTracker>;

    // Referrer url should be called only AFTER trackPageView
    tracker.setReferrerUrl.and.callFake(() => {
      expect(tracker.trackPageView).toHaveBeenCalled();
    });

    // When
    service.init();
    triggerEvent('/');
    tick(41);
    // Then
    expect(tracker.setCustomUrl).not.toHaveBeenCalled();
    expect(tracker.trackPageView).not.toHaveBeenCalled();
    expect(tracker.setReferrerUrl).not.toHaveBeenCalled();

    // When
    tick(1);
    // Then
    expect(tracker.setCustomUrl).toHaveBeenCalledWith('/custom-url');
    expect(tracker.trackPageView).toHaveBeenCalledWith('Custom page title');
    expect(tracker.setReferrerUrl).toHaveBeenCalledWith('/custom-url');
  }));

  it('should track page view with link tracking', fakeAsync(() => {
    // Given
    const service = instantiate({}, {enableLinkTracking: true});
    const tracker = TestBed.inject(MatomoTracker) as jasmine.SpyObj<MatomoTracker>;

    // Referrer url should be called only AFTER trackPageView
    tracker.setReferrerUrl.and.callFake(() => {
      expect(tracker.trackPageView).toHaveBeenCalled();
    });

    // When
    service.init();
    triggerEvent('/');
    tick(); // Tracking is asynchronous by default

    // Then
    expect(tracker.setCustomUrl).toHaveBeenCalledWith('/custom-url');
    expect(tracker.trackPageView).toHaveBeenCalledWith('Custom page title');
    expect(tracker.setReferrerUrl).toHaveBeenCalledWith('/custom-url');
    expect(tracker.enableLinkTracking).toHaveBeenCalledWith(true);
  }));

  function expectExcludedUrls(config: MatomoRouterConfiguration['exclude'], events: string[], expected: string[]): void {
    // Given
    const service = instantiate({exclude: config}, {enableLinkTracking: true});
    const tracker = TestBed.inject(MatomoTracker) as jasmine.SpyObj<MatomoTracker>;
    const urlProvider = TestBed.inject(MATOMO_PAGE_URL_PROVIDER) as jasmine.SpyObj<PageUrlProvider>;

    urlProvider.getCurrentPageUrl.and.callFake((event) => of(event.urlAfterRedirects));

    // When
    service.init();
    events.forEach(triggerEvent);
    tick(); // Tracking is asynchronous by default

    // Then
    expected.forEach(expectedUrl => {
      expect(tracker.setCustomUrl).toHaveBeenCalledWith(expectedUrl);
    });
    events.filter(url => !expected.includes(url)).forEach(excludedUrl => {
      expect(tracker.setCustomUrl).not.toHaveBeenCalledWith(excludedUrl);
    });
    expect(tracker.trackPageView).toHaveBeenCalledTimes(expected.length);
  }

  it('should track page view with single url filter', fakeAsync(() => {
    expectExcludedUrls(
      /^\/excluded-url$/,
      ['accepted-url-1', '/excluded-url', 'accepted-url-2'],
      ['accepted-url-1', 'accepted-url-2'],
    );
  }));

  it('should track page view with multiple url filter', fakeAsync(() => {
    expectExcludedUrls(
      [/^\/excluded-url-1$/, '^/excluded-url-2$'],
      ['accepted-url-1', '/excluded-url-1', 'accepted-url-2', '/excluded-url-2'],
      ['accepted-url-1', 'accepted-url-2'],
    );
  }));

  it('should track page view with no url filter', fakeAsync(() => {
    expectExcludedUrls(
      undefined,
      ['accepted-url-1', 'accepted-url-2'],
      ['accepted-url-1', 'accepted-url-2'],
    );
  }));

});
