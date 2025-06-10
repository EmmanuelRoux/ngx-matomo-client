import { Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MatomoTracker } from 'ngx-matomo-client';
import { BASE_TITLE } from '../title';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';

@Component({
  templateUrl: './track-event-component.component.html',
  styleUrls: ['./track-event-component.component.scss'],
  imports: [MatFormField, MatLabel, MatInput, FormsModule, MatButton],
})
export class TrackEventComponentComponent implements OnInit {
  private readonly tracker = inject(MatomoTracker);
  private readonly title = inject(Title);

  category = '';
  action = '';
  name = '';
  value?: number;

  ngOnInit(): void {
    this.title.setTitle(BASE_TITLE + ' | Track any event (from component)');
  }

  doTrack(): void {
    this.tracker.trackEvent(this.category, this.action, this.name, this.value);
  }
}
