import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import {
  MATOMO_ROUTER_CONFIGURATION,
  MatomoRouterConfigurationWithInterceptors,
} from './router/configuration';
import { provideInterceptors } from './router/interceptor';
import { MatomoRouter } from './router/matomo-router.service';
import { MATOMO_ROUTER_ENABLED } from './tracker/configuration';

@NgModule({
  providers: [{ provide: MATOMO_ROUTER_ENABLED, useValue: true }],
})
export class NgxMatomoRouterModule {
  constructor(
    private readonly router: MatomoRouter,
    @Optional() @SkipSelf() parent?: NgxMatomoRouterModule
  ) {
    if (!parent) {
      // Do not initialize if it is already (by a parent module)
      this.router.initialize();
    }
  }

  static forRoot({
    interceptors,
    ...config
  }: MatomoRouterConfigurationWithInterceptors = {}): ModuleWithProviders<NgxMatomoRouterModule> {
    return {
      ngModule: NgxMatomoRouterModule,
      providers: [
        { provide: MATOMO_ROUTER_CONFIGURATION, useValue: config },
        provideInterceptors(interceptors),
      ],
    };
  }
}
