# Ngx-Matomo

Matomo (fka. Piwik) client for Angular applications

---

[← return to documentation](../README.md)

## Manual installation without Angular CLI

**You are reading documentation for version 2.x compatible with Angular 13. For other versions, please refer to [main
documentation](https://github.com/EmmanuelRoux/ngx-matomo).**

If your project is not using [Angular CLI](https://angular.io/cli/add) then you must install package then manually
import the module into your application:

Run `npm install --save @ngx-matomo/tracker@^2` or `yarn add @ngx-matomo/tracker@^2`

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

`npm install --save @ngx-matomo/router@^2` or `yarn add @ngx-matomo/router@^2`

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
