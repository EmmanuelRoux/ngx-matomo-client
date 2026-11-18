/**
 * A/B test target, used to restrict on which pages an experiment should run.
 *
 * @see https://developer.matomo.org/guides/ab-tests/browser
 */
export interface MatomoAbTestingTarget {
  /** Attribute to match, e.g. `'url'`, `'path'` or `'urlparam'` */
  attribute: 'url' | 'path' | 'urlparam' | (string & {});
  /**
   * Type of comparison, e.g. `'any'`, `'exists'`, `'equals_simple'`, `'equals_exactly'`, `'contains'`,
   * `'starts_with'` or `'regexp'`
   */
  type:
    | 'any'
    | 'exists'
    | 'equals_simple'
    | 'equals_exactly'
    | 'contains'
    | 'starts_with'
    | 'regexp'
    | (string & {});
  /** Value to compare with */
  value?: string;
  /** Whether the condition should be inverted (`'1'`) or not (`'0'`) */
  inverted?: '0' | '1' | boolean;
}

/**
 * Event passed to a variation's `activate` callback.
 */
export interface MatomoAbTestingActivateEvent {
  /**
   * Redirect the visitor to the given URL (useful for split URL tests).
   *
   * Matomo will make sure the redirect happens only once the variation has been tracked.
   */
  redirect(url: string): void;
}

/**
 * A variation of an A/B test experiment.
 */
export interface MatomoAbTestingVariation {
  /** Name of the variation, or its ID (to avoid exposing its name) */
  name: string | number;
  /** Optional percentage of traffic allocated to this variation */
  percentage?: number;
  /** Callback invoked when this variation is activated for the current visitor */
  activate?: (this: MatomoAbTestingVariation, event: MatomoAbTestingActivateEvent) => void;
}

/**
 * Definition of an A/B test experiment, as expected by `AbTesting::create`.
 *
 * @see https://developer.matomo.org/guides/ab-tests/browser
 */
export interface MatomoAbTestingExperiment {
  /** Name of the experiment, or its ID (to avoid exposing its name) */
  name: string | number;
  /** Percentage of visitors that should take part in the experiment (defaults to 100) */
  percentage?: number;
  /** Targets to include: the experiment only runs if all included targets match */
  includedTargets?: MatomoAbTestingTarget[];
  /** Targets to exclude: the experiment does not run if any excluded target matches */
  excludedTargets?: MatomoAbTestingTarget[];
  /** Start date of the experiment, e.g. `'2026/06/30 23:00:00 UTC'` */
  startDateTime?: string;
  /** End date of the experiment, e.g. `'2026/07/31 23:00:00 UTC'` */
  endDateTime?: string;
  /** Variations of the experiment (usually including an `original` variation) */
  variations: MatomoAbTestingVariation[];
  /** Optional callback to decide whether the experiment should be triggered for the current visitor */
  trigger?: () => boolean;
}
