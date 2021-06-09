import { APP_BASE_HREF, PlatformLocation } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { NavigationEnd } from '@angular/router';
import { MATOMO_CONFIGURATION, MatomoConfiguration } from '@ngx-matomo/tracker';
import { MATOMO_ROUTER_CONFIGURATION, MatomoRouterConfiguration } from './configuration';
import { MATOMO_PAGE_URL_PROVIDER, PageUrlProvider } from './page-url-provider';

describe('PageUrlProvider', () => {
  function instantiate(
    config: MatomoRouterConfiguration | null,
    baseHref: string | null
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
      '/test/'
    );

    // When
    provider.getCurrentPageUrl(new NavigationEnd(0, '/my-page', '/my-page')).subscribe(url => {
      // Then
      expect(url).toEqual('/test/my-page');
    });
  });

  it('should return page url prepended with DOM base href', () => {
    // Given
    const provider = instantiate(
      {
        /* prependBaseHref: true */
      },
      null
    );
    const platform = TestBed.inject(PlatformLocation);

    spyOn(platform, 'getBaseHrefFromDOM').and.returnValue('/test');

    // When
    provider.getCurrentPageUrl(new NavigationEnd(0, '/my-page', '/my-page')).subscribe(url => {
      // Then
      expect(url).toEqual('/test/my-page');
    });
  });

  it('should return page url without base href', () => {
    // Given
    const provider = instantiate({ prependBaseHref: false }, '/test/');
    const platform = TestBed.inject(PlatformLocation);

    spyOn(platform, 'getBaseHrefFromDOM').and.returnValue('/test');

    // When
    provider.getCurrentPageUrl(new NavigationEnd(0, '/my-page', '/my-page')).subscribe(url => {
      // Then
      expect(url).toEqual('/my-page');
    });
  });
});
