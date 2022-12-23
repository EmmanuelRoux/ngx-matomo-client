import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { NavigationEnd } from '@angular/router';
import { MATOMO_PAGE_TITLE_PROVIDER, PageTitleProvider } from './page-title-providers';

describe('PageTitleProvider', () => {
  let titleService: Title;
  let provider: PageTitleProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({});

    titleService = TestBed.inject(Title);
    provider = TestBed.inject(MATOMO_PAGE_TITLE_PROVIDER);
  });

  it('should return page title by default', () => {
    // Given
    titleService.setTitle('My custom title');

    // When
    provider.getCurrentPageTitle(new NavigationEnd(0, '/', '/')).subscribe(title => {
      // Then
      expect(title).toEqual('My custom title');
    });
  });
});
