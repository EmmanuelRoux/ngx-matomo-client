import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'without-router',
    loadComponent: () =>
      import('./track-page-view-without-router/track-page-view-without-router.component').then(
        m => m.TrackPageViewWithoutRouterComponent,
      ),
  },
  {
    path: 'simple-click',
    loadComponent: () =>
      import('./track-simple-click-event/track-simple-click-event.component').then(
        m => m.TrackSimpleClickEventComponent,
      ),
  },
  {
    path: 'event-from-template',
    loadComponent: () =>
      import('./track-event-template/track-event-template.component').then(
        m => m.TrackEventTemplateComponent,
      ),
  },
  {
    path: 'event-from-component',
    loadComponent: () =>
      import('./track-event-component/track-event-component.component').then(
        m => m.TrackEventComponentComponent,
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
