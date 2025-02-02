/*
 * Public API Surface of tracker
 */

export {
  withRouter,
  withRouterInterceptors,
  withRouteData,
  withPageUrlProvider,
} from './providers';
export { MatomoRouterModule, NgxMatomoRouterModule } from './matomo-router.module';
export {
  MatomoRouterConfiguration,
  MATOMO_ROUTER_CONFIGURATION,
  ExclusionConfig,
  MatomoRouterConfigurationWithInterceptors,
  NavigationEndComparator,
} from './configuration';
export { PageTitleProvider, MATOMO_PAGE_TITLE_PROVIDER } from './page-title-providers';
export {
  PageUrlProvider,
  MATOMO_PAGE_URL_PROVIDER,
  PageUrlProviderFn,
  providePageUrlProvider,
} from './page-url-provider';
export {
  MatomoRouterInterceptor,
  MatomoRouterInterceptorFn,
  MATOMO_ROUTER_INTERCEPTORS,
  provideInterceptor,
  provideInterceptors,
} from './interceptor';
export { MatomoRouteInterceptorBase } from './interceptors/route-interceptor-base';
export {
  MatomoRouteData,
  MatomoRouteDataInterceptor,
  MATOMO_ROUTE_DATA_KEY,
} from './interceptors/route-data-interceptor';
