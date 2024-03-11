import {
  AfterViewInit,
  booleanAttribute,
  Directive,
  ElementRef,
  inject,
  Input,
} from '@angular/core';
import { throwFormNotFoundError } from './errors';
import { TrackFormDirective } from './track-form.directive';

@Directive({
  selector: '[matomoTrackFormField]',
  standalone: true,
  exportAs: 'matomoTrackFormField',
})
export class TrackFormFieldDirective implements AfterViewInit {
  private readonly elementRef: ElementRef<Element> = inject(ElementRef);
  private readonly form =
    inject(TrackFormDirective, { optional: true }) ??
    throwFormNotFoundError('[matomoTrackFormField]');

  private initialized = false;

  @Input({ transform: booleanAttribute }) set matomoIgnore(ignore: boolean) {
    if (ignore) {
      this.elementRef.nativeElement.setAttribute('data-matomo-ignore', '');
    } else {
      this.elementRef.nativeElement.removeAttribute('data-matomo-ignore');
    }
  }

  @Input() set matomoTrackFormField(name: string | null | undefined) {
    if (name) {
      this.elementRef.nativeElement.setAttribute('data-matomo-name', name);
    } else {
      this.elementRef.nativeElement.removeAttribute('data-matomo-name');
    }

    if (this.initialized) {
      this.track();
    }
  }

  ngAfterViewInit(): void {
    this.track();
    this.initialized = true;
  }

  track(): void {
    this.form.track();
  }
}
