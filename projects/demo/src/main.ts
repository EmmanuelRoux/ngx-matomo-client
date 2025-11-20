import { enableProdMode, importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { provideMatomo, withRouter } from 'ngx-matomo-client';
import { AppRoutingModule } from './app/app-routing.module';
import { AppComponent } from './app/app.component';

import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      FormsModule,
      AppRoutingModule,
      MatTabsModule,
      MatFormFieldModule,
      MatInputModule,
      MatButtonModule,
      MatIconModule,
    ),
    provideMatomo(
      {
        siteId: environment.matomoSiteId,
        trackerUrl: environment.matomoTrackerUrl,
      },
      withRouter({
        exclude: /without-router$/,
      }),
    ),
  ],
}).catch(err => console.error(err));
