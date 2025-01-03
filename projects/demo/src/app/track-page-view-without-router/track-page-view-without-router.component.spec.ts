import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideMatomoTesting } from 'ngx-matomo-client/testing';
import { TrackPageViewWithoutRouterComponent } from './track-page-view-without-router.component';

describe('TrackPageViewWithoutRouterComponent', () => {
  let component: TrackPageViewWithoutRouterComponent;
  let fixture: ComponentFixture<TrackPageViewWithoutRouterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, TrackPageViewWithoutRouterComponent],
      providers: [
        provideMatomoTesting({
          trackerUrl: '',
          siteId: '',
        }),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
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
