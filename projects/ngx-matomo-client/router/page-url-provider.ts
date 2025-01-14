import { APP_BASE_HREF, LocationStrategy } from '@angular/common';
import { inject, InjectionToken } from '@angular/core';
import { NavigationEnd } from '@angular/router';
import { Observable, of } from 'rxjs';
import { INTERNAL_ROUTER_CONFIGURATION, InternalRouterConfiguration } from './configuration';

export const MATOMO_PAGE_URL_PROVIDER = new InjectionToken<PageUrlProvider>(
  'MATOMO_PAGE_URL_PROVIDER',
  {
    factory: () =>
      new DefaultPageUrlProvider(
        inject(INTERNAL_ROUTER_CONFIGURATION),
        inject(APP_BASE_HREF, { optional: true }),
        inject(LocationStrategy),
      ),
  },
);

export interface PageUrlProvider {
  getCurrentPageUrl(event: NavigationEnd): Observable<string> | Promise<string>;
}

function trimTrailingSlash(str: string): string {
  return str.endsWith('/') ? str.slice(0, -1) : str;
}

export class DefaultPageUrlProvider implements PageUrlProvider {
  constructor(
    private readonly config: InternalRouterConfiguration,
    private readonly baseHref: string | null,
    private readonly locationStrategy: LocationStrategy,
  ) {}

  getCurrentPageUrl(event: NavigationEnd): Observable<string> {
    const url = this.config.prependBaseHref
      ? this.getBaseHrefWithoutTrailingSlash() + event.urlAfterRedirects
      : event.urlAfterRedirects;

    return of(url);
  }

  private getBaseHrefWithoutTrailingSlash(): string {
    return trimTrailingSlash(this.baseHref ?? this.locationStrategy.getBaseHref() ?? '');
  }
}
