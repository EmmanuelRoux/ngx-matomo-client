# Ngx-Matomo

Matomo (fka. Piwik) client for Angular applications

---

[← return to documentation](../README.md)

## Configuration reference

### NgxMatomoTrackerModule

Configuration may be provided either in `NgxMatomoTrackerModule.forRoot(...)` or by adding a provider with injection
token:

```typescript
@NgModule({
  imports: [NgxMatomoTrackerModule],
  providers: [
    {
      provide: MATOMO_CONFIGURATION,
      useValue: {
        // ...
      } as MatomoConfiguration,
    },
  ],
})
export class AppModule {}
```

Available options :

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

### NgxMatomoRouterModule

Configuration may be provided either in `NgxMatomoRouterModule.forRoot(...)` or by adding a provider with injection
token:

```typescript
@NgModule({
  imports: [NgxMatomoRouterModule],
  providers: [
    {
      provide: MATOMO_ROUTER_CONFIGURATION,
      useValue: {
        // ...
      } as MatomoRouterConfiguration,
    },
  ],
})
export class AppModule {}
```

Available options :

| Option          | Type                                            | Default value                         | Description                                                                                                                                                                                                                                                                                                                                                                                             |
| --------------- | ----------------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| prependBaseHref | `boolean`                                       | `true`                                | Set whether the application's <i>base href</i> should be prepended to current url when tracking page views. Set it to `false` to disable this behavior.                                                                                                                                                                                                                                                 |
| trackPageTitle  | `boolean`                                       | `true`                                | Set whether to detect page title when tracking views. <br>By default, page title is automatically detected from DOM document title. <br>Note that if set to `false`, Matomo is likely to still use the initial document title for all tracked page views.                                                                                                                                               |
| delay           | `number`<br>Set to `-1` to run synchronously    | `0` (no delay but still asynchronous) | Set a delay after navigation event before page view is tracked. <br>If your document title is updated asynchronously after Router events, you may have to set a delay to correctly detect document title. <br>If set to `0`, tacking is still asynchronous. Set it to `-1` to execute tracking synchronously.<br>See also previous sections for more advanced page title customization.                 |
| exclude         | `string`, `RegExp`, `string[]` or `RegExp[]`    | `[]`                                  | Set some url patterns to exclude from page views tracking.                                                                                                                                                                                                                                                                                                                                              |
| interceptors    | array of `MatomoRouterInterceptor` constructors | `[]`                                  | Interceptors types to register. <br>For more complex scenarios, it is possible to configure any interceptor by providing token `MATOMO_ROUTER_INTERCEPTORS` as `multi` provider(s). <br><b>This option is only available in `.forRoot()` options argument; otherwise they should be provided using [`MATOMO_ROUTER_INTERCEPTORS`](../README.md#customize-anything-page-title-ecommerce-view) token.</b> |
