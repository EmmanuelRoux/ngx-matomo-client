import { Inject, Injectable, Optional } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { MatomoTracker } from '@ngx-matomo/tracker';
import {
  combineLatest,
  forkJoin,
  from,
  identity,
  MonoTypeOperatorFunction,
  Observable,
  of,
} from 'rxjs';
import {
  concatMap,
  defaultIfEmpty,
  delay,
  distinctUntilKeyChanged,
  filter,
  map,
  mapTo,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';
import {
  ExclusionConfig,
  INTERNAL_ROUTER_CONFIGURATION,
  InternalRouterConfiguration,
} from './configuration';
import { invalidInterceptorsProviderError } from './errors';
import { MATOMO_ROUTER_INTERCEPTORS, MatomoRouterInterceptor } from './interceptor';
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
    private readonly tracker: MatomoTracker,
    @Optional()
    @Inject(MATOMO_ROUTER_INTERCEPTORS)
    private readonly interceptors: MatomoRouterInterceptor[] | null
  ) {
    if (interceptors && !Array.isArray(interceptors)) {
      throw invalidInterceptorsProviderError();
    }
  }

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
        // Set default page title & url
        switchMap(event =>
          this.presetPageTitleAndUrl(event).pipe(map(({ pageUrl }) => ({ pageUrl, event })))
        ),
        // Run interceptors then track page view
        concatMap(({ event, pageUrl }) =>
          this.callInterceptors(event).pipe(tap(() => this.trackPageView(pageUrl)))
        )
      )
      .subscribe();
  }

  private callInterceptors(event: NavigationEnd): Observable<void> {
    if (this.interceptors) {
      return forkJoin(
        this.interceptors.map(interceptor => {
          const result = interceptor.beforePageTrack(event);
          const result$ = result == null ? of(undefined) : from(result);

          // Must not be an empty observable (otherwise forkJoin would complete without waiting others)
          return result$.pipe(take(1), defaultIfEmpty(undefined as void));
        })
      ).pipe(mapTo(undefined), defaultIfEmpty(undefined as void));
    } else {
      return of(undefined);
    }
  }

  private presetPageTitleAndUrl(event: NavigationEnd): Observable<{ pageUrl: string }> {
    const title$ = this.config.trackPageTitle
      ? this.pageTitleProvider
          .getCurrentPageTitle(event)
          .pipe(tap(pageTitle => this.tracker.setDocumentTitle(pageTitle)))
      : of(undefined);
    const url$ = this.pageUrlProvider
      .getCurrentPageUrl(event)
      .pipe(tap(pageUrl => this.tracker.setCustomUrl(pageUrl)));

    return combineLatest([title$, url$]).pipe(map(([_, pageUrl]) => ({ pageUrl })));
  }

  private trackPageView(pageUrl: string): void {
    this.tracker.trackPageView();

    if (this.config.enableLinkTracking) {
      this.tracker.enableLinkTracking(true);
    }

    // Set referrer for next page view
    this.tracker.setReferrerUrl(pageUrl);
  }
}
