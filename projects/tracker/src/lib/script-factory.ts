import { InjectionToken } from '@angular/core';

export type MatomoScriptFactory = (scriptUrl: string, document: Document) => HTMLScriptElement;

export const createDefaultMatomoScriptElement: MatomoScriptFactory = (scriptUrl, document) => {
  const g = document.createElement('script');

  g.type = 'text/javascript';
  g.defer = true;
  g.async = true;
  g.src = scriptUrl;

  return g;
};

export const MATOMO_SCRIPT_FACTORY = new InjectionToken<MatomoScriptFactory>(
  'MATOMO_SCRIPT_FACTORY',
  {
    providedIn: 'root',
    factory: () => createDefaultMatomoScriptElement,
  }
);
