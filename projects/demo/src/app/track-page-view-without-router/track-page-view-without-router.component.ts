import { Component, OnInit } from '@angular/core';
import { MatomoTracker } from 'ngx-matomo-client';
import { BASE_TITLE } from '../title';
import { MatIcon } from '@angular/material/icon';

@Component({
  templateUrl: './track-page-view-without-router.component.html',
  imports: [MatIcon],
})
export class TrackPageViewWithoutRouterComponent implements OnInit {
  constructor(private readonly tracker: MatomoTracker) {}

  ngOnInit(): void {
    this.tracker.trackPageView(BASE_TITLE + ' | Manual tracking without router');
  }
}
