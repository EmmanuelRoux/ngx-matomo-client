import { ApplicationInitStatus, InjectionToken } from '@angular/core';
import { TestBed, TestModuleMetadata } from '@angular/core/testing';
import {
  provideMatomo,
  withRouteData,
  withRouter,
  withRouterInterceptors,
  withScriptFactory,
} from './ngx-matomo-providers';
import { MATOMO_ROUTER_CONFIGURATION } from './router/configuration';
import { MATOMO_ROUTER_INTERCEPTORS, MatomoRouterInterceptor } from './router/interceptor';
import {
  DEFAULT_DATA_KEY,
  MATOMO_ROUTE_DATA_KEY,
  MatomoRouteDataInterceptor,
} from './router/interceptors/route-data-interceptor';
import { MatomoRouter } from './router/matomo-router.service';
import {
  MATOMO_CONFIGURATION,
  MATOMO_ROUTER_ENABLED,
  MatomoConfiguration,
} from './tracker/configuration';
import { MatomoInitializerService } from './tracker/matomo-initializer.service';
import { MatomoTracker } from './tracker/matomo-tracker.service';
import { createDefaultMatomoScriptElement } from './tracker/script-factory';

describe('providers', () => {
  async function setUp(providers: TestModuleMetadata['providers']): Promise<void> {
    TestBed.configureTestingModule({
      providers: providers,
    });

    // https://github.com/angular/angular/issues/24218
    await TestBed.inject(ApplicationInitStatus).donePromise;
  }

  it('should provide basic Matomo providers with static configuration', async () => {
    const fakeInitializer = jasmine.createSpyObj<MatomoInitializerService>(['initialize']);
    const config: MatomoConfiguration = { trackerUrl: 'my-tracker', siteId: 42 };

    await setUp([
      {
        provide: MatomoInitializerService,
        useValue: fakeInitializer,
      },
      provideMatomo(config),
    ]);

    expect(TestBed.inject(MatomoTracker)).toEqual(jasmine.any(MatomoTracker));
    expect(TestBed.inject(MATOMO_CONFIGURATION)).toEqual(config);
    expect(fakeInitializer.initialize).toHaveBeenCalledTimes(1);
  });

  it('should provide basic Matomo providers with configuration factory', async () => {
    const fakeInitializer = jasmine.createSpyObj<MatomoInitializerService>(['initialize']);
    const trackerUrl = 'my-tracker';
    const config: MatomoConfiguration = { trackerUrl, siteId: 42 };
    const trackerUrlToken = new InjectionToken<string>('trackerUrl');

    await setUp([
      {
        provide: MatomoInitializerService,
        useValue: fakeInitializer,
      },
      {
        provide: trackerUrlToken,
        useValue: trackerUrl,
      },
      provideMatomo(() => ({ trackerUrl: TestBed.inject(trackerUrlToken), siteId: 42 })),
    ]);

    expect(TestBed.inject(MatomoTracker)).toEqual(jasmine.any(MatomoTracker));
    expect(TestBed.inject(MATOMO_CONFIGURATION)).toEqual(config);
    expect(fakeInitializer.initialize).toHaveBeenCalledTimes(1);
  });

  it('should provide basic Matomo providers with custom script factory', async () => {
    const scriptFactory = jasmine
      .createSpy('scriptFactory')
      .and.callFake(createDefaultMatomoScriptElement);

    await setUp([
      provideMatomo({ trackerUrl: 'my-tracker', siteId: 42 }, withScriptFactory(scriptFactory)),
    ]);

    expect(TestBed.inject(MatomoTracker)).toEqual(jasmine.any(MatomoTracker));
    expect(scriptFactory).toHaveBeenCalledTimes(1);
  });

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
