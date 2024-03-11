export { runOnce as ɵrunOnce } from './utils/function';
export { appendTrailingSlash as ɵappendTrailingSlash } from './utils/url';
export { ScriptInjector as ɵScriptInjector } from './utils/script-injector';
export {
  INTERNAL_MATOMO_CONFIGURATION as ɵINTERNAL_MATOMO_CONFIGURATION,
  ASYNC_INTERNAL_MATOMO_CONFIGURATION as ɵASYNC_INTERNAL_MATOMO_CONFIGURATION,
  MATOMO_ROUTER_ENABLED as ɵMATOMO_ROUTER_ENABLED,
  isExplicitTrackerConfiguration as ɵisExplicitTrackerConfiguration,
  getTrackersConfiguration as ɵgetTrackersConfiguration,
  isAutoConfigurationMode as ɵisAutoConfigurationMode,
} from './tracker/configuration';
export { InternalMatomoTracker as ɵInternalMatomoTracker } from './tracker/internal-matomo-tracker.service';
export { createMatomoFeature as ɵcreateMatomoFeature } from './providers';
