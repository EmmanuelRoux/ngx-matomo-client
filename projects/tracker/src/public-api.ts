/*
 * Public API Surface of tracker
 */

export { MatomoTracker } from './lib/matomo-tracker.service';
export { NgxMatomoTrackerModule } from './lib/ngx-matomo-tracker.module';
export {
  MatomoConfiguration,
  MATOMO_CONFIGURATION,
  MatomoInitializationMode,
  MatomoConsentMode,
  InternalMatomoConfiguration,
  INTERNAL_MATOMO_CONFIGURATION,
} from './lib/configuration';
export { MatomoTrackerDirective } from './lib/directives/matomo-tracker.directive';
export { MatomoTrackClickDirective } from './lib/directives/matomo-track-click.directive';
