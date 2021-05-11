import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MatomoTracker } from '@ngx-matomo/tracker';
import { BASE_TITLE } from '../title';

@Component({
  templateUrl: './track-event-component.component.html',
  styleUrls: ['./track-event-component.component.scss'],
})
export class TrackEventComponentComponent implements OnInit {
  category = '';
  action = '';
  name = '';
  value?: number;

  constructor(private readonly tracker: MatomoTracker, private readonly title: Title) {}

  ngOnInit(): void {
    this.title.setTitle(BASE_TITLE + ' | Track any event (from component)');
  }

  doTrack(): void {
    this.tracker.trackEvent(this.category, this.action, this.name, this.value);
  }
}
