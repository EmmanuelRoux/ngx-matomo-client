import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TrackEventComponentComponent } from './track-event-component/track-event-component.component';
import { TrackEventTemplateComponent } from './track-event-template/track-event-template.component';
import { TrackPageViewWithoutRouterComponent } from './track-page-view-without-router/track-page-view-without-router.component';
import { TrackSimpleClickEventComponent } from './track-simple-click-event/track-simple-click-event.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'without-router',
    component: TrackPageViewWithoutRouterComponent,
  },
  {
    path: 'simple-click',
    component: TrackSimpleClickEventComponent,
  },
  {
    path: 'event-from-template',
    component: TrackEventTemplateComponent,
  },
  {
    path: 'event-from-component',
    component: TrackEventComponentComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
