import { inject, InjectionToken, Type } from '@angular/core';
import { NavigationEnd } from '@angular/router';
import {
  InternalMatomoConfiguration,
  ɵINTERNAL_MATOMO_CONFIGURATION as INTERNAL_MATOMO_CONFIGURATION,
} from 'ngx-matomo-client/core';
import { MatomoRouterInterceptor } from './interceptor';

export const MATOMO_ROUTER_CONFIGURATION = new InjectionToken<MatomoRouterConfiguration>(
  'MATOMO_ROUTER_CONFIGURATION',
);

export type ExclusionConfig = string | RegExp | (string | RegExp)[];
export type NavigationEndComparator = (
  previousNavigationEnd: NavigationEnd,
  currentNavigationEnd: NavigationEnd,
) => boolean;

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

  /**
   * Custom url comparator to detect url change between Angular route navigations.
   *
   * This may be useful, because by default all `NavigationEnd` events will trigger a page track and this may happen
   * after query params change only (without url actually changing).
   *
   * You can define a custom comparator here to compare url by ignoring query params.
   *
   * Note: this is different from providing the url sent to Matomo for actual tracking. The url sent to Matomo will be
   * the full page url, including any base href, and is configured using a {@link PageUrlProvider} (see
   * `MATOMO_PAGE_URL_PROVIDER` token).
   *
   * Optional, default is to compare `NavigationEnd.urlAfterRedirects`
   *
   * Possible values:
   * - `'fullUrl'` (or undefined): default value, compare using `NavigationEnd.urlAfterRedirects`
   * - `'ignoreQueryParams'`: compare using `NavigationEnd.urlAfterRedirects` but ignoring query params
   * - `NavigationEndComparator`: compare using a custom `NavigationEndComparator` function
   */
  navigationEndComparator?: NavigationEndComparator | 'ignoreQueryParams' | 'fullUrl';
}

export interface MatomoRouterConfigurationWithInterceptors extends MatomoRouterConfiguration {
  /**
   * Interceptors types to register.
   *
   * For more complex scenarios, it is possible to configure any interceptor by
   * providing token `MATOMO_ROUTER_INTERCEPTORS` as `multi` provider(s).
   */
  interceptors?: Type<MatomoRouterInterceptor>[];
}

export const DEFAULT_ROUTER_CONFIGURATION: Required<MatomoRouterConfiguration> = {
  prependBaseHref: true,
  trackPageTitle: true,
  delay: 0,
  exclude: [],
  navigationEndComparator: 'fullUrl',
};

export type InternalGlobalConfiguration = Pick<
  InternalMatomoConfiguration,
  'enableLinkTracking' | 'disabled'
>;
export type InternalRouterConfiguration = Required<MatomoRouterConfiguration> &
  InternalGlobalConfiguration;

export const INTERNAL_ROUTER_CONFIGURATION = new InjectionToken<InternalRouterConfiguration>(
  'INTERNAL_ROUTER_CONFIGURATION',
  {
    factory: () => {
      const { disabled, enableLinkTracking } = inject(INTERNAL_MATOMO_CONFIGURATION);
      const routerConfig = inject(MATOMO_ROUTER_CONFIGURATION, { optional: true }) || {};

      return { ...DEFAULT_ROUTER_CONFIGURATION, ...routerConfig, enableLinkTracking, disabled };
    },
  },
);
