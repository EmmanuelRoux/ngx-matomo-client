import { ModuleWithProviders, NgModule } from '@angular/core';
import { MATOMO_DIRECTIVES } from 'ngx-matomo-client/core';
import { provideMatomoTesting } from './providers';

@NgModule({
  imports: [...MATOMO_DIRECTIVES],
  exports: [...MATOMO_DIRECTIVES],
})
export class MatomoTestingModule {
  static forRoot(): ModuleWithProviders<MatomoTestingModule> {
    return {
      ngModule: MatomoTestingModule,
      providers: [provideMatomoTesting()],
    };
  }
}
