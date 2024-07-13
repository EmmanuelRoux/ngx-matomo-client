import { TestBed } from '@angular/core/testing';
import { NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs';
import {
  MATOMO_ROUTER_INTERCEPTORS,
  MatomoRouterInterceptor,
  MatomoRouterInterceptorFn,
  provideInterceptor,
  provideInterceptors,
} from './interceptor';

describe('Interceptor', () => {
  class FakeInterceptor1 implements MatomoRouterInterceptor {
    beforePageTrack(_: NavigationEnd): Observable<void> | Promise<void> | void {
      calls.push('interceptor 1');
    }
  }

  class FakeInterceptor2 implements MatomoRouterInterceptor {
    beforePageTrack(_: NavigationEnd): Observable<void> | Promise<void> | void {
      calls.push('interceptor 2');
    }
  }

  const fakeInterceptor3: MatomoRouterInterceptorFn = () => {
    calls.push('interceptor 3');
  };

  let calls: string[] = [];

  beforeEach(() => (calls = []));

  it('should provide Matomo interceptor individually by type token', () => {
    // Given
    TestBed.configureTestingModule({
      providers: [provideInterceptor(FakeInterceptor1)],
    });

    // When
    const interceptors = TestBed.inject(MATOMO_ROUTER_INTERCEPTORS);
    const event = new NavigationEnd(0, '/', '/');

    interceptors.forEach(interceptor => interceptor.beforePageTrack(event));

    // Then
    expect(calls).toEqual(['interceptor 1']);
  });

  it('should provide functional Matomo interceptor individually', () => {
    // Given
    TestBed.configureTestingModule({
      providers: [provideInterceptor(fakeInterceptor3)],
    });

    const interceptors = TestBed.inject(MATOMO_ROUTER_INTERCEPTORS);
    const event = new NavigationEnd(0, '/', '/');

    interceptors.forEach(interceptor => interceptor.beforePageTrack(event));

    // Then
    expect(calls).toEqual(['interceptor 3']);
  });

  it('should provide Matomo interceptors', () => {
    // Given
    TestBed.configureTestingModule({
      providers: [provideInterceptors([FakeInterceptor1, FakeInterceptor2, fakeInterceptor3])],
    });

    const interceptors = TestBed.inject(MATOMO_ROUTER_INTERCEPTORS);
    const event = new NavigationEnd(0, '/', '/');

    interceptors.forEach(interceptor => interceptor.beforePageTrack(event));

    // Then
    expect(calls).toEqual(['interceptor 1', 'interceptor 2', 'interceptor 3']);
  });

  it('should not provide anything when no interceptor token is provided', () => {
    // Given
    TestBed.configureTestingModule({
      providers: [provideInterceptors(undefined)],
    });
    const interceptors = TestBed.inject(MATOMO_ROUTER_INTERCEPTORS, null, { optional: true });

    // Then
    expect(interceptors).toBeNull();
  });
});
