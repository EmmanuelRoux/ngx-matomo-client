import { Component, inject, Inject } from '@angular/core';
import { MATOMO_CONFIGURATION, MatomoConfiguration, MatomoTracker } from '@ngx-matomo/tracker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private readonly tracker = inject(MatomoTracker);

  invalid = false;

  constructor(@Inject(MATOMO_CONFIGURATION) private readonly config: MatomoConfiguration) {
    this.invalid =
      config.siteId === 'YOUR_MATOMO_SITE_ID_HERE' || config.trackerUrl === 'YOUR_MATOMO_URL_HERE';
  }

  giveConsent() {
    this.tracker.setCookieConsentGiven();
  }
}
