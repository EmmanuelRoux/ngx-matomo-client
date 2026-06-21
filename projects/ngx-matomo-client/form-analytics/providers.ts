import { provideEnvironmentInitializer, ErrorHandler, inject } from '@angular/core';
import {
  MatomoFeature as MatomoFeature,
  ɵcreateMatomoFeature as createMatomoFeature,
} from 'ngx-matomo-client/core';
import {
  MATOMO_FORM_ANALYTICS_CONFIGURATION,
  MatomoFormAnalyticsConfiguration,
} from './configuration';
import { MatomoFormAnalyticsInitializer } from './matomo-form-analytics-initializer.service';
import { MatomoFormAnalytics } from './matomo-form-analytics.service';

/**
 * Additional Matomo router features kind
 */
export const enum FormAnalyticsMatomoFeatureKind {
  FormAnalytics = 'FormAnalytics',
}

/** Enable automatic page views tracking */
export function withFormAnalytics(config?: MatomoFormAnalyticsConfiguration): MatomoFeature {
  const providers = [
    MatomoFormAnalytics,
    MatomoFormAnalyticsInitializer,
    {
      provide: MATOMO_FORM_ANALYTICS_CONFIGURATION,
      useValue: config,
    },
    provideEnvironmentInitializer(() => {
      const errorHandler = inject(ErrorHandler);

      // Do NOT wait here for initialization, because app startup should NOT be blocked until deferred config is resolved
      // However, correctly propagate errors to error handler
      Promise.resolve(inject(MatomoFormAnalyticsInitializer).initialize()).catch(error =>
        errorHandler.handleError(error),
      );
    }),
  ];

  return createMatomoFeature(FormAnalyticsMatomoFeatureKind.FormAnalytics, providers);
}
