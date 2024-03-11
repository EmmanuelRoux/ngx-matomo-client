import { Component, ElementRef, ViewChild } from '@angular/core';
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
  imports: [TrackFormDirective],
  standalone: true,
})
class HostComponent {
  @ViewChild('containerRef', { read: ElementRef }) containerRef!: ElementRef<HTMLElement>;
  @ViewChild('elRef', { read: ElementRef }) elRef!: ElementRef<HTMLElement>;
  @ViewChild('submitButton', { read: ElementRef }) submitButtonRef!: ElementRef<HTMLButtonElement>;
  @ViewChild(TrackFormDirective) dir!: TrackFormDirective;

  trackConversionOnSubmit: boolean | undefined;
  ignore: boolean | undefined;
  name: string | undefined;
}

describe('TrackFormDirective', () => {
  let component: HostComponent;
  let fixture: ComponentFixture<HostComponent>;
  let formAnalytics: jasmine.SpyObj<MatomoFormAnalytics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent, TrackFormDirective],
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

    formAnalytics = TestBed.inject(MatomoFormAnalytics) as jasmine.SpyObj<MatomoFormAnalytics>;
    fixture = TestBed.createComponent(HostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should add data-matomo-form attribute', () => {
    expect(component.containerRef.nativeElement.hasAttribute('data-matomo-form')).toBeTrue();
  });

  it('should add data-matomo-ignore attribute', async () => {
    component.ignore = true;

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.containerRef.nativeElement.hasAttribute('data-matomo-ignore')).toBeTrue();

    component.ignore = false;

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.containerRef.nativeElement.hasAttribute('data-matomo-ignore')).toBeFalse();
  });

  it('should set data-matomo-name attribute', async () => {
    component.name = 'test-name';

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.containerRef.nativeElement.getAttribute('data-matomo-name')).toEqual(
      'test-name',
    );
  });

  it('should track form on init', async () => {
    await fixture.whenStable();

    expect(formAnalytics.trackForm).toHaveBeenCalledOnceWith(component.containerRef);
  });

  it('should track form again manually', async () => {
    formAnalytics.trackForm.calls.reset();

    component.dir.track();

    expect(formAnalytics.trackForm).toHaveBeenCalledOnceWith(component.containerRef);
  });

  it('should track form submit', async () => {
    component.dir.trackSubmit();

    expect(formAnalytics.trackFormSubmit).toHaveBeenCalledOnceWith(component.containerRef);
  });

  it('should track form conversion', async () => {
    component.dir.trackConversion();

    expect(formAnalytics.trackFormConversion).toHaveBeenCalledOnceWith(component.containerRef);
  });

  it('should track form conversion automatically', async () => {
    component.trackConversionOnSubmit = true;
    fixture.detectChanges();
    await fixture.whenStable();

    component.submitButtonRef.nativeElement.click();

    expect(formAnalytics.trackFormConversion).toHaveBeenCalledOnceWith(component.containerRef);
  });
});
