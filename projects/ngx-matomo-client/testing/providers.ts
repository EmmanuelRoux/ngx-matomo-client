import { EnvironmentProviders, makeEnvironmentProviders, Provider } from '@angular/core';
import {
  MATOMO_CONFIGURATION,
  MatomoConfiguration,
  MatomoFeature,
  MatomoTracker,
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
  ..._ignored: MatomoFeature[]
): EnvironmentProviders {
  const providers: Provider[] = [
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
