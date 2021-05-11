import {inject, InjectFlags, InjectionToken} from '@angular/core';
import {requireNonNull} from './coercion';

const CONFIG_NOT_FOUND = 'No Matomo configuration found! Have you included Matomo module using NgxMatomoTrackerModule.forRoot() ?';

/** Injection token for {@link MatomoConfiguration} */
export const MATOMO_CONFIGURATION = new InjectionToken<MatomoConfiguration>('MATOMO_CONFIGURATION');

/**
 * For internal use only. Injection token for {@link InternalMatomoConfiguration}
 *
 */
export const INTERNAL_MATOMO_CONFIGURATION = new InjectionToken<InternalMatomoConfiguration>('INTERNAL_MATOMO_CONFIGURATION', {
  factory: () => ({
    disabled: false,
    enableLinkTracking: true,
    trackAppInitialLoad: false,
    ...requireNonNull(inject(MATOMO_CONFIGURATION, InjectFlags.Optional), CONFIG_NOT_FOUND),
  }) as InternalMatomoConfiguration,
});

/**
 * For internal use only. Module configuration merged with default values.
 *
 */
export type InternalMatomoConfiguration = MatomoConfiguration & Required<BaseMatomoConfiguration>;

export enum MatomoInitializationMode {
  /** Automatically inject matomo script using provided configuration */
  AUTO,
  /** Do not inject Matomo script. In this case, initialization script must be provided */
  MANUAL,
}

export interface MatomoTrackerConfiguration {
  /** Matomo site id */
  siteId: number | string;

  /** Matomo server url */
  trackerUrl: string;
}

export interface MultiTrackersConfiguration {
  /**
   * Configure multiple tracking servers. <b>Order matters: if no custom script url is
   * provided, Matomo script will be downloaded from first tracker.</b>
   */
  trackers: MatomoTrackerConfiguration[];
}

export interface BaseMatomoConfiguration {
  /** Set to `true` to disable tracking */
  disabled?: boolean;

  /** If `true`, track a page view when app loads (default `false`) */
  trackAppInitialLoad?: boolean;

  /**
   * Set to `false` to disable this Matomo feature (default `true`).
   * Used when {@link trackAppInitialLoad} is `true` and by Router module.
   */
  enableLinkTracking?: boolean;

  /** Set to `true` to not track users who opt out of tracking using <i>Do Not Track</i> setting */
  acceptDoNotTrack?: boolean;
}

export interface BaseAutoMatomoConfiguration {
  /**
   * Set the script initialization mode (default is `AUTO`)
   *
   */
  mode?: MatomoInitializationMode.AUTO;

  /** Matomo script url (default is `matomo.js` appended to main tracker url) */
  scriptUrl?: string;

}

type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
type XOR<T, U> = (T | U) extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;

export type ManualMatomoConfiguration = {
  /**
   * Set the script initialization mode (default is `AUTO`)
   *
   */
  mode: MatomoInitializationMode.MANUAL;
};


export type AutoMatomoConfiguration = BaseAutoMatomoConfiguration & XOR<MatomoTrackerConfiguration, MultiTrackersConfiguration>;

export type MatomoConfiguration = BaseMatomoConfiguration & XOR<AutoMatomoConfiguration, ManualMatomoConfiguration>;
