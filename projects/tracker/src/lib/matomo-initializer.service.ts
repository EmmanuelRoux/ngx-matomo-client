import { Injectable, Injector } from '@angular/core';
import {
  getTrackersConfiguration,
  INTERNAL_MATOMO_CONFIGURATION,
  InternalMatomoConfiguration,
  isManualConfiguration,
  MatomoConsentMode,
} from './configuration';
import { MatomoHolder } from './holder';
import { MatomoTracker } from './matomo-tracker.service';

declare var window: MatomoHolder;

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
  injector: Injector
): MatomoInitializerService {
  return config.disabled
    ? (new NoopMatomoInitializer() as MatomoInitializerService)
    : new MatomoInitializerService(config, injector);
}

export class NoopMatomoInitializer implements Pick<MatomoInitializerService, 'init'> {
  init(): void {
    // No-op
  }
}

@Injectable({
  providedIn: 'root',
  useFactory: createMatomoInitializer,
  deps: [INTERNAL_MATOMO_CONFIGURATION, Injector],
})
export class MatomoInitializerService {
  constructor(
    private readonly config: InternalMatomoConfiguration,
    private readonly injector: Injector
  ) {
    window._paq = window._paq || [];
  }

  init(): void {
    this.runPreInitTasks();
    this.injectMatomoScript();
  }

  private injectMatomoScript() {
    if (!isManualConfiguration(this.config)) {
      // Lazy-inject tracker via Injector because it requires _paq to be initialized
      const tracker = this.injector.get(MatomoTracker);
      const { scriptUrl: customScriptUrl } = this.config;
      const [mainTracker, ...additionalTrackers] = getTrackersConfiguration(this.config);
      const mainTrackerUrl = appendTrailingSlash(mainTracker.trackerUrl);
      const mainTrackerSiteId = coerceSiteId(mainTracker.siteId);

      tracker.setTrackerUrl(mainTrackerUrl + TRACKER_SUFFIX);
      tracker.setSiteId(mainTrackerSiteId);

      additionalTrackers.forEach(({ trackerUrl, siteId }) => {
        const additionalTrackerUrl = appendTrailingSlash(trackerUrl);
        const additionalTrackerSiteId = coerceSiteId(siteId);

        tracker.addTracker(additionalTrackerUrl + TRACKER_SUFFIX, additionalTrackerSiteId);
      });

      const d = window.document;
      const g = d.createElement('script');
      const s = d.getElementsByTagName('script')[0];

      g.type = 'text/javascript';
      g.async = true;
      g.defer = true;
      g.src = customScriptUrl ?? mainTrackerUrl + DEFAULT_SCRIPT_SUFFIX;
      s.parentNode!.insertBefore(g, s); // Parent node has at least one script tag: ourself :-)
    }
  }

  private runPreInitTasks(): void {
    // Lazy-inject tracker via Injector because it requires _paq to be initialized
    const tracker = this.injector.get(MatomoTracker);

    if (this.config.acceptDoNotTrack) {
      tracker.setDoNotTrack(true);
    }

    if (this.config.requireConsent === MatomoConsentMode.COOKIE) {
      tracker.requireCookieConsent();
    } else if (this.config.requireConsent === MatomoConsentMode.TRACKING) {
      tracker.requireConsent();
    }

    if (this.config.trackAppInitialLoad) {
      tracker.trackPageView();
    }

    if (this.config.enableLinkTracking) {
      tracker.enableLinkTracking();
    }
  }
}
