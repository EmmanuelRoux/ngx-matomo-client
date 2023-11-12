import {
  ENVIRONMENT_INITIALIZER,
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
  Provider,
} from '@angular/core';
import { MATOMO_CONFIGURATION, MatomoConfiguration } from './tracker/configuration';
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

export function createMatomoFeature(kind: MatomoFeatureKind, providers: Provider[]): MatomoFeature {
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
        `Matomo feature ${providerName} cannot be used without router feature! Did you forget to call withRouter()?`,
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
