import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideMatomoTesting } from 'ngx-matomo-client/testing';
import { TrackEventTemplateComponent } from './track-event-template.component';

describe('TrackEventTemplateComponent', () => {
  let component: TrackEventTemplateComponent;
  let fixture: ComponentFixture<TrackEventTemplateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, TrackEventTemplateComponent],
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
    fixture = TestBed.createComponent(TrackEventTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
