import {
  ENVIRONMENT_INITIALIZER,
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
  Provider,
  Type,
} from '@angular/core';
import { MATOMO_ROUTER_CONFIGURATION, MatomoRouterConfiguration } from './router/configuration';
import { MatomoRouterInterceptor, provideInterceptors } from './router/interceptor';
import { MatomoRouter } from './router/matomo-router.service';
import { MATOMO_CONFIGURATION, MatomoConfiguration } from './tracker/configuration';
import { MatomoInitializerService } from './tracker/matomo-initializer.service';
import { MATOMO_SCRIPT_FACTORY, MatomoScriptFactory } from './tracker/script-factory';

const PRIVATE_MATOMO_PROVIDERS = Symbol('MATOMO_PROVIDERS');

/**
 * Additional Matomo features kind
 */
export const enum MatomoFeatureKind {
  ScriptFactory,
  Router,
  RouterInterceptors,
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
 * @see MatomoConfiguration
 * @see withScriptFactory
 * @see withRouter
 * @see withRouterInterceptors
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

  if (
    featuresKind.includes(MatomoFeatureKind.RouterInterceptors) &&
    !featuresKind.includes(MatomoFeatureKind.Router)
  ) {
    throw new Error(
      'Matomo feature withRouterInterceptors() cannot be used without router feature! Did you forget to call withRouter()?'
    );
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
  const providers = provideRouterInternal(config);

  return createMatomoFeature(MatomoFeatureKind.Router, providers);
}

export function provideRouterInternal(config?: MatomoRouterConfiguration): Provider[] {
  return [
    { provide: MATOMO_ROUTER_CONFIGURATION, useValue: config },
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useValue() {
        inject(MatomoRouter).initialize();
      },
    },
  ];
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
