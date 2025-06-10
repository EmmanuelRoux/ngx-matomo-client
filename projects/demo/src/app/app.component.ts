import { Component, inject } from '@angular/core';
import { MATOMO_CONFIGURATION, MatomoConfiguration } from 'ngx-matomo-client';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatTabNav, MatTabLink, MatTabNavPanel } from '@angular/material/tabs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterLink, MatTabNav, MatTabLink, RouterLinkActive, MatTabNavPanel, RouterOutlet],
})
export class AppComponent {
  private readonly config = inject<MatomoConfiguration>(MATOMO_CONFIGURATION);

  invalid = false;

  constructor() {
    const config = this.config;

    this.invalid =
      config.siteId === 'YOUR_MATOMO_SITE_ID_HERE' || config.trackerUrl === 'YOUR_MATOMO_URL_HERE';
  }
}
