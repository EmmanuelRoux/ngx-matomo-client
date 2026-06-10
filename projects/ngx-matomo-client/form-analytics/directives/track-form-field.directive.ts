import {
  AfterViewInit,
  booleanAttribute,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
} from '@angular/core';
import { throwFormNotFoundError } from './errors';
import { TrackFormDirective } from './track-form.directive';

@Directive({
  selector: '[matomoTrackFormField]',
  exportAs: 'matomoTrackFormField',
})
export class TrackFormFieldDirective implements AfterViewInit {
  private readonly elementRef: ElementRef<Element> = inject(ElementRef);
  private readonly form =
    inject(TrackFormDirective, { optional: true }) ??
    throwFormNotFoundError('[matomoTrackFormField]');

  private initialized = false;
  readonly matomoIgnore = input<boolean>(undefined, { transform: booleanAttribute });
  readonly matomoTrackFormField = input<string | null | undefined>();

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
      const name = this.matomoTrackFormField();
      if (name) {
        this.elementRef.nativeElement.setAttribute('data-matomo-name', name);
      } else {
        this.elementRef.nativeElement.removeAttribute('data-matomo-name');
      }

      if (this.initialized) {
        this.track();
      }
    });
  }

  ngAfterViewInit(): void {
    this.track();
    this.initialized = true;
  }

  track(): void {
    this.form.track();
  }
}
