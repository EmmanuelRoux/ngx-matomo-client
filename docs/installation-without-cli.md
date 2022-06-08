# Ngx-Matomo

Matomo (fka. Piwik) client for Angular applications

---

[← return to documentation](../README.md)

## Manual installation without Angular CLI

If your project is not using [Angular CLI](https://angular.io/cli/add) then you must install package then manually
import the module into your application:

Run `npm install --save @ngx-matomo/tracker` or `yarn add @ngx-matomo/tracker`

Then import `NgxMatomoTrackerModule` into your root module (typically `AppModule`):

```typescript
import { NgModule } from '@angular/core';
import { NgxMatomoTrackerModule } from '@ngx-matomo/tracker';

@NgModule({
  imports: [
    // ...
    NgxMatomoTrackerModule.forRoot({
      siteId: 'YOUR_MATOMO_SITE_ID', // your Matomo's site ID (find it in your Matomo's settings)
      trackerUrl: 'YOUR_MATOMO_SERVER_URL', // your matomo server root url
    }),
  ],
  // ...
})
export class AppModule {}
```

**If you use [Angular router](https://angular.io/guide/router) and want to automatically track page views**, you may
optionally install the router adapter:

`npm install --save @ngx-matomo/router` or `yarn add @ngx-matomo/router`

Then import `NgxMatomoRouterModule` into your root module:

```typescript
import { NgModule } from '@angular/core';
import { NgxMatomoTrackerModule } from '@ngx-matomo/tracker';
import { NgxMatomoRouterModule } from '@ngx-matomo/router';

@NgModule({
  imports: [
    // ...
    NgxMatomoTrackerModule.forRoot({
      siteId: 'YOUR_MATOMO_SITE_ID', // your Matomo's site ID (find it in your Matomo's settings)
      trackerUrl: 'YOUR_MATOMO_SERVER_URL', // your matomo server root url
    }),
    NgxMatomoRouterModule,
  ],
  // ...
})
export class AppModule {}
```

These are example configurations: see all options in [configuration reference](configuration-reference.md).
