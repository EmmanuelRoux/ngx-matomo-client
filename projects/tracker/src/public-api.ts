/*
 * Public API Surface of tracker
 */

export {
  MatomoTracker,
  MatomoECommerceItem,
  MatomoECommerceView,
  MatomoECommerceItemView,
  MatomoECommerceCategoryView,
} from './lib/matomo-tracker.service';
export { NgxMatomoTrackerModule } from './lib/ngx-matomo-tracker.module';
export {
  MatomoConfiguration,
  MATOMO_CONFIGURATION,
  MatomoInitializationMode,
  MatomoConsentMode,
  InternalMatomoConfiguration,
  INTERNAL_MATOMO_CONFIGURATION,
} from './lib/configuration';
export {
  MATOMO_SCRIPT_FACTORY,
  MatomoScriptFactory,
  createDefaultMatomoScriptElement,
} from './lib/script-factory';
export { MatomoTrackerDirective } from './lib/directives/matomo-tracker.directive';
export { MatomoTrackClickDirective } from './lib/directives/matomo-track-click.directive';
export { MatomoOptOutFormComponent } from './lib/directives/matomo-opt-out-form.component';
