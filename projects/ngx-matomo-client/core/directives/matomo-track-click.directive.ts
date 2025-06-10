import { Directive, HostListener, Input, inject } from '@angular/core';
import { MatomoTracker } from '../tracker/matomo-tracker.service';
import { requireNonNull } from '../utils/coercion';

@Directive({
  selector: '[matomoClickCategory][matomoClickAction]',
  standalone: true,
})
export class MatomoTrackClickDirective {
  private readonly tracker = inject(MatomoTracker);

  @Input() matomoClickCategory?: string;
  @Input() matomoClickAction?: string;
  @Input() matomoClickName?: string;
  @Input() matomoClickValue?: number;

  @HostListener('click')
  onClick(): void {
    this.tracker.trackEvent(
      requireNonNull(this.matomoClickCategory, 'matomo category is required'),
      requireNonNull(this.matomoClickAction, 'matomo action is required'),
      this.matomoClickName,
      this.matomoClickValue,
    );
  }
}
