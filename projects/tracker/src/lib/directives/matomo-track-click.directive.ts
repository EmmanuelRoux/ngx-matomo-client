import { Directive, HostListener, Input } from '@angular/core';
import { MatomoTracker } from '../matomo-tracker.service';
import { requireNonNull } from '../coercion';

@Directive({
  selector: '[matomoClickCategory][matomoClickAction]',
})
export class MatomoTrackClickDirective {
  @Input() matomoClickCategory?: string;
  @Input() matomoClickAction?: string;
  @Input() matomoClickName?: string;
  @Input() matomoClickValue?: number;

  constructor(private readonly tracker: MatomoTracker) {}

  @HostListener('click')
  onClick(): void {
    this.tracker.trackEvent(
      requireNonNull(this.matomoClickCategory, 'matomo category is required'),
      requireNonNull(this.matomoClickAction, 'matomo action is required'),
      this.matomoClickName,
      this.matomoClickValue
    );
  }
}
