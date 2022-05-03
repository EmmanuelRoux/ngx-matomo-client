import { Component, ElementRef, Type, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatomoTracker } from '../matomo-tracker.service';
import { MatomoTrackerDirective, TrackArgs } from './matomo-tracker.directive';

type HTMLElementEvent = keyof HTMLElementEventMap;

@Component({
  template: ` <input
    type="text"
    #input
    [matomoTracker]="events"
    [matomoCategory]="defaultCategory"
    [matomoAction]="defaultAction"
    [matomoName]="defaultName"
    [matomoValue]="defaultValue"
  />`,
})
class HostWithInputEventsComponent {
  @ViewChild('input') inputRef?: ElementRef<HTMLInputElement>;

  events?: HTMLElementEvent | HTMLElementEvent[] | string | string[];
  defaultCategory?: string;
  defaultAction?: string;
  defaultName?: string;
  defaultValue?: number;

  triggerEvent(event: Event): void {
    this.inputRef?.nativeElement.dispatchEvent(event);
  }
}

@Component({
  template: `<input
    type="text"
    #input
    #tracker="matomo"
    matomoTracker
    [matomoCategory]="defaultCategory"
    [matomoAction]="defaultAction"
    [matomoName]="defaultName"
    [matomoValue]="defaultValue"
    (change)="tracker.trackEvent(arg1, arg2)"
  />`,
})
class HostWithCustomHandler1Component {
  @ViewChild('input') inputRef?: ElementRef<HTMLInputElement>;

  defaultCategory?: string;
  defaultAction?: string;
  defaultName?: string;
  defaultValue?: number;
  arg1?: string | number;
  arg2?: number;

  triggerEvent(event: Event): void {
    this.inputRef?.nativeElement.dispatchEvent(event);
  }
}

@Component({
  template: `<input
    type="text"
    #input
    #tracker="matomo"
    matomoTracker
    [matomoCategory]="defaultCategory"
    [matomoAction]="defaultAction"
    [matomoName]="defaultName"
    [matomoValue]="defaultValue"
    (change)="tracker.trackEvent(customArgs)"
  />`,
})
class HostWithCustomHandler2Component {
  @ViewChild('input') inputRef?: ElementRef<HTMLInputElement>;

  defaultCategory?: string;
  defaultAction?: string;
  defaultName?: string;
  defaultValue?: number;

  customArgs?: TrackArgs;

  triggerEvent(event: Event): void {
    this.inputRef?.nativeElement.dispatchEvent(event);
  }
}

describe('MatomoTrackerDirective', () => {
  let tracker: jasmine.SpyObj<MatomoTracker>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: MatomoTracker,
          useValue: jasmine.createSpyObj<MatomoTracker>('MatomoTracker', ['trackEvent']),
        },
      ],
      declarations: [
        HostWithInputEventsComponent,
        MatomoTrackerDirective,
        HostWithCustomHandler1Component,
        HostWithCustomHandler2Component,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    tracker = TestBed.inject(MatomoTracker) as jasmine.SpyObj<MatomoTracker>;
  });

  function createComponent<T>(type: Type<T>): { component: T; fixture: ComponentFixture<T> } {
    const fixture = TestBed.createComponent(type);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    return { fixture, component };
  }

  it('should track custom element events', () => {
    // Given
    const { fixture, component } = createComponent(HostWithInputEventsComponent);

    component.events = ['focus', 'blur'];
    component.defaultCategory = 'myCategory';
    component.defaultAction = 'myAction';
    fixture.detectChanges();

    // When
    component.triggerEvent(new FocusEvent('focus'));
    // Then
    expect(tracker.trackEvent).toHaveBeenCalledWith('myCategory', 'myAction', undefined, undefined);
    expect(tracker.trackEvent).toHaveBeenCalledTimes(1);

    // When
    component.triggerEvent(new CustomEvent('blur'));
    // Then
    expect(tracker.trackEvent).toHaveBeenCalledWith('myCategory', 'myAction', undefined, undefined);
    expect(tracker.trackEvent).toHaveBeenCalledTimes(2);

    // When
    component.triggerEvent(new CustomEvent('change'));
    // Then
    expect(tracker.trackEvent).toHaveBeenCalledTimes(2);

    // When
    component.events = undefined;
    fixture.detectChanges();
    component.triggerEvent(new CustomEvent('focus'));
    // Then
    expect(tracker.trackEvent).toHaveBeenCalledTimes(2);

    // When
    component.events = 'focus';
    fixture.detectChanges();
    component.triggerEvent(new CustomEvent('focus'));
    // Then
    expect(tracker.trackEvent).toHaveBeenCalledTimes(3);

    // When
    fixture.destroy();
    // Then
    expect(tracker.trackEvent).toHaveBeenCalledTimes(3);
  });

  it('should track events using custom handler', () => {
    // Given
    const { fixture, component } = createComponent(HostWithCustomHandler1Component);

    component.defaultCategory = 'defaultCategory';
    component.defaultAction = 'defaultAction';
    component.defaultName = 'defaultName';

    // When
    component.arg1 = 99;
    fixture.detectChanges();
    component.triggerEvent(new FocusEvent('change'));
    // Then
    expect(tracker.trackEvent).toHaveBeenCalledWith(
      'defaultCategory',
      'defaultAction',
      'defaultName',
      99
    );

    // When
    component.arg1 = 'myName';
    fixture.detectChanges();
    component.triggerEvent(new FocusEvent('change'));
    // Then
    expect(tracker.trackEvent).toHaveBeenCalledWith(
      'defaultCategory',
      'defaultAction',
      'myName',
      undefined
    );

    // When
    component.arg2 = 42;
    fixture.detectChanges();
    component.triggerEvent(new FocusEvent('change'));
    // Then
    expect(tracker.trackEvent).toHaveBeenCalledWith(
      'defaultCategory',
      'defaultAction',
      'myName',
      42
    );
  });

  it('should track events using custom handler and overwritten arguments', () => {
    // Given
    const { fixture, component } = createComponent(HostWithCustomHandler2Component);

    // When
    component.defaultCategory = 'defaultCategory';
    component.defaultAction = 'defaultAction';
    component.defaultName = 'defaultName';
    component.defaultValue = -1;
    component.customArgs = {};
    fixture.detectChanges();
    component.triggerEvent(new FocusEvent('change'));
    // Then
    expect(tracker.trackEvent).toHaveBeenCalledWith(
      'defaultCategory',
      'defaultAction',
      'defaultName',
      -1
    );

    // When
    component.defaultCategory = 'defaultCategory';
    component.defaultAction = 'defaultAction';
    component.defaultName = 'defaultName';
    component.defaultValue = -1;
    component.customArgs = {
      category: 'myCategory',
      action: 'myAction',
      name: 'myName',
      value: 99,
    };
    fixture.detectChanges();
    component.triggerEvent(new FocusEvent('change'));
    // Then
    expect(tracker.trackEvent).toHaveBeenCalledWith('myCategory', 'myAction', 'myName', 99);
  });
});
