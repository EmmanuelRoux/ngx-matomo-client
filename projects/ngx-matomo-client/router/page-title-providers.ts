import { Injectable, InjectionToken, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd } from '@angular/router';
import { Observable, of } from 'rxjs';

/**
 * @deprecated Use an interceptor calling `setDocumentTitle()` instead
 * @see MatomoRouterInterceptor
 * @see MATOMO_ROUTER_INTERCEPTORS
 */
export const MATOMO_PAGE_TITLE_PROVIDER = new InjectionToken<PageTitleProvider>(
  'MATOMO_PAGE_TITLE_PROVIDER',
);

/**
 * @deprecated Use an interceptor calling `setDocumentTitle()` instead
 * @see MatomoRouterInterceptor
 * @see MATOMO_ROUTER_INTERCEPTORS
 */
export interface PageTitleProvider {
  getCurrentPageTitle(event: NavigationEnd): Observable<string>;
}

@Injectable()
export class DefaultPageTitleProvider implements PageTitleProvider {
  private readonly title = inject(Title);

  getCurrentPageTitle(_: NavigationEnd): Observable<string> {
    return of(this.title.getTitle());
  }
}
