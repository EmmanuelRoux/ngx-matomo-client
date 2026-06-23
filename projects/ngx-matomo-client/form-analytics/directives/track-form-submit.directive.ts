import { booleanAttribute, Directive, inject, input } from '@angular/core';
import { throwFormNotFoundError } from './errors';
import { TrackFormDirective } from './track-form.directive';

@Directive({
  selector: '[matomoTrackFormSubmit]',
  host: {
    '[attr.data-matomo-ignore]': 'matomoIgnore() ? "" : null',
    '(click)': 'trackSubmit()',
  },
})
export class TrackFormSubmitDirective {
  private readonly form =
    inject(TrackFormDirective, { optional: true }) ??
    throwFormNotFoundError('[matomoTrackFormSubmit]');

  /** If true, will track a conversion after form submit */
  readonly trackConversion = input(false, { transform: booleanAttribute });
  readonly matomoIgnore = input<boolean>();

  trackSubmit(): void {
    this.form.trackSubmit();

    if (this.trackConversion()) {
      this.form.trackConversion();
    }
  }
}
