import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideMatomoTesting } from 'ngx-matomo-client/testing';
import { TrackEventComponentComponent } from './track-event-component.component';

describe('TrackEventComponentComponent', () => {
  let component: TrackEventComponentComponent;
  let fixture: ComponentFixture<TrackEventComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, TrackEventComponentComponent],
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
    fixture = TestBed.createComponent(TrackEventComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
