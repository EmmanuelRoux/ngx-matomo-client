import { Component, Inject } from '@angular/core';
import { MATOMO_CONFIGURATION, MatomoConfiguration } from 'ngx-matomo-client';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';
import { MatTabNav, MatTabLink, MatTabNavPanel } from '@angular/material/tabs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    RouterLink,
    NgIf,
    MatTabNav,
    MatTabLink,
    RouterLinkActive,
    MatTabNavPanel,
    RouterOutlet,
  ],
})
export class AppComponent {
  invalid = false;

  constructor(@Inject(MATOMO_CONFIGURATION) private readonly config: MatomoConfiguration) {
    this.invalid =
      config.siteId === 'YOUR_MATOMO_SITE_ID_HERE' || config.trackerUrl === 'YOUR_MATOMO_URL_HERE';
  }
}
