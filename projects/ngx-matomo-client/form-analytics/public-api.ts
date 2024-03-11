/*
 * Public API Surface of plugin form-analytics
 */

export {
  MatomoFormAnalyticsModule,
  MATOMO_FORM_ANALYTICS_DIRECTIVES,
} from './matomo-form-analytics.module';
export { withFormAnalytics } from './providers';
export {
  MatomoFormAnalyticsConfiguration,
  MATOMO_FORM_ANALYTICS_CONFIGURATION,
} from './configuration';
export { MatomoFormAnalytics, MatomoFormAnalyticsInstance } from './matomo-form-analytics.service';
export { TrackFormDirective } from './directives/track-form.directive';
export { TrackFormsDirective } from './directives/track-forms.directive';
export { TrackFormFieldDirective } from './directives/track-form-field.directive';
