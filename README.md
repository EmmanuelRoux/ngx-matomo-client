# ngx-matomo-client&nbsp;&nbsp;—&nbsp;&nbsp;Matomo Analytics client for Angular

<h3 align="center">
  <br>
  <img src="https://github.com/EmmanuelRoux/ngx-matomo/blob/815c54b151feb69a73311ce420ddf7dcce08c573/logo-large.png" alt="matomo-logo" style="height: 24px; vertical-align: middle;" />
  <br>
</h3>

<p align="center">
  <i>
    Matomo is the Google Analytics alternative that protects your data and your customers' privacy.
    <br>
    Matomo is exempt from consent to tracking <a href="https://fr.matomo.org/blog/2021/10/matomo-exempt-from-tracking-consent-in-france/">in some countries</a> (recommended by the CNIL in France).
    <br>
    <br>
    https://matomo.org/
  </i>
  <br>
  <br>
</p>

<p align="center">
  <a href="https://angular.io/">
    <img src="https://img.shields.io/badge/Angular-16-limegreen.svg?logo=angular" alt="Angular 16">
  </a>&nbsp;
  <a href="https://www.npmjs.com/package/ngx-matomo-client">
    <img src="https://img.shields.io/npm/v/ngx-matomo-client/latest.svg?logo=npm&logoColor=fff&label=NPM+package&color=limegreen" alt="NPM latest version">
  </a>&nbsp;
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/License-MIT-limegreen.svg" alt="MIT license">
  </a>&nbsp;
  <a href="https://github.com/semantic-release/semantic-release">
    <img src="https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-limegreen.svg" alt="semantic-release">
  </a>&nbsp;
  <a href="https://www.buymeacoffee.com/emmanuelroux">
    <img src="https://img.shields.io/badge/-buy_me_a%C2%A0coffee-gray?logo=buy-me-a-coffee" alt="Sponsorship">
  </a>
</p>

<hr>

