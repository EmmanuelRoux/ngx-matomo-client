import {inject, InjectFlags, InjectionToken} from '@angular/core';
import {INTERNAL_MATOMO_CONFIGURATION, InternalMatomoConfiguration} from '@ngx-matomo/tracker';

export const MATOMO_ROUTER_CONFIGURATION = new InjectionToken<MatomoRouterConfiguration>('MATOMO_ROUTER_CONFIGURATION');

export type ExclusionConfig = string | RegExp | (string | RegExp)[];

export interface MatomoRouterConfiguration {

  /**
   * Set whether the application base href should be included in Matomo tracked urls
   *
   * Optional, default is `true`
   */
  prependBaseHref?: boolean; // Default true or false?

  /**
   * Set whether the page title should be set when tracking page views
   *
   * Note that if set to `false`, Matomo is likely to still use the initial document title for all
   * tracked page views.
   *
   * Optional, default is `true`
   */
  trackPageTitle?: boolean;

  /**
   * Set a delay after navigation event, before the page view is tracked. This is useful to let a
   * chance to the components to update document title.
   *
   * Set it to 0 (the default) to execute tracking asynchronously without further delay
   * Set it to -1, to execute tracking synchronously (not recommended)
   *
   * Optional, default is `0` (but still asynchronous)
   */
  delay?: number;

  /**
   * Pass some regular expressions to exclude some urls from being tracked as page views
   *
   * Optional, default is no url excluded
   */
  exclude?: ExclusionConfig;

}

export const DEFAULT_ROUTER_CONFIGURATION: Required<MatomoRouterConfiguration> = {
  prependBaseHref: true,
  trackPageTitle: true,
  delay: 0,
  exclude: [],
};

export type InternalGlobalConfiguration = Pick<InternalMatomoConfiguration, 'enableLinkTracking' | 'disabled'>;
export type InternalRouterConfiguration = Required<MatomoRouterConfiguration> & InternalGlobalConfiguration;

export const INTERNAL_ROUTER_CONFIGURATION = new InjectionToken<InternalRouterConfiguration>('INTERNAL_ROUTER_CONFIGURATION', {
  factory: () => {
    const {disabled, enableLinkTracking} = inject(INTERNAL_MATOMO_CONFIGURATION);
    const routerConfig = inject(MATOMO_ROUTER_CONFIGURATION, InjectFlags.Optional) || {};

    return {...DEFAULT_ROUTER_CONFIGURATION, ...routerConfig, enableLinkTracking, disabled};
  },
});
