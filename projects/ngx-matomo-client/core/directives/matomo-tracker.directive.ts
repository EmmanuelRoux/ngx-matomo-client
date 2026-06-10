import { Directive, ElementRef, OnDestroy, inject, input } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { fromEvent, merge, switchMap, EMPTY } from 'rxjs';
import { MatomoTracker } from '../tracker/matomo-tracker.service';
import { requireNonNull } from '../utils/coercion';

export interface TrackArgs {
  category?: string;
  action?: string;
  name?: string;
  value?: number;
}

type EventName = keyof GlobalEventHandlersEventMap | string;
type DOMEventInput = EventName | EventName[] | null | undefined;

function coerceEventNames(input: DOMEventInput): EventName[] | null | undefined {
  if (input && input.length > 0) {
    return Array.isArray(input) ? input : [input];
  } else {
    return undefined;
  }
}

@Directive({
  selector: '[matomoTracker]',
  exportAs: 'matomo',
})
export class MatomoTrackerDirective implements OnDestroy {
  private readonly tracker = inject(MatomoTracker);
  private readonly elementRef = inject(ElementRef);

  /** Set the event category */
  readonly matomoCategory = input<string | undefined>(undefined);
  /** Set the event action */
  readonly matomoAction = input<string | undefined>(undefined);
  /** Set the event name */
  readonly matomoName = input<string | undefined>(undefined);
  /** Set the event value */
  readonly matomoValue = input<number | undefined>(undefined);

  /** Track a Matomo event whenever specified DOM event is triggered */
  readonly matomoTracker = input<DOMEventInput>(undefined);

  private sub = toObservable(this.matomoTracker)
    .pipe(
      switchMap(input => {
        const eventNames = coerceEventNames(input);
        if (!eventNames) return EMPTY;
        return merge(...eventNames.map(name => fromEvent(this.elementRef.nativeElement, name)));
      }),
      takeUntilDestroyed(),
    )
    .subscribe(() => this.trackEvent());

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  /** Track an event using category, action, name and value set as input signals */
  trackEvent(): void;
  /** Track an event using provided name (string), value (number), or both, with input signals as defaults */
  trackEvent(nameOrValue?: string | number, value?: number): void;
  /** Track an event using provided args (any input signal is used as a default value) */
  trackEvent(args?: TrackArgs): void;

  trackEvent(arg1?: TrackArgs | string | number, arg2?: number): void {
    let category = this.matomoCategory();
    let action = this.matomoAction();
    let name = this.matomoName();
    let value = this.matomoValue();

    if (typeof arg1 === 'object') {
      category = arg1.category ?? category;
      action = arg1.action ?? action;
      name = arg1.name ?? name;
      value = arg1.value ?? value;
    } else if (typeof arg1 === 'string') {
      name = arg1;

      if (typeof arg2 === 'number') {
        value = arg2;
      }
    } else if (typeof arg1 === 'number') {
      value = arg1;
    }

    this.tracker.trackEvent(
      requireNonNull(category, 'matomo category is required'),
      requireNonNull(action, 'matomo action is required'),
      name,
      value,
    );
  }
}
