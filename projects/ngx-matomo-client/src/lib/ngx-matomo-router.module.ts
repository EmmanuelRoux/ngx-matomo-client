import { ModuleWithProviders, NgModule } from '@angular/core';
import { provideRouterInternal } from './ngx-matomo-providers';
import { MatomoRouterConfigurationWithInterceptors } from './router/configuration';
import { provideInterceptors } from './router/interceptor';

@NgModule()
export class NgxMatomoRouterModule {
  static forRoot({
    interceptors,
    ...config
  }: MatomoRouterConfigurationWithInterceptors = {}): ModuleWithProviders<NgxMatomoRouterModule> {
    return {
      ngModule: NgxMatomoRouterModule,
      providers: [provideRouterInternal(config), provideInterceptors(interceptors)],
    };
  }
}
