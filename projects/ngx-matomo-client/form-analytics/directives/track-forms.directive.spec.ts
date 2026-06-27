import { Component, ElementRef, viewChild, ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatomoFormAnalytics } from '../matomo-form-analytics.service';
import { TrackFormsDirective } from './track-forms.directive';

@Component({
  template: ` <div #containerRef matomoTrackForms>
    <div #elRef></div>
  </div>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [TrackFormsDirective],
})
class HostComponent {
  readonly containerRef = viewChild.required('containerRef', { read: ElementRef });
  readonly elRef = viewChild.required('elRef', { read: ElementRef });
  readonly dir = viewChild.required(TrackFormsDirective);
}

describe('TrackFormsDirective', () => {
  let component: HostComponent;
  let fixture: ComponentFixture<HostComponent>;
  let formAnalytics: Mocked<MatomoFormAnalytics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent, TrackFormsDirective],
      providers: [
        {
          provide: MatomoFormAnalytics,
          useValue: {
            scanForForms: vi.fn(),
            trackFormSubmit: vi.fn(),
            trackFormConversion: vi.fn(),
          },
        },
      ],
    }).compileComponents();

    formAnalytics = TestBed.inject(MatomoFormAnalytics) as Mocked<MatomoFormAnalytics>;
    fixture = TestBed.createComponent(HostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should scan for forms on initialization', async () => {
    await fixture.whenStable();

    expect(formAnalytics.scanForForms).toHaveBeenCalledOnce();
    expect(formAnalytics.scanForForms).toHaveBeenCalledWith(component.containerRef());
  });

  it('should track form submit', async () => {
    const elRef = component.elRef();
    component.dir().trackSubmit(elRef);

    expect(formAnalytics.trackFormSubmit).toHaveBeenCalledOnce();
    expect(formAnalytics.trackFormSubmit).toHaveBeenCalledWith(elRef);
  });

  it('should track form conversion', async () => {
    const elRef = component.elRef();
    component.dir().trackConversion(elRef);

    expect(formAnalytics.trackFormConversion).toHaveBeenCalledOnce();
    expect(formAnalytics.trackFormConversion).toHaveBeenCalledWith(elRef);
  });
});
