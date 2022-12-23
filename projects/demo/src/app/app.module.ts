import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxMatomoTrackerModule, NgxMatomoRouterModule } from 'ngx-matomo-client';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { TrackEventComponentComponent } from './track-event-component/track-event-component.component';
import { TrackEventTemplateComponent } from './track-event-template/track-event-template.component';
import { TrackPageViewWithoutRouterComponent } from './track-page-view-without-router/track-page-view-without-router.component';
import { TrackSimpleClickEventComponent } from './track-simple-click-event/track-simple-click-event.component';

@NgModule({
  declarations: [
    AppComponent,
    TrackPageViewWithoutRouterComponent,
    TrackSimpleClickEventComponent,
    TrackEventTemplateComponent,
    TrackEventComponentComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    NgxMatomoTrackerModule.forRoot({
      siteId: environment.matomoSiteId,
      trackerUrl: environment.matomoTrackerUrl,
    }),
    NgxMatomoRouterModule.forRoot({
      exclude: /without-router$/,
    }),
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FlexLayoutModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
