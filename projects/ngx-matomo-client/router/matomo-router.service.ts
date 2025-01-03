import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { MatomoTracker, ɵrunOnce as runOnce } from 'ngx-matomo-client/core';
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
  distinctUntilChanged,
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
  NavigationEndComparator,
} from './configuration';
import { invalidInterceptorsProviderError, ROUTER_ALREADY_INITIALIZED_ERROR } from './errors';
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

function stripQueryParams(url: string): string {
  return url.split('?')[0];
}

function defaultNavigationEndComparator(urlExtractor: (event: NavigationEnd) => string) {
  return (eventA: NavigationEnd, eventB: NavigationEnd) =>
    urlExtractor(eventA) === urlExtractor(eventB);
}

function getNavigationEndComparator(config: InternalRouterConfiguration): NavigationEndComparator {
  switch (config.navigationEndComparator) {
    case 'fullUrl':
      return defaultNavigationEndComparator(event => event.urlAfterRedirects);
    case 'ignoreQueryParams':
      return defaultNavigationEndComparator(event => stripQueryParams(event.urlAfterRedirects));
    default:
      return config.navigationEndComparator;
  }
}

@Injectable()
export class MatomoRouter {
  constructor(
    private readonly router: Router,
    @Inject(PLATFORM_ID)
    private readonly platformId: object,
    @Inject(INTERNAL_ROUTER_CONFIGURATION)
    private readonly config: InternalRouterConfiguration,
    @Inject(MATOMO_PAGE_TITLE_PROVIDER)
    private readonly pageTitleProvider: PageTitleProvider,
    @Inject(MATOMO_PAGE_URL_PROVIDER)
    private readonly pageUrlProvider: PageUrlProvider,
    private readonly tracker: MatomoTracker,
    @Optional()
    @Inject(MATOMO_ROUTER_INTERCEPTORS)
    private readonly interceptors: MatomoRouterInterceptor[] | null,
  ) {
    if (interceptors && !Array.isArray(interceptors)) {
      throw invalidInterceptorsProviderError();
    }
  }

  /** @deprecated use {@link initialize initialize()} instead */
  init(): void {
    this.initialize();
  }

  readonly initialize = runOnce(() => {
    if (this.config.disabled || !isPlatformBrowser(this.platformId)) {
      // Do not set-up router if globally disabled or running on server
      return;
    }

    const delayOp: MonoTypeOperatorFunction<NavigationEnd> =
      this.config.delay === -1 ? identity : delay(this.config.delay);
    const navigationEndComparator = getNavigationEndComparator(this.config);

    this.router.events
      .pipe(
        // Take only NavigationEnd events
        filter(isNavigationEnd),
        // Filter out excluded urls
        filter(isNotExcluded(this.config.exclude)),
        // Filter out NavigationEnd events to ignore, e.g. when url does not actually change (component reload)
        distinctUntilChanged(navigationEndComparator),
        // Optionally add some delay
        delayOp,
        // Set default page title & url
        switchMap(event =>
          this.presetPageTitleAndUrl(event).pipe(map(({ pageUrl }) => ({ pageUrl, event }))),
        ),
        // Run interceptors then track page view
        concatMap(({ event, pageUrl }) =>
          this.callInterceptors(event).pipe(tap(() => this.trackPageView(pageUrl))),
        ),
      )
      .subscribe();
  }, ROUTER_ALREADY_INITIALIZED_ERROR);

  private callInterceptors(event: NavigationEnd): Observable<void> {
    if (this.interceptors) {
      return forkJoin(
        this.interceptors.map(interceptor => {
          const result = interceptor.beforePageTrack(event);
          const result$ = result == null ? of(undefined) : from(result);

          // Must not be an empty observable (otherwise forkJoin would complete without waiting others)
          return result$.pipe(take(1), defaultIfEmpty(undefined as void));
        }),
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
    const url$ = from(this.pageUrlProvider.getCurrentPageUrl(event)).pipe(
      tap(pageUrl => this.tracker.setCustomUrl(pageUrl)),
    );

    return combineLatest([title$, url$]).pipe(map(([_, pageUrl]) => ({ pageUrl })));
  }

  private trackPageView(pageUrl: string): void {
    this.tracker.trackPageView();

    if (this.config.enableLinkTracking) {
      this.tracker.enableLinkTracking(this.config.enableLinkTracking === 'enable-pseudo');
    }

    // Set referrer for next page view
    this.tracker.setReferrerUrl(pageUrl);
  }
}
