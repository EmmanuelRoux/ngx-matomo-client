import {
  ENVIRONMENT_INITIALIZER,
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
  Provider,
  Type,
} from '@angular/core';
import { MATOMO_ROUTER_CONFIGURATION, MatomoRouterConfiguration } from './router/configuration';
import {
  MatomoRouterInterceptor,
  provideInterceptor,
  provideInterceptors,
} from './router/interceptor';
import {
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
import { MATOMO_SCRIPT_FACTORY, MatomoScriptFactory } from './tracker/script-factory';

const PRIVATE_MATOMO_PROVIDERS = Symbol('MATOMO_PROVIDERS');

/**
 * Additional Matomo features kind
 */
export const enum MatomoFeatureKind {
  /** @see withScriptFactory */
  ScriptFactory,
  /** @see withRouter */
  Router,
  /** @see withRouterInterceptors */
  RouterInterceptors,
  /** @see withRouteData */
  BuiltInRouteDataInterceptor,
}

export interface MatomoFeature {
  readonly kind: MatomoFeatureKind;
  [PRIVATE_MATOMO_PROVIDERS]: Provider[];
}

function createMatomoFeature(kind: MatomoFeatureKind, providers: Provider[]): MatomoFeature {
  return { kind, [PRIVATE_MATOMO_PROVIDERS]: providers };
}

/**
 * Return Matomo providers (typically added to an application's root module)
 *
 * Additional features may be provided as additional arguments, like this:
 * @example
 * // Simple configuration
 * providers: [ provideMatomo({ siteId: 1, trackerUrl: '...' }) ]
 *
 * // With additional features
 * providers: [
 *     provideMatomo(
 *         { siteId: 1, trackerUrl: '...' },
 *         withScriptFactory(...),
 *     )
 * ]
 *
 * // With advanced config factory function
 * providers: [
 *     provideMatomo(
 *         () => inject(MyService).getMatomoConfig(),
 *         withScriptFactory(...),
 *     )
 * ]
 *
 * @param config Matomo configuration (or configuration factory, which can use `inject`)
 * @param features Optional additional features to enable
 *
 * @see MatomoConfiguration
 * @see withScriptFactory
 * @see withRouter
 * @see withRouterInterceptors
 * @see withRouteData
 */
export function provideMatomo(
  config: MatomoConfiguration | (() => MatomoConfiguration),
  ...features: MatomoFeature[]
): EnvironmentProviders {
  const providers: Provider[] = [
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useValue() {
        inject(MatomoInitializerService).initialize();
      },
    },
  ];
  const featuresKind: MatomoFeatureKind[] = [];

  if (typeof config === 'function') {
    providers.push({
      provide: MATOMO_CONFIGURATION,
      useFactory: config,
    });
  } else {
    providers.push({
      provide: MATOMO_CONFIGURATION,
      useValue: config,
    });
  }

  for (const feature of features) {
    providers.push(...feature[PRIVATE_MATOMO_PROVIDERS]);
    featuresKind.push(feature.kind);
  }

  const routerFeatures = [
    [MatomoFeatureKind.RouterInterceptors, 'withRouterInterceptors()'],
    [MatomoFeatureKind.BuiltInRouteDataInterceptor, 'withRouteData()'],
  ] as const;

  for (const [feature, providerName] of routerFeatures) {
    if (featuresKind.includes(feature) && !featuresKind.includes(MatomoFeatureKind.Router)) {
      throw new Error(
        `Matomo feature ${providerName} cannot be used without router feature! Did you forget to call withRouter()?`
      );
    }
  }

  return makeEnvironmentProviders(providers);
}

/** Add a custom script factory to use for Matomo's script element */
export function withScriptFactory(scriptFactory: MatomoScriptFactory): MatomoFeature {
  return createMatomoFeature(MatomoFeatureKind.ScriptFactory, [
    { provide: MATOMO_SCRIPT_FACTORY, useValue: scriptFactory },
  ]);
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
