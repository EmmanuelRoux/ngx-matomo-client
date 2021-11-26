# Ngx-Matomo

Matomo (fka. Piwik) client for Angular applications

---

[← return to documentation](../README.md)

Be sure to first follow instruction installation to add `@ngx-matomo/tracker` dependency.

NgxMatomo includes Matomo's tracking script for you.
**You don't need to copy/paste the tracking code into your application.**

If for some reason you want to manually include the script tag yourself, then follow the instructions below.

## Manual installation with script tag

Insert Matomo tracking code into your application
[as explained on official guide](https://developer.matomo.org/guides/tracking-javascript-guide).

In your root module, import `NgxMatomoTrackerModule` and set the configuration mode to `MANUAL`:

```typescript
import { NgModule } from '@angular/core';
import { MatomoInitializationMode, NgxMatomoTrackerModule } from '@ngx-matomo/tracker';
import { NgxMatomoRouterModule } from '@ngx-matomo/router';

@NgModule({
  // ...
  imports: [
    // ...
    NgxMatomoTrackerModule.forRoot({
      mode: MatomoInitializationMode.MANUAL,
    }),
    NgxMatomoRouterModule, // Only if you want to enable automatic page views tracking with @angular/router
  ],
  // ...
})
export class AppModule {}
```
