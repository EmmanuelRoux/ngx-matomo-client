import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatomoConfiguration, NgxMatomoTrackerModule } from '@ngx-matomo/tracker';
import { TrackPageViewWithoutRouterComponent } from './track-page-view-without-router.component';

describe('TrackPageViewWithoutRouterComponent', () => {
  let component: TrackPageViewWithoutRouterComponent;
  let fixture: ComponentFixture<TrackPageViewWithoutRouterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxMatomoTrackerModule.forRoot({
          trackerUrl: '',
          siteId: '',
        } as MatomoConfiguration),
      ],
      declarations: [TrackPageViewWithoutRouterComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackPageViewWithoutRouterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
