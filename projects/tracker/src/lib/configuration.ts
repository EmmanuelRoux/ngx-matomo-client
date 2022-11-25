import { inject, InjectFlags, InjectionToken } from '@angular/core';
import { requireNonNull } from './coercion';

const CONFIG_NOT_FOUND =
  'No Matomo configuration found! Have you included Matomo module using NgxMatomoTrackerModule.forRoot() ?';

/** Injection token for {@link MatomoConfiguration} */
export const MATOMO_CONFIGURATION = new InjectionToken<MatomoConfiguration>('MATOMO_CONFIGURATION');

/**
 * For internal use only. Injection token for {@link InternalMatomoConfiguration}
 *
 */
export const INTERNAL_MATOMO_CONFIGURATION = new InjectionToken<InternalMatomoConfiguration>(
  'INTERNAL_MATOMO_CONFIGURATION',
  {
    factory: () =>
      ({
        disabled: false,
        enableLinkTracking: true,
        trackAppInitialLoad: false,
        requireConsent: MatomoConsentMode.NONE,
        enableJSErrorTracking: false,
        runOutsideAngularZone: false,
        ...requireNonNull(inject(MATOMO_CONFIGURATION, InjectFlags.Optional), CONFIG_NOT_FOUND),
      } as InternalMatomoConfiguration),
  }
);

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
  /**
   * Automatically inject matomo script when deferred tracker configuration is provided using `MatomoDeferredInitializerService.init`.
   */
  AUTO_DEFERRED,
}

export enum MatomoConsentMode {
  /** Do not require any consent, always track users */
  NONE,
  /** Require cookie consent */
  COOKIE,
  /** Require tracking consent */
  TRACKING,
}

export interface MatomoTrackerConfiguration {
  /** Matomo site id */
  siteId: number | string;

  /** Matomo server url */
  trackerUrl: string;

  /** The trackerUrlSuffix is always appended to the trackerUrl. It defaults to matomo.php */
  trackerUrlSuffix?: string;
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

  /**
   * Configure user consent requirement
   *
   * To identify whether you need to ask for any consent, you need to determine whether your lawful
   * basis for processing personal data is "Consent" or "Legitimate interest", or whether you can
   * avoid collecting personal data altogether.
   *
   * Matomo differentiates between cookie and tracking consent:
   * - In the context of <b>tracking consent</b> no cookies will be used and no tracking request
   *   will be sent unless consent was given. As soon as consent was given, tracking requests will
   *   be sent and cookies will be used.
   * - In the context of <b>cookie consent</b> tracking requests will always be sent. However,
   *   cookies will be only used if consent for storing and using cookies was given by the user.
   *
   * Note that cookies impact reports accuracy.
   *
   * See Matomo guide: {@link https://developer.matomo.org/guides/tracking-consent}
   */
  requireConsent?: MatomoConsentMode;

  /** Set to `true` to enable Javascript errors tracking as <i>events</i> (with category <i>JavaScript Errors</i>) */
  enableJSErrorTracking?: boolean;

  /** Set to `true` to run matomo calls outside of angular NgZone. This may fix angular freezes. */
  runOutsideAngularZone?: boolean;
}

export interface BaseAutoMatomoConfiguration<
  M extends
    | MatomoInitializationMode.AUTO
    | MatomoInitializationMode.AUTO_DEFERRED = MatomoInitializationMode.AUTO
> {
  /**
   * Set the script initialization mode (default is `AUTO`)
   *
   */
  mode?: M;

  /** Matomo script url (default is `matomo.js` appended to main tracker url) */
  scriptUrl: string;
}

type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
type XOR<T, U> = T | U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;
type XOR3<T, U, V> = XOR<T, XOR<U, V>>;

export type ManualMatomoConfiguration = {
  /**
   * Set the script initialization mode (default is `AUTO`)
   *
   */
  mode: MatomoInitializationMode.MANUAL;
};

export type DeferredMatomoConfiguration = {
  /**
   * Set the script initialization mode (default is `AUTO`)
   *
   */
  mode: MatomoInitializationMode.AUTO_DEFERRED;
};

export type ExplicitAutoConfiguration<
  M extends
    | MatomoInitializationMode.AUTO
    | MatomoInitializationMode.AUTO_DEFERRED = MatomoInitializationMode.AUTO
> = Partial<BaseAutoMatomoConfiguration<M>> &
  XOR<MatomoTrackerConfiguration, MultiTrackersConfiguration>;
export type EmbeddedAutoConfiguration<
  M extends
    | MatomoInitializationMode.AUTO
    | MatomoInitializationMode.AUTO_DEFERRED = MatomoInitializationMode.AUTO
> = BaseAutoMatomoConfiguration<M> & Partial<MultiTrackersConfiguration>;

export type AutoMatomoConfiguration<
  M extends
    | MatomoInitializationMode.AUTO
    | MatomoInitializationMode.AUTO_DEFERRED = MatomoInitializationMode.AUTO
> = XOR<ExplicitAutoConfiguration<M>, EmbeddedAutoConfiguration<M>>;

export type MatomoConfiguration = BaseMatomoConfiguration &
  XOR3<AutoMatomoConfiguration, ManualMatomoConfiguration, DeferredMatomoConfiguration>;

export function isAutoConfigurationMode(
  config: MatomoConfiguration
): config is AutoMatomoConfiguration {
  return config.mode == null || config.mode === MatomoInitializationMode.AUTO;
}

function hasMainTrackerConfiguration<
  M extends MatomoInitializationMode.AUTO | MatomoInitializationMode.AUTO_DEFERRED
>(config: AutoMatomoConfiguration<M>): config is ExplicitAutoConfiguration<M> {
  // If one is undefined, both should be
  return config.siteId != null && config.trackerUrl != null;
}

export function isEmbeddedTrackerConfiguration<
  M extends MatomoInitializationMode.AUTO | MatomoInitializationMode.AUTO_DEFERRED
>(config: AutoMatomoConfiguration<M>): config is EmbeddedAutoConfiguration<M> {
  return config.scriptUrl != null && !hasMainTrackerConfiguration(config);
}

export function isExplicitTrackerConfiguration<
  M extends MatomoInitializationMode.AUTO | MatomoInitializationMode.AUTO_DEFERRED
>(config: AutoMatomoConfiguration<M>): config is ExplicitAutoConfiguration<M> {
  return hasMainTrackerConfiguration(config) || isMultiTrackerConfiguration(config);
}

export function isMultiTrackerConfiguration(
  config: AutoMatomoConfiguration<
    MatomoInitializationMode.AUTO | MatomoInitializationMode.AUTO_DEFERRED
  >
): config is MultiTrackersConfiguration {
  return Array.isArray(config.trackers);
}

export function getTrackersConfiguration(
  config: ExplicitAutoConfiguration<
    MatomoInitializationMode.AUTO | MatomoInitializationMode.AUTO_DEFERRED
  >
): MatomoTrackerConfiguration[] {
  return isMultiTrackerConfiguration(config)
    ? config.trackers
    : [
        {
          trackerUrl: config.trackerUrl,
          siteId: config.siteId,
          trackerUrlSuffix: config.trackerUrlSuffix,
        },
      ];
}
