import { Directive, input, inject } from '@angular/core';
import { MatomoTracker } from '../tracker/matomo-tracker.service';
import { requireNonNull } from '../utils/coercion';

@Directive({
  selector: '[matomoClickCategory][matomoClickAction]',
  host: {
    '(click)': 'onClick()',
  },
})
export class MatomoTrackClickDirective {
  private readonly tracker = inject(MatomoTracker);

  readonly matomoClickCategory = input<string>();
  readonly matomoClickAction = input<string>();
  readonly matomoClickName = input<string>();
  readonly matomoClickValue = input<number>();

  onClick(): void {
    this.tracker.trackEvent(
      requireNonNull(this.matomoClickCategory(), 'matomo category is required'),
      requireNonNull(this.matomoClickAction(), 'matomo action is required'),
      this.matomoClickName(),
      this.matomoClickValue(),
    );
  }
}
