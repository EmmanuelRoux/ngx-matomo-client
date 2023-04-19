# Ngx-Matomo

Matomo (fka. Piwik) client for Angular applications

---

[← return to documentation](../README.md)

## Configuration reference

The configuration should be provided in your application's root module providers using `provideMatomo()`:

```ts
import { NgModule } from '@angular/core';
import { provideMatomo, MatomoConfiguration } from 'ngx-matomo-client';

@NgModule({
  providers: [
    provideMatomo(
      // Options:
      {
        siteId: 42,
        trackerUrl: 'http://...',
        // Find all available MatomoConfiguration properties below
      },

      // Optionally add one or more features:
      withRouter({
        // Find all available MatomoRouterConfiguration below
      }),
      withScriptFactory(),
      withRouterInterceptors()
    ),
  ],
})
export class AppModule {}
```

### MatomoConfiguration

Used in `provideMatomo()`. Available options are:

| Option                | Type                                                                       | Default value                                                  | Description                                                                                                                                                                                              | Available in `MANUAL` mode |
| --------------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| mode                  | `MatomoInitializationMode`                                                 | `MatomoInitializationMode.AUTO`                                | Set whether tracking code should be automatically embedded or not. <br>If set to `MatomoInitializationMode.MANUAL`, some other option cannot be used.                                                    | -                          |
| siteId                | `number` or `string`                                                       | <b>required</b>, unless `trackers` is set                      | Your Matomo site id (may be found in your Matomo server's settings).                                                                                                                                     | no                         |
| trackerUrl            | `string`                                                                   | <b>required</b>, unless `trackers` is set                      | Your Matomo server url.                                                                                                                                                                                  | no                         |
| trackerUrlSuffix      | `string`                                                                   | `matomo.php`                                                   | Suffix to append to `trackerUrl`.                                                                                                                                                                        | no                         |
| trackers              | array of `{siteId: string, trackerUrl: string, trackerUrlSuffix?: string}` | <i>none</i>, required unless `siteId` and `trackerUrl` are set | A list of multiple Matomo servers. Note that tracking code will be downloaded from the FIRST tracker in the list (unless `scriptUrl` option is set). Mutually exclusive with the three previous options. | no                         |
| scriptUrl             | `string`                                                                   | tracker url suffixed with `matomo.js`                          | Url of Matomo tracker's script.                                                                                                                                                                          | no                         |
| disabled              | `boolean`                                                                  | `false`                                                        | If set to `true` then all tracking operations become no-op. Note that in this case, all getter methods will return rejected Promises.                                                                    | yes                        |
| trackAppInitialLoad   | `boolean`                                                                  | `false`                                                        | If set to `true`, will call trackPageView on application init. This should probably never be used on a routed single-page application.                                                                   | yes                        |
| enableLinkTracking    | `boolean`                                                                  | `true`                                                         | If set to `false`, disable Matomo link tracking.                                                                                                                                                         | yes                        |
| enableJSErrorTracking | `boolean`                                                                  | `false`                                                        | If set to `true`, enable JS errors tracking.                                                                                                                                                             | yes                        |
| acceptDoNotTrack      | `boolean`                                                                  | `false`                                                        | Set whether to not track users who opt out of tracking using <i>Do Not Track</i> setting                                                                                                                 | yes                        |
| requireConsent        | `MatomoConsentMode`                                                        | `MatomoConsentMode.NONE`                                       | Configure user consent requirement.                                                                                                                                                                      | yes                        |
| runOutsideAngularZone | `boolean`                                                                  | `false`                                                        | If set to `true`, will run matomo calls outside of angular's NgZone. This may help if the call causes the app to freeze.                                                                                 | yes                        |

### MatomoRouterConfiguration

Used to configure `withRouter(MatomoRouterConfiguration)` feature. Available options are:

| Option          | Type                                         | Default value                         | Description                                                                                                                                                                                                                                                                                                                                                                             |
| --------------- | -------------------------------------------- | ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| prependBaseHref | `boolean`                                    | `true`                                | Set whether the application's <i>base href</i> should be prepended to current url when tracking page views. Set it to `false` to disable this behavior.                                                                                                                                                                                                                                 |
| trackPageTitle  | `boolean`                                    | `true`                                | Set whether to detect page title when tracking views. <br>By default, page title is automatically detected from DOM document title. <br>Note that if set to `false`, Matomo is likely to still use the initial document title for all tracked page views.                                                                                                                               |
| delay           | `number`<br>Set to `-1` to run synchronously | `0` (no delay but still asynchronous) | Set a delay after navigation event before page view is tracked. <br>If your document title is updated asynchronously after Router events, you may have to set a delay to correctly detect document title. <br>If set to `0`, tacking is still asynchronous. Set it to `-1` to execute tracking synchronously.<br>See also previous sections for more advanced page title customization. |
| exclude         | `string`, `RegExp`, `string[]` or `RegExp[]` | `[]`                                  | Set some url patterns to exclude from page views tracking.                                                                                                                                                                                                                                                                                                                              |
