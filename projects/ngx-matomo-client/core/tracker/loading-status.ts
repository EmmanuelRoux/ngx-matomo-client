import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID, Service, signal } from '@angular/core';
import { INTERNAL_MATOMO_CONFIGURATION } from './configuration';

/**
 * Loading status of Matomo's script:
 *
 * - __idle__: script has not been injected (yet). This is the case when initialization mode is `'manual'` (the script
 * is then expected to be included by yourself), or when mode is `'deferred'` and
 * {@link MatomoInitializerService.initializeTracker initializeTracker()} has not been called yet.
 * - __loading__: script has been injected and is currently loading.
 * - __loaded__: script has been successfully loaded and Matomo is initialized: tracking calls are now sent.
 * - __failed__: script failed to load (it may have been blocked by an ad-blocker or a browser extension, or a network
 * error occurred). Tracking calls will not be sent.
 * - __disabled__: tracking is disabled (either from configuration or because the app is not running in a browser).
 */
export type MatomoLoadingStatus = 'idle' | 'loading' | 'loaded' | 'failed' | 'disabled';

/** Internal holder of Matomo's loading status, shared between initializer (writer) and tracker (reader) */
@Service({ autoProvided: false })
export class InternalMatomoLoadingStatus {
  readonly status = signal<MatomoLoadingStatus>(
    inject(INTERNAL_MATOMO_CONFIGURATION).disabled || !isPlatformBrowser(inject(PLATFORM_ID))
      ? 'disabled'
      : 'idle',
  );
}
