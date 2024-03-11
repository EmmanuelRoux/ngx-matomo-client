import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatomoFormAnalytics } from '../matomo-form-analytics.service';
import { TrackFormsDirective } from './track-forms.directive';

@Component({
  template: ` <div #containerRef matomoTrackForms>
    <div #elRef></div>
  </div>`,
  imports: [TrackFormsDirective],
  standalone: true,
})
class HostComponent {
  @ViewChild('containerRef', { read: ElementRef }) containerRef!: ElementRef<HTMLElement>;
  @ViewChild('elRef', { read: ElementRef }) elRef!: ElementRef<HTMLElement>;
  @ViewChild(TrackFormsDirective) dir!: TrackFormsDirective;
}

describe('TrackFormsDirective', () => {
  let component: HostComponent;
  let fixture: ComponentFixture<HostComponent>;
  let formAnalytics: jasmine.SpyObj<MatomoFormAnalytics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent, TrackFormsDirective],
      providers: [
        {
          provide: MatomoFormAnalytics,
          useValue: jasmine.createSpyObj<MatomoFormAnalytics>('MatomoFormAnalytics', [
            'scanForForms',
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

  it('should scan for forms on initialization', async () => {
    await fixture.whenStable();

    expect(formAnalytics.scanForForms).toHaveBeenCalledOnceWith(component.containerRef);
  });

  it('should track form submit', async () => {
    component.dir.trackSubmit(component.elRef);

    expect(formAnalytics.trackFormSubmit).toHaveBeenCalledOnceWith(component.elRef);
  });

  it('should track form submit', async () => {
    component.dir.trackConversion(component.elRef);

    expect(formAnalytics.trackFormConversion).toHaveBeenCalledOnceWith(component.elRef);
  });
});
