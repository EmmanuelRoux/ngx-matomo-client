import { inject, Injectable, InjectionToken } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { MatomoECommerceView, MatomoTracker } from 'ngx-matomo-client/core';
import { MatomoRouteInterceptorBase } from './route-interceptor-base';

export const DEFAULT_DATA_KEY = 'matomo';

/** Token to define the route's data key to be looked-up by `MatomoRouteDataInterceptor`  */
export const MATOMO_ROUTE_DATA_KEY = new InjectionToken<string>('MATOMO_ROUTE_DATA_KEY', {
  providedIn: 'root',
  factory: () => DEFAULT_DATA_KEY,
});

/** Standard properties that may be read from route data */
export interface MatomoRouteData {
  title?: string;
  ecommerce?: MatomoECommerceView;
}

/**
 * Simple interceptor looking at 'matomo' key of route's data for tracking.
 *
 * It is possible to extend this class or {@link MatomoRouteInterceptorBase}
 * for custom behavior (to use another data key, etc.)
 *
 * @example
 * // Using provided MatomoRouteDataInterceptor (looks into 'matomo' data key)
 * const routes: Routes = [
 *   {
 *     path: '/hello',
 *     component: HelloComponent,
 *     data: {
 *       matomo: {
 *         title: 'Page title',
 *       } as MatomoRouteData
 *     }
 *   },
 * ];
 *
 * NgxMatomoRouterModule.forRoot({
 *   interceptors: [MatomoRouteDataInterceptor],
 * }),
 *
 * @example
 * // Using custom 'myCustomAnalyticsKey' data key
 * const routes: Routes = [
 *   {
 *     path: '/hello',
 *     component: HelloComponent,
 *     data: {
 *       myCustomAnalyticsKey: {
 *         title: 'Page title',
 *       } as MatomoRouteData
 *     }
 *   },
 * ];
 *
 * @Injectable()
 * export class MyCustomInterceptor extends MatomoRouteDataInterceptor {
 *   readonly dataKey = 'myCustomAnalyticsKey';
 * }
 *
 * NgxMatomoRouterModule.forRoot({
 *   interceptors: [MyCustomInterceptor],
 * }),
 *
 * @see MatomoRouteInterceptorBase
 * @see MatomoRouteData
 */
@Injectable()
export class MatomoRouteDataInterceptor extends MatomoRouteInterceptorBase<
  MatomoRouteData | undefined
> {
  protected readonly tracker = inject(MatomoTracker);
  protected readonly dataKey = inject(MATOMO_ROUTE_DATA_KEY);

  protected extractRouteData(route: ActivatedRouteSnapshot): MatomoRouteData | undefined {
    return route.data[this.dataKey];
  }

  protected processRouteData(
    data: MatomoRouteData | undefined
  ): Observable<void> | Promise<void> | void {
    if (!data) {
      return;
    }

    if (data.title) {
      this.tracker.setDocumentTitle(data.title);
    }

    if (data.ecommerce) {
      this.tracker.setEcommerceView(data.ecommerce);
    }
  }
}
