import {
  Component,
  ElementRef,
  provideZoneChangeDetection,
  viewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [TrackFormDirective, TrackFormSubmitDirective],
})
class HostComponent {
  readonly formDir = viewChild.required(TrackFormDirective);
  readonly submitElRef = viewChild.required(TrackFormSubmitDirective, { read: ElementRef });

  ignore: boolean | undefined;
  trackConversion: boolean | undefined;
}

@Component({
  template: ` <button matomoTrackFormSubmit></button>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [TrackFormSubmitDirective],
})
class InvalidHostComponent {}

describe('TrackFormSubmitDirective', () => {
  let component: HostComponent;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent, InvalidHostComponent, TrackFormDirective, TrackFormFieldDirective],
      providers: [
        provideZoneChangeDetection(),
        {
          provide: MatomoFormAnalytics,
          useValue: {
            trackForm: vi.fn(),
            trackFormSubmit: vi.fn(),
            trackFormConversion: vi.fn(),
          } as unknown as Mocked<MatomoFormAnalytics>,
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

    expect(component.submitElRef().nativeElement.hasAttribute('data-matomo-ignore')).toBe(true);

    component.ignore = false;

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.submitElRef().nativeElement.hasAttribute('data-matomo-ignore')).toBe(false);
  });

  it('should track submit', async () => {
    const formDir = component.formDir();
    vi.spyOn(formDir, 'trackSubmit').mockImplementation(() => undefined);
    vi.spyOn(formDir, 'trackConversion').mockImplementation(() => undefined);

    component.submitElRef().nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(formDir.trackSubmit).toHaveBeenCalledTimes(1);
    expect(formDir.trackConversion).not.toHaveBeenCalled();
  });

  it('should track submit and conversion', async () => {
    component.trackConversion = true;
    fixture.detectChanges();
    await fixture.whenStable();

    const formDir = component.formDir();
    vi.spyOn(formDir, 'trackSubmit').mockImplementation(() => undefined);
    vi.spyOn(formDir, 'trackConversion').mockImplementation(() => undefined);

    component.submitElRef().nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(formDir.trackSubmit).toHaveBeenCalledTimes(1);
    expect(formDir.trackConversion).toHaveBeenCalledTimes(1);
  });
});
