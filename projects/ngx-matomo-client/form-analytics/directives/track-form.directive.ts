import {
  AfterViewInit,
  booleanAttribute,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
} from '@angular/core';
import { MatomoFormAnalytics } from '../matomo-form-analytics.service';

@Directive({
  selector: '[matomoTrackForm]',
  exportAs: 'matomoTrackForm',
  host: {
    '(submit)': 'trackFormConversionOnSubmit()',
  },
})
export class TrackFormDirective implements AfterViewInit {
  private readonly elementRef: ElementRef<Element> = inject(ElementRef);
  private readonly tracker = inject(MatomoFormAnalytics);
  private initialized = false;

  /** If true, will track a conversion after form submit */
  readonly trackConversionOnSubmit = input(false, { transform: booleanAttribute });
  readonly matomoIgnore = input<boolean>(undefined, { transform: booleanAttribute });
  readonly matomoTrackForm = input<string | null>();

  constructor() {
    effect(() => {
      const ignore = this.matomoIgnore();
      if (ignore) {
        this.elementRef.nativeElement.setAttribute('data-matomo-ignore', '');
      } else {
        this.elementRef.nativeElement.removeAttribute('data-matomo-ignore');
      }
    });
    effect(() => {
      const name = this.matomoTrackForm();
      if (name) {
        this.elementRef.nativeElement.setAttribute('data-matomo-name', name);
      } else {
        this.elementRef.nativeElement.removeAttribute('data-matomo-name');
      }

      if (this.initialized) {
        this.track();
      }
    });
    this.elementRef.nativeElement.setAttribute('data-matomo-form', '');
  }

  ngAfterViewInit(): void {
    this.track();
    this.initialized = true;
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
