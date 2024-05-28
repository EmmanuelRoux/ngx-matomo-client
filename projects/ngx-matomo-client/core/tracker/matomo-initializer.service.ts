import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { EnvironmentInjector, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { initializeMatomoHolder } from '../holder';
import { requireNonNull } from '../utils/coercion';
import { runOnce } from '../utils/function';
import {
  AutoMatomoConfiguration,
  DEFERRED_INTERNAL_MATOMO_CONFIGURATION,
  getTrackersConfiguration,
  INTERNAL_MATOMO_CONFIGURATION,
  isAutoConfigurationMode,
  isEmbeddedTrackerConfiguration,
  isExplicitTrackerConfiguration,
  MatomoConsentMode,
  MatomoInitializationMode,
  MatomoTrackerConfiguration,
} from './configuration';
import { ALREADY_INITIALIZED_ERROR, ALREADY_INJECTED_ERROR } from './errors';
import { MatomoTracker } from './matomo-tracker.service';
import { MATOMO_SCRIPT_FACTORY } from './script-factory';

function coerceSiteId(siteId: number | string): string {
  return `${siteId}`;
}

function appendTrailingSlash(str: string): string {
  return str.endsWith('/') ? str : `${str}/`;
}

function buildTrackerUrl(url: string, suffix: string | undefined): string {
  if (suffix == null) {
    return appendTrailingSlash(url) + DEFAULT_TRACKER_SUFFIX;
  }
  return url + suffix;
}

const DEFAULT_TRACKER_SUFFIX = 'matomo.php';
const DEFAULT_SCRIPT_SUFFIX = 'matomo.js';

export function createMatomoInitializer(): MatomoInitializerService {
  const disabled = inject(INTERNAL_MATOMO_CONFIGURATION).disabled;
  const isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  return disabled || !isBrowser
    ? (new NoopMatomoInitializer() as MatomoInitializerService)
    : new MatomoInitializerService();
}

export class NoopMatomoInitializer
  implements Pick<MatomoInitializerService, 'initialize' | 'initializeTracker'>
{
  initialize(): void {
    // No-op
  }

  initializeTracker(_: AutoMatomoConfiguration<MatomoInitializationMode.AUTO_DEFERRED>): void {
    // No-op
  }
}

@Injectable({
  providedIn: 'root',
  useFactory: createMatomoInitializer,
})
export class MatomoInitializerService {
  private readonly config = inject(INTERNAL_MATOMO_CONFIGURATION);
  private readonly deferredConfig = inject(DEFERRED_INTERNAL_MATOMO_CONFIGURATION);
  private readonly tracker = inject(MatomoTracker);
  private readonly scriptFactory = inject(MATOMO_SCRIPT_FACTORY);
  private readonly injector = inject(EnvironmentInjector);
  private readonly document = inject(DOCUMENT);

  constructor() {
    initializeMatomoHolder();
  }

  /** @deprecated use {@link initialize initialize()} instead */
  init(): void {
    this.initialize();
  }

  readonly initialize = runOnce(() => {
    this.runPreInitTasks();

    if (isAutoConfigurationMode(this.config)) {
      this.injectMatomoScript(this.config);
    }
  }, ALREADY_INITIALIZED_ERROR);

  initializeTracker(config: AutoMatomoConfiguration<MatomoInitializationMode.AUTO_DEFERRED>): void {
    this.injectMatomoScript(config);
  }

  private readonly injectMatomoScript = runOnce(
    (
      config: AutoMatomoConfiguration<
        MatomoInitializationMode.AUTO | MatomoInitializationMode.AUTO_DEFERRED
      >,
    ): void => {
      if (isExplicitTrackerConfiguration(config)) {
        const { scriptUrl: customScriptUrl } = config;
        const [mainTracker, ...additionalTrackers] = getTrackersConfiguration(config);
        const scriptUrl =
          customScriptUrl ?? appendTrailingSlash(mainTracker.trackerUrl) + DEFAULT_SCRIPT_SUFFIX;

        this.registerMainTracker(mainTracker);
        this.registerAdditionalTrackers(additionalTrackers);
        this.injectDOMScript(scriptUrl);
      } else if (isEmbeddedTrackerConfiguration(config)) {
        const { scriptUrl, trackers: additionalTrackers } = {
          trackers: [],
          ...config,
        };

        this.registerAdditionalTrackers(additionalTrackers);
        this.injectDOMScript(scriptUrl);
      }

      this.deferredConfig.markReady(config);
    },
    ALREADY_INJECTED_ERROR,
  );

  private registerMainTracker(mainTracker: MatomoTrackerConfiguration): void {
    const mainTrackerUrl = buildTrackerUrl(mainTracker.trackerUrl, mainTracker.trackerUrlSuffix);
    const mainTrackerSiteId = coerceSiteId(mainTracker.siteId);

    this.tracker.setTrackerUrl(mainTrackerUrl);
    this.tracker.setSiteId(mainTrackerSiteId);
  }

  private registerAdditionalTrackers(additionalTrackers: MatomoTrackerConfiguration[]): void {
    additionalTrackers.forEach(({ trackerUrl, siteId, trackerUrlSuffix }) => {
      const additionalTrackerUrl = buildTrackerUrl(trackerUrl, trackerUrlSuffix);
      const additionalTrackerSiteId = coerceSiteId(siteId);

      this.tracker.addTracker(additionalTrackerUrl, additionalTrackerSiteId);
    });
  }

  private injectDOMScript(scriptUrl: string): void {
    // From ng v16, runInContext is deprecated in favor of runInInjectionContext
    // In a future version, it will probably be necessary to do this (breaking) change
    const scriptElement = this.injector.runInContext(() =>
      this.scriptFactory(scriptUrl, this.document),
    );
    const selfScript = requireNonNull(
      this.document.getElementsByTagName('script')[0],
      'no existing script found',
    );
    const parent = requireNonNull(selfScript.parentNode, "no script's parent node found");

    parent.insertBefore(scriptElement, selfScript);
  }

  private runPreInitTasks(): void {
    if (this.config.acceptDoNotTrack) {
      this.tracker.setDoNotTrack(true);
    }

    if (this.config.requireConsent === MatomoConsentMode.COOKIE) {
      this.tracker.requireCookieConsent();
    } else if (this.config.requireConsent === MatomoConsentMode.TRACKING) {
      this.tracker.requireConsent();
    }

    if (this.config.enableJSErrorTracking) {
      this.tracker.enableJSErrorTracking();
    }

    if (this.config.disableCampaignParameters) {
      this.tracker.disableCampaignParameters();
    }

    if (this.config.trackAppInitialLoad) {
      this.tracker.trackPageView();
    }

    if (this.config.enableLinkTracking) {
      this.tracker.enableLinkTracking(this.config.enableLinkTracking === 'enable-pseudo');
    }
  }
}
