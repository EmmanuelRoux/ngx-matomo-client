import { Inject, Injectable } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { MatomoTracker } from '@ngx-matomo/tracker';
import { combineLatest, identity, MonoTypeOperatorFunction, Observable, of } from 'rxjs';
import { delay, distinctUntilKeyChanged, filter, map, switchMap } from 'rxjs/operators';
import {
  ExclusionConfig,
  INTERNAL_ROUTER_CONFIGURATION,
  InternalRouterConfiguration,
} from './configuration';
import { MATOMO_PAGE_TITLE_PROVIDER, PageTitleProvider } from './page-title-providers';
import { MATOMO_PAGE_URL_PROVIDER, PageUrlProvider } from './page-url-provider';

function isNavigationEnd(event: Event): event is NavigationEnd {
  return event instanceof NavigationEnd;
}

function coerceRegExp(input: string | RegExp): RegExp {
  return typeof input === 'string' ? new RegExp(input) : input;
}

function coerceRegExpArray(input: ExclusionConfig | null | undefined): RegExp[] {
  if (!input) {
    return [];
  }

  return Array.isArray(input) ? input.map(coerceRegExp) : [coerceRegExp(input)];
}

function isNotExcluded(excludeConfig: ExclusionConfig): (event: NavigationEnd) => boolean {
  const exclusions = coerceRegExpArray(excludeConfig);

  return (event: NavigationEnd) => !exclusions.some(rx => event.urlAfterRedirects.match(rx));
}

@Injectable({ providedIn: 'root' })
export class MatomoRouter {
  constructor(
    private readonly router: Router,
    @Inject(INTERNAL_ROUTER_CONFIGURATION)
    private readonly config: InternalRouterConfiguration,
    @Inject(MATOMO_PAGE_TITLE_PROVIDER)
    private readonly pageTitleProvider: PageTitleProvider,
    @Inject(MATOMO_PAGE_URL_PROVIDER)
    private readonly pageUrlProvider: PageUrlProvider,
    private readonly tracker: MatomoTracker
  ) {}

  init(): void {
    if (this.config.disabled) {
      // Do not set-up router if globally disabled
      return;
    }

    const delayOp: MonoTypeOperatorFunction<NavigationEnd> =
      this.config.delay === -1 ? identity : delay(this.config.delay);

    this.router.events
      .pipe(
        // Take only NavigationEnd events
        filter(isNavigationEnd),
        // Filter out excluded urls
        filter(isNotExcluded(this.config.exclude)),
        // Distinct urls
        distinctUntilKeyChanged('urlAfterRedirects'),
        // Optionally add some delay
        delayOp,
        // Grab page title & url
        switchMap(event => this.getPageTitleAndUrl(event))
      )
      .subscribe(({ pageTitle, pageUrl }) => this.trackPageView(pageTitle, pageUrl));
  }

  private getPageTitleAndUrl(
    event: NavigationEnd
  ): Observable<{ pageTitle: string | undefined; pageUrl: string }> {
    const title$ = this.config.trackPageTitle
      ? this.pageTitleProvider.getCurrentPageTitle(event)
      : of(undefined);
    const url$ = this.pageUrlProvider.getCurrentPageUrl(event);

    return combineLatest([title$, url$]).pipe(
      map(([pageTitle, pageUrl]) => ({ pageTitle, pageUrl }))
    );
  }

  private trackPageView(pageTitle: string | undefined, pageUrl: string): void {
    this.tracker.setCustomUrl(pageUrl);
    this.tracker.trackPageView(pageTitle);

    if (this.config.enableLinkTracking) {
      this.tracker.enableLinkTracking(true);
    }

    // Set referrer for next page view
    this.tracker.setReferrerUrl(pageUrl);
  }
}
