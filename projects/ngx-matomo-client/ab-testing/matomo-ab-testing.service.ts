import { inject, Service } from '@angular/core';
import { ɵInternalMatomoTracker as InternalMatomoTracker } from 'ngx-matomo-client/core';
import { MatomoAbTestingExperiment } from './types';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface MatomoAbTestingInstance {}

/**
 * Low-level API of Matomo A/B testing plugin
 *
 * @see https://developer.matomo.org/guides/ab-tests/browser
 */
@Service({ autoProvided: false })
export class MatomoAbTesting {
  private readonly delegate: InternalMatomoTracker<MatomoAbTestingInstance, 'AbTesting::'> = inject(
    InternalMatomoTracker<MatomoAbTestingInstance>,
  );

  /**
   * Create (and run) an A/B test experiment
   *
   * The `activate` callback of the variation chosen for the current visitor will be called by Matomo.
   */
  create(experiment: MatomoAbTestingExperiment): void {
    this.delegate.push(['AbTesting::create', experiment]);
  }

  /**
   * Manually track that the current visitor entered an experiment variation
   *
   * This is typically useful when the variation is chosen server-side, or when running a split URL test
   * where the variation is chosen by redirecting the visitor.
   *
   * @param experiment name (or ID) of the experiment
   * @param variation name (or ID) of the variation
   */
  enter(experiment: string | number, variation: string | number): void {
    this.delegate.push(['AbTesting::enter', { experiment, variation }]);
  }
}
