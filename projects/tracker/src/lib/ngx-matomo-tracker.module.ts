import {ModuleWithProviders, NgModule} from '@angular/core';
import {MATOMO_CONFIGURATION, MatomoConfiguration} from './configuration';
import {MatomoTrackClickDirective} from './directives/matomo-track-click.directive';
import {MatomoTrackerDirective} from './directives/matomo-tracker.directive';
import {MatomoInitializerService} from './matomo-initializer.service';

@NgModule({
  declarations: [MatomoTrackerDirective, MatomoTrackClickDirective],
  exports: [MatomoTrackerDirective, MatomoTrackClickDirective],
})
export class NgxMatomoTrackerModule {

  constructor(private readonly initializer: MatomoInitializerService) {
    this.initializer.init();
  }

  static forRoot(config: MatomoConfiguration): ModuleWithProviders<NgxMatomoTrackerModule> {
    return {
      ngModule: NgxMatomoTrackerModule,
      providers: [
        {provide: MATOMO_CONFIGURATION, useValue: config},
      ],
    };
  }

}
