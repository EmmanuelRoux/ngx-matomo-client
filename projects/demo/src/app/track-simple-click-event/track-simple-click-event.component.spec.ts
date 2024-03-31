import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatomoConfiguration, MatomoModule } from 'ngx-matomo-client';
import { TrackSimpleClickEventComponent } from './track-simple-click-event.component';

describe('TrackSimpleClickEventComponent', () => {
  let component: TrackSimpleClickEventComponent;
  let fixture: ComponentFixture<TrackSimpleClickEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatomoModule.forRoot({
          trackerUrl: '',
          siteId: '',
        } as MatomoConfiguration),
      ],
      declarations: [TrackSimpleClickEventComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
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
