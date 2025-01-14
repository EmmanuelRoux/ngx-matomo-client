import { ApplicationInitStatus } from '@angular/core';
import { TestBed, TestModuleMetadata } from '@angular/core/testing';
import { NavigationEnd } from '@angular/router';
import {
  MatomoTracker,
  provideMatomo,
  ɵMATOMO_ROUTER_ENABLED as MATOMO_ROUTER_ENABLED,
} from 'ngx-matomo-client/core';
import { firstValueFrom, from, Observable, of } from 'rxjs';
import { MATOMO_ROUTER_CONFIGURATION } from './configuration';
import {
  MATOMO_ROUTER_INTERCEPTORS,
  MatomoRouterInterceptor,
  MatomoRouterInterceptorFn,
} from './interceptor';
import {
  DEFAULT_DATA_KEY,
  MATOMO_ROUTE_DATA_KEY,
  MatomoRouteDataInterceptor,
} from './interceptors/route-data-interceptor';
import { MatomoRouter } from './matomo-router.service';
import { MATOMO_PAGE_URL_PROVIDER, PageUrlProvider, PageUrlProviderFn } from './page-url-provider';
import {
  withPageUrlProvider,
  withRouteData,
  withRouter,
  withRouterInterceptors,
} from './providers';

describe('providers', () => {
  async function setUp(providers: TestModuleMetadata['providers']): Promise<void> {
    TestBed.configureTestingModule({
      providers: providers,
    });

    // https://github.com/angular/angular/issues/24218
    await TestBed.inject(ApplicationInitStatus).donePromise;
  }

  it('should provide basic Matomo providers with router feature', async () => {
    await setUp([
      provideMatomo({ trackerUrl: 'my-tracker', siteId: 42 }, withRouter({ delay: 42 })),
    ]);

    expect(TestBed.inject(MatomoTracker)).toEqual(jasmine.any(MatomoTracker));
    expect(TestBed.inject(MatomoRouter)).toEqual(jasmine.any(MatomoRouter));
    expect(TestBed.inject(MATOMO_ROUTER_CONFIGURATION)).toEqual({ delay: 42 });
    expect(TestBed.inject(MATOMO_ROUTER_ENABLED)).toEqual(true);
  });

  it('should provide basic Matomo providers with router feature and additional class-based interceptor', async () => {
    const calls: NavigationEnd[] = [];

    class MyInterceptor implements MatomoRouterInterceptor {
      beforePageTrack(event: NavigationEnd): Observable<void> | Promise<void> | void {
        calls.push(event);
      }
    }

    await setUp([
      provideMatomo(
        { trackerUrl: 'my-tracker', siteId: 42 },
        withRouter({ delay: 42 }),
        withRouterInterceptors([MyInterceptor]),
      ),
    ]);

    const event = new NavigationEnd(0, '/', '/');

    TestBed.inject(MATOMO_ROUTER_INTERCEPTORS).forEach(interceptor =>
      interceptor.beforePageTrack(event),
    );

    expect(calls).toEqual([event]);
  });

  it('should provide basic Matomo providers with router feature and additional functional interceptor', async () => {
    const calls: NavigationEnd[] = [];
    const myInterceptor: MatomoRouterInterceptorFn = (event: NavigationEnd) => {
      calls.push(event);
    };

    await setUp([
      provideMatomo(
        { trackerUrl: 'my-tracker', siteId: 42 },
        withRouter({ delay: 42 }),
        withRouterInterceptors([myInterceptor]),
      ),
    ]);

    const event = new NavigationEnd(0, '/', '/');

    TestBed.inject(MATOMO_ROUTER_INTERCEPTORS).forEach(interceptor =>
      interceptor.beforePageTrack(event),
    );

    expect(calls).toEqual([event]);
  });

  it('should provide basic Matomo providers with router feature and route data retrieval', async () => {
    await setUp([
      provideMatomo(
        { trackerUrl: 'my-tracker', siteId: 42 },
        withRouter({ delay: 42 }),
        withRouteData(),
      ),
    ]);

    expect(TestBed.inject(MATOMO_ROUTER_INTERCEPTORS)).toEqual([
      jasmine.any(MatomoRouteDataInterceptor),
    ]);
    expect(TestBed.inject(MATOMO_ROUTE_DATA_KEY)).toEqual(DEFAULT_DATA_KEY);
  });

  it('should provide basic Matomo providers with router feature and route data retrieval with custom key', async () => {
    await setUp([
      provideMatomo(
        { trackerUrl: 'my-tracker', siteId: 42 },
        withRouter({ delay: 42 }),
        withRouteData('myCustomKey'),
      ),
    ]);

    expect(TestBed.inject(MATOMO_ROUTER_INTERCEPTORS)).toEqual([
      jasmine.any(MatomoRouteDataInterceptor),
    ]);
    expect(TestBed.inject(MATOMO_ROUTE_DATA_KEY)).toEqual('myCustomKey');
  });

  it('should provide basic Matomo providers with custom url provider feature and additional class-based interceptor', async () => {
    class MyUrlProvider implements PageUrlProvider {
      async getCurrentPageUrl(_event: NavigationEnd): Promise<string> {
        return 'my/custom/url';
      }
    }

    await setUp([
      provideMatomo(
        { trackerUrl: 'my-tracker', siteId: 42 },
        withRouter({ delay: 42 }),
        withPageUrlProvider(MyUrlProvider),
      ),
    ]);

    const event = new NavigationEnd(0, '/', '/');

    const pageUrl = await firstValueFrom(
      from(TestBed.inject(MATOMO_PAGE_URL_PROVIDER).getCurrentPageUrl(event)),
    );

    expect(pageUrl).toEqual('my/custom/url');
  });

  it('should provide basic Matomo providers with custom url provider feature and additional functional interceptor', async () => {
    const myProvider: PageUrlProviderFn = (event: NavigationEnd) => of('my/custom/url');

    await setUp([
      provideMatomo(
        { trackerUrl: 'my-tracker', siteId: 42 },
        withRouter({ delay: 42 }),
        withPageUrlProvider(myProvider),
      ),
    ]);

    const event = new NavigationEnd(0, '/', '/');

    const pageUrl = await firstValueFrom(
      from(TestBed.inject(MATOMO_PAGE_URL_PROVIDER).getCurrentPageUrl(event)),
    );

    expect(pageUrl).toEqual('my/custom/url');
  });

  it('should throw when using router features without withRouter()', () => {
    class MyInterceptor implements MatomoRouterInterceptor {
      readonly beforePageTrack = jasmine.createSpy('beforePageTrack');
    }

    expect(() =>
      provideMatomo(
        { trackerUrl: 'my-tracker', siteId: 42 },
        withRouterInterceptors([MyInterceptor]),
      ),
    ).toThrow();

    expect(() =>
      provideMatomo({ trackerUrl: 'my-tracker', siteId: 42 }, withRouteData()),
    ).toThrow();

    expect(() =>
      provideMatomo(
        { trackerUrl: 'my-tracker', siteId: 42 },
        withPageUrlProvider(() => Promise.resolve('')),
      ),
    ).toThrow();
  });
});
