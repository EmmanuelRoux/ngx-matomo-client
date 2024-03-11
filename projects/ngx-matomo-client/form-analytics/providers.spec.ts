import { ApplicationInitStatus } from '@angular/core';
import { TestBed, TestModuleMetadata } from '@angular/core/testing';
import { MatomoTracker, provideMatomo } from 'ngx-matomo-client/core';
import {
  INTERNAL_MATOMO_FORM_ANALYTICS_CONFIGURATION,
  MATOMO_FORM_ANALYTICS_CONFIGURATION,
} from './configuration';
import { MatomoFormAnalytics } from './matomo-form-analytics.service';
import { withFormAnalytics } from './providers';

describe('FormAnalytics > providers', () => {
  async function setUp(providers: TestModuleMetadata['providers']): Promise<void> {
    TestBed.configureTestingModule({
      providers: providers,
    });

    // https://github.com/angular/angular/issues/24218
    await TestBed.inject(ApplicationInitStatus).donePromise;
  }

  it('should provide basic Matomo providers with FormAnalytics feature', async () => {
    await setUp([provideMatomo({ trackerUrl: 'my-tracker', siteId: 42 }, withFormAnalytics())]);

    expect(TestBed.inject(MatomoTracker)).toEqual(jasmine.any(MatomoTracker));
    expect(TestBed.inject(MatomoFormAnalytics)).toEqual(jasmine.any(MatomoFormAnalytics));
    expect(TestBed.inject(MATOMO_FORM_ANALYTICS_CONFIGURATION)).toBeUndefined();
    expect(TestBed.inject(INTERNAL_MATOMO_FORM_ANALYTICS_CONFIGURATION)).toEqual({
      autoScan: true,
      autoScanDelay: 0,
      loadScript: false,
      disabled: false,
    });
  });

  it('should provide basic Matomo providers with FormAnalytics feature and custom configuration', async () => {
    await setUp([
      provideMatomo(
        { trackerUrl: 'my-tracker', siteId: 42 },
        withFormAnalytics({
          autoScan: false,
          autoScanDelay: 0,
          loadScript: 'http://script.localhost',
          disabled: true,
        }),
      ),
    ]);

    expect(TestBed.inject(MatomoTracker)).toEqual(jasmine.any(MatomoTracker));
    expect(TestBed.inject(MatomoFormAnalytics)).toEqual(jasmine.any(MatomoFormAnalytics));
    expect(TestBed.inject(MATOMO_FORM_ANALYTICS_CONFIGURATION)).toEqual({
      autoScan: false,
      autoScanDelay: 0,
      loadScript: 'http://script.localhost',
      disabled: true,
    });
    expect(TestBed.inject(INTERNAL_MATOMO_FORM_ANALYTICS_CONFIGURATION)).toEqual({
      autoScan: false,
      autoScanDelay: 0,
      loadScript: 'http://script.localhost',
      disabled: true,
    });
  });
});
