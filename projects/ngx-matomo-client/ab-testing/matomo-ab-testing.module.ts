import { inject, ModuleWithProviders, NgModule } from '@angular/core';
import { MATOMO_AB_TESTING_CONFIGURATION, MatomoAbTestingConfiguration } from './configuration';
import { MatomoAbTestingInitializer } from './matomo-ab-testing-initializer.service';
import { MatomoAbTesting } from './matomo-ab-testing.service';

@NgModule({
  providers: [MatomoAbTesting, MatomoAbTestingInitializer],
})
export class MatomoAbTestingModule {
  private readonly initializer = inject(MatomoAbTestingInitializer);

  constructor() {
    const parent = inject(MatomoAbTestingModule, { optional: true, skipSelf: true });

    if (!parent) {
      // Do not initialize if it is already (by a parent module)
      this.initializer.initialize();
    }
  }

  static forRoot(
    config: MatomoAbTestingConfiguration = {},
  ): ModuleWithProviders<MatomoAbTestingModule> {
    return {
      ngModule: MatomoAbTestingModule,
      providers: [{ provide: MATOMO_AB_TESTING_CONFIGURATION, useValue: config }],
    };
  }
}
