declare let window: MatomoHolder;

export interface MatomoHolder extends Window {
  _paq: { push: Array<unknown>['push'] };
  /** Defined by Matomo's script once loaded */
  Matomo?: unknown;
  /** Legacy alias of {@link Matomo}, defined by Matomo's script once loaded */
  Piwik?: unknown;
}

/** Return true if Matomo's script has been loaded and executed */
export function isMatomoScriptExecuted(): boolean {
  return typeof window !== 'undefined' && (window.Matomo != null || window.Piwik != null);
}

export function initializeMatomoHolder() {
  window._paq = window._paq || [];
}
