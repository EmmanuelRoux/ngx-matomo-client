import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { requireNonNull } from './coercion';
import {
  getTrackersConfiguration,
  INTERNAL_MATOMO_CONFIGURATION,
  InternalMatomoConfiguration,
  isEmbeddedTrackerConfiguration,
  isExplicitTrackerConfiguration,
  MatomoConsentMode,
  MatomoTrackerConfiguration,
} from './configuration';
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

export class NoopMatomoInitializer implements Pick<MatomoInitializerService, 'init'> {
  init(): void {
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
    this.injectMatomoScript();
  }

  private injectMatomoScript() {
    if (isExplicitTrackerConfiguration(this.config)) {
      const { scriptUrl: customScriptUrl } = this.config;
      const [mainTracker, ...additionalTrackers] = getTrackersConfiguration(this.config);
      const scriptUrl =
        customScriptUrl ?? appendTrailingSlash(mainTracker.trackerUrl) + DEFAULT_SCRIPT_SUFFIX;

      this.registerMainTracker(mainTracker);
      this.registerAdditionalTrackers(additionalTrackers);
      this.injectDOMScript(scriptUrl);
    } else if (isEmbeddedTrackerConfiguration(this.config)) {
      const { scriptUrl, trackers: additionalTrackers } = {
        trackers: [],
        ...this.config,
      };

      this.registerAdditionalTrackers(additionalTrackers);
      this.injectDOMScript(scriptUrl);
    }
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
