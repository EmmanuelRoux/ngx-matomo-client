import { ErrorHandler, inject, provideEnvironmentInitializer } from '@angular/core';
import { MatomoFeature, ɵcreateMatomoFeature as createMatomoFeature } from 'ngx-matomo-client/core';
import { MATOMO_AB_TESTING_CONFIGURATION, MatomoAbTestingConfiguration } from './configuration';
import { MatomoAbTestingInitializer } from './matomo-ab-testing-initializer.service';
import { MatomoAbTesting } from './matomo-ab-testing.service';

/**
 * Additional Matomo A/B testing features kind
 */
export const enum AbTestingMatomoFeatureKind {
  AbTesting = 'AbTesting',
}

/** Enable A/B testing plugin support */
export function withAbTesting(config?: MatomoAbTestingConfiguration): MatomoFeature {
  const providers = [
    MatomoAbTesting,
    MatomoAbTestingInitializer,
    {
      provide: MATOMO_AB_TESTING_CONFIGURATION,
      useValue: config,
    },
    provideEnvironmentInitializer(() => {
      const errorHandler = inject(ErrorHandler);

      // Do NOT wait here for initialization, because app startup should NOT be blocked until deferred config is resolved
      // However, correctly propagate errors to error handler
      Promise.resolve(inject(MatomoAbTestingInitializer).initialize()).catch(error =>
        errorHandler.handleError(error),
      );
    }),
  ];

  return createMatomoFeature(AbTestingMatomoFeatureKind.AbTesting, providers);
}
