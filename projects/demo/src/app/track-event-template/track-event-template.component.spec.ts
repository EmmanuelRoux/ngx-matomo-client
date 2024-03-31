import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatomoConfiguration, MatomoModule } from 'ngx-matomo-client';
import { TrackEventTemplateComponent } from './track-event-template.component';

describe('TrackEventTemplateComponent', () => {
  let component: TrackEventTemplateComponent;
  let fixture: ComponentFixture<TrackEventTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatomoModule.forRoot({
          trackerUrl: '',
          siteId: '',
        } as MatomoConfiguration),
      ],
      declarations: [TrackEventTemplateComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackEventTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
