import { EnvironmentProviders, makeEnvironmentProviders, Provider } from '@angular/core';
import {
  MATOMO_CONFIGURATION,
  MatomoConfiguration,
  MatomoFeature,
  MatomoTracker,
  provideMatomo,
  ɵprovideTestingTracker as provideTestingTracker,
} from 'ngx-matomo-client/core';
import { MatomoTestingTracker } from './matomo-testing-tracker';

/**
 * Set up a no-op Matomo tracker. Useful for testing scenario.
 *
 *
 * Testing tracker is available as both {@link MatomoTracker} and {@link MatomoTestingTracker} injection tokens,
 * the latter allowing to customize testing behavior (see {@link MatomoTestingTracker}).
 *
 * @see MatomoTestingTracker
 */
export function provideMatomoTesting(
  config: Partial<MatomoConfiguration> | (() => Partial<MatomoConfiguration>) = {},
  ...features: MatomoFeature[]
): EnvironmentProviders {
  const providers: (Provider | EnvironmentProviders)[] = [
    provideMatomo(config as MatomoConfiguration | (() => MatomoConfiguration), ...features),
    provideTestingTracker(),
    MatomoTestingTracker,
    {
      provide: MatomoTracker,
      useExisting: MatomoTestingTracker,
    },
  ];

  // Allow to provide a configuration, because it can be useful for users depending on `MATOMO_CONFIGURATION` in their code.
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

  return makeEnvironmentProviders(providers);
}
