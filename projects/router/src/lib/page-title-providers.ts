import { inject, InjectionToken } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd } from '@angular/router';
import { Observable, of } from 'rxjs';

export const MATOMO_PAGE_TITLE_PROVIDER = new InjectionToken<PageTitleProvider>(
  'MATOMO_PAGE_TITLE_PROVIDER',
  {
    factory: () => new DefaultPageTitleProvider(inject(Title)),
  }
);

export interface PageTitleProvider {
  getCurrentPageTitle(event: NavigationEnd): Observable<string>;
}

export class DefaultPageTitleProvider implements PageTitleProvider {
  constructor(private readonly title: Title) {}

  getCurrentPageTitle(event: NavigationEnd): Observable<string> {
    return of(this.title.getTitle());
  }
}
