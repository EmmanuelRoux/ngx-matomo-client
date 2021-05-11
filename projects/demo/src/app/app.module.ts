import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxMatomoRouterModule } from '@ngx-matomo/router';
import { NgxMatomoTrackerModule } from '@ngx-matomo/tracker';
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
