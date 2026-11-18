import { TestBed } from '@angular/core/testing';
import {
  MatomoConfiguration,
  provideMatomo,
  ɵMatomoTestingTracker as MatomoTestingTracker,
  ɵprovideTestingTracker as provideTestingTracker,
} from 'ngx-matomo-client/core';
import { MatomoAbTesting } from './matomo-ab-testing.service';
import { withAbTesting } from './providers';
import { MatomoAbTestingExperiment } from './types';

describe('MatomoAbTesting', () => {
  let abTesting: MatomoAbTesting;
  let tracker: MatomoTestingTracker;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMatomo({} as MatomoConfiguration, withAbTesting()),
        provideTestingTracker(),
      ],
    });

    tracker = TestBed.inject(MatomoTestingTracker);
    abTesting = TestBed.inject(MatomoAbTesting);
  });

  it('should create experiment', () => {
    // Given
    const experiment: MatomoAbTestingExperiment = {
      name: 'my-experiment',
      percentage: 100,
      includedTargets: [
        { attribute: 'url', type: 'starts_with', value: 'http://localhost', inverted: '0' },
      ],
      excludedTargets: [],
      startDateTime: '2026/06/30 23:00:00 UTC',
      endDateTime: '2026/07/31 23:00:00 UTC',
      variations: [
        { name: 'original', activate: () => {} },
        { name: 'blue', percentage: 50, activate: () => {} },
      ],
      trigger: () => true,
    };

    // When
    abTesting.create(experiment);

    // Then
    expect(tracker.callsAfterInit).toEqual([['AbTesting::create', experiment]]);
    expect(tracker.callsAfterInit[0][1]).toBe(experiment);
  });

  it('should enter experiment variation', () => {
    // When
    abTesting.enter('my-experiment', 'blue');

    // Then
    expect(tracker.callsAfterInit).toEqual([
      ['AbTesting::enter', { experiment: 'my-experiment', variation: 'blue' }],
    ]);
  });

  it('should enter experiment variation by ids', () => {
    // When
    abTesting.enter(5, 6);

    // Then
    expect(tracker.callsAfterInit).toEqual([['AbTesting::enter', { experiment: 5, variation: 6 }]]);
  });
});
