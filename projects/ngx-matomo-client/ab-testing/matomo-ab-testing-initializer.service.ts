import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID, Service } from '@angular/core';
import {
  ɵappendTrailingSlash as appendTrailingSlash,
  ɵASYNC_INTERNAL_MATOMO_CONFIGURATION as ASYNC_INTERNAL_MATOMO_CONFIGURATION,
  ɵgetTrackersConfiguration as getTrackersConfiguration,
  ɵisAutoConfigurationMode as isAutoConfigurationMode,
  ɵisExplicitTrackerConfiguration as isExplicitTrackerConfiguration,
  ɵrunOnce as runOnce,
  ɵScriptInjector as ScriptInjector,
} from 'ngx-matomo-client/core';
import { INTERNAL_MATOMO_AB_TESTING_CONFIGURATION } from './configuration';

const DEFAULT_SCRIPT_SUFFIX = 'plugins/AbTesting/tracker.min.js';

@Service({ autoProvided: false })
export class MatomoAbTestingInitializer {
  private readonly config = inject(INTERNAL_MATOMO_AB_TESTING_CONFIGURATION);
  private readonly coreConfig = inject(ASYNC_INTERNAL_MATOMO_CONFIGURATION);
  private readonly scriptInjector = inject(ScriptInjector);
  private readonly platformId = inject(PLATFORM_ID);

  readonly initialize = runOnce(async () => {
    // Do not load anything if running on server
    if (!isPlatformBrowser(this.platformId) || this.config.disabled) {
      return;
    }

    if (this.config.loadScript) {
      const scriptUrl =
        typeof this.config.loadScript === 'boolean'
          ? await this.buildDefaultScriptUrl()
          : this.config.loadScript;

      this.scriptInjector.injectDOMScript(scriptUrl);
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
      'Cannot resolve default matomo AbTesting plugin script url. ' +
        'Please explicitly provide `loadScript` configuration property instead of `true`',
    );
  }
}
