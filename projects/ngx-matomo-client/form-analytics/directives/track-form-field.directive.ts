import { afterRenderEffect, booleanAttribute, Directive, inject, input } from '@angular/core';
import { throwFormNotFoundError } from './errors';
import { TrackFormDirective } from './track-form.directive';

@Directive({
  selector: '[matomoTrackFormField]',
  exportAs: 'matomoTrackFormField',
  host: {
    '[attr.data-matomo-ignore]': 'matomoIgnore() ? "" : null',
    '[attr.data-matomo-name]': 'matomoTrackFormField() || null',
  },
})
export class TrackFormFieldDirective {
  private readonly form =
    inject(TrackFormDirective, { optional: true }) ??
    throwFormNotFoundError('[matomoTrackFormField]');

  readonly matomoIgnore = input<boolean>(undefined, { transform: booleanAttribute });
  readonly matomoTrackFormField = input<string | null>();

  constructor() {
    afterRenderEffect(() => {
      this.matomoTrackFormField();
      this.track();
    });
  }

  track(): void {
    this.form.track();
  }
}
