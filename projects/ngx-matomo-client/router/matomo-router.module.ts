import { ModuleWithProviders, NgModule } from '@angular/core';
import { ɵMATOMO_ROUTER_ENABLED as MATOMO_ROUTER_ENABLED } from 'ngx-matomo-client/core';
import {
  MATOMO_ROUTER_CONFIGURATION,
  MatomoRouterConfigurationWithInterceptors,
} from './configuration';
import { provideInterceptors } from './interceptor';
import { MatomoRouter } from './matomo-router.service';

@NgModule({
  providers: [{ provide: MATOMO_ROUTER_ENABLED, useValue: true }],
})
export class MatomoRouterModule {
  static forRoot(
    configWithInterceptors: MatomoRouterConfigurationWithInterceptors = {},
  ): ModuleWithProviders<MatomoRouterModule> {
    // Note: not using "rest" syntax here, in order to avoid any dependency on tslib (and reduce package size)
    // The only drawback of this is that MATOMO_ROUTER_CONFIGURATION will actually
    // contain a reference to provided interceptors
    return {
      ngModule: MatomoRouterModule,
      providers: [
        MatomoRouter,
        { provide: MATOMO_ROUTER_CONFIGURATION, useValue: configWithInterceptors },
        provideInterceptors(configWithInterceptors.interceptors),
      ],
    };
  }
}

/**
 * @deprecated use MatomoRouterModule instead
 * @breaking-change 7.0.0
 */
@NgModule({
  providers: [{ provide: MATOMO_ROUTER_ENABLED, useValue: true }],
})
export class NgxMatomoRouterModule {
  static forRoot(
    configWithInterceptors: MatomoRouterConfigurationWithInterceptors = {},
  ): ModuleWithProviders<NgxMatomoRouterModule> {
    // Note: not using "rest" syntax here, in order to avoid any dependency on tslib (and reduce package size)
    // The only drawback of this is that MATOMO_ROUTER_CONFIGURATION will actually
    // contain a reference to provided interceptors
    return {
      ngModule: NgxMatomoRouterModule,
      providers: [
        { provide: MATOMO_ROUTER_CONFIGURATION, useValue: configWithInterceptors },
        provideInterceptors(configWithInterceptors.interceptors),
      ],
    };
  }
}
