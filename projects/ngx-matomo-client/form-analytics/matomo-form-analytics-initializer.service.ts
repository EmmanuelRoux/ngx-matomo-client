import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, OnDestroy, PLATFORM_ID } from '@angular/core';
import {
  MatomoTracker,
  ɵappendTrailingSlash as appendTrailingSlash,
  ɵASYNC_INTERNAL_MATOMO_CONFIGURATION as ASYNC_INTERNAL_MATOMO_CONFIGURATION,
  ɵgetTrackersConfiguration as getTrackersConfiguration,
  ɵisAutoConfigurationMode as isAutoConfigurationMode,
  ɵisExplicitTrackerConfiguration as isExplicitTrackerConfiguration,
  ɵrunOnce as runOnce,
  ɵScriptInjector as ScriptInjector,
} from 'ngx-matomo-client/core';
import { debounceTime, identity, Subscription } from 'rxjs';
import { INTERNAL_MATOMO_FORM_ANALYTICS_CONFIGURATION } from './configuration';
import { MatomoFormAnalytics } from './matomo-form-analytics.service';

const DEFAULT_SCRIPT_SUFFIX = 'plugins/FormAnalytics/tracker.min.js';

@Injectable({
  providedIn: 'root',
})
export class MatomoFormAnalyticsInitializer implements OnDestroy {
  private readonly config = inject(INTERNAL_MATOMO_FORM_ANALYTICS_CONFIGURATION);
  private readonly coreConfig = inject(ASYNC_INTERNAL_MATOMO_CONFIGURATION);
  private readonly scriptInjector = inject(ScriptInjector);
  private readonly tracker = inject(MatomoTracker);
  private readonly formAnalytics = inject(MatomoFormAnalytics);
  private readonly platformId = inject(PLATFORM_ID);

  private pageTrackedSubscription: Subscription | undefined;

  ngOnDestroy(): void {
    this.pageTrackedSubscription?.unsubscribe();
  }

  readonly initialize = runOnce(async () => {
    // Do not set-up router if running on server
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (this.config.disabled) {
      this.formAnalytics.disableFormAnalytics();
      return;
    }

    if (this.config.loadScript) {
      const scriptUrl =
        typeof this.config.loadScript === 'boolean'
          ? await this.buildDefaultScriptUrl()
          : this.config.loadScript;

      this.scriptInjector.injectDOMScript(scriptUrl);
    }

    if (this.config.autoScan) {
      const delayOp = this.config.autoScanDelay
        ? debounceTime(this.config.autoScanDelay)
        : identity;

      this.pageTrackedSubscription = this.tracker.pageViewTracked
        .pipe(delayOp)
        .subscribe(() => this.formAnalytics.scanForForms());
    }
  });

  private async buildDefaultScriptUrl(): Promise<string> {
    const config = await this.coreConfig;

    if (isAutoConfigurationMode(config) && isExplicitTrackerConfiguration(config)) {
      const [mainTracker] = getTrackersConfiguration(config);

      if (mainTracker) {
        return appendTrailingSlash(mainTracker.trackerUrl) + DEFAULT_SCRIPT_SUFFIX;
      }
    }

    throw new Error(
      'Cannot resolve default matomo FormAnalytics plugin script url. ' +
        'Please explicitly provide `loadScript` configuration property instead of `true`',
    );
  }
}
