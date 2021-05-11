import { APP_BASE_HREF, PlatformLocation } from '@angular/common';
import { Inject, inject, InjectFlags, InjectionToken, Optional } from '@angular/core';
import { NavigationEnd } from '@angular/router';
import { Observable, of } from 'rxjs';
import { INTERNAL_ROUTER_CONFIGURATION, InternalRouterConfiguration } from './configuration';

export const MATOMO_PAGE_URL_PROVIDER = new InjectionToken<PageUrlProvider>(
  'MATOMO_PAGE_URL_PROVIDER',
  {
    factory: () =>
      new DefaultPageUrlProvider(
        inject(INTERNAL_ROUTER_CONFIGURATION),
        inject(APP_BASE_HREF, InjectFlags.Optional),
        inject(PlatformLocation)
      ),
  }
);

export interface PageUrlProvider {
  getCurrentPageUrl(event: NavigationEnd): Observable<string>;
}

function trimTrailingSlash(str: string): string {
  return str.endsWith('/') ? str.slice(0, -1) : str;
}

export class DefaultPageUrlProvider implements PageUrlProvider {
  constructor(
    @Optional()
    @Inject(INTERNAL_ROUTER_CONFIGURATION)
    private readonly config: InternalRouterConfiguration,
    @Optional() @Inject(APP_BASE_HREF) private readonly baseHref: string | null,
    private readonly platformLocation: PlatformLocation
  ) {}

  getCurrentPageUrl(event: NavigationEnd): Observable<string> {
    const url = this.config.prependBaseHref
      ? this.getBaseHrefWithoutTrailingSlash() + event.urlAfterRedirects
      : event.urlAfterRedirects;

    return of(url);
  }

  private getBaseHrefWithoutTrailingSlash(): string {
    return trimTrailingSlash(this.baseHref ?? this.platformLocation.getBaseHrefFromDOM());
  }
}
