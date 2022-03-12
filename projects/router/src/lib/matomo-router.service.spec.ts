import { Provider } from '@angular/core';
import { fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { Event, NavigationEnd, Router } from '@angular/router';
import { MATOMO_CONFIGURATION, MatomoTracker } from '@ngx-matomo/tracker';
import { of, Subject } from 'rxjs';
import {
  InternalGlobalConfiguration,
  MATOMO_ROUTER_CONFIGURATION,
  MatomoRouterConfiguration,
} from './configuration';
import { invalidInterceptorsProviderError } from './errors';
import { MATOMO_ROUTER_INTERCEPTORS, MatomoRouterInterceptor } from './interceptor';
import { MatomoRouter } from './matomo-router.service';
import { MATOMO_PAGE_TITLE_PROVIDER, PageTitleProvider } from './page-title-providers';
import { MATOMO_PAGE_URL_PROVIDER, PageUrlProvider } from './page-url-provider';

describe('MatomoRouter', () => {
  let routerEvents: Subject<Event>;
  let nextEventId: number;

  function instantiate(
    routerConfig: MatomoRouterConfiguration,
    config: Partial<InternalGlobalConfiguration>,
    providers: Provider[] = []
  ): MatomoRouter {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Router,
          useValue: jasmine.createSpyObj<Router>('Router', [], {
            events: routerEvents,
          }),
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
          useValue: jasmine.createSpyObj<MatomoTracker>('MatomoTracker', [
            'setCustomUrl',
            'setDocumentTitle',
            'trackPageView',
            'enableLinkTracking',
            'setReferrerUrl',
          ]),
        },
        ...providers,
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
    const service = instantiate({}, { enableLinkTracking: false });
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
    expect(tracker.setDocumentTitle).toHaveBeenCalledWith('Custom page title');
    expect(tracker.trackPageView).toHaveBeenCalled();
    expect(tracker.setReferrerUrl).toHaveBeenCalledWith('/custom-url');
  }));

  it('should track page view without page title', fakeAsync(() => {
    // Given
    const service = instantiate({ trackPageTitle: false }, { enableLinkTracking: false });
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
    expect(tracker.setDocumentTitle).not.toHaveBeenCalled();
    expect(tracker.trackPageView).not.toHaveBeenCalled();
    expect(tracker.setReferrerUrl).not.toHaveBeenCalled();

    // When
    tick();
    // Then
    expect(tracker.setCustomUrl).toHaveBeenCalledWith('/custom-url');
    expect(tracker.setDocumentTitle).not.toHaveBeenCalled();
    expect(tracker.trackPageView).toHaveBeenCalled();
    expect(tracker.setReferrerUrl).toHaveBeenCalledWith('/custom-url');
  }));

  it('should track page view synchronously', fakeAsync(() => {
    // Given
    const service = instantiate({ delay: -1 }, { enableLinkTracking: false });
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
    expect(tracker.setDocumentTitle).toHaveBeenCalledWith('Custom page title');
    expect(tracker.trackPageView).toHaveBeenCalled();
    expect(tracker.setReferrerUrl).toHaveBeenCalledWith('/custom-url');
  }));

  it('should track page view with some delay', fakeAsync(() => {
    // Given
    const service = instantiate({ delay: 42 }, { enableLinkTracking: false });
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
    expect(tracker.setDocumentTitle).not.toHaveBeenCalled();
    expect(tracker.trackPageView).not.toHaveBeenCalled();
    expect(tracker.setReferrerUrl).not.toHaveBeenCalled();

    // When
    tick(1);
    // Then
    expect(tracker.setCustomUrl).toHaveBeenCalledWith('/custom-url');
    expect(tracker.setDocumentTitle).toHaveBeenCalledWith('Custom page title');
    expect(tracker.trackPageView).toHaveBeenCalled();
    expect(tracker.setReferrerUrl).toHaveBeenCalledWith('/custom-url');
  }));

  it('should track page view with link tracking', fakeAsync(() => {
    // Given
    const service = instantiate({}, { enableLinkTracking: true });
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
    expect(tracker.setDocumentTitle).toHaveBeenCalledWith('Custom page title');
    expect(tracker.trackPageView).toHaveBeenCalled();
    expect(tracker.setReferrerUrl).toHaveBeenCalledWith('/custom-url');
    expect(tracker.enableLinkTracking).toHaveBeenCalledWith(true);
  }));

  function expectExcludedUrls(
    config: MatomoRouterConfiguration['exclude'],
    events: string[],
    expected: string[]
  ): void {
    // Given
    const service = instantiate({ exclude: config }, { enableLinkTracking: true });
    const tracker = TestBed.inject(MatomoTracker) as jasmine.SpyObj<MatomoTracker>;
    const urlProvider = TestBed.inject(MATOMO_PAGE_URL_PROVIDER) as jasmine.SpyObj<PageUrlProvider>;

    urlProvider.getCurrentPageUrl.and.callFake(event => of(event.urlAfterRedirects));

    // When
    service.init();
    events.forEach(triggerEvent);
    tick(); // Tracking is asynchronous by default

    // Then
    expected.forEach(expectedUrl => {
      expect(tracker.setCustomUrl).toHaveBeenCalledWith(expectedUrl);
    });
    events
      .filter(url => !expected.includes(url))
      .forEach(excludedUrl => {
        expect(tracker.setCustomUrl).not.toHaveBeenCalledWith(excludedUrl);
      });
    expect(tracker.trackPageView).toHaveBeenCalledTimes(expected.length);
  }

  it('should track page view with single url filter', fakeAsync(() => {
    expectExcludedUrls(
      /^\/excluded-url$/,
      ['accepted-url-1', '/excluded-url', 'accepted-url-2'],
      ['accepted-url-1', 'accepted-url-2']
    );
  }));

  it('should track page view with multiple url filter', fakeAsync(() => {
    expectExcludedUrls(
      [/^\/excluded-url-1$/, '^/excluded-url-2$'],
      ['accepted-url-1', '/excluded-url-1', 'accepted-url-2', '/excluded-url-2'],
      ['accepted-url-1', 'accepted-url-2']
    );
  }));

  it('should track page view with no url filter', fakeAsync(() => {
    expectExcludedUrls(
      undefined,
      ['accepted-url-1', 'accepted-url-2'],
      ['accepted-url-1', 'accepted-url-2']
    );
  }));

  it('should not track page view if disabled', fakeAsync(() => {
    // Given
    const service = instantiate({}, { disabled: true, enableLinkTracking: false });
    const tracker = TestBed.inject(MatomoTracker) as jasmine.SpyObj<MatomoTracker>;

    // When
    service.init();
    triggerEvent('/');
    tick(); // Tracking is asynchronous by default

    // Then
    expect(tracker.setCustomUrl).not.toHaveBeenCalled();
    expect(tracker.setDocumentTitle).not.toHaveBeenCalled();
    expect(tracker.trackPageView).not.toHaveBeenCalled();
    expect(tracker.setReferrerUrl).not.toHaveBeenCalled();
  }));

  it('should call interceptors if any and wait for them to resolve', fakeAsync(() => {
    // Given
    const interceptor1 = jasmine.createSpyObj<MatomoRouterInterceptor>('interceptor1', [
      'beforePageTrack',
    ]);
    let interceptor2Resolve: () => void;
    const interceptor2Promise = new Promise<void>(resolve => (interceptor2Resolve = resolve));
    const interceptor2 = jasmine.createSpyObj<MatomoRouterInterceptor>('interceptor2', {
      beforePageTrack: interceptor2Promise,
    });
    const interceptor3Subject = new Subject<void>();
    const interceptor3 = jasmine.createSpyObj<MatomoRouterInterceptor>('interceptor3', {
      beforePageTrack: interceptor3Subject,
    });
    const service = instantiate({ delay: -1 }, { enableLinkTracking: false }, [
      { provide: MATOMO_ROUTER_INTERCEPTORS, multi: true, useValue: interceptor1 },
      { provide: MATOMO_ROUTER_INTERCEPTORS, multi: true, useValue: interceptor2 },
      { provide: MATOMO_ROUTER_INTERCEPTORS, multi: true, useValue: interceptor3 },
    ]);
    const tracker = TestBed.inject(MatomoTracker) as jasmine.SpyObj<MatomoTracker>;

    // When
    service.init();
    triggerEvent('/');
    // Then
    expect(tracker.trackPageView).not.toHaveBeenCalled();
    expect(interceptor1.beforePageTrack).toHaveBeenCalled();
    expect(interceptor2.beforePageTrack).toHaveBeenCalled();
    expect(interceptor3.beforePageTrack).toHaveBeenCalled();

    // When
    interceptor3Subject.next();
    interceptor3Subject.complete();
    // Then
    expect(tracker.trackPageView).not.toHaveBeenCalled();

    // When
    interceptor2Resolve!();
    flush();
    // Then
    expect(tracker.trackPageView).toHaveBeenCalled();
  }));

  it('should throw an error when interceptors are not declared as multi provider', fakeAsync(() => {
    // Given
    const interceptor = jasmine.createSpyObj<MatomoRouterInterceptor>('interceptor', [
      'beforePageTrack',
    ]);
    const errorMessage = invalidInterceptorsProviderError().message;

    // Then
    expect(() =>
      instantiate({}, {}, [
        {
          provide: MATOMO_ROUTER_INTERCEPTORS,
          useValue: interceptor,
        },
      ])
    ).toThrowError(errorMessage);
    TestBed.resetTestingModule();
    expect(() =>
      instantiate({}, {}, [
        {
          provide: MATOMO_ROUTER_INTERCEPTORS,
          multi: true,
          useValue: interceptor,
        },
      ])
    ).not.toThrow();
  }));

  it('should wait for interceptors to resolve and queue calls', fakeAsync(() => {
    // Given
    let slowInterceptorResolve1: () => void;
    let slowInterceptorResolve2: () => void;
    let slowInterceptorResolve3: () => void;
    const slowInterceptorPromise1 = new Promise<void>(
      resolve => (slowInterceptorResolve1 = resolve)
    );
    const slowInterceptorPromise2 = new Promise<void>(
      resolve => (slowInterceptorResolve2 = resolve)
    );
    const slowInterceptorPromise3 = new Promise<void>(
      resolve => (slowInterceptorResolve3 = resolve)
    );
    const slowInterceptor = jasmine.createSpyObj<MatomoRouterInterceptor>('slowInterceptor', [
      'beforePageTrack',
    ]);
    const service = instantiate({ delay: -1 }, { enableLinkTracking: false }, [
      { provide: MATOMO_ROUTER_INTERCEPTORS, multi: true, useValue: slowInterceptor },
    ]);
    const tracker = TestBed.inject(MatomoTracker) as jasmine.SpyObj<MatomoTracker>;

    slowInterceptor.beforePageTrack.and.returnValues(
      slowInterceptorPromise1,
      slowInterceptorPromise2,
      slowInterceptorPromise3
    );

    // When
    service.init();
    triggerEvent('/page1');
    triggerEvent('/page2');
    triggerEvent('/page3');
    slowInterceptorResolve2!(); // Resolve #2 first
    // Then
    expect(tracker.trackPageView).not.toHaveBeenCalled();
    expect(slowInterceptor.beforePageTrack).toHaveBeenCalledTimes(1);

    // When
    slowInterceptorResolve1!(); // Resolve #1
    flush();
    // Then
    expect(slowInterceptor.beforePageTrack).toHaveBeenCalledTimes(3);
    expect(tracker.trackPageView).toHaveBeenCalledTimes(2);

    // When
    slowInterceptorResolve3!(); // Resolve #3
    flush();
    // Then
    expect(slowInterceptor.beforePageTrack).toHaveBeenCalledTimes(3);
    expect(tracker.trackPageView).toHaveBeenCalledTimes(3);
  }));
});
