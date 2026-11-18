import { inject, InjectionToken } from '@angular/core';
import { ɵINTERNAL_MATOMO_CONFIGURATION as INTERNAL_MATOMO_CONFIGURATION } from 'ngx-matomo-client/core';

export interface MatomoAbTestingConfiguration {
  /**
   * Whether the A/B testing plugin script should be loaded.
   *
   * Set to `true` to load the script from the default location (`plugins/AbTesting/tracker.min.js`, relative to the
   * tracker url), or to a string to load it from a custom url.
   *
   * This is not needed if the plugin tracker code is already included in your main `matomo.js` script (which is
   * the default behavior of Matomo).
   *
   * Default: `false`
   */
  loadScript?: boolean | string;
}

export type InternalMatomoAbTestingConfiguration = Required<MatomoAbTestingConfiguration> & {
  disabled: boolean;
};

export const MATOMO_AB_TESTING_CONFIGURATION = new InjectionToken<MatomoAbTestingConfiguration>(
  'MATOMO_AB_TESTING_CONFIGURATION',
);

export const DEFAULT_AB_TESTING_CONFIGURATION: Required<MatomoAbTestingConfiguration> = {
  loadScript: false,
};

export const INTERNAL_MATOMO_AB_TESTING_CONFIGURATION =
  new InjectionToken<InternalMatomoAbTestingConfiguration>(
    'INTERNAL_MATOMO_AB_TESTING_CONFIGURATION',
    {
      factory() {
        const matomoConfig = inject(INTERNAL_MATOMO_CONFIGURATION);
        const userConfig = inject(MATOMO_AB_TESTING_CONFIGURATION, { optional: true }) || {};

        return {
          ...DEFAULT_AB_TESTING_CONFIGURATION,
          ...userConfig,
          disabled: !!matomoConfig.disabled,
        };
      },
    },
  );
