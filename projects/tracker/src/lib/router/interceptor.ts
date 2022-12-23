import { InjectionToken, Provider, Type } from '@angular/core';
import { NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs';

export const MATOMO_ROUTER_INTERCEPTORS = new InjectionToken<MatomoRouterInterceptor[]>(
  'MATOMO_ROUTER_INTERCEPTORS'
);

/** Interceptor used to hook into the page tracking process */
export interface MatomoRouterInterceptor {
  /**
   * Called after a router event has occurred and before page view has been tracked (i.e. before `trackPageView()` has been called)
   *
   * If an Observable or a Promise is returned, the observable (first emission or completion) or promise resolution is awaited before tracking call.
   */
  beforePageTrack(event: NavigationEnd): Observable<void> | Promise<void> | void;
}

export function provideInterceptor(type: Type<MatomoRouterInterceptor>): Provider {
  return {
    provide: MATOMO_ROUTER_INTERCEPTORS,
    multi: true,
    useClass: type,
  };
}

export function provideInterceptors(
  types: Type<MatomoRouterInterceptor>[] | undefined
): Provider[] {
  if (!types) {
    return [];
  }

  return types.map(provideInterceptor);
}
