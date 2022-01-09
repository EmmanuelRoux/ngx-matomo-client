import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { requireNonNull } from './coercion';
import {
  getTrackersConfiguration,
  INTERNAL_MATOMO_CONFIGURATION,
  InternalMatomoConfiguration,
  isManualConfiguration,
  MatomoConsentMode,
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

const TRACKER_SUFFIX = 'matomo.php';
const DEFAULT_SCRIPT_SUFFIX = 'matomo.js';

export function createMatomoInitializer(
  config: InternalMatomoConfiguration,
  tracker: MatomoTracker,
  scriptFactory: MatomoScriptFactory,
  document: Document
): MatomoInitializerService {
  return config.disabled
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
  deps: [INTERNAL_MATOMO_CONFIGURATION, MatomoTracker, MATOMO_SCRIPT_FACTORY, DOCUMENT],
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
    if (!isManualConfiguration(this.config)) {
      const { scriptUrl: customScriptUrl } = this.config;
      const [mainTracker, ...additionalTrackers] = getTrackersConfiguration(this.config);
      const mainTrackerUrl = appendTrailingSlash(mainTracker.trackerUrl);
      const mainTrackerSiteId = coerceSiteId(mainTracker.siteId);

      this.tracker.setTrackerUrl(mainTrackerUrl + TRACKER_SUFFIX);
      this.tracker.setSiteId(mainTrackerSiteId);

      additionalTrackers.forEach(({ trackerUrl, siteId }) => {
        const additionalTrackerUrl = appendTrailingSlash(trackerUrl);
        const additionalTrackerSiteId = coerceSiteId(siteId);

        this.tracker.addTracker(additionalTrackerUrl + TRACKER_SUFFIX, additionalTrackerSiteId);
      });

      const scriptUrl = customScriptUrl ?? mainTrackerUrl + DEFAULT_SCRIPT_SUFFIX;
      const scriptElement = this.scriptFactory(scriptUrl, this.document);
      const selfScript = requireNonNull(
        this.document.getElementsByTagName('script')[0],
        'no existing script found'
      );
      const parent = requireNonNull(selfScript.parentNode, "no script's parent node found");

      parent.insertBefore(scriptElement, selfScript);
    }
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

    if (this.config.trackAppInitialLoad) {
      this.tracker.trackPageView();
    }

    if (this.config.enableLinkTracking) {
      this.tracker.enableLinkTracking();
    }
  }
}
