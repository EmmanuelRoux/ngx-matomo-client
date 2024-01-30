import { APP_BASE_HREF, LocationStrategy } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { NavigationEnd } from '@angular/router';
import { MATOMO_CONFIGURATION, MatomoConfiguration } from 'ngx-matomo-client/core';
import { MATOMO_ROUTER_CONFIGURATION, MatomoRouterConfiguration } from './configuration';
import { MATOMO_PAGE_URL_PROVIDER, PageUrlProvider } from './page-url-provider';

describe('PageUrlProvider', () => {
  function instantiate(
    config: MatomoRouterConfiguration | null,
    baseHref: string | null,
  ): PageUrlProvider {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: MATOMO_CONFIGURATION,
          useValue: {} as MatomoConfiguration,
        },
        {
          provide: MATOMO_ROUTER_CONFIGURATION,
          useValue: config,
        },
        {
          provide: APP_BASE_HREF,
          useValue: baseHref,
        },
      ],
    });

    return TestBed.inject(MATOMO_PAGE_URL_PROVIDER);
  }

  it('should return page url by default', () => {
    // Given
    const provider = instantiate(null, null);

    // When
    provider.getCurrentPageUrl(new NavigationEnd(0, '/my-page', '/my-page')).subscribe(url => {
      // Then
      expect(url).toEqual('/my-page');
    });
  });

  it('should return page url prepended with APP_BASE_HREF', () => {
    // Given
    const provider = instantiate(
      {
        /* prependBaseHref: true */
      },
      '/test/',
    );

    // When
    provider.getCurrentPageUrl(new NavigationEnd(0, '/my-page', '/my-page')).subscribe(url => {
      // Then
      expect(url).toEqual('/test/my-page');
    });
  });

  it('should return page url prepended with LocationStrategy base href', () => {
    // Given
    const provider = instantiate(
      {
        /* prependBaseHref: true */
      },
      null,
    );
    const locationStrategy = TestBed.inject(LocationStrategy);

    spyOn(locationStrategy, 'getBaseHref').and.returnValue('/test');

    // When
    provider.getCurrentPageUrl(new NavigationEnd(0, '/my-page', '/my-page')).subscribe(url => {
      // Then
      expect(url).toEqual('/test/my-page');
    });
  });

  it('should return page url without base href', () => {
    // Given
    const provider = instantiate({ prependBaseHref: false }, '/test/');
    const locationStrategy = TestBed.inject(LocationStrategy);

    spyOn(locationStrategy, 'getBaseHref').and.returnValue('/test');

    // When
    provider.getCurrentPageUrl(new NavigationEnd(0, '/my-page', '/my-page')).subscribe(url => {
      // Then
      expect(url).toEqual('/my-page');
    });
  });

  it('should return page url when base href is null', () => {
    // Given
    const provider = instantiate(
      {
        /* prependBaseHref: true */
      },
      null,
    );
    const locationStrategy = TestBed.inject(LocationStrategy);

    // @ts-expect-error Bug in angular in which sometimes a null value is returned despite typing
    spyOn(locationStrategy, 'getBaseHref').and.returnValue(null);

    // When
    provider.getCurrentPageUrl(new NavigationEnd(0, '/my-page', '/my-page')).subscribe(url => {
      // Then
      expect(url).toEqual('/my-page');
    });
  });
});
