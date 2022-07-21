import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { requireNonNull } from './coercion';
import {
  AutoMatomoConfiguration,
  getTrackersConfiguration,
  INTERNAL_MATOMO_CONFIGURATION,
  InternalMatomoConfiguration,
  isAutoConfigurationMode,
  isEmbeddedTrackerConfiguration,
  isExplicitTrackerConfiguration,
  MatomoConsentMode,
  MatomoInitializationMode,
  MatomoTrackerConfiguration,
} from './configuration';
import { ALREADY_INJECTED_ERROR } from './errors';
import { initializeMatomoHolder } from './holder';
import { MatomoTracker } from './matomo-tracker.service';
import { MATOMO_SCRIPT_FACTORY, MatomoScriptFactory } from './script-factory';

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

export function createMatomoInitializer(
  config: InternalMatomoConfiguration,
  tracker: MatomoTracker,
  scriptFactory: MatomoScriptFactory,
  document: Document,
  platformId: Object
): MatomoInitializerService {
  return config.disabled || !isPlatformBrowser(platformId)
    ? (new NoopMatomoInitializer() as MatomoInitializerService)
    : new MatomoInitializerService(config, tracker, scriptFactory, document);
}

export class NoopMatomoInitializer
  implements Pick<MatomoInitializerService, 'init' | 'initializeTracker'>
{
  init(): void {
    // No-op
  }

  initializeTracker(
    _: AutoMatomoConfiguration<
      MatomoInitializationMode.AUTO | MatomoInitializationMode.AUTO_DEFERRED
    >
  ): void {
    // No-op
  }
}

@Injectable({
  providedIn: 'root',
  useFactory: createMatomoInitializer,
  deps: [
    INTERNAL_MATOMO_CONFIGURATION,
    MatomoTracker,
    MATOMO_SCRIPT_FACTORY,
    DOCUMENT,
    PLATFORM_ID,
  ],
})
export class MatomoInitializerService {
  private injected = false;

  constructor(
    private readonly config: InternalMatomoConfiguration,
    private readonly tracker: MatomoTracker,
    @Inject(MATOMO_SCRIPT_FACTORY) private readonly scriptFactory: MatomoScriptFactory,
    @Inject(DOCUMENT) private readonly document: Document
  ) {
    initializeMatomoHolder();
  }

  init(): void {
    this.runPreInitTasks();

    if (isAutoConfigurationMode(this.config)) {
      this.injectMatomoScript(this.config);
    }
  }

  initializeTracker(config: AutoMatomoConfiguration<MatomoInitializationMode.AUTO_DEFERRED>): void {
    this.injectMatomoScript(config);
  }

  private injectMatomoScript(
    config: AutoMatomoConfiguration<
      MatomoInitializationMode.AUTO | MatomoInitializationMode.AUTO_DEFERRED
    >
  ): void {
    if (this.injected) {
      throw new Error(ALREADY_INJECTED_ERROR);
    }

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

    this.injected = true;
  }

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
    const scriptElement = this.scriptFactory(scriptUrl, this.document);
    const selfScript = requireNonNull(
      this.document.getElementsByTagName('script')[0],
      'no existing script found'
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

    if (this.config.trackAppInitialLoad) {
      this.tracker.trackPageView();
    }

    if (this.config.enableLinkTracking) {
      this.tracker.enableLinkTracking();
    }
  }
}
