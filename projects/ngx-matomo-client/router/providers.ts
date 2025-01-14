import { ENVIRONMENT_INITIALIZER, inject, Provider, Type } from '@angular/core';
import {
  MatomoFeature as MatomoFeature,
  MatomoFeatureKind,
  ɵcreateMatomoFeature as createMatomoFeature,
  ɵMATOMO_ROUTER_ENABLED as MATOMO_ROUTER_ENABLED,
} from 'ngx-matomo-client/core';
import {
  createInternalRouterConfiguration,
  INTERNAL_ROUTER_CONFIGURATION,
  MATOMO_ROUTER_CONFIGURATION,
  MatomoRouterConfiguration,
} from './configuration';
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
import { DefaultPageTitleProvider, MATOMO_PAGE_TITLE_PROVIDER } from './page-title-providers';
import {
  createDefaultPageUrlProvider,
  MATOMO_PAGE_URL_PROVIDER,
  PageUrlProvider,
  PageUrlProviderFn,
  providePageUrlProvider,
} from './page-url-provider';

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
  PageUrlProvider = 'PageUrlProvider',
}

/** Enable automatic page views tracking */
export function withRouter(config?: MatomoRouterConfiguration): MatomoFeature {
  const providers = buildInternalRouterProviders(config);

  return createMatomoFeature(RouterMatomoFeatureKind.Router, providers);
}

export function buildInternalRouterProviders(config?: MatomoRouterConfiguration): Provider[] {
  return [
    MatomoRouter,
    { provide: MATOMO_ROUTER_ENABLED, useValue: true },
    { provide: MATOMO_ROUTER_CONFIGURATION, useValue: config },
    {
      provide: INTERNAL_ROUTER_CONFIGURATION,
      useFactory: createInternalRouterConfiguration,
    },
    {
      provide: MATOMO_PAGE_URL_PROVIDER,
      useFactory: createDefaultPageUrlProvider,
    },
    {
      provide: MATOMO_PAGE_TITLE_PROVIDER,
      useClass: DefaultPageTitleProvider,
    },
    MatomoRouter,
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useValue() {
        inject(MatomoRouter).initialize();
      },
    },
  ];
}

function requireRouterFeature(featureName: string) {
  return (featuresKind: MatomoFeatureKind[]) => {
    if (!featuresKind.includes(RouterMatomoFeatureKind.Router)) {
      throw new Error(
        `Matomo feature ${featureName} cannot be used without router feature! Did you forget to call withRouter()?`,
      );
    }
  };
}

/** Add some matomo router interceptors */
export function withRouterInterceptors(
  interceptors: (Type<MatomoRouterInterceptor> | MatomoRouterInterceptorFn)[],
): MatomoFeature {
  return createMatomoFeature(
    RouterMatomoFeatureKind.RouterInterceptors,
    provideInterceptors(interceptors),
    requireRouterFeature('withRouterInterceptors()'),
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
    requireRouterFeature('withRouteData()'),
  );
}

export function withPageUrlProvider(
  provider: Type<PageUrlProvider> | PageUrlProviderFn,
): MatomoFeature {
  return createMatomoFeature(
    RouterMatomoFeatureKind.PageUrlProvider,
    [providePageUrlProvider(provider)],
    requireRouterFeature('withPageUrlProvider()'),
  );
}
