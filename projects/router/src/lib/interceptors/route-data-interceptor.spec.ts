import {
  ActivatedRouteSnapshot,
  Data,
  NavigationEnd,
  PRIMARY_OUTLET,
  Router,
  RouterState,
  RouterStateSnapshot,
} from '@angular/router';
import { MatomoECommerceItemView, MatomoTracker } from '@ngx-matomo/tracker';
import {
  DEFAULT_DATA_KEY,
  MatomoRouteData,
  MatomoRouteDataInterceptor,
} from './route-data-interceptor';

function createRouteSnapshot(
  data: Data,
  children: ActivatedRouteSnapshot[] = []
): ActivatedRouteSnapshot {
  return { data, children, outlet: PRIMARY_OUTLET } as ActivatedRouteSnapshot;
}

describe('RouteDataInterceptor', () => {
  let tracker: jasmine.SpyObj<MatomoTracker>;
  let router: jasmine.SpyObj<Router>;
  let routerState: Partial<RouterState>;
  let interceptor: MatomoRouteDataInterceptor;

  beforeEach(() => {
    routerState = {};
    router = jasmine.createSpyObj<Router>([], { routerState: routerState as RouterState });
    tracker = jasmine.createSpyObj<MatomoTracker>(['setDocumentTitle', 'setEcommerceView']);
    interceptor = new MatomoRouteDataInterceptor(tracker, router);
  });

  it('should set title through simple route data', () => {
    // Given
    const root = createRouteSnapshot({
      [DEFAULT_DATA_KEY]: {
        title: 'My Root Page Title',
      } as MatomoRouteData,
    });

    // When
    routerState.snapshot = { root } as RouterStateSnapshot;
    interceptor.beforePageTrack(new NavigationEnd(0, '/', '/'));
    // Then
    expect(tracker.setDocumentTitle).toHaveBeenCalledOnceWith('My Root Page Title');
    expect(tracker.setEcommerceView).not.toHaveBeenCalled();
  });

  it('should set title through child route data', () => {
    // Given
    const child = createRouteSnapshot({
      [DEFAULT_DATA_KEY]: {
        title: 'My Child Page Title',
      } as MatomoRouteData,
    });
    const root = createRouteSnapshot({}, [child]);

    // When
    routerState.snapshot = { root } as RouterStateSnapshot;
    interceptor.beforePageTrack(new NavigationEnd(0, '/', '/'));
    // Then
    expect(tracker.setDocumentTitle).toHaveBeenCalledOnceWith('My Child Page Title');
    expect(tracker.setEcommerceView).not.toHaveBeenCalled();
  });

  it('should set ecommerce view through simple route data', () => {
    // Given
    const ecommerce = { productSKU: 'pid' } as MatomoECommerceItemView;
    const root = createRouteSnapshot({
      [DEFAULT_DATA_KEY]: { ecommerce } as MatomoRouteData,
    });

    // When
    routerState.snapshot = { root } as RouterStateSnapshot;
    interceptor.beforePageTrack(new NavigationEnd(0, '/', '/'));
    // Then
    expect(tracker.setEcommerceView).toHaveBeenCalledOnceWith(ecommerce);
    expect(tracker.setDocumentTitle).not.toHaveBeenCalled();
  });

  it('should set ecommerce through child route data', () => {
    // Given
    const ecommerce = { productSKU: 'pid' } as MatomoECommerceItemView;
    const child = createRouteSnapshot({
      [DEFAULT_DATA_KEY]: { ecommerce } as MatomoRouteData,
    });
    const root = createRouteSnapshot({}, [child]);

    // When
    routerState.snapshot = { root } as RouterStateSnapshot;
    interceptor.beforePageTrack(new NavigationEnd(0, '/', '/'));
    // Then
    expect(tracker.setEcommerceView).toHaveBeenCalledOnceWith(ecommerce);
    expect(tracker.setDocumentTitle).not.toHaveBeenCalled();
  });

  it('should silently ignore when no data is present', () => {
    // Given
    const root = createRouteSnapshot({});

    // When
    routerState.snapshot = { root } as RouterStateSnapshot;
    interceptor.beforePageTrack(new NavigationEnd(0, '/', '/'));
    // Then
    expect(tracker.setEcommerceView).not.toHaveBeenCalled();
    expect(tracker.setDocumentTitle).not.toHaveBeenCalled();
  });
});
