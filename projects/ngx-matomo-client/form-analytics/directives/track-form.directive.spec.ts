import {
  Component,
  ElementRef,
  provideZoneChangeDetection,
  viewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatomoFormAnalytics } from '../matomo-form-analytics.service';
import { TrackFormDirective } from './track-form.directive';

@Component({
  template: ` <form
    #containerRef
    [matomoTrackForm]="name"
    [trackConversionOnSubmit]="trackConversionOnSubmit"
    [matomoIgnore]="ignore"
    (submit)="$event.preventDefault()"
  >
    <button #submitButton></button>
  </form>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [TrackFormDirective],
})
class HostComponent {
  readonly containerRef = viewChild.required('containerRef', { read: ElementRef });
  readonly submitButtonRef = viewChild.required('submitButton', { read: ElementRef });
  readonly dir = viewChild.required(TrackFormDirective);

  trackConversionOnSubmit: boolean | undefined;
  ignore: boolean | undefined;
  name: string | undefined;
}

describe('TrackFormDirective', () => {
  let component: HostComponent;
  let fixture: ComponentFixture<HostComponent>;
  let formAnalytics: Mocked<MatomoFormAnalytics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent, TrackFormDirective],
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

    formAnalytics = TestBed.inject(MatomoFormAnalytics) as Mocked<MatomoFormAnalytics>;
    fixture = TestBed.createComponent(HostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should add data-matomo-form attribute', () => {
    expect(component.containerRef().nativeElement.hasAttribute('data-matomo-form')).toBe(true);
  });

  it('should add data-matomo-ignore attribute', async () => {
    component.ignore = true;

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.containerRef().nativeElement.hasAttribute('data-matomo-ignore')).toBe(true);

    component.ignore = false;

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.containerRef().nativeElement.hasAttribute('data-matomo-ignore')).toBe(false);
  });

  it('should set data-matomo-name attribute', async () => {
    component.name = 'test-name';

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.containerRef().nativeElement.getAttribute('data-matomo-name')).toEqual(
      'test-name',
    );
  });

  it('should track form on init', async () => {
    await fixture.whenStable();

    expect(formAnalytics.trackForm).toHaveBeenCalledOnce();
    expect(formAnalytics.trackForm).toHaveBeenCalledWith(component.containerRef());
  });

  it('should track form again manually', async () => {
    formAnalytics.trackForm.mockClear();

    component.dir().track();

    expect(formAnalytics.trackForm).toHaveBeenCalledOnce();
    expect(formAnalytics.trackForm).toHaveBeenCalledWith(component.containerRef());
  });

  it('should track form submit', async () => {
    component.dir().trackSubmit();

    expect(formAnalytics.trackFormSubmit).toHaveBeenCalledOnce();
    expect(formAnalytics.trackFormSubmit).toHaveBeenCalledWith(component.containerRef());
  });

  it('should track form conversion', async () => {
    component.dir().trackConversion();

    expect(formAnalytics.trackFormConversion).toHaveBeenCalledOnce();
    expect(formAnalytics.trackFormConversion).toHaveBeenCalledWith(component.containerRef());
  });

  it('should track form conversion automatically', async () => {
    component.trackConversionOnSubmit = true;
    fixture.detectChanges();
    await fixture.whenStable();

    component.submitButtonRef().nativeElement.click();

    expect(formAnalytics.trackFormConversion).toHaveBeenCalledOnce();
    expect(formAnalytics.trackFormConversion).toHaveBeenCalledWith(component.containerRef());
  });
});
