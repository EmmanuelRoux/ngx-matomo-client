import {
  AfterViewInit,
  booleanAttribute,
  Directive,
  ElementRef,
  HostListener,
  inject,
  Input,
} from '@angular/core';
import { MatomoFormAnalytics } from '../matomo-form-analytics.service';

@Directive({
  selector: '[matomoTrackForm]',
  standalone: true,
  exportAs: 'matomoTrackForm',
})
export class TrackFormDirective implements AfterViewInit {
  private readonly elementRef: ElementRef<Element> = inject(ElementRef);
  private readonly tracker = inject(MatomoFormAnalytics);
  private initialized = false;

  /** If true, will track a conversion after form submit */
  @Input({ transform: booleanAttribute }) trackConversionOnSubmit = false;

  @Input({ transform: booleanAttribute }) set matomoIgnore(ignore: boolean) {
    if (ignore) {
      this.elementRef.nativeElement.setAttribute('data-matomo-ignore', '');
    } else {
      this.elementRef.nativeElement.removeAttribute('data-matomo-ignore');
    }
  }

  @Input() set matomoTrackForm(name: string | null | undefined) {
    if (name) {
      this.elementRef.nativeElement.setAttribute('data-matomo-name', name);
    } else {
      this.elementRef.nativeElement.removeAttribute('data-matomo-name');
    }

    if (this.initialized) {
      this.track();
    }
  }

  constructor() {
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

  @HostListener('submit')
  trackFormConversionOnSubmit(): void {
    if (this.trackConversionOnSubmit) {
      this.trackConversion();
    }
  }
}
