declare var window: MatomoHolder;

export interface MatomoHolder extends Window {
  _paq: { push: Array<unknown>['push'] };
}

export function initializeMatomoHolder() {
  window._paq = window._paq || [];
}
