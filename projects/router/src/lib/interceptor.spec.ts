import { InjectFlags } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs';
import {
  MATOMO_ROUTER_INTERCEPTORS,
  MatomoRouterInterceptor,
  provideInterceptor,
  provideInterceptors,
} from './interceptor';

class FakeInterceptor1 implements MatomoRouterInterceptor {
  beforePageTrack(event: NavigationEnd): Observable<void> | Promise<void> | void {
    // Do nothing
  }
}

class FakeInterceptor2 implements MatomoRouterInterceptor {
  beforePageTrack(event: NavigationEnd): Observable<void> | Promise<void> | void {
    // Do nothing
  }
}

describe('Interceptor', () => {
  it('should provide Matomo interceptor individually by type token', () => {
    // Given
    TestBed.configureTestingModule({
      providers: [provideInterceptor(FakeInterceptor1)],
    });

    const interceptors = TestBed.inject(MATOMO_ROUTER_INTERCEPTORS);

    // Then
    expect(interceptors).toEqual([jasmine.any(FakeInterceptor1)]);
  });

  it('should provide Matomo interceptors', () => {
    // Given
    TestBed.configureTestingModule({
      providers: [provideInterceptors([FakeInterceptor1, FakeInterceptor2])],
    });

    const interceptors = TestBed.inject(MATOMO_ROUTER_INTERCEPTORS);

    // Then
    expect(interceptors).toEqual([jasmine.any(FakeInterceptor1), jasmine.any(FakeInterceptor2)]);
  });

  it('should not provide anything when no interceptor token is provided', () => {
    // Given
    TestBed.configureTestingModule({
      providers: [provideInterceptors(undefined)],
    });
    const interceptors = TestBed.inject(MATOMO_ROUTER_INTERCEPTORS, null, InjectFlags.Optional);

    // Then
    expect(interceptors).toBeNull();
  });
});
