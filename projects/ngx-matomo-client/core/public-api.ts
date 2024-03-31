/*
 * Public API Surface of tracker
 */

export * from './private-api';

export {
  NgxMatomoModule,
  NgxMatomoTrackerModule,
  MatomoModule,
  MATOMO_DIRECTIVES,
} from './matomo.module';
export { provideMatomo, withScriptFactory, MatomoFeatureKind, MatomoFeature } from './providers';
export {
  MatomoTracker,
  MatomoECommerceItem,
  MatomoECommerceView,
  MatomoECommerceItemView,
  MatomoECommerceCategoryView,
  PagePerformanceTimings,
  MatomoInstance,
} from './tracker/matomo-tracker.service';
export { MatomoInitializerService } from './tracker/matomo-initializer.service';
export {
  MatomoConfiguration,
  MATOMO_CONFIGURATION,
  AutoMatomoConfiguration,
  MatomoInitializationMode,
  MatomoConsentMode,
  InternalMatomoConfiguration,
  INTERNAL_MATOMO_CONFIGURATION,
} from './tracker/configuration';
export {
  MATOMO_SCRIPT_FACTORY,
  MatomoScriptFactory,
  createDefaultMatomoScriptElement,
} from './tracker/script-factory';
export { MatomoTrackerDirective } from './directives/matomo-tracker.directive';
export { MatomoTrackClickDirective } from './directives/matomo-track-click.directive';
export { MatomoOptOutFormComponent } from './directives/matomo-opt-out-form.component';
