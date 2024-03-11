import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import {
  MATOMO_FORM_ANALYTICS_CONFIGURATION,
  MatomoFormAnalyticsConfiguration,
} from './configuration';
import { TrackFormFieldDirective } from './directives/track-form-field.directive';
import { TrackFormDirective } from './directives/track-form.directive';
import { TrackFormsDirective } from './directives/track-forms.directive';
import { MatomoFormAnalyticsInitializer } from './matomo-form-analytics-initializer.service';

export const MATOMO_FORM_ANALYTICS_DIRECTIVES = [
  TrackFormDirective,
  TrackFormsDirective,
  TrackFormFieldDirective,
] as const;

@NgModule({
  imports: [...MATOMO_FORM_ANALYTICS_DIRECTIVES],
  exports: [...MATOMO_FORM_ANALYTICS_DIRECTIVES],
})
export class MatomoFormAnalyticsModule {
  constructor(
    private readonly formAnalytics: MatomoFormAnalyticsInitializer,
    @Optional() @SkipSelf() parent?: MatomoFormAnalyticsModule,
  ) {
    if (!parent) {
      // Do not initialize if it is already (by a parent module)
      this.formAnalytics.initialize();
    }
  }

  static forRoot(
    config: MatomoFormAnalyticsConfiguration = {},
  ): ModuleWithProviders<MatomoFormAnalyticsModule> {
    return {
      ngModule: MatomoFormAnalyticsModule,
      providers: [{ provide: MATOMO_FORM_ANALYTICS_CONFIGURATION, useValue: config }],
    };
  }
}
