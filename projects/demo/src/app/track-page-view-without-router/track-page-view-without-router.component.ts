import { Component, OnInit } from '@angular/core';
import { MatomoTracker } from '@ngx-matomo/tracker';
import { BASE_TITLE } from '../title';

@Component({
  templateUrl: './track-page-view-without-router.component.html',
})
export class TrackPageViewWithoutRouterComponent implements OnInit {
  constructor(private readonly tracker: MatomoTracker) {}

  ngOnInit(): void {
    this.tracker.trackPageView(BASE_TITLE + ' | Manual tracking without router');
  }
}
