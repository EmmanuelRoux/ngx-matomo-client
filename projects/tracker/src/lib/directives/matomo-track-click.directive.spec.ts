import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatomoTracker } from '../matomo-tracker.service';
import { MatomoTrackClickDirective } from './matomo-track-click.directive';

@Component({
  template: ` <button
    type="button"
    #button
    [matomoClickCategory]="category"
    [matomoClickAction]="action"
    [matomoClickName]="name"
    [matomoClickValue]="value"
  ></button>`,
})
class HostComponent {
  @ViewChild('button') buttonRef?: ElementRef<HTMLButtonElement>;

  category?: string;
  action?: string;
  name?: string;
  value?: number;

  clickButton(): void {
    this.buttonRef?.nativeElement.dispatchEvent(new MouseEvent('click'));
  }
}

describe('MatomoTrackClickDirective', () => {
  let component: HostComponent;
  let fixture: ComponentFixture<HostComponent>;
  let tracker: jasmine.SpyObj<MatomoTracker>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: MatomoTracker,
          useValue: jasmine.createSpyObj<MatomoTracker>('MatomoTracker', ['trackEvent']),
        },
      ],
      declarations: [HostComponent, MatomoTrackClickDirective],
    }).compileComponents();
  }));

  beforeEach(() => {
    tracker = TestBed.inject(MatomoTracker) as jasmine.SpyObj<MatomoTracker>;
    fixture = TestBed.createComponent(HostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should track event with category & action', () => {
    // Given
    component.category = 'myCategory';
    component.action = 'myAction';
    fixture.detectChanges();

    // When
    component.clickButton();

    // Then
    expect(tracker.trackEvent).toHaveBeenCalledWith('myCategory', 'myAction', undefined, undefined);
  });

  it('should track event with category, action & name', () => {
    // Given
    component.category = 'myCategory';
    component.action = 'myAction';
    component.name = 'myName';
    fixture.detectChanges();

    // When
    component.clickButton();

    // Then
    expect(tracker.trackEvent).toHaveBeenCalledWith('myCategory', 'myAction', 'myName', undefined);
  });

  it('should track event with category, action, name & value', () => {
    // Given
    component.category = 'myCategory';
    component.action = 'myAction';
    component.name = 'myName';
    component.value = 100;
    fixture.detectChanges();

    // When
    component.clickButton();

    // Then
    expect(tracker.trackEvent).toHaveBeenCalledWith('myCategory', 'myAction', 'myName', 100);
  });
});
