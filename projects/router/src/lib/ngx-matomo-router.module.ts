import { ModuleWithProviders, NgModule } from '@angular/core';
import { MATOMO_ROUTER_CONFIGURATION, MatomoRouterConfiguration } from './configuration';
import { MatomoRouter } from './matomo-router.service';

@NgModule()
export class NgxMatomoRouterModule {
  constructor(private readonly router: MatomoRouter) {
    this.router.init();
  }

  static forRoot(
    config: MatomoRouterConfiguration = {}
  ): ModuleWithProviders<NgxMatomoRouterModule> {
    return {
      ngModule: NgxMatomoRouterModule,
      providers: [{ provide: MATOMO_ROUTER_CONFIGURATION, useValue: config }],
    };
  }
}
