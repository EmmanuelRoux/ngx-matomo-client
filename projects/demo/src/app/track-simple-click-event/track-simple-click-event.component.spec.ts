import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideMatomoTesting } from 'ngx-matomo-client/testing';
import { TrackSimpleClickEventComponent } from './track-simple-click-event.component';

describe('TrackSimpleClickEventComponent', () => {
  let component: TrackSimpleClickEventComponent;
  let fixture: ComponentFixture<TrackSimpleClickEventComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, TrackSimpleClickEventComponent],
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
    fixture = TestBed.createComponent(TrackSimpleClickEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
