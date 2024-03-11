import {
  booleanAttribute,
  Directive,
  ElementRef,
  HostListener,
  inject,
  Input,
} from '@angular/core';
import { throwFormNotFoundError } from './errors';
import { TrackFormDirective } from './track-form.directive';

@Directive({
  selector: '[matomoTrackFormSubmit]',
  standalone: true,
})
export class TrackFormSubmitDirective {
  private readonly elementRef: ElementRef<Element> = inject(ElementRef);
  private readonly form =
    inject(TrackFormDirective, { optional: true }) ??
    throwFormNotFoundError('[matomoTrackFormSubmit]');

  /** If true, will track a conversion after form submit */
  @Input({ transform: booleanAttribute }) trackConversion = false;

  @Input({ transform: booleanAttribute }) set matomoIgnore(ignore: boolean) {
    if (ignore) {
      this.elementRef.nativeElement.setAttribute('data-matomo-ignore', '');
    } else {
      this.elementRef.nativeElement.removeAttribute('data-matomo-ignore');
    }
  }

  @HostListener('click')
  trackSubmit(): void {
    this.form.trackSubmit();

    if (this.trackConversion) {
      this.form.trackConversion();
    }
  }
}
