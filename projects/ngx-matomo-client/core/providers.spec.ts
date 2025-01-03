import { ApplicationInitStatus, InjectionToken } from '@angular/core';
import { TestBed, TestModuleMetadata } from '@angular/core/testing';
import { provideMatomo, withScriptFactory } from './providers';
import { MATOMO_CONFIGURATION, MatomoConfiguration } from './tracker/configuration';
import { MatomoInitializerService } from './tracker/matomo-initializer.service';
import { MatomoTracker } from './tracker/matomo-tracker.service';
import { createDefaultMatomoScriptElement } from './tracker/script-factory';

describe('providers', () => {
  async function setUp(providers: TestModuleMetadata['providers']): Promise<void> {
    TestBed.configureTestingModule({
      providers: providers,
    });

    // https://github.com/angular/angular/issues/24218
    await TestBed.inject(ApplicationInitStatus).donePromise;
  }

  it('should provide basic Matomo providers with static configuration', async () => {
    const fakeInitializer = jasmine.createSpyObj<MatomoInitializerService>(['initialize']);
    const config: MatomoConfiguration = { trackerUrl: 'my-tracker', siteId: 42 };

    await setUp([
      provideMatomo(config),
      {
        provide: MatomoInitializerService,
        useValue: fakeInitializer,
      },
    ]);

    expect(TestBed.inject(MatomoTracker)).toEqual(jasmine.any(MatomoTracker));
    expect(TestBed.inject(MATOMO_CONFIGURATION)).toEqual(config);
    expect(fakeInitializer.initialize).toHaveBeenCalledTimes(1);
  });

  it('should provide basic Matomo providers with configuration factory', async () => {
    const fakeInitializer = jasmine.createSpyObj<MatomoInitializerService>(['initialize']);
    const trackerUrl = 'my-tracker';
    const config: MatomoConfiguration = { trackerUrl, siteId: 42 };
    const trackerUrlToken = new InjectionToken<string>('trackerUrl');

    await setUp([
      provideMatomo(() => ({ trackerUrl: TestBed.inject(trackerUrlToken), siteId: 42 })),
      {
        provide: MatomoInitializerService,
        useValue: fakeInitializer,
      },
      {
        provide: trackerUrlToken,
        useValue: trackerUrl,
      },
    ]);

    expect(TestBed.inject(MatomoTracker)).toEqual(jasmine.any(MatomoTracker));
    expect(TestBed.inject(MATOMO_CONFIGURATION)).toEqual(config);
    expect(fakeInitializer.initialize).toHaveBeenCalledTimes(1);
  });

  it('should provide basic Matomo providers with custom script factory', async () => {
    const scriptFactory = jasmine
      .createSpy('scriptFactory')
      .and.callFake(createDefaultMatomoScriptElement);

    await setUp([
      provideMatomo({ trackerUrl: 'my-tracker', siteId: 42 }, withScriptFactory(scriptFactory)),
    ]);

    expect(TestBed.inject(MatomoTracker)).toEqual(jasmine.any(MatomoTracker));
    expect(scriptFactory).toHaveBeenCalledTimes(1);
  });
});
