import { ModuleWithProviders, NgModule, Optional, Provider, SkipSelf } from '@angular/core';
import { MATOMO_CONFIGURATION, MatomoConfiguration } from './configuration';
import { MatomoOptOutFormComponent } from './directives/matomo-opt-out-form.component';
import { MatomoTrackClickDirective } from './directives/matomo-track-click.directive';
import { MatomoTrackerDirective } from './directives/matomo-tracker.directive';
import { MatomoInitializerService } from './matomo-initializer.service';
import { MATOMO_SCRIPT_FACTORY, MatomoScriptFactory } from './script-factory';

@NgModule({
  declarations: [MatomoTrackerDirective, MatomoTrackClickDirective, MatomoOptOutFormComponent],
  exports: [MatomoTrackerDirective, MatomoTrackClickDirective, MatomoOptOutFormComponent],
})
export class NgxMatomoTrackerModule {
  constructor(
    private readonly initializer: MatomoInitializerService,
    @Optional() @SkipSelf() parent?: NgxMatomoTrackerModule
  ) {
    if (!parent) {
      // Do not initialize if it is already (by a parent module)
      this.initializer.init();
    }
  }

  static forRoot(
    config: MatomoConfiguration,
    scriptFactory?: MatomoScriptFactory
  ): ModuleWithProviders<NgxMatomoTrackerModule> {
    const providers: Provider[] = [{ provide: MATOMO_CONFIGURATION, useValue: config }];

    if (scriptFactory) {
      providers.push({ provide: MATOMO_SCRIPT_FACTORY, useFactory: scriptFactory });
    }

    return {
      ngModule: NgxMatomoTrackerModule,
      providers,
    };
  }
}
