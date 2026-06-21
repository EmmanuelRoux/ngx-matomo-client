import { booleanAttribute, Directive, ElementRef, inject, input, effect } from '@angular/core';
import { throwFormNotFoundError } from './errors';
import { TrackFormDirective } from './track-form.directive';

@Directive({
  selector: '[matomoTrackFormSubmit]',
  host: {
    '(click)': 'trackSubmit()',
  },
})
export class TrackFormSubmitDirective {
  private readonly elementRef: ElementRef<Element> = inject(ElementRef);
  private readonly form =
    inject(TrackFormDirective, { optional: true }) ??
    throwFormNotFoundError('[matomoTrackFormSubmit]');

  /** If true, will track a conversion after form submit */
  readonly trackConversion = input(false, { transform: booleanAttribute });
  readonly matomoIgnore = input<boolean>();

  constructor() {
    effect(() => {
      const ignore = this.matomoIgnore();
      if (ignore) {
        this.elementRef.nativeElement.setAttribute('data-matomo-ignore', '');
      } else {
        this.elementRef.nativeElement.removeAttribute('data-matomo-ignore');
      }
    });
  }

  trackSubmit(): void {
    this.form.trackSubmit();

    if (this.trackConversion()) {
      this.form.trackConversion();
    }
  }
}
