import { ApplicationInitStatus } from '@angular/core';
import { TestBed, TestModuleMetadata } from '@angular/core/testing';
import { withRouteData, withRouter, withRouterInterceptors } from './providers';
import { MATOMO_ROUTER_CONFIGURATION } from './configuration';
import { MATOMO_ROUTER_INTERCEPTORS, MatomoRouterInterceptor } from './interceptor';
import {
  DEFAULT_DATA_KEY,
  MATOMO_ROUTE_DATA_KEY,
  MatomoRouteDataInterceptor,
} from './interceptors/route-data-interceptor';
import { MatomoRouter } from './matomo-router.service';
import {
  MatomoTracker,
  provideMatomo,
  ɵMATOMO_ROUTER_ENABLED as MATOMO_ROUTER_ENABLED,
} from 'ngx-matomo-client/core';

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

  it('should provide basic Matomo providers with router feature and additional interceptor', async () => {
    class MyInterceptor implements MatomoRouterInterceptor {
      readonly beforePageTrack = jasmine.createSpy('beforePageTrack');
    }

    await setUp([
      provideMatomo(
        { trackerUrl: 'my-tracker', siteId: 42 },
        withRouter({ delay: 42 }),
        withRouterInterceptors([MyInterceptor])
      ),
    ]);

    expect(TestBed.inject(MATOMO_ROUTER_INTERCEPTORS)).toEqual([jasmine.any(MyInterceptor)]);
  });

  it('should provide basic Matomo providers with router feature and route data retrieval', async () => {
    await setUp([
      provideMatomo(
        { trackerUrl: 'my-tracker', siteId: 42 },
        withRouter({ delay: 42 }),
        withRouteData()
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
        withRouteData('myCustomKey')
      ),
    ]);

    expect(TestBed.inject(MATOMO_ROUTER_INTERCEPTORS)).toEqual([
      jasmine.any(MatomoRouteDataInterceptor),
    ]);
    expect(TestBed.inject(MATOMO_ROUTE_DATA_KEY)).toEqual('myCustomKey');
  });

  it('should throw when using router features without withRouter()', () => {
    class MyInterceptor implements MatomoRouterInterceptor {
      readonly beforePageTrack = jasmine.createSpy('beforePageTrack');
    }

    expect(() =>
      provideMatomo(
        { trackerUrl: 'my-tracker', siteId: 42 },
        withRouterInterceptors([MyInterceptor])
      )
    ).toThrow();

    expect(() =>
      provideMatomo({ trackerUrl: 'my-tracker', siteId: 42 }, withRouteData())
    ).toThrow();
  });
});
