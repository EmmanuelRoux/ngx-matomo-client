import { Injector, NgZone, PLATFORM_ID, runInInjectionContext } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatomoHolder } from '../holder';
import {
  INTERNAL_MATOMO_CONFIGURATION,
  InternalMatomoConfiguration,
  MATOMO_CONFIGURATION,
} from './configuration';
import {
  createInternalMatomoTracker,
  InternalMatomoTracker,
} from './internal-matomo-tracker.service';

declare var window: MatomoHolder;

// Extracted from https://github.com/angular/angular/blob/b66e479cdb1e474a29ff676f10a5fcc3d7eae799/packages/common/src/platform_id.ts
const PLATFORM_BROWSER_ID = 'browser';
const PLATFORM_SERVER_ID = 'server';

interface FakeMatomoInstance {
  getX(): number;
}

describe('InternalMatomoTracker', () => {
  function createMockZone(): jasmine.SpyObj<NgZone> {
    return jasmine.createSpyObj<NgZone>(['runOutsideAngular']);
  }

  function createTracker(
    config: Partial<InternalMatomoConfiguration> = { disabled: false },
    platform: Object = PLATFORM_BROWSER_ID,
    ngZone: NgZone = createMockZone(),
  ): InternalMatomoTracker<FakeMatomoInstance> {
    const injector = Injector.create({
      providers: [
        {
          provide: MATOMO_CONFIGURATION,
          useValue: config,
        },
        {
          provide: INTERNAL_MATOMO_CONFIGURATION,
          useValue: config,
        },
        {
          provide: PLATFORM_ID,
          useValue: platform,
        },
        {
          provide: NgZone,
          useValue: ngZone,
        },
      ],
    });

    return runInInjectionContext(
      injector,
      createInternalMatomoTracker,
    ) as InternalMatomoTracker<FakeMatomoInstance>;
  }

  function expectPush(
    when: (tracker: InternalMatomoTracker<FakeMatomoInstance>) => void,
    expected: unknown[][],
  ): () => void {
    return () => {
      // When
      when(createTracker());
      // Then
      expect(window._paq).toEqual(expected);
    };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: MATOMO_CONFIGURATION,
          useValue: {},
        },
      ],
    });

    window._paq = [];
  });

  it(
    'should push to window._paq',
    expectPush(
      tracker => {
        tracker.push(['funcA', 'arg1', 'arg2']);
        tracker.push(['funcB']);
        tracker.push(['funcC', 'arg1', undefined, undefined]);
      },
      [['funcA', 'arg1', 'arg2'], ['funcB'], ['funcC', 'arg1']],
    ),
  );

  it('should run function with matomo instance', async () => {
    const tracker = createTracker();
    const result = tracker.pushFn(matomo => matomo.getX());
    const stack = [].slice.call(window._paq) as unknown[][];
    const fakeInstance: FakeMatomoInstance = {
      getX(): number {
        return 42;
      },
    };

    expect(stack).toEqual([[jasmine.any(Function)]]);
    await expectAsync(result).toBePending();

    (stack[0][0] as (this: FakeMatomoInstance) => number).call(fakeInstance);
    await expectAsync(result).toBeResolvedTo(42);
  });

  it('should get from matomo instance', async () => {
    const tracker = createTracker();
    const result = tracker.get('getX');
    const stack = [].slice.call(window._paq) as unknown[][];
    const fakeInstance: FakeMatomoInstance = {
      getX(): number {
        return 42;
      },
    };

    expect(stack).toEqual([[jasmine.any(Function)]]);
    await expectAsync(result).toBePending();

    (stack[0][0] as (this: FakeMatomoInstance) => number).call(fakeInstance);
    await expectAsync(result).toBeResolvedTo(42);
  });

  it('should run commands outside Angular Zone', () => {
    // Given
    const zone = createMockZone();
    const tracker = createTracker({ runOutsideAngularZone: true }, PLATFORM_BROWSER_ID, zone);
    let runOutside = false;

    zone.runOutsideAngular.and.callFake(fn => {
      runOutside = true;
      return fn();
    });

    // When
    tracker.push(['func_outside']);

    // Then
    expect(runOutside).toBeTrue();
    expect(window._paq).toEqual([['func_outside']]);
  });

  it('should ignore calls when disabled', () => {
    // Given
    const tracker = createTracker({ disabled: true });
    (window as any)._paq = undefined;

    // Then
    expect(() => tracker.push(['track'])).not.toThrow();
    expect(window._paq).toBeUndefined();
  });

  it('should reject all promises when disabled', async () => {
    // Given
    const tracker = createTracker({ disabled: true });

    // Then
    await expectAsync(tracker.get('getX')).toBeRejected();
    await expectAsync(tracker.pushFn(matomo => matomo.getX())).toBeRejected();
  });

  it('should ignore calls when platform is not browser', () => {
    // Given
    const tracker = createTracker({ disabled: false }, PLATFORM_SERVER_ID);
    (window as any)._paq = undefined;

    // Then
    expect(() => tracker.push(['track'])).not.toThrow();
    expect(window._paq).toBeUndefined();
  });

  it('should reject all promises when platform is not browser', async () => {
    // Given
    const tracker = createTracker({ disabled: false }, PLATFORM_SERVER_ID);

    // Then
    await expectAsync(tracker.get('getX')).toBeRejected();
    await expectAsync(tracker.pushFn(matomo => matomo.getX())).toBeRejected();
  });
});
