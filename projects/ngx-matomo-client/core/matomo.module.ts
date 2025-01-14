import { EnvironmentProviders, ModuleWithProviders, NgModule } from '@angular/core';
import { MatomoOptOutFormComponent } from './directives/matomo-opt-out-form.component';
import { MatomoTrackClickDirective } from './directives/matomo-track-click.directive';
import { MatomoTrackerDirective } from './directives/matomo-tracker.directive';
import { MatomoFeature, provideMatomo, withScriptFactory } from './providers';
import { MatomoConfiguration } from './tracker/configuration';
import { MatomoScriptFactory } from './tracker/script-factory';

export const MATOMO_DIRECTIVES = [
  MatomoTrackerDirective,
  MatomoTrackClickDirective,
  MatomoOptOutFormComponent,
] as const;

function buildProviders(
  config: MatomoConfiguration,
  scriptFactory?: MatomoScriptFactory,
): EnvironmentProviders {
  const features: MatomoFeature[] = [];

  if (scriptFactory) {
    features.push(withScriptFactory(scriptFactory));
  }

  return provideMatomo(config, ...features);
}

@NgModule({
  imports: [...MATOMO_DIRECTIVES],
  exports: [...MATOMO_DIRECTIVES],
})
export class MatomoModule {
  static forRoot(
    config: MatomoConfiguration,
    scriptFactory?: MatomoScriptFactory,
  ): ModuleWithProviders<MatomoModule> {
    return {
      ngModule: MatomoModule,
      providers: [buildProviders(config, scriptFactory)],
    };
  }
}

/**
 * @deprecated use MatomoModule instead
 * @breaking-change 8.0.0
 */
@NgModule({
  imports: [MatomoModule],
  exports: [MatomoModule],
})
export class NgxMatomoModule {
  static forRoot(
    config: MatomoConfiguration,
    scriptFactory?: MatomoScriptFactory,
  ): ModuleWithProviders<NgxMatomoModule> {
    return {
      ngModule: NgxMatomoModule,
      providers: [buildProviders(config, scriptFactory)],
    };
  }
}

/**
 * @deprecated use MatomoModule instead
 * @breaking-change 8.0.0
 */
@NgModule({
  imports: [NgxMatomoModule],
  exports: [NgxMatomoModule],
})
export class NgxMatomoTrackerModule {
  static forRoot(
    config: MatomoConfiguration,
    scriptFactory?: MatomoScriptFactory,
  ): ModuleWithProviders<NgxMatomoTrackerModule> {
    return {
      ngModule: NgxMatomoTrackerModule,
      providers: [buildProviders(config, scriptFactory)],
    };
  }
}
