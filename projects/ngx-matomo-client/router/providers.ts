import { ENVIRONMENT_INITIALIZER, inject, Provider, Type } from '@angular/core';
import {
  MatomoFeature as MatomoFeature,
  ɵcreateMatomoFeature as createMatomoFeature,
  ɵMATOMO_ROUTER_ENABLED as MATOMO_ROUTER_ENABLED,
} from 'ngx-matomo-client/core';
import { MATOMO_ROUTER_CONFIGURATION, MatomoRouterConfiguration } from './configuration';
import {
  MatomoRouterInterceptor,
  MatomoRouterInterceptorFn,
  provideInterceptor,
  provideInterceptors,
} from './interceptor';
import {
  MATOMO_ROUTE_DATA_KEY,
  MatomoRouteDataInterceptor,
} from './interceptors/route-data-interceptor';
import { MatomoRouter } from './matomo-router.service';

/**
 * Additional Matomo router features kind
 */
export const enum RouterMatomoFeatureKind {
  /** @see withRouter */
  Router = 'Router',
  /** @see withRouterInterceptors */
  RouterInterceptors = 'RouterInterceptors',
  /** @see withRouteData */
  BuiltInRouteDataInterceptor = 'BuiltInRouteDataInterceptor',
}

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

  return createMatomoFeature(RouterMatomoFeatureKind.Router, providers);
}

/** Add some matomo router interceptors */
export function withRouterInterceptors(
  interceptors: (Type<MatomoRouterInterceptor> | MatomoRouterInterceptorFn)[],
): MatomoFeature {
  return createMatomoFeature(
    RouterMatomoFeatureKind.RouterInterceptors,
    provideInterceptors(interceptors),
    featuresKind => {
      if (!featuresKind.includes(RouterMatomoFeatureKind.Router)) {
        throw new Error(
          `Matomo feature withRouterInterceptors() cannot be used without router feature! Did you forget to call withRouter()?`,
        );
      }
    },
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

  return createMatomoFeature(
    RouterMatomoFeatureKind.BuiltInRouteDataInterceptor,
    providers,
    featuresKind => {
      if (!featuresKind.includes(RouterMatomoFeatureKind.Router)) {
        throw new Error(
          `Matomo feature withRouteData() cannot be used without router feature! Did you forget to call withRouter()?`,
        );
      }
    },
  );
}
