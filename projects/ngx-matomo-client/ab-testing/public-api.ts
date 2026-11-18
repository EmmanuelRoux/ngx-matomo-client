/*
 * Public API Surface of plugin ab-testing
 */

export { MatomoAbTestingModule } from './matomo-ab-testing.module';
export { withAbTesting } from './providers';
export { MatomoAbTestingConfiguration, MATOMO_AB_TESTING_CONFIGURATION } from './configuration';
export { MatomoAbTesting } from './matomo-ab-testing.service';
export {
  MatomoAbTestingExperiment,
  MatomoAbTestingVariation,
  MatomoAbTestingTarget,
  MatomoAbTestingActivateEvent,
} from './types';
