import { ApplicationInitStatus } from '@angular/core';
import { TestBed, TestModuleMetadata } from '@angular/core/testing';
import { MatomoTracker, provideMatomo } from 'ngx-matomo-client/core';
import {
  INTERNAL_MATOMO_AB_TESTING_CONFIGURATION,
  MATOMO_AB_TESTING_CONFIGURATION,
} from './configuration';
import { MatomoAbTesting } from './matomo-ab-testing.service';
import { withAbTesting } from './providers';

describe('AbTesting > providers', () => {
  async function setUp(providers: TestModuleMetadata['providers']): Promise<void> {
    TestBed.configureTestingModule({ providers });

    // https://github.com/angular/angular/issues/24218
    await TestBed.inject(ApplicationInitStatus).donePromise;
  }

  it('should provide basic Matomo providers with AbTesting feature', async () => {
    await setUp([provideMatomo({ trackerUrl: 'my-tracker', siteId: 42 }, withAbTesting())]);

    expect(TestBed.inject(MatomoTracker)).toEqual(jasmine.any(MatomoTracker));
    expect(TestBed.inject(MatomoAbTesting)).toEqual(jasmine.any(MatomoAbTesting));
    expect(TestBed.inject(MATOMO_AB_TESTING_CONFIGURATION)).toBeUndefined();
    expect(TestBed.inject(INTERNAL_MATOMO_AB_TESTING_CONFIGURATION)).toEqual({
      loadScript: false,
      disabled: false,
    });
  });

  it('should provide basic Matomo providers with AbTesting feature and custom configuration', async () => {
    await setUp([
      provideMatomo(
        { trackerUrl: 'my-tracker', siteId: 42, disabled: true },
        withAbTesting({ loadScript: 'http://script.localhost' }),
      ),
    ]);

    expect(TestBed.inject(MatomoAbTesting)).toEqual(jasmine.any(MatomoAbTesting));
    expect(TestBed.inject(MATOMO_AB_TESTING_CONFIGURATION)).toEqual({
      loadScript: 'http://script.localhost',
    });
    expect(TestBed.inject(INTERNAL_MATOMO_AB_TESTING_CONFIGURATION)).toEqual({
      loadScript: 'http://script.localhost',
      disabled: true,
    });
  });
});
