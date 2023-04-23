import { ActivatedRouteSnapshot, NavigationEnd, PRIMARY_OUTLET, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MatomoRouterInterceptor } from '../interceptor';
import { getLeafRoute } from './route-utils';

/**
 * Simple interceptor base looking into route's data for tracking
 *
 * @see MatomoRouteDataInterceptor
 */
export abstract class MatomoRouteInterceptorBase<D> implements MatomoRouterInterceptor {
  protected constructor(protected readonly router: Router) {}

  beforePageTrack(event: NavigationEnd): Observable<void> | Promise<void> | void {
    const route = this.getRoute(event);
    const data = this.extractRouteData(route);

    return this.processRouteData(data);
  }

  protected getRoute(event: NavigationEnd): ActivatedRouteSnapshot {
    return getLeafRoute(this.router.routerState.snapshot.root, PRIMARY_OUTLET);
  }

  protected abstract extractRouteData(route: ActivatedRouteSnapshot): D;

  protected abstract processRouteData(data: D): Observable<void> | Promise<void> | void;
}
