import { ModuleWithProviders, NgModule } from '@angular/core';
import {
  MatomoOptOutFormComponent,
  MatomoTrackClickDirective,
  MatomoTrackerDirective,
} from 'ngx-matomo-client/core';
import { provideMatomoTesting } from './providers';

@NgModule({
  imports: [MatomoTrackerDirective, MatomoTrackClickDirective, MatomoOptOutFormComponent],
  exports: [MatomoTrackerDirective, MatomoTrackClickDirective, MatomoOptOutFormComponent],
})
export class MatomoTestingModule {
  static forRoot(): ModuleWithProviders<MatomoTestingModule> {
    return {
      ngModule: MatomoTestingModule,
      providers: [provideMatomoTesting()],
    };
  }
}
