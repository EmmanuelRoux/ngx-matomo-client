import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatomoConfiguration, NgxMatomoTrackerModule } from '@ngx-matomo/tracker';
import { TrackEventComponentComponent } from './track-event-component.component';

describe('TrackEventComponentComponent', () => {
  let component: TrackEventComponentComponent;
  let fixture: ComponentFixture<TrackEventComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxMatomoTrackerModule.forRoot({
          trackerUrl: '',
          siteId: '',
        } as MatomoConfiguration),
      ],
      declarations: [TrackEventComponentComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackEventComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
