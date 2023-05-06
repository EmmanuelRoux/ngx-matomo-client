/*
 * Public API Surface of tracker
 */

export { NgxMatomoModule, NgxMatomoTrackerModule } from './lib/ngx-matomo.module';
export {
  provideMatomo,
  withScriptFactory,
  withRouter,
  withRouterInterceptors,
  withRouteData,
  MatomoFeatureKind,
  MatomoFeature,
} from './lib/ngx-matomo-providers';
export {
  MatomoTracker,
  MatomoECommerceItem,
  MatomoECommerceView,
  MatomoECommerceItemView,
  MatomoECommerceCategoryView,
  PagePerformanceTimings,
} from './lib/tracker/matomo-tracker.service';
export { MatomoInitializerService } from './lib/tracker/matomo-initializer.service';
export {
  MatomoConfiguration,
  MATOMO_CONFIGURATION,
  AutoMatomoConfiguration,
  MatomoInitializationMode,
  MatomoConsentMode,
  InternalMatomoConfiguration,
  INTERNAL_MATOMO_CONFIGURATION,
} from './lib/tracker/configuration';
export {
  MATOMO_SCRIPT_FACTORY,
  MatomoScriptFactory,
  createDefaultMatomoScriptElement,
} from './lib/tracker/script-factory';
export { MatomoTrackerDirective } from './lib/directives/matomo-tracker.directive';
export { MatomoTrackClickDirective } from './lib/directives/matomo-track-click.directive';
export { MatomoOptOutFormComponent } from './lib/directives/matomo-opt-out-form.component';
export { NgxMatomoRouterModule } from './lib/ngx-matomo-router.module';
export {
  MatomoRouterConfiguration,
  MATOMO_ROUTER_CONFIGURATION,
  ExclusionConfig,
  MatomoRouterConfigurationWithInterceptors,
} from './lib/router/configuration';
export { PageTitleProvider, MATOMO_PAGE_TITLE_PROVIDER } from './lib/router/page-title-providers';
export { PageUrlProvider, MATOMO_PAGE_URL_PROVIDER } from './lib/router/page-url-provider';
export {
  MatomoRouterInterceptor,
  MATOMO_ROUTER_INTERCEPTORS,
  provideInterceptor,
  provideInterceptors,
} from './lib/router/interceptor';
export { MatomoRouteInterceptorBase } from './lib/router/interceptors/route-interceptor-base';
export {
  MatomoRouteData,
  MatomoRouteDataInterceptor,
} from './lib/router/interceptors/route-data-interceptor';
