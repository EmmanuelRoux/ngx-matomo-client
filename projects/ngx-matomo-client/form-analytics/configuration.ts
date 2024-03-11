import { inject, InjectionToken } from '@angular/core';
import { ɵINTERNAL_MATOMO_CONFIGURATION as INTERNAL_MATOMO_CONFIGURATION } from 'ngx-matomo-client/core';

export interface MatomoFormAnalyticsConfiguration {
  disabled?: boolean;
  loadScript?: boolean | string;
  autoScan?: boolean;
  autoScanDelay?: number;
}

export type InternalMatomoFormAnalyticsConfiguration = Required<MatomoFormAnalyticsConfiguration>;

export const MATOMO_FORM_ANALYTICS_CONFIGURATION =
  new InjectionToken<MatomoFormAnalyticsConfiguration>('MATOMO_FORM_ANALYTICS_CONFIGURATION');

export const DEFAULT_FORM_ANALYTICS_CONFIGURATION: InternalMatomoFormAnalyticsConfiguration = {
  disabled: false,
  loadScript: false,
  autoScan: true,
  autoScanDelay: 0,
};

export const INTERNAL_MATOMO_FORM_ANALYTICS_CONFIGURATION =
  new InjectionToken<InternalMatomoFormAnalyticsConfiguration>(
    'INTERNAL_MATOMO_FORM_ANALYTICS_CONFIGURATION',
    {
      factory() {
        const matomoConfig = inject(INTERNAL_MATOMO_CONFIGURATION);
        const userConfig = inject(MATOMO_FORM_ANALYTICS_CONFIGURATION, { optional: true }) || {};
        const merged = {
          ...DEFAULT_FORM_ANALYTICS_CONFIGURATION,
          ...userConfig,
        };

        return {
          ...merged,
          disabled: merged.disabled || matomoConfig.disabled,
        };
      },
    },
  );
