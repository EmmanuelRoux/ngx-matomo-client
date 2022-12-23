import { ModuleWithProviders, NgModule, Optional, Provider, SkipSelf } from '@angular/core';
import { MatomoOptOutFormComponent } from './directives/matomo-opt-out-form.component';
import { MatomoTrackClickDirective } from './directives/matomo-track-click.directive';
import { MatomoTrackerDirective } from './directives/matomo-tracker.directive';
import { MATOMO_CONFIGURATION, MatomoConfiguration } from './tracker/configuration';
import { MatomoInitializerService } from './tracker/matomo-initializer.service';
import { MATOMO_SCRIPT_FACTORY, MatomoScriptFactory } from './tracker/script-factory';

const DIRECTIVES = [MatomoTrackerDirective, MatomoTrackClickDirective, MatomoOptOutFormComponent];

function buildProviders(
  config: MatomoConfiguration,
  scriptFactory?: MatomoScriptFactory
): Provider[] {
  const providers: Provider[] = [{ provide: MATOMO_CONFIGURATION, useValue: config }];

  if (scriptFactory) {
    providers.push({ provide: MATOMO_SCRIPT_FACTORY, useValue: scriptFactory });
  }

  return providers;
}

@NgModule({
  declarations: DIRECTIVES,
  exports: DIRECTIVES,
})
export class NgxMatomoModule {
  constructor(
    private readonly initializer: MatomoInitializerService,
    @Optional() @SkipSelf() parent?: NgxMatomoModule
  ) {
    if (!parent) {
      // Do not initialize if it is already (by a parent module)
      this.initializer.initialize();
    }
  }

  static forRoot(
    config: MatomoConfiguration,
    scriptFactory?: MatomoScriptFactory
  ): ModuleWithProviders<NgxMatomoModule> {
    return {
      ngModule: NgxMatomoModule,
      providers: buildProviders(config, scriptFactory),
    };
  }
}

/**
 * @deprecated use NgxMatomoModule instead
 */
@NgModule({
  imports: [NgxMatomoModule],
  exports: [NgxMatomoModule],
})
export class NgxMatomoTrackerModule {
  static forRoot(
    config: MatomoConfiguration,
    scriptFactory?: MatomoScriptFactory
  ): ModuleWithProviders<NgxMatomoTrackerModule> {
    return {
      ngModule: NgxMatomoTrackerModule,
      providers: buildProviders(config, scriptFactory),
    };
  }
}