**Note: this library was previously distributed as `@ngx-matomo/tracker` and `@ngx-matomo/router` packages.
Since version 5, it is now distributed as a single package `ngx-matomo-client`.
Follow [instructions below](#migration-from-version--4-ngx-matomotracker-and-ngx-matomorouter) for how to
easily migrate.**

<hr>

**Compatibility table:**

| Angular | ngx-matomo-client | @ngx-matomo/tracker <br> @ngx-matomo/router                                                 | Matomo        |
| ------- | ----------------- | ------------------------------------------------------------------------------------------- | ------------- |
| 9 to 12 |                   | 1.x ([docs](https://github.com/EmmanuelRoux/ngx-matomo/blob/1.x/README.md))                 | Matomo 3 or 4 |
| 13      |                   | 2.x ([docs](https://github.com/EmmanuelRoux/ngx-matomo/blob/2.x/README.md))                 | Matomo 3 or 4 |
| 14      |                   | 3.x ([docs](https://github.com/EmmanuelRoux/ngx-matomo/blob/3.x/README.md))                 | Matomo 3 or 4 |
| 15      |                   | 4.x ([docs](https://github.com/EmmanuelRoux/ngx-matomo/blob/4.x/README.md))                 | Matomo 3 or 4 |
| 16      | 5.x               | 4.1+ ([docs](https://github.com/EmmanuelRoux/ngx-matomo/blob/4.x/README.md)) _(deprecated)_ | Matomo 3 or 4 |

[![build](https://github.com/EmmanuelRoux/ngx-matomo/actions/workflows/main.yml/badge.svg)](https://github.com/EmmanuelRoux/ngx-matomo/actions/workflows/main.yml)
[![CodeQL](https://github.com/EmmanuelRoux/ngx-matomo/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/EmmanuelRoux/ngx-matomo/actions/workflows/codeql-analysis.yml)
[![Coverage Status](https://coveralls.io/repos/github/EmmanuelRoux/ngx-matomo/badge.svg?branch=main)](https://coveralls.io/github/EmmanuelRoux/ngx-matomo?branch=main)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-limegreen.svg?logo=prettier)](https://github.com/prettier/prettier)

<!-- prettier-ignore-start -->

<!-- toc -->

- [Installation](#installation)
- [Usage](#usage)
  * [Tracking page views](#tracking-page-views)
  * [Adding info or customizing automatic page view tracking](#adding-info-or-customizing-automatic-page-view-tracking)
  * [Tracking events](#tracking-events)
  * [Managing user consent: opt-in/opt-out for tracking & cookies](#managing-user-consent-opt-inopt-out-for-tracking--cookies)
  * [Low-level API](#low-level-api)
- [Migration from version <= 4 (`@ngx-matomo/tracker` and `@ngx-matomo/router`)](#migration-from-version--4-ngx-matomotracker-and-ngx-matomorouter)
- [Configuration reference](#configuration-reference)
- [FAQ](#faq)
  * [How to set a page title?](#how-to-set-a-page-title)
  * [Should I include the tracking code provided by Matomo?](#should-i-include-the-tracking-code-provided-by-matomo)
  * [How to disable tracking in some environments?](#how-to-disable-tracking-in-some-environments)
  * [How can I customize the inserted script tag?](#how-can-i-customize-the-inserted-script-tag)
  * [Can I use `ngx-matomo-client` with Server-side rendering (SSR) / Angular Universal?](#can-i-use-ngx-matomo-client-with-server-side-rendering-ssr--angular-universal)
  * [Can I use `ngx-matomo-client` with Tag Manager?](#can-i-use-ngx-matomo-client-with-tag-manager)
  * [How to define configuration asynchronously? (HTTP fetch...)](#how-to-define-configuration-asynchronously-http-fetch)
- [Roadmap](#roadmap)
- [Launch demo app](#launch-demo-app)

<!-- tocstop -->

<!-- prettier-ignore-end -->

## Installation

Run `ng add ngx-matomo-client`

This will prompt you for some information such as your Matomo's server address and site ID. You can find your site ID in
Matomo admin panel.

This command will set up basic configuration into your root `AppModule` (
use `ng add ngx-matomo-client --module [module]` to specify a different root module). You can then take a look
at [configuration reference](#configuration-reference) for fine-grained set-up.

<details>
  <summary>If you're not using Angular CLI, follow these instructions instead</summary>

Run `npm install --save ngx-matomo-client` or `yarn add ngx-matomo-client` then
manually [update your application configuration](#configuration-reference).

</details>

## Usage

### Tracking page views

Enable automatic page view tracking by adding `withRouter()` feature:

```ts
@NgModule({
  providers: [
    provideMatomo(
      {}, // Your base configuration
      withRouter()
    ),
  ],
})
export class AppModule {}
```

This will track every page view (using Angular Router) with basic info such as page title and page url.

If you wish to manually track page views instead, just inject `MatomoTracker` and call `trackPageView()` or other
desired methods (`setCustomUrl`, `setReferrerUrl`...):

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { MatomoTracker } from 'ngx-matomo-client';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss'],
})
export class ExampleComponent implements OnInit {
  private readonly tracker = inject(MatomoTracker);

  ngOnInit() {
    this.tracker.trackPageView();

    // With custom page title
    this.tracker.trackPageView('My page title');
  }
}
```

### Adding info or customizing automatic page view tracking

#### Using route data

Add `withRouteData()` feature to ask `ngx-matomo-client` to read some configuration from route data under `matomo` key.

```ts
const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: {
      matomo: {
        title: 'My Home Page Title',
      } as MatomoRouteData,
    },
  },
  {
    path: 'hello',
    component: HelloComponent,
    data: {
      matomo: {
        title: 'My Home Page Title',
        ecommerce: {
          productSKU: '12345',
          productName: 'French baguette',
        },
      } as MatomoRouteData,
    },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [
    provideMatomo(
      {}, // Your base configuration
      withRouter(),
      withRouteData() // Add this feature
    ),
  ],
})
export class AppModule {}
```

#### Using custom interceptor

If you need custom logic to extract data, provide a custom interceptor implementation:

```typescript
@NgModule({
  providers: [
    provideMatomo(
      {}, // Your base configuration
      withRouter(),
      withRouterInterceptors([MySimpleInterceptor, MyAsyncInterceptor]) // Add this feature
    ),
  ],
})
export class AppModule {}

@Injectable()
export class MySimpleInterceptor implements MatomoRouterInterceptor {
  private readonly tracker = inject(MatomoTracker);

  beforePageTrack(event: NavigationEnd): void {
    this.tracker.setDocumentTitle('My title');
    this.tracker.setEcommerceView(/* ... */);
  }
}

@Injectable()
export class MyAsyncInterceptor extends MatomoRouteInterceptorBase<string> {
  constructor(private readonly tracker: MatomoTracker, router: Router) {
    super(router);
  }

  protected extractRouteData(route: ActivatedRouteSnapshot): string {
    return route.paramMap.get('productId');
  }

  protected async processRouteData(productId: string): Promise<void> {
    const product = await this.loadProductData(productId);

    this.tracker.setEcommerceView(productId, product.name);
  }
}
```

### Tracking events

You can track click events directly from your templates:

```html
<button
  type="button"
  matomoClickCategory="myCategory"
  matomoClickAction="myAction"
  matomoClickName="myName"
  [matomoClickValue]="42"
>
  Example for tracking button clicks
</button>
<!-- Inputs [matomoClickName] and [matomoClickValue] are optional -->
```

You can also track any other kind of events:

```html
<!-- Tracking "change" event on an input -->
<input
  type="text"
  matomoTracker="change"
  matomoCategory="myCategory"
  matomoAction="myAction"
  matomoName="myName"
  [matomoValue]="myValue"
/>

<!-- Tracking multiple events -->
<input
  type="text"
  [matomoTracker]="['focus', 'blur']"
  matomoCategory="myCategory"
  matomoAction="myAction"
  matomoName="myName"
/>

<!-- For advanced usage, export directive as a variable and call its 'trackEvent()' method -->
<input
  type="text"
  matomoTracker
  #tracker="matomo"
  matomoCategory="myCategory"
  matomoAction="myAction"
  matomoName="myName"
  [matomoValue]="myValue"
  (change)="tracker.trackEvent()"
/>

<!-- This directive is very flexible: you may set default values and overwrite them in method call -->
<input
  type="text"
  matomoTracker
  #tracker="matomo"
  matomoCategory="myCategory"
  matomoAction="myAction"
  (focus)="tracker.trackEvent('focus')"
  (blur)="tracker.trackEvent('blur')"
/>
```

### Managing user consent: opt-in/opt-out for tracking & cookies

Matomo supports multiple options to allow requiring user consent for tracking.

To identify whether you need to ask for any consent, you need to determine whether your lawful basis for processing
personal data is "Consent" or "Legitimate interest", or whether you can avoid collecting personal data altogether.

#### Do not track

The _do not track_ feature is supported, just set the `acceptDoNotTrack` configuration option.

Please note that _do-not-track_ setting is configured server-side! You should likely set this setting here to match you
server-side configuration. In case users opt-in for _do-not-track_:

- If set to `true` here, users will not be tracked, independently of you server-side setting.
- If set to `false` here (the default), users will be tracked depending on your server setting, **but tracking requests
  and cookies will still be created!**

[See official guide](https://fr.matomo.org/docs/privacy-how-to/#step-4-respect-donottrack-preference)

#### Consent opt-in

By default, no consent is required. To manage consent opt-in, first set dedicated configuration option `requireConsent`
to either `MatomoConsentMode.COOKIE`
or `MatomoConsentMode.TRACKING`:

- In the context of <b>tracking consent</b> no cookies will be used and no tracking request will be sent unless consent
  was given. As soon as consent was given, tracking requests will be sent and cookies will be used.
- In the context of <b>cookie consent</b> tracking requests will be always sent. However, cookies will be only used if
  consent for storing and using cookies was given by the user.

[See official guide](https://developer.matomo.org/guides/tracking-consent)

For integration with a consent opt-in form, you may want to use following `MatomoTracker` methods:

- `isConsentRequired()`
- `setConsentGiven()` / `setCookieConsentGiven()`
- `rememberConsentGiven(hoursToExpire?: number)` / `rememberCookieConsentGiven(hoursToExpire?: number)`
- `forgetConsentGiven()` / `forgetCookieConsentGiven()`
- `hasRememberedConsent()` / `areCookiesEnabled()`
- `getRememberedConsent()`

See also example below on how to create a consent form. Example below is about creating an opt-in form, but it may be
easily adapted using methods listed above.

#### Consent opt-out

To manage consent opt-out, use dedicated methods `MatomoTracker.optUserOut()` and `MatomoTracker.forgetUserOptOut()`.

A (very) simple form is provided through `<matomo-opt-out-form>` component.

For more advanced integration with a custom form, you may want to define your own component and use `MatomoTracker`
methods:

```html
<p>To opt-out, please activate the checkbox below to receive an opt-out cookie.</p>
<p>
  <label>
    <input type="checkbox" [ngModel]="optedOut$ | async" (ngModelChange)="handleChange($event)" />
    <ng-container *ngIf="optedOut$ | async; else: optedIn">
      You are currently opted out. Click here to opt in.
    </ng-container>
    <ng-template #optedIn>You are currently opted in. Click here to opt out.</ng-template>
  </label>
</p>
```

```typescript
@Component({
  selector: 'my-opt-out-form',
  templateUrl: '...',
})
export class MatomoOptOutFormComponent {
  optedOut$: Promise<boolean>;

  constructor(private readonly tracker: MatomoTracker) {
    this.optedOut$ = tracker.isUserOptedOut();
  }

  handleChange(optOut: boolean) {
    if (optOut) {
      this.tracker.optUserOut();
    } else {
      this.tracker.forgetUserOptOut();
    }

    this.optedOut$ = this.tracker.isUserOptedOut();
  }
}
```

This example is adapted from
[official guide](https://developer.matomo.org/guides/tracking-javascript-guide#optional-creating-a-custom-opt-out-form)
about how to create a custom opt-out form

### Low-level API

All Matomo tracking features are available through `MatomoTracker` service. Please refer
to [Matomo documentation](https://fr.matomo.org/docs) for details.

```typescript
import { Component, inject } from '@angular/core';
import { MatomoTracker } from 'ngx-matomo-client';

@Component({
  /* ... */
})
export class ExampleComponent {
  private readonly tracker = inject(MatomoTracker);

  myMethod() {
    // Example of using e-commerce features:
    this.tracker.setEcommerceView('product-SKU', 'My product name', 'Product category', 999);
    this.tracker.addEcommerceItem('product-SKU');
    this.tracker.trackEcommerceCartUpdate(999);
    this.tracker.trackEcommerceOrder('order-id', 999);

    // ... many more methods are available
  }
}
```

Please note that some features (such as `setEcommerceView`) must be called **before**
`trackPageView`! You may want to take a look
at [how to use interceptors](#adding-info-or-customizing-automatic-page-view-tracking).

## Migration from version <= 4 (`@ngx-matomo/tracker` and `@ngx-matomo/router`)

Starting from version 5, this library is distributed as a single package named `ngx-matomo-client` instead
of `@ngx-matomo/tracker` and `@ngx-matomo/router`.

**Run `ng add ngx-matomo-client` to migrate your code automatically.**

To manually migrate your code:

1. In your `package.json`, replace `@ngx-matomo/tracker` dependency with `ngx-matomo-client`
2. In your `package.json`, remove `@ngx-matomo/router` dependency
3. Replace all imports from `@ngx-matomo/tracker` or `@ngx-matomo/router` with imports from `ngx-matomo-client` instead.

Also, we encourage you to use the new way of providing `ngx-matomo-client` using `provideMatomo()` function instead of
importing `NgxMatomoTrackerModule` and `NgxMatomoRouterModule`.

## Configuration reference

[Find all options and features here](docs/configuration-reference.md)

## FAQ

### How to set a page title?

If automatic page view tracking is enabled, then you probably have nothing to do: the page title will be detected and
sent
to Matomo.

As of Angular 14, and as long as you don't set `withRouter({ delay: -1})`, customizing page title by setting `title`
property of Angular route config is natively supported. See Angular tutorial
here: [Setting the page title](https://angular.io/guide/router#setting-the-page-title).

If you're not using automatic page view tracking, then call `tracker.setDocumentTitle(title)`
or `tracker.trackPageView(title)`.

### Should I include the tracking code provided by Matomo?

No, by default `ngx-matomo-client` includes Matomo's tracking script for you, so **you don't need to copy/paste the
tracking code into your application**.

If you are not using the default configuration and set the initialization mode to `MatomoInitializationMode.MANUAL`,
then
you must include the tracking code
yourself [as explained on official guide](https://developer.matomo.org/guides/tracking-javascript-guide).

### How to disable tracking in some environments?

You may want to disable tracker in dev environments to avoid tracking some unwanted usage: local dev usage, end-to-end
tests...

To do so just set the `disabled` configuration switch:

```typescript
import { NgModule } from '@angular/core';
import { provideMatomo } from 'ngx-matomo-client';
import { environment } from './environment';

@NgModule({
  providers: [
    provideMatomo({
      disabled: !environment.production,
      // include here your normal Matomo config
    }),
  ],
})
export class AppModule {}
```

### How can I customize the inserted script tag?

By default, Matomo's script is injected using a basic script tag looking
like `<script src="..." defer async type="text/javascript">`.

To customize this script tag, provide a custom factory function:

```ts
import { createDefaultMatomoScriptElement } from 'ngx-matomo-client';

function myScriptFactory(scriptUrl: string, document: Document): HTMLScriptElement {
  // Create using default factory...
  const script = createDefaultMatomoScriptElement(scriptUrl, document);

  // ...or if you prefer do it yourself
  // const script = document.createElement('script')
  // script.url = scriptUrl;

  // Customize what you want
  script.setAttribute('data-cookieconsent', 'statistics');

  return script;
}

@NgModule({
  providers: [
    provideMatomo(
      { ... }, // Configuration
      withScriptFactory(myScriptFactory),
    )
  ],
})
export class AppModule {
}
```

### Can I use `ngx-matomo-client` with Server-side rendering (SSR) / Angular Universal?

`ngx-matomo-client` cannot be used server-side and automatically disables itself on non-browser platforms.

### Can I use `ngx-matomo-client` with Tag Manager?

If your tracker configuration is embedded in JS client (e.g. from a Tag Manager _variable_), you don't have to set
yourself the `trackerUrl` and `siteId`.

During install with `ng add`, leave `serverUrl` and `siteId` blank and provide a value for `scriptUrl`.

Your configuration should look like that:

```typescript
import { NgModule } from '@angular/core';
import { provideMatomo } from 'ngx-matomo-client';

@NgModule({
  providers: [
    provideMatomo({
      scriptUrl: 'YOUR_MATOMO_SCRIPT_URL', // your Matomo's script url
    }),
  ],
})
export class AppModule {}
```

### How to define configuration asynchronously? (HTTP fetch...)

In some case, you may want to load your trackers configuration asynchronously. To do so, set the configuration mode
to `AUTO_DEFERRED` and manually call `MatomoInitializerService.initializeTracker(config)` when you are ready:

```ts
@NgModule({
  providers: [
    provideMatomo({
      mode: MatomoInitializationMode.AUTO_DEFERRED,
    }),

    // Example: use an APP_INITIALIZER
    {
      provide: APP_INITIALIZER,
      useFactory: () => {
        const http = inject(HttpClient);
        const matomoInitializer = inject(MatomoInitializerService);

        return () =>
          http.get('/my-config').pipe(tap(config => matomoInitializer.initializeTracker(config)));
      },
      multi: true,
    },
  ],
})
export class AppModule {}
```

All tracking instructions before `initializeTracker` will be queued and sent only when this method is called.
**Don't forget to call it!**

If you need to asynchronously load more configuration properties, then
consider [the solution described in this issue](https://github.com/EmmanuelRoux/ngx-matomo/issues/31) instead (which has
some drawbacks, such as delaying the application startup).

_Side note: only the **trackers** configuration can be deferred, not all configuration properties.
This is required because some properties require to be set **before** any other action is tracked: for
example, `requireConsent` must be set before any other tracking call and `trackAppInitialLoad` should be set before
any navigation occurs._

## Roadmap

[See roadmap here](docs/roadmap.md)

## Launch demo app

1. Clone this repository
2. Update `matomoSiteId` and `matomoTrackerUrl` in `projects/demo/src/environments/environment.ts`
3. Launch the app using `npm run demo`. This will build and launch the app on `http://localhost:4200`

Note: if you can't bind to an existing Matomo server, see https://github.com/matomo-org/docker to set-up a local Matomo
instance
