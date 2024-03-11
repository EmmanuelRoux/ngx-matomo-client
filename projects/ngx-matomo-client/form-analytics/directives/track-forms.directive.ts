import { AfterViewInit, Directive, ElementRef, inject } from '@angular/core';
import { MatomoFormAnalytics } from '../matomo-form-analytics.service';

@Directive({
  selector: '[matomoTrackForms]',
  standalone: true,
  exportAs: 'matomoTrackForms',
})
export class TrackFormsDirective implements AfterViewInit {
  private readonly elementRef: ElementRef<Element> = inject(ElementRef);
  private readonly tracker = inject(MatomoFormAnalytics);

  ngAfterViewInit(): void {
    this.scan();
  }

  scan(): void {
    this.tracker.scanForForms(this.elementRef);
  }

  trackSubmit(element: Element | ElementRef<Element>): void {
    this.tracker.trackFormSubmit(element);
  }

  trackConversion(element: Element | ElementRef<Element>): void {
    this.tracker.trackFormConversion(element);
  }
}
