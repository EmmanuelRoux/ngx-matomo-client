import { Component, ElementRef, provideZoneChangeDetection, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatomoFormAnalytics } from '../matomo-form-analytics.service';
import { TrackFormFieldDirective } from './track-form-field.directive';
import { TrackFormDirective } from './track-form.directive';

@Component({
  template: ` <form (submit)="$event.preventDefault()" matomoTrackForm>
    @if (showField) {
      <div [matomoIgnore]="ignore" [matomoTrackFormField]="fieldName"></div>
    }
  </form>`,
  imports: [TrackFormDirective, TrackFormFieldDirective],
})
class HostComponent {
  @ViewChild(TrackFormDirective, { read: ElementRef }) containerRef!: ElementRef<HTMLElement>;
  @ViewChild(TrackFormDirective) formDir!: TrackFormDirective;
  @ViewChild(TrackFormFieldDirective) fieldDir!: TrackFormFieldDirective;
  @ViewChild(TrackFormFieldDirective, { read: ElementRef }) fieldElRef!: ElementRef<HTMLElement>;

  showField = true;
  ignore: boolean | undefined;
  fieldName: string | undefined;
}

@Component({
  template: ` <div matomoTrackFormField></div>`,
  imports: [TrackFormDirective, TrackFormFieldDirective],
})
class InvalidHostComponent {}

describe('TrackFormFieldDirective', () => {
  let component: HostComponent;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent, InvalidHostComponent, TrackFormDirective, TrackFormFieldDirective],
      providers: [
        provideZoneChangeDetection(),
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

    expect(component.fieldElRef.nativeElement.hasAttribute('data-matomo-ignore')).toBeTrue();

    component.ignore = false;

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.fieldElRef.nativeElement.hasAttribute('data-matomo-ignore')).toBeFalse();
  });

  it('should set data-matomo-name attribute', async () => {
    component.fieldName = 'test-name';

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.fieldElRef.nativeElement.getAttribute('data-matomo-name')).toEqual(
      'test-name',
    );
  });

  it('should set data-matomo-name attribute and immediately track parent form', async () => {
    component.fieldName = 'test-name';
    fixture.detectChanges();
    await fixture.whenStable();

    spyOn(component.formDir, 'track');

    component.fieldName = 'another-test-name';
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.fieldElRef.nativeElement.getAttribute('data-matomo-name')).toEqual(
      'another-test-name',
    );
    expect(component.formDir.track).toHaveBeenCalledTimes(1);
  });

  it('should track form on init', async () => {
    // Given
    component.showField = false;
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.fieldDir).toBeUndefined();
    spyOn(component.formDir, 'track');

    // When
    component.showField = true;
    fixture.detectChanges();
    await fixture.whenStable();

    // Then
    expect(component.formDir.track).toHaveBeenCalledTimes(1);
  });
});
