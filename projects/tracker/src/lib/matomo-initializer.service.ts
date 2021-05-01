import {Inject, Injectable} from '@angular/core';
import {
  AutoMatomoConfiguration,
  INTERNAL_MATOMO_CONFIGURATION,
  InternalMatomoConfiguration,
  ManualMatomoConfiguration,
  MatomoConfiguration,
  MatomoInitializationMode,
  MatomoTrackerConfiguration,
  MultiTrackersConfiguration,
} from './configuration';
import {MatomoHolder} from './holder';

declare var window: MatomoHolder;

function isManualConfiguration(config: MatomoConfiguration): config is ManualMatomoConfiguration {
  return config.mode === MatomoInitializationMode.MANUAL;
}

function isMultiTrackerConfiguration(config: AutoMatomoConfiguration): config is MultiTrackersConfiguration {
  return Array.isArray(config.trackers);
}

function getTrackersConfiguration(config: AutoMatomoConfiguration): MatomoTrackerConfiguration[] {
  return isMultiTrackerConfiguration(config)
    ? config.trackers
    : [{trackerUrl: config.trackerUrl, siteId: config.siteId}];
}

function coerceSiteId(siteId: number | string): string {
  return `${siteId}`;
}

function appendTrailingSlash(str: string): string {
  return str.endsWith('/') ? str : `${str}/`;
}

const TRACKER_SUFFIX = 'matomo.php';
const DEFAULT_SCRIPT_SUFFIX = 'matomo.js';

@Injectable({providedIn: 'root'})
export class MatomoInitializerService {

  constructor(@Inject(INTERNAL_MATOMO_CONFIGURATION) private readonly config: InternalMatomoConfiguration) {
    window._paq = window._paq || [];
  }

  init(): void {
    const _paq = window._paq;

    if (this.config.trackAppInitialLoad) {
      _paq.push(['trackPageView']);

      if (this.config.enableLinkTracking) {
        window._paq.push(['enableLinkTracking']);
      }
    }

    if (!isManualConfiguration(this.config)) {
      const {scriptUrl: customScriptUrl} = this.config;
      const [mainTracker, ...additionalTrackers] = getTrackersConfiguration(this.config);
      const mainTrackerUrl = appendTrailingSlash(mainTracker.trackerUrl);
      const mainTrackerSiteId = coerceSiteId(mainTracker.siteId);

      _paq.push(['setTrackerUrl', mainTrackerUrl + TRACKER_SUFFIX]);
      _paq.push(['setSiteId', mainTrackerSiteId]);

      additionalTrackers.forEach(({trackerUrl, siteId}) =>
        _paq.push(['addTracker', appendTrailingSlash(trackerUrl) + TRACKER_SUFFIX, coerceSiteId(siteId)]),
      );

      const d = window.document;
      const g = d.createElement('script');
      const s = d.getElementsByTagName('script')[0];

      g.type = 'text/javascript';
      g.async = true;
      g.defer = true;
      g.src = customScriptUrl ?? mainTrackerUrl + DEFAULT_SCRIPT_SUFFIX;
      (s.parentNode as Node).insertBefore(g, s); // Parent node has at least one script tag: ourself :-)
    }
  }

}
