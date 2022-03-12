/*
 * Public API Surface of router
 */

export { NgxMatomoRouterModule } from './lib/ngx-matomo-router.module';
export {
  MatomoRouterConfiguration,
  MATOMO_ROUTER_CONFIGURATION,
  ExclusionConfig,
  MatomoRouterConfigurationWithInterceptors,
} from './lib/configuration';
export { PageTitleProvider, MATOMO_PAGE_TITLE_PROVIDER } from './lib/page-title-providers';
export { PageUrlProvider, MATOMO_PAGE_URL_PROVIDER } from './lib/page-url-provider';
export {
  MatomoRouterInterceptor,
  MATOMO_ROUTER_INTERCEPTORS,
  provideInterceptor,
  provideInterceptors,
} from './lib/interceptor';
export { MatomoRouteInterceptorBase } from './lib/interceptors/route-interceptor-base';
export {
  MatomoRouteData,
  MatomoRouteDataInterceptor,
} from './lib/interceptors/route-data-interceptor';
