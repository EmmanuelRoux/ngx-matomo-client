import { ɵPLATFORM_BROWSER_ID, ɵPLATFORM_SERVER_ID } from '@angular/common';
import { PLATFORM_ID, Provider } from '@angular/core';
import { fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { Event, NavigationEnd, Router } from '@angular/router';
import {
  MatomoConfiguration,
  provideMatomo,
  ɵMatomoTestingTracker as MatomoTestingTracker,
  ɵprovideTestingTracker as provideTestingTracker,
} from 'ngx-matomo-client/core';
import { of, Subject } from 'rxjs';
import { MatomoRouterConfiguration, NavigationEndComparator } from './configuration';
import { invalidInterceptorsProviderError } from './errors';
import { MATOMO_ROUTER_INTERCEPTORS, MatomoRouterInterceptor } from './interceptor';
import { MatomoRouter } from './matomo-router.service';
import { MATOMO_PAGE_TITLE_PROVIDER, PageTitleProvider } from './page-title-providers';
import { MATOMO_PAGE_URL_PROVIDER, PageUrlProvider } from './page-url-provider';
import { withRouter } from './providers';

describe('MatomoRouter', () => {
  let routerEvents: Subject<Event>;
  let nextEventId: number;

  function instantiate(
    routerConfig: MatomoRouterConfiguration,
    config: Partial<MatomoConfiguration>,
    providers: Provider[] = [],
  ): { tracker: MatomoTestingTracker; router: MatomoRouter } {
    TestBed.configureTestingModule({
      providers: [
        provideMatomo(config as MatomoConfiguration, withRouter(routerConfig)),
        {
          provide: Router,
          useValue: { events: routerEvents } as unknown as Router,
        },
        {
          provide: MATOMO_PAGE_TITLE_PROVIDER,
          useValue: {
            getCurrentPageTitle: vi.fn().mockReturnValue(of('Custom page title')),
          } as unknown as Mocked<PageTitleProvider>,
        },
        {
          provide: MATOMO_PAGE_URL_PROVIDER,
          useValue: {
            getCurrentPageUrl: vi.fn().mockReturnValue(of('/custom-url')),
          } as unknown as Mocked<PageUrlProvider>,
        },
        provideTestingTracker(),
        ...providers,
      ],
    });

    return { router: TestBed.inject(MatomoRouter), tracker: TestBed.inject(MatomoTestingTracker) };
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
    const { tracker } = instantiate({}, { enableLinkTracking: false });

    // When
    triggerEvent('/');
    tick(); // Tracking is asynchronous by default

    // Then
    expect(tracker.callsAfterInit).toEqual([
      ['setDocumentTitle', 'Custom page title'],
      ['setCustomUrl', '/custom-url'],
      ['trackPageView', undefined],
      ['setReferrerUrl', '/custom-url'],
    ]);
  }));

  it('should track page view without page title', fakeAsync(() => {
    // Given
    const { tracker } = instantiate({ trackPageTitle: false }, { enableLinkTracking: false });

    // When
    triggerEvent('/');
    // Then
    expect(tracker.callsAfterInit).toEqual([]);

    // When
    tick();
    // Then
    expect(tracker.callsAfterInit).toEqual([
      ['setCustomUrl', '/custom-url'],
      ['trackPageView', undefined],
      ['setReferrerUrl', '/custom-url'],
    ]);
  }));

  it('should track page view synchronously', fakeAsync(() => {
    // Given
    const { tracker } = instantiate({ delay: -1 }, { enableLinkTracking: false });

    // When
    triggerEvent('/');

    // Then
    expect(tracker.callsAfterInit).toEqual([
      ['setDocumentTitle', 'Custom page title'],
      ['setCustomUrl', '/custom-url'],
      ['trackPageView', undefined],
      ['setReferrerUrl', '/custom-url'],
    ]);
  }));

  it('should track page view with some delay', fakeAsync(() => {
    // Given
    const { tracker } = instantiate({ delay: 42 }, { enableLinkTracking: false });

    // When
    triggerEvent('/');
    tick(41);
    // Then
    expect(tracker.callsAfterInit).toEqual([]);

    // When
    tick(1);
    // Then
    expect(tracker.callsAfterInit).toEqual([
      ['setDocumentTitle', 'Custom page title'],
      ['setCustomUrl', '/custom-url'],
      ['trackPageView', undefined],
      ['setReferrerUrl', '/custom-url'],
    ]);
  }));

  it('should track page view with link tracking', fakeAsync(() => {
    // Given
    const { tracker } = instantiate({}, { enableLinkTracking: true });

    // When
    triggerEvent('/');
    tick(); // Tracking is asynchronous by default

    // Then
    expect(tracker.callsAfterInit).toEqual([
      ['setDocumentTitle', 'Custom page title'],
      ['setCustomUrl', '/custom-url'],
      ['trackPageView', undefined],
      ['enableLinkTracking', false],
      ['setReferrerUrl', '/custom-url'],
    ]);
  }));

  it('should track page view with link tracking using pseudo-clicks', fakeAsync(() => {
    // Given
    const { tracker } = instantiate({}, { enableLinkTracking: 'enable-pseudo' });

    // When
    triggerEvent('/');
    tick(); // Tracking is asynchronous by default

    // Then
    expect(tracker.callsAfterInit).toEqual([
      ['setDocumentTitle', 'Custom page title'],
      ['setCustomUrl', '/custom-url'],
      ['trackPageView', undefined],
      ['enableLinkTracking', true],
      ['setReferrerUrl', '/custom-url'],
    ]);
  }));

  function expectExcludedUrls(
    config: MatomoRouterConfiguration['exclude'],
    events: string[],
    expected: string[],
  ): void {
    // Given
    const { tracker } = instantiate({ exclude: config }, { enableLinkTracking: true });
    const urlProvider = TestBed.inject(MATOMO_PAGE_URL_PROVIDER) as Mocked<PageUrlProvider>;

    urlProvider.getCurrentPageUrl.mockImplementation(event => of(event.urlAfterRedirects));

    // When
    events.forEach(triggerEvent);
    tick(); // Tracking is asynchronous by default

    // Then
    expected.forEach(expectedUrl => {
      expect(tracker.callsAfterInit).toEqual(
        expect.arrayContaining([['setCustomUrl', expectedUrl]]),
      );
      // expect(tracker.setCustomUrl).toHaveBeenCalledWith(expectedUrl);
    });
    events
      .filter(url => !expected.includes(url))
      .forEach(excludedUrl => {
        expect(tracker.callsAfterInit).not.toEqual(
          expect.arrayContaining([['setCustomUrl', excludedUrl]]),
        );
        // expect(tracker.setCustomUrl).not.toHaveBeenCalledWith(excludedUrl);
      });
    expect(tracker.countCallsAfterInit('setCustomUrl')).toEqual(expected.length);
    // expect(tracker.trackPageView).toHaveBeenCalledTimes(expected.length);
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

  it('should not track page view if disabled', fakeAsync(() => {
    // Given
    const { tracker } = instantiate({}, { disabled: true, enableLinkTracking: false });

    // When
    triggerEvent('/');
    tick(); // Tracking is asynchronous by default

    // Then
    expect(tracker.callsAfterInit).toEqual([]);
  }));

  it('should track page view if in browser', fakeAsync(() => {
    // Given
    const interceptor = { beforePageTrack: vi.fn() } as unknown as Mocked<MatomoRouterInterceptor>;

    const { tracker } = instantiate({}, {}, [
      { provide: PLATFORM_ID, useValue: ɵPLATFORM_BROWSER_ID },
      { provide: MATOMO_ROUTER_INTERCEPTORS, multi: true, useValue: interceptor },
    ]);

    // When
    triggerEvent('/');
    tick(); // Tracking is asynchronous by default

    // Then
    expect(tracker.callsAfterInit).toEqual(expect.arrayContaining([['trackPageView', undefined]]));
    expect(interceptor.beforePageTrack).toHaveBeenCalled();
  }));

  it('should not track page view if on server', fakeAsync(() => {
    // Given
    const interceptor = { beforePageTrack: vi.fn() } as unknown as Mocked<MatomoRouterInterceptor>;
    const { tracker } = instantiate({}, {}, [
      { provide: PLATFORM_ID, useValue: ɵPLATFORM_SERVER_ID },
      { provide: MATOMO_ROUTER_INTERCEPTORS, multi: true, useValue: interceptor },
    ]);

    // When
    triggerEvent('/');
    tick(); // Tracking is asynchronous by default

    // Then
    expect(tracker.callsAfterInit).toEqual([]);
    expect(interceptor.beforePageTrack).not.toHaveBeenCalled();
  }));

  it('should track page view if navigated to the same url with different query params', fakeAsync(() => {
    // Given
    const { tracker } = instantiate(
      {
        navigationEndComparator: 'fullUrl',
      },
      { enableLinkTracking: false },
    );

    // When
    triggerEvent('/test');
    triggerEvent('/test?page=1');
    tick(); // Tracking is asynchronous by default

    // Then
    expect(tracker.callsAfterInit).toEqual([
      // First call
      ['setDocumentTitle', 'Custom page title'],
      ['setCustomUrl', '/custom-url'],
      ['trackPageView', undefined],
      ['setReferrerUrl', '/custom-url'],

      // Second call
      ['setDocumentTitle', 'Custom page title'],
      ['setCustomUrl', '/custom-url'],
      ['trackPageView', undefined],
      ['setReferrerUrl', '/custom-url'],
    ]);
  }));

  it('should not track page view if navigated to the same url with query params', fakeAsync(() => {
    // Given
    const { tracker } = instantiate(
      { navigationEndComparator: 'ignoreQueryParams' },
      { enableLinkTracking: false },
    );

    // When
    triggerEvent('/test');
    triggerEvent('/test?page=1');
    tick(); // Tracking is asynchronous by default

    // Then
    expect(tracker.callsAfterInit).toEqual([
      ['setDocumentTitle', 'Custom page title'],
      ['setCustomUrl', '/custom-url'],
      ['trackPageView', undefined],
      ['setReferrerUrl', '/custom-url'],
    ]);
  }));

  it('should not track page view if navigated to the "same" url, as configured from custom NavigationEndComparator', fakeAsync(() => {
    // Given
    const isEvenPageParam = (url: string) => {
      const params = new URL(url, 'http://localhost').searchParams;
      const page = Number(params.get('page') ?? 0);

      return page % 2 === 0;
    };
    const myCustomComparator: NavigationEndComparator = (
      previousNavigationEnd,
      currentNavigationEnd,
    ) => {
      return (
        isEvenPageParam(previousNavigationEnd.urlAfterRedirects) ===
        isEvenPageParam(currentNavigationEnd.urlAfterRedirects)
      );
    };

    const { tracker } = instantiate(
      {
        navigationEndComparator: myCustomComparator,
      },
      { enableLinkTracking: false },
    );

    // When
    triggerEvent('/test?page=1');
    triggerEvent('/test?page=2');
    triggerEvent('/test?page=4');
    tick(); // Tracking is asynchronous by default

    // Then
    expect(tracker.callsAfterInit).toEqual([
      // First call
      ['setDocumentTitle', 'Custom page title'],
      ['setCustomUrl', '/custom-url'],
      ['trackPageView', undefined],
      ['setReferrerUrl', '/custom-url'],

      // Second call
      ['setDocumentTitle', 'Custom page title'],
      ['setCustomUrl', '/custom-url'],
      ['trackPageView', undefined],
      ['setReferrerUrl', '/custom-url'],
    ]);
  }));

  it('should call interceptors if any and wait for them to resolve', fakeAsync(() => {
    // Given
    const interceptor1 = { beforePageTrack: vi.fn() } as unknown as Mocked<MatomoRouterInterceptor>;
    let interceptor2Resolve: () => void;
    const interceptor2Promise = new Promise<void>(resolve => (interceptor2Resolve = resolve));
    const interceptor2 = {
      beforePageTrack: vi.fn().mockReturnValue(interceptor2Promise),
    } as unknown as Mocked<MatomoRouterInterceptor>;
    const interceptor3Subject = new Subject<void>();
    const interceptor3 = {
      beforePageTrack: vi.fn().mockReturnValue(interceptor3Subject),
    } as unknown as Mocked<MatomoRouterInterceptor>;
    const { tracker } = instantiate({ delay: -1 }, { enableLinkTracking: false }, [
      { provide: MATOMO_ROUTER_INTERCEPTORS, multi: true, useValue: interceptor1 },
      { provide: MATOMO_ROUTER_INTERCEPTORS, multi: true, useValue: interceptor2 },
      { provide: MATOMO_ROUTER_INTERCEPTORS, multi: true, useValue: interceptor3 },
    ]);

    // When
    triggerEvent('/');
    // Then
    expect(tracker.callsAfterInit).toEqual([
      ['setDocumentTitle', 'Custom page title'],
      ['setCustomUrl', '/custom-url'],
    ]);
    expect(interceptor1.beforePageTrack).toHaveBeenCalled();
    expect(interceptor2.beforePageTrack).toHaveBeenCalled();
    expect(interceptor3.beforePageTrack).toHaveBeenCalled();

    // When
    interceptor3Subject.next();
    interceptor3Subject.complete();
    // Then
    expect(tracker.callsAfterInit).toEqual([
      ['setDocumentTitle', 'Custom page title'],
      ['setCustomUrl', '/custom-url'],
    ]);

    // When
    interceptor2Resolve!();
    flush();
    // Then
    expect(tracker.callsAfterInit).toEqual([
      ['setDocumentTitle', 'Custom page title'],
      ['setCustomUrl', '/custom-url'],
      ['trackPageView', undefined],
      ['setReferrerUrl', '/custom-url'],
    ]);
  }));

  it('should throw an error when interceptors are not declared as multi provider', fakeAsync(() => {
    // Given
    const interceptor = { beforePageTrack: vi.fn() } as unknown as Mocked<MatomoRouterInterceptor>;
    const errorMessage = invalidInterceptorsProviderError().message;

    // Then
    expect(() =>
      instantiate({}, {}, [
        {
          provide: MATOMO_ROUTER_INTERCEPTORS,
          useValue: interceptor,
        },
      ]),
    ).toThrowError(errorMessage);
    TestBed.resetTestingModule();
    expect(() =>
      instantiate({}, {}, [
        {
          provide: MATOMO_ROUTER_INTERCEPTORS,
          multi: true,
          useValue: interceptor,
        },
      ]),
    ).not.toThrow();
  }));

  it('should wait for interceptors to resolve and queue calls', fakeAsync(() => {
    // Given
    let slowInterceptorResolve1: () => void;
    let slowInterceptorResolve2: () => void;
    let slowInterceptorResolve3: () => void;
    const slowInterceptorPromise1 = new Promise<void>(
      resolve => (slowInterceptorResolve1 = resolve),
    );
    const slowInterceptorPromise2 = new Promise<void>(
      resolve => (slowInterceptorResolve2 = resolve),
    );
    const slowInterceptorPromise3 = new Promise<void>(
      resolve => (slowInterceptorResolve3 = resolve),
    );
    const slowInterceptor = {
      beforePageTrack: vi.fn(),
    } as unknown as Mocked<MatomoRouterInterceptor>;
    const { tracker } = instantiate({ delay: -1 }, { enableLinkTracking: false }, [
      { provide: MATOMO_ROUTER_INTERCEPTORS, multi: true, useValue: slowInterceptor },
    ]);

    slowInterceptor.beforePageTrack
      .mockReturnValueOnce(slowInterceptorPromise1)
      .mockReturnValueOnce(slowInterceptorPromise2)
      .mockReturnValueOnce(slowInterceptorPromise3);

    // When
    triggerEvent('/page1');
    triggerEvent('/page2');
    triggerEvent('/page3');
    slowInterceptorResolve2!(); // Resolve #2 first
    // Then
    expect(tracker.calls).toEqual([
      ['setDocumentTitle', 'Custom page title'],
      ['setCustomUrl', '/custom-url'],
      ['setDocumentTitle', 'Custom page title'],
      ['setCustomUrl', '/custom-url'],
      ['setDocumentTitle', 'Custom page title'],
      ['setCustomUrl', '/custom-url'],
    ]);
    expect(slowInterceptor.beforePageTrack).toHaveBeenCalledTimes(1);

    // When
    slowInterceptorResolve1!(); // Resolve #1
    flush();
    // Then
    expect(slowInterceptor.beforePageTrack).toHaveBeenCalledTimes(3);
    expect(tracker.calls).toEqual([
      ['setDocumentTitle', 'Custom page title'],
      ['setCustomUrl', '/custom-url'],
      ['setDocumentTitle', 'Custom page title'],
      ['setCustomUrl', '/custom-url'],
      ['setDocumentTitle', 'Custom page title'],
      ['setCustomUrl', '/custom-url'],
      ['trackPageView', undefined],
      ['setReferrerUrl', '/custom-url'],
      ['trackPageView', undefined],
      ['setReferrerUrl', '/custom-url'],
    ]);

    // When
    slowInterceptorResolve3!(); // Resolve #3
    flush();
    // Then
    expect(slowInterceptor.beforePageTrack).toHaveBeenCalledTimes(3);
    expect(tracker.calls).toEqual([
      ['setDocumentTitle', 'Custom page title'],
      ['setCustomUrl', '/custom-url'],
      ['setDocumentTitle', 'Custom page title'],
      ['setCustomUrl', '/custom-url'],
      ['setDocumentTitle', 'Custom page title'],
      ['setCustomUrl', '/custom-url'],
      ['trackPageView', undefined],
      ['setReferrerUrl', '/custom-url'],
      ['trackPageView', undefined],
      ['setReferrerUrl', '/custom-url'],
      ['trackPageView', undefined],
      ['setReferrerUrl', '/custom-url'],
    ]);
  }));

  it('should map deprecated init() method to initialize()', () => {
    // Given
    const { router } = instantiate({}, {});

    vi.spyOn(router, 'initialize').mockImplementation(() => undefined);

    // When
    router.init();

    // Then
    expect(router.initialize).toHaveBeenCalledOnce();
  });
});
