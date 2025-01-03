import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { initializeMatomoHolder } from '../holder';
import { runOnce } from '../utils/function';
import { ScriptInjector } from '../utils/script-injector';
import { PublicInterface } from '../utils/types';
import { appendTrailingSlash } from '../utils/url';
import {
  AutoMatomoConfiguration,
  DEFERRED_INTERNAL_MATOMO_CONFIGURATION,
  getTrackersConfiguration,
  INTERNAL_MATOMO_CONFIGURATION,
  InternalMatomoConfiguration,
  isAutoConfigurationMode,
  isEmbeddedTrackerConfiguration,
  isExplicitTrackerConfiguration,
  MatomoTrackerConfiguration,
} from './configuration';
import { ALREADY_INITIALIZED_ERROR, ALREADY_INJECTED_ERROR } from './errors';
import { MatomoTracker } from './matomo-tracker.service';

function coerceSiteId(siteId: number | string): string {
  return `${siteId}`;
}

function buildTrackerUrl(url: string, suffix: string | undefined): string {
  if (suffix == null) {
    return appendTrailingSlash(url) + DEFAULT_TRACKER_SUFFIX;
  }
  return url + suffix;
}

const DEFAULT_TRACKER_SUFFIX = 'matomo.php';
const DEFAULT_SCRIPT_SUFFIX = 'matomo.js';

export function createMatomoInitializer(): PublicInterface<MatomoInitializerService> {
  const disabled = inject(INTERNAL_MATOMO_CONFIGURATION).disabled;
  const isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  return disabled || !isBrowser ? new NoopMatomoInitializer() : new MatomoInitializerService();
}

export class NoopMatomoInitializer implements PublicInterface<MatomoInitializerService> {
  initialize(): void {
    // No-op
  }

  init(): void {
    // No-op
  }

  initializeTracker(_: AutoMatomoConfiguration<'deferred'>): void {
    // No-op
  }
}

@Injectable()
export class MatomoInitializerService {
  private readonly config = inject(INTERNAL_MATOMO_CONFIGURATION);
  private readonly deferredConfig = inject(DEFERRED_INTERNAL_MATOMO_CONFIGURATION);
  private readonly tracker = inject(MatomoTracker);
  private readonly scriptInjector = inject(ScriptInjector);

  constructor() {
    initializeMatomoHolder();
  }

  // TODO v7 remove
  /** @deprecated Will be removed in v7+. Use {@link initialize initialize()} instead. */
  init(): void {
    this.initialize();
  }

  readonly initialize = runOnce(() => {
    this.runPreInitTasks();

    if (isAutoConfigurationMode(this.config)) {
      this.injectMatomoScript(this.config);
    }
  }, ALREADY_INITIALIZED_ERROR);

  initializeTracker(config: AutoMatomoConfiguration<'deferred'>): void {
    this.injectMatomoScript(config);
  }

  private readonly injectMatomoScript = runOnce(
    (config: AutoMatomoConfiguration<'auto' | 'deferred'>): void => {
      if (isExplicitTrackerConfiguration(config)) {
        const { scriptUrl: customScriptUrl } = config;
        const [mainTracker, ...additionalTrackers] = getTrackersConfiguration(config);
        const scriptUrl =
          customScriptUrl ?? appendTrailingSlash(mainTracker.trackerUrl) + DEFAULT_SCRIPT_SUFFIX;

        this.registerMainTracker(mainTracker);
        this.registerAdditionalTrackers(additionalTrackers);
        this.scriptInjector.injectDOMScript(scriptUrl);
      } else if (isEmbeddedTrackerConfiguration(config)) {
        const { scriptUrl, trackers: additionalTrackers } = {
          trackers: [],
          ...config,
        };

        this.registerAdditionalTrackers(additionalTrackers);
        this.scriptInjector.injectDOMScript(scriptUrl);
      }

      this.deferredConfig.markReady(config as InternalMatomoConfiguration);
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

  private runPreInitTasks(): void {
    if (this.config.acceptDoNotTrack) {
      this.tracker.setDoNotTrack(true);
    }

    if (this.config.requireConsent === 'cookie') {
      this.tracker.requireCookieConsent();
    } else if (this.config.requireConsent === 'tracking') {
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
