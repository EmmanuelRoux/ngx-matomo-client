import { Directive, ElementRef, Input, OnDestroy } from '@angular/core';
import { fromEvent, merge, Subscription } from 'rxjs';
import { requireNonNull } from '../coercion';
import { MatomoTracker } from '../matomo-tracker.service';

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
  private sub?: Subscription;

  /** Set the event category */
  @Input() matomoCategory?: string;
  /** Set the event action */
  @Input() matomoAction?: string;
  /** Set the event name */
  @Input() matomoName?: string;
  /** Set the event value */
  @Input() matomoValue?: number;

  constructor(private readonly tracker: MatomoTracker, private readonly elementRef: ElementRef) {}

  /** Track a Matomo event whenever specified DOM event is triggered */
  @Input()
  set matomoTracker(input: DOMEventInput) {
    const eventNames = coerceEventNames(input);

    this.sub?.unsubscribe();

    if (eventNames) {
      const handlers = eventNames.map(eventName =>
        fromEvent(this.elementRef.nativeElement, eventName)
      );

      this.sub = merge(...handlers).subscribe(() => this.trackEvent());
    } else {
      this.sub = undefined;
    }
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  /** Track an event using category, action, name and value set as @Input() */
  // eslint-disable-next-line @typescript-eslint/unified-signatures
  trackEvent(): void;

  /** Track an event using category, action and name set as @Input() and provided value */
  // eslint-disable-next-line @typescript-eslint/unified-signatures
  trackEvent(value: number): void;

  /** Track an event using category and action set as @Input() and provided name and value */
  // eslint-disable-next-line @typescript-eslint/unified-signatures
  trackEvent(name: string, value?: number): void;

  /** Track an event using provided category, action, name and value (any @Input() is used as a default value) */
  // eslint-disable-next-line @typescript-eslint/unified-signatures
  trackEvent(args: TrackArgs): void;

  trackEvent(arg1?: TrackArgs | string | number, arg2?: number): void {
    let category = this.matomoCategory;
    let action = this.matomoAction;
    let name = this.matomoName;
    let value = this.matomoValue;

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
      value
    );
  }
}
