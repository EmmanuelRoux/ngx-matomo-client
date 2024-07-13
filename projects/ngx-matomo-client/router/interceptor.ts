import {
  inject,
  InjectionToken,
  INJECTOR,
  Injector,
  Provider,
  runInInjectionContext,
  Type,
} from '@angular/core';
import { NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs';

export const MATOMO_ROUTER_INTERCEPTORS = new InjectionToken<MatomoRouterInterceptor[]>(
  'MATOMO_ROUTER_INTERCEPTORS',
);

/** Interceptor used to hook just before every page tracking */
export type MatomoRouterInterceptorFn = (
  event: NavigationEnd,
) => Observable<void> | Promise<void> | void;

/** Interceptor used to hook into the page tracking process */
export interface MatomoRouterInterceptor {
  /**
   * Called after a router event has occurred and before page view has been tracked (i.e. before `trackPageView()` has been called)
   *
   * If an Observable or a Promise is returned, the observable (first emission or completion) or promise resolution is awaited before tracking call.
   */
  beforePageTrack(event: NavigationEnd): Observable<void> | Promise<void> | void;
}

/**
 * This is not an ideal implementation, because there exist no easy way to differentiate between a class constructor and a function.
 */
function isInterceptorFn(
  interceptor: Type<MatomoRouterInterceptor> | MatomoRouterInterceptorFn,
): interceptor is MatomoRouterInterceptorFn {
  return typeof interceptor.prototype?.beforePageTrack !== 'function';
}

class InterceptorFnAdapter implements MatomoRouterInterceptor {
  constructor(
    private readonly fn: MatomoRouterInterceptorFn,
    private readonly injector: Injector,
  ) {}

  beforePageTrack(event: NavigationEnd): Observable<void> | Promise<void> | void {
    return runInInjectionContext(this.injector, () => this.fn(event));
  }
}

export function provideInterceptor(
  typeOrFn: Type<MatomoRouterInterceptor> | MatomoRouterInterceptorFn,
): Provider {
  if (isInterceptorFn(typeOrFn)) {
    return {
      provide: MATOMO_ROUTER_INTERCEPTORS,
      multi: true,
      useFactory: () => new InterceptorFnAdapter(typeOrFn, inject(INJECTOR)),
    };
  } else {
    return {
      provide: MATOMO_ROUTER_INTERCEPTORS,
      multi: true,
      useClass: typeOrFn,
    };
  }
}

export function provideInterceptors(
  types: (Type<MatomoRouterInterceptor> | MatomoRouterInterceptorFn)[] | undefined,
): Provider[] {
  if (!types) {
    return [];
  }

  return types.map(provideInterceptor);
}
