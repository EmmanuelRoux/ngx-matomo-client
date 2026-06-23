import {
  afterRenderEffect,
  booleanAttribute,
  Directive,
  ElementRef,
  inject,
  input,
} from '@angular/core';
import { MatomoFormAnalytics } from '../matomo-form-analytics.service';

@Directive({
  selector: '[matomoTrackForm]',
  exportAs: 'matomoTrackForm',
  host: {
    'data-matomo-form': '',
    '[attr.data-matomo-ignore]': 'matomoIgnore() ? "" : null',
    '[attr.data-matomo-name]': 'matomoTrackForm() || null',
    '(submit)': 'trackFormConversionOnSubmit()',
  },
})
export class TrackFormDirective {
  private readonly elementRef: ElementRef<Element> = inject(ElementRef);
  private readonly tracker = inject(MatomoFormAnalytics);

  /** If true, will track a conversion after form submit */
  readonly trackConversionOnSubmit = input(false, { transform: booleanAttribute });
  readonly matomoIgnore = input<boolean>(undefined, { transform: booleanAttribute });
  readonly matomoTrackForm = input<string | null>();

  constructor() {
    afterRenderEffect(() => {
      this.matomoTrackForm();
      this.track();
    });
  }

  track(): void {
    this.tracker.trackForm(this.elementRef);
  }

  trackSubmit(): void {
    this.tracker.trackFormSubmit(this.elementRef);
  }

  trackConversion(): void {
    this.tracker.trackFormConversion(this.elementRef);
  }

  trackFormConversionOnSubmit(): void {
    if (this.trackConversionOnSubmit()) {
      this.trackConversion();
    }
  }
}
