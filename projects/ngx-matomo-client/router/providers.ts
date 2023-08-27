import {
  ɵcreateMatomoFeature as createMatomoFeature,
  ɵMATOMO_ROUTER_ENABLED as MATOMO_ROUTER_ENABLED,
  ɵMatomoFeature as MatomoFeature,
  ɵMatomoFeatureKind as MatomoFeatureKind,
} from 'ngx-matomo-client/core';
import { ENVIRONMENT_INITIALIZER, inject, Provider, Type } from '@angular/core';
import { MATOMO_ROUTER_CONFIGURATION, MatomoRouterConfiguration } from './configuration';
import { MatomoRouter } from './matomo-router.service';
import {
  MATOMO_ROUTE_DATA_KEY,
  MatomoRouteDataInterceptor,
} from './interceptors/route-data-interceptor';
import { MatomoRouterInterceptor, provideInterceptor, provideInterceptors } from './interceptor';

/** Enable automatic page views tracking */
export function withRouter(config?: MatomoRouterConfiguration): MatomoFeature {
  const providers = [
    { provide: MATOMO_ROUTER_ENABLED, useValue: true },
    { provide: MATOMO_ROUTER_CONFIGURATION, useValue: config },
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useValue() {
        inject(MatomoRouter).initialize();
      },
    },
  ];

  return createMatomoFeature(MatomoFeatureKind.Router, providers);
}

/** Add some matomo router interceptors */
export function withRouterInterceptors(
  interceptors: Type<MatomoRouterInterceptor>[]
): MatomoFeature {
  return createMatomoFeature(
    MatomoFeatureKind.RouterInterceptors,
    provideInterceptors(interceptors)
  );
}

/**
 * Enable retrieval of tracking information from route data
 *
 * @see MatomoRouteData
 * @param key A custom key to get lookup route data - default is 'matomo'
 */
export function withRouteData(key?: string): MatomoFeature {
  const providers: Provider[] = [provideInterceptor(MatomoRouteDataInterceptor)];

  if (key) {
    providers.push({ provide: MATOMO_ROUTE_DATA_KEY, useValue: key });
  }

  return createMatomoFeature(MatomoFeatureKind.BuiltInRouteDataInterceptor, providers);
}
