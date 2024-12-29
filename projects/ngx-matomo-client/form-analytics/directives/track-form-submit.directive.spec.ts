import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatomoFormAnalytics } from '../matomo-form-analytics.service';
import { TrackFormFieldDirective } from './track-form-field.directive';
import { TrackFormSubmitDirective } from './track-form-submit.directive';
import { TrackFormDirective } from './track-form.directive';

@Component({
  template: ` <form (submit)="$event.preventDefault()" matomoTrackForm>
    <button
      [matomoIgnore]="ignore"
      [trackConversion]="trackConversion"
      matomoTrackFormSubmit
      type="button"
    ></button>
  </form>`,
  imports: [CommonModule, TrackFormDirective, TrackFormSubmitDirective],
})
class HostComponent {
  @ViewChild(TrackFormDirective, { read: ElementRef }) containerRef!: ElementRef<HTMLElement>;
  @ViewChild(TrackFormDirective) formDir!: TrackFormDirective;
  @ViewChild(TrackFormSubmitDirective) submitDir!: TrackFormSubmitDirective;
  @ViewChild(TrackFormSubmitDirective, { read: ElementRef }) submitElRef!: ElementRef<HTMLElement>;

  ignore: boolean | undefined;
  trackConversion: boolean | undefined;
}

@Component({
  template: ` <button matomoTrackFormSubmit></button>`,
  imports: [TrackFormDirective, TrackFormSubmitDirective],
})
class InvalidHostComponent {}

describe('TrackFormSubmitDirective', () => {
  let component: HostComponent;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent, InvalidHostComponent, TrackFormDirective, TrackFormFieldDirective],
      providers: [
        {
          provide: MatomoFormAnalytics,
          useValue: jasmine.createSpyObj<MatomoFormAnalytics>('MatomoFormAnalytics', [
            'trackForm',
            'trackFormSubmit',
            'trackFormConversion',
          ]),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should throw an error if not parent form is present', () => {
    expect(() => {
      TestBed.createComponent(InvalidHostComponent);
      fixture.detectChanges();
    }).toThrow();
  });

  it('should add data-matomo-ignore attribute', async () => {
    component.ignore = true;

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.submitElRef.nativeElement.hasAttribute('data-matomo-ignore')).toBeTrue();

    component.ignore = false;

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.submitElRef.nativeElement.hasAttribute('data-matomo-ignore')).toBeFalse();
  });

  it('should track submit', async () => {
    spyOn(component.formDir, 'trackSubmit');
    spyOn(component.formDir, 'trackConversion');

    component.submitElRef.nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.formDir.trackSubmit).toHaveBeenCalledTimes(1);
    expect(component.formDir.trackConversion).not.toHaveBeenCalled();
  });

  it('should track submit and conversion', async () => {
    component.trackConversion = true;
    fixture.detectChanges();
    await fixture.whenStable();

    spyOn(component.formDir, 'trackSubmit');
    spyOn(component.formDir, 'trackConversion');

    component.submitElRef.nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.formDir.trackSubmit).toHaveBeenCalledTimes(1);
    expect(component.formDir.trackConversion).toHaveBeenCalledTimes(1);
  });
});
