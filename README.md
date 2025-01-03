<h1 align="center">
  <div><img src="https://github.com/EmmanuelRoux/ngx-matomo-client/blob/ef38fdae3a5e5b1d1cdb1c9ba9d3a753117b7d80/logo-small.png" alt="matomo-logo" style="height: 24px; vertical-align: middle;" /> ngx-matomo-client</div>
  <div>Matomo Analytics client for Angular</div>
</h1>

<p align="center">
  <a href="https://angular.io/"><img src="https://img.shields.io/badge/Angular-18-limegreen.svg?logo=angular" alt="Angular 18"></a>&nbsp;
  <a href="https://www.npmjs.com/package/ngx-matomo-client"><img src="https://img.shields.io/npm/v/ngx-matomo-client/latest.svg?logo=npm&logoColor=fff&label=NPM+package&color=limegreen" alt="NPM latest version"></a>&nbsp;
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-limegreen.svg" alt="MIT license"></a>&nbsp;
  <a href="https://github.com/semantic-release/semantic-release"><img src="https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-limegreen.svg" alt="semantic-release"></a>&nbsp;
  <a href="https://www.buymeacoffee.com/emmanuelroux"><img src="https://img.shields.io/badge/-buy_me_a%C2%A0coffee-gray?logo=buy-me-a-coffee" alt="Sponsorship"></a>
</p>

<div align="center">
  <br>
 <div><img src="https://github.com/EmmanuelRoux/ngx-matomo-client/blob/ef38fdae3a5e5b1d1cdb1c9ba9d3a753117b7d80/logo-large.png" alt="matomo-logo" style="height: 24px; vertical-align: middle;" />
 </div>
  <i>
    Matomo is the Google Analytics alternative that protects your data and your customers' privacy.
    <br>
    Matomo is exempt from consent to tracking <a href="https://fr.matomo.org/blog/2021/10/matomo-exempt-from-tracking-consent-in-france/">in some countries</a> (recommended by the CNIL in France).
    <br>
    <br>
    https://matomo.org/
  </i>
  <br>
</div>

<hr>

**Note: this library was previously distributed as `@ngx-matomo/tracker` and `@ngx-matomo/router` packages. Since
version 5, it is now distributed as a single package `ngx-matomo-client`.
Follow [instructions below](#migration-from-ngx-matomotracker-and-ngx-matomorouter-version--4) for how to
easily migrate.**

[![NPM version](https://img.shields.io/npm/v/@ngx-matomo/tracker/latest.svg?logo=npm&logoColor=fff&label=Legacy+NPM+package&color=limegreen)](https://www.npmjs.com/package/@ngx-matomo/tracker)

<hr>

**Compatibility table:**

| Matomo    | Angular | ngx-matomo-client                                                                  | @ngx-matomo/tracker <br> @ngx-matomo/router                                                       |
| --------- | ------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| 3 or 4    | 9 to 12 |                                                                                    | 1.x ([docs](https://github.com/EmmanuelRoux/ngx-matomo-client/blob/1.x/README.md))                |
| 3 or 4    | 13      |                                                                                    | 2.x ([docs](https://github.com/EmmanuelRoux/ngx-matomo-client/blob/2.x/README.md))                |
| 3 or 4    | 14      |                                                                                    | 3.x ([docs](https://github.com/EmmanuelRoux/ngx-matomo-client/blob/3.x/README.md))                |
| 3 or 4    | 15      | 5.x ([docs](https://github.com/EmmanuelRoux/ngx-matomo-client/blob/5.x/README.md)) | 4.0.x ([docs](https://github.com/EmmanuelRoux/ngx-matomo-client/blob/4.0.x/README.md))            |
| 3, 4 or 5 | 16      | 5.x ([docs](https://github.com/EmmanuelRoux/ngx-matomo-client/blob/5.x/README.md)) | 4.x ([docs](https://github.com/EmmanuelRoux/ngx-matomo-client/blob/4.x/README.md)) _(deprecated)_ |
| 3, 4 or 5 | 17      | 6.x                                                                                |                                                                                                   |
| 3, 4 or 5 | 18      | 6.2.x or above                                                                     |                                                                                                   |

[![build](https://github.com/EmmanuelRoux/ngx-matomo-client/actions/workflows/main.yml/badge.svg)](https://github.com/EmmanuelRoux/ngx-matomo-client/actions/workflows/main.yml)
[![CodeQL](https://github.com/EmmanuelRoux/ngx-matomo-client/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/EmmanuelRoux/ngx-matomo-client/actions/workflows/github-code-scanning/codeql)
[![Coverage Status](https://coveralls.io/repos/github/EmmanuelRoux/ngx-matomo-client/badge.svg?branch=main)](https://coveralls.io/github/EmmanuelRoux/ngx-matomo-client?branch=main)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-limegreen.svg?logo=prettier)](https://github.com/prettier/prettier)

<!-- prettier-ignore-start -->

<!-- toc -->

- [Installation](#installation)
- [Usage](#usage)
  * [Tracking page views](#tracking-page-views)
  * [Adding info or customizing automatic page view tracking](#adding-info-or-customizing-automatic-page-view-tracking)
  * [Tracking events](#tracking-events)
  * [Managing user consent: opt-in/opt-out for tracking & cookies](#managing-user-consent-opt-inopt-out-for-tracking--cookies)
  * [Tracker API](#tracker-api)
- [Plugins](#plugins)
  * [Form analytics](#form-analytics)
- [Migration from `@ngx-matomo/tracker` and `@ngx-matomo/router` (version <= 4)](#migration-from-ngx-matomotracker-and-ngx-matomorouter-version--4)
- [Configuration reference](#configuration-reference)
- [FAQ](#faq)
  * [How to use `ngx-matomo-client` without `@angular/router`?](#how-to-use-ngx-matomo-client-without-angularrouter)
  * [How to set page title?](#how-to-set-page-title)
  * [Should I include the tracking code provided by Matomo?](#should-i-include-the-tracking-code-provided-by-matomo)
  * [How to disable tracking in some environments?](#how-to-disable-tracking-in-some-environments)
  * [How to exclude some routes from tracking](#how-to-exclude-some-routes-from-tracking)
  * [How can I customize the inserted script tag?](#how-can-i-customize-the-inserted-script-tag)
  * [Can I use `ngx-matomo-client` with Server-side rendering (SSR) / Angular Universal?](#can-i-use-ngx-matomo-client-with-server-side-rendering-ssr--angular-universal)
  * [Can I use `ngx-matomo-client` with Tag Manager?](#can-i-use-ngx-matomo-client-with-tag-manager)
  * [How to define configuration asynchronously? (HTTP fetch...)](#how-to-define-configuration-asynchronously-http-fetch)
  * [How can I test my components which uses `MatomoTracker` or other Matomo features?](#how-can-i-test-my-components-which-uses-matomotracker-or-other-matomo-features)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Launch demo app](#launch-demo-app)

<!-- tocstop -->

<!-- prettier-ignore-end -->

## Installation

Run `ng add ngx-matomo-client`

This will prompt you for some information such as your Matomo's server address and site ID. You can find your site ID in
Matomo admin panel.

This command will set up basic configuration into your root `AppModule`
(use `ng add ngx-matomo-client --module [module]` to specify a different root module). You can then take a look
at [configuration reference](#configuration-reference) for fine-grained set-up.

<details>
  <summary>If you're not using Angular CLI, follow these instructions instead</summary>

Run `npm install --save ngx-matomo-client` or `yarn add ngx-matomo-client` then
manually import Matomo into your Angular application:

```ts
import { provideMatomo } from 'ngx-matomo-client';

await bootstrapApplication(RootComponent, {
  providers: [
    provideMatomo({
      siteId: 1,
      trackerUrl: 'http://my-matomo-instance',
    }),
  ],
});
```

Or, if you use `@NgModule`:

```ts
import { MatomoModule } from 'ngx-matomo-client';

@NgModule({
  imports: [
    MatomoModule.forRoot({
      siteId: 1,
      trackerUrl: 'http://my-matomo-instance',
    }),
  ],
})
export class AppModule {}
```

Take a look at [configuration reference](#configuration-reference) for all available configuration properties.

</details>

> **Note:** in this documentation, all code examples use imports from `ngx-matomo-client` because this is the most
> common use case.
> **If you don't have `@angular/router` in you application, you must import from `ngx-matomo-client/core` instead.**
>
> See [FAQ](#how-to-use-ngx-matomo-client-without-angularrouter) for more details.

## Usage

### Tracking page views

Enable automatic page view tracking by adding `withRouter()` feature to `provideMatomo()`:

```ts
import { provideMatomo, withRouter } from 'ngx-matomo-client';

await bootstrapApplication(RootComponent, {
  providers: [
    provideMatomo(
      {
        siteId: 1,
        trackerUrl: 'http://my-matomo-instance',
      },
      withRouter(),
    ),
  ],
});
```

<details>
  <summary>See equivalent configuration with <code>@NgModule</code></summary>

```ts
import { MatomoModule, MatomoRouterModule } from 'ngx-matomo-client';

@NgModule({
  imports: [
    MatomoModule.forRoot({
      siteId: 1,
      trackerUrl: 'http://my-matomo-instance',
    }),
    MatomoRouterModule,
  ],
})
export class AppModule {}
```

</details>

This will track every page view using Angular Router.

If you wish to manually track page views instead, inject `MatomoTracker` and call `trackPageView()` or other
desired methods (`setCustomUrl`, `setReferrerUrl`...):

```typescript
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
  }
}
```

### Adding info or customizing automatic page view tracking

By default, Matomo detects page title and url. Page title is read from Angular's `Title` service (which itself is filled with route's `'title'` key) if available, or from document title. You may override defaults as described below.

#### Using route data

1. Configure `ngx-matomo-client` to read from route data:

```ts
import { provideMatomo, withRouter, withRouteData } from 'ngx-matomo-client';

await bootstrapApplication(RootComponent, {
  providers: [
    provideMatomo(
      {
        /* ... */
      },
      withRouter(),
      withRouteData(), // Add this feature
    ),
  ],
});
```

By default, Matomo properties are looked-up at `matomo` key of Angular route data.
You may define another key by providing it as an argument to `withRouteData`:

```ts
// provideMatomo()
withRouteData('myCustomKey');

// Route data:
const routes: Routes = [
  {
    path: 'hello',
    component: HelloComponent,
    data: {
      myCustomKey: {
        ecommerce: {
          productSKU: '12345',
        },
      } as MatomoRouteData,
    },
  },
];
```

<details>
  <summary>See equivalent configuration with <code>@NgModule</code></summary>

```ts
import { MatomoModule, MatomoRouterModule, MatomoRouteDataInterceptor } from 'ngx-matomo-client';

@NgModule({
  imports: [
    MatomoModule.forRoot({
      /* ... */
    }),
    MatomoRouterModule.forRoot({
      interceptors: [MatomoRouteDataInterceptor], // Add this configuration
    }),
  ],
  providers: [
    // Optionally, define another key to look-up at:
    {
      provide: MATOMO_ROUTE_DATA_KEY,
      useValue: 'myCustomKey',
    },
  ],
})
export class AppModule {}
```

</details>

2. Then, declare route data under `matomo` key:

```ts
import { MatomoRouteData } from './route-data-interceptor';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'My home page', // <-- Matomo will use this title by default, if available
    data: {
      matomo: {
        title: 'My home page title for Matomo', // <-- You can override the title sent to Matomo
      } as MatomoRouteData,
    },
  },
  {
    path: 'hello',
    component: HelloComponent,
    title: 'My home page', // <-- Matomo will use this title if available
    data: {
      matomo: {
        ecommerce: {
          productSKU: '12345',
          productName: 'French baguette',
        },
      } as MatomoRouteData,
    },
  },

  // Data can also be retrieve asynchronously using 'resolve':
  {
    path: ':productId',
    component: ProductComponent,
    resolve: {
      matomo: async (route: ActivatedRouteSnapshot): Promise<MatomoRouteData> => {
        // Load any asynchronous data
        const product = await inject(MyProductService).loadProductData(route.params.productId);

        return {
          ecommerce: {
            productSKU: product.sku,
          },
        };
      },
    },
  },
];
```

Following properties are available:

| Property                    | Type     |
| --------------------------- | -------- |
| `title`                     | `string` |
| `ecommerce.productSKU`      | `string` |
| `ecommerce.productName`     | `string` |
| `ecommerce.productCategory` | `string` |
| `ecommerce.price`           | `number` |
| `ecommerce.quantity`        | `number` |

#### Using custom interceptor

If you need custom logic to extract data, define a custom interceptor implementation.
An interceptor may be either a _function_ or a _class_:

```ts
import {
  MatomoRouterInterceptor,
  MatomoRouterInterceptorFn,
  MatomoRouteInterceptorBase,
} from 'ngx-matomo-client';

/** A simple functional interceptor */
const myInterceptorFn: MatomoRouterInterceptorFn = (event: NavigationEnd) => {
  const tracker = inject(MatomoTracker);

  tracker.setDocumentTitle('My title');
  tracker.setEcommerceView(/* ... */);
};

/** A class interceptor must implement `MatomoRouterInterceptor` */
@Injectable()
export class MySimpleInterceptor implements MatomoRouterInterceptor {
  private readonly tracker = inject(MatomoTracker);

  beforePageTrack(event: NavigationEnd): void {
    this.tracker.setDocumentTitle('My title');
    this.tracker.setEcommerceView(/* ... */);
  }
}

/**
 * For interceptors that need access to ActivatedRouteSnapshot, you may extend
 * `MatomoRouteInterceptorBase` built-in class.
 */
@Injectable()
export class MyAsyncInterceptor extends MatomoRouteInterceptorBase<string> {
  private readonly tracker = inject(MatomoTracker);

  protected extractRouteData(route: ActivatedRouteSnapshot): string {
    return route.paramMap.get('productId');
  }

  protected async processRouteData(productId: string): Promise<void> {
    const product = await this.loadProductData(productId);

    this.tracker.setEcommerceView(productId, product.name);
  }
}
```

And provide it in your application:

```typescript
import { withRouterInterceptors, MatomoRouterInterceptor } from 'ngx-matomo-client';

await bootstrapApplication(RootComponent, {
  providers: [
    provideMatomo(
      {
        /* ... */
      },
      withRouter(),

      // Add interceptors here:
      withRouterInterceptors([myInterceptorFn, MySimpleInterceptor, MyAsyncInterceptor]),
    ),
  ],
});
```

<details>
  <summary>See equivalent configuration with <code>@NgModule</code></summary>

```ts
@NgModule({
  imports: [
    MatomoModule.forRoot({
      /* ... */
    }),
    MatomoRouterModule.forRoot({
      // Add interceptors here:
      interceptors: [myInterceptorFn, MySimpleInterceptor, MyAsyncInterceptor],
    }),
  ],
})
export class AppModule {}
```

</details>

### Tracking events

You can track click events in templates using `[matomoClickAction]` directive:

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

You can also track any kind of events using `[matomoTracker]` directive:

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

<!-- For advanced usage, you may export directive as a variable and call its 'trackEvent()' method -->
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

<!-- You may also set default values and overwrite them in method call -->
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

_**Note for standalone components users:** all `ngx-matomo-client` components and directives are standalone
and can be imported where you need them. You may also want to import all of them at once using `MATOMO_DIRECTIVES`._

### Managing user consent: opt-in/opt-out for tracking & cookies

Matomo supports multiple options to allow requiring user consent for tracking.

To identify whether you need to ask for any consent, you need to determine whether your lawful basis for processing
personal data is "Consent" or "Legitimate interest", or whether you can avoid collecting personal data altogether.

#### Do not track

_Do not track_ feature is supported, just set `acceptDoNotTrack` configuration option.

Please note that _do-not-track_ setting is also configured server-side! You should likely set this setting here to match
your server-side configuration. In case users opt-in for _do-not-track_:

- If set to `true` here, users will not be tracked, independently of you server-side setting.
- If set to `false` here (the default), users will be tracked depending on your server setting, **but tracking requests
  and cookies will still be created!**

[See official guide](https://fr.matomo.org/docs/privacy-how-to/#step-4-respect-donottrack-preference)

#### Consent opt-in

By default, no consent is required. To manage consent opt-in, first set dedicated configuration option `requireConsent` to either `'cookie'` or `'tracking'`:

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
- `getRememberedConsent()` / `getRememberedCookieConsent()`

See also example below on how to create a consent form. Example below is about creating an opt-out form, but it may be
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

### Tracker API

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

Please note that most features (such as `setEcommerceView`) must be called **before**
`trackPageView`! You may want to take a look
at [how to use interceptors](#adding-info-or-customizing-automatic-page-view-tracking).

## Plugins

### Form analytics

**Form Analytics support is currently experimental. [Please report any bugs](https://github.com/EmmanuelRoux/ngx-matomo-client/issues), and pull requests are highly appreciated!**

#### Configuration

Form analytics plugin is supported out-of-the-box. Add `withFormAnalytics()` feature to `provideMatomo()`:

```ts
import { withFormAnalytics } from 'ngx-matomo-client/form-analytics';

await bootstrapApplication(RootComponent, {
  providers: [
    provideMatomo(
      {}, // Your base configuration
      withFormAnalytics(), // Add this feature
    ),
  ],
});
```

<details>
  <summary>See equivalent configuration with <code>@NgModule</code></summary>

```ts
import { MatomoFormAnalyticsModule } from 'ngx-matomo-client/form-analytics';

@NgModule({
  imports: [
    NgxMatomoModule.forRoot({
      /* ... */
    }),
    MatomoFormAnalyticsModule,
  ],
})
export class AppModule {}
```

</details>

#### Usage

Matomo client will automatically scan for forms in your pages after each page tracking.

If some forms are dynamically added in your components on another timing, you can use `matomoTrackForm` or
`matomoTrackForms` directives to track them:

```html
<!-- Adding matomoTrackForm directive will ensure the form is always tracked -->
<form id="myForm" matomoTrackForm></form>
```

If the content of your form is dynamic, and you want to correctly track inner form controls, you will have to rescan the
form after changes:

```html
<form id="myForm" matomoTrackForm>
  <!-- Add matomoTrackFormField directive to ensure the form is tracked -->
  <input *ngIf="condition" matomoTrackFormField />
</form>
```

If a _container_ is dynamically toggled, you can track multiple descendant forms at once by using `matomoTrackForms` (note the final _s_) on the container:

```html
<div *ngIf="showFormsCondition" matomoTrackForms>
  <form id="myForm1">...</form>
  <form id="myForm2">...</form>
</div>
```

To automatically track a form submit when an element is clicked (for example a non-submit button), add `matomoTrackFormSubmit` on the button:

```html
<form id="myForm" matomoTrackForm>
  <button type="button" matomoTrackFormSubmit>Non-native submit</button>
</form>
```

You can also inject `MatomoFormAnalytics` service in your components and use low-level api directly.

See official guide at https://developer.matomo.org/guides/form-analytics.

## Migration from `@ngx-matomo/tracker` and `@ngx-matomo/router` (version <= 4)

Starting from version 5, this library is distributed as a single package named `ngx-matomo-client` instead
of `@ngx-matomo/tracker` and `@ngx-matomo/router`.

**Run `ng add ngx-matomo-client` to migrate your code automatically.**

To manually migrate your code:

1. In your `package.json`, replace `@ngx-matomo/tracker` dependency with `ngx-matomo-client`
2. In your `package.json`, remove `@ngx-matomo/router` dependency
3. Replace all imports from `@ngx-matomo/tracker` or `@ngx-matomo/router` with imports from `ngx-matomo-client` instead.

Also, feel free to use the new `NgModule`-free way of providing `ngx-matomo-client` using `provideMatomo()` function
instead of importing `NgxMatomoModule` and `NgxMatomoRouterModule`.

## Configuration reference

[Find all options and features here](docs/configuration-reference.md)

## FAQ

### How to use `ngx-matomo-client` without `@angular/router`?

If you don't have `@angular/router` in your application, you will encounter errors when declaring imports
from `ngx-matomo-client`.

**Instead, you must use imports from `ngx-matomo-client/core`.**

> This is because `ngx-matomo-client` is composed of two entry points:
>
> - `ngx-matomo-client/core` which contains core features and doesn't depend on `@angular/router`
> - `ngx-matomo-client/router` which brings router features and depends on `@angular/router`
>
> For backward compatibility reasons, the global entrypoint `ngx-matomo-client` is a shorthand that re-exports both of them (thus depending on `@angular/router`).

### How to set page title?

If automatic page view tracking is enabled, then you probably have nothing to do: the page title will be detected and
sent to Matomo.

- Customizing page title by setting `title` property of Angular route config is natively supported.
  See Angular tutorial here: [Setting the page title](https://angular.io/guide/router#setting-the-page-title).
  Please note this will not work if you set Matomo router `delay` option to `-1`.
- For more complex logic, you may also define an interceptor that will call `tracker.setDocumentTitle(title)`.
  See [dedicated section](#adding-info-or-customizing-automatic-page-view-tracking).

If you're not using automatic page view tracking, then you should manually call `tracker.setDocumentTitle(title)`
or `tracker.trackPageView(title)`.

### Should I include the tracking code provided by Matomo?

No, by default `ngx-matomo-client` includes Matomo's tracking script for you, so **you don't need to copy/paste the
tracking code into your application**.

If you are not using the default configuration and set the initialization mode to `'manual'`, then you must include the tracking code yourself [as explained on official guide](https://developer.matomo.org/guides/tracking-javascript-guide).

### How to disable tracking in some environments?

You may want to disable tracker in dev environments to avoid tracking some unwanted usage: local dev usage, end-to-end
tests...

To do so just set the `disabled` property to `true` in your main configuration:

```typescript
await bootstrapApplication(RootComponent, {
  providers: [
    provideMatomo({
      /* ... */
      disabled: !environment.production,
    }),
  ],
});
```

<details>
  <summary>See equivalent configuration with <code>@NgModule</code></summary>

```typescript
@NgModule({
  imports: [
    MatomoModule.forRoot({
      /* ... */
      disabled: !environment.production,
    }),
  ],
})
export class AppModule {}
```

</details>

### How to exclude some routes from tracking

If you are using automatic route tracking and want to ignore some routes, use
the `exclude` option of router configuration:

```ts
await bootstrapApplication(RootComponent, {
  providers: [
    provideMatomo(
      {
        /* ... */
      },
      withRouter({
        exclude: [/some-pattern$/],
      }),
    ),
  ],
});
```

<details>
  <summary>See equivalent configuration with <code>@NgModule</code></summary>

```ts
@NgModule({
  imports: [
    MatomoModule.forRoot({
      /* ... */
    }),
    MatomoRouterModule.forRoot({
      exclude: [/some-pattern$/],
    }),
  ],
})
export class AppModule {}
```

</details>

### How can I customize the inserted script tag?

By default, Matomo's script is injected using a basic script tag looking
like `<script src="..." defer async type="text/javascript">`.

To customize this script tag, define a custom script factory function:

```ts
import { createDefaultMatomoScriptElement } from 'ngx-matomo-client';

const myScriptFactory: MatomoScriptFactory = (
  scriptUrl: string,
  document: Document,
): HTMLScriptElement => {
  // Option 1: create using default built-in factory
  const script = createDefaultMatomoScriptElement(scriptUrl, document);

  // Option 2: Manually create a script element
  const script = document.createElement('script');
  script.url = scriptUrl;

  // Customize what you want
  script.setAttribute('data-cookieconsent', 'statistics');

  return script;
};
```

And provide it to your application:

```ts
import { withScriptFactory } from 'ngx-matomo-client';

await bootstrapApplication(RootComponent, {
  providers: [
    provideMatomo(
      {
        /* ... */
      },
      withScriptFactory(myScriptFactory),
    ),
  ],
});
```

<details>
  <summary>See equivalent configuration with <code>@NgModule</code></summary>

```ts
import { MATOMO_SCRIPT_FACTORY } from 'ngx-matomo-client';

@NgModule({
  imports: [
    MatomoModule.forRoot({
      /* ... */
    }),
  ],
  providers: [
    {
      provide: MATOMO_SCRIPT_FACTORY,
      useValue: myScriptFactory,
    },
  ],
})
export class AppModule {}
```

</details>

### Can I use `ngx-matomo-client` with Server-side rendering (SSR) / Angular Universal?

Yes. `ngx-matomo-client` automatically disables itself on non-browser platforms.

### Can I use `ngx-matomo-client` with Tag Manager?

Yes.

In such case, you don't have to set yourself the `trackerUrl` and `siteId`.
During install with `ng add`, leave `serverUrl` and `siteId` blank and provide a value for `scriptUrl`.

Your configuration may look like that:

```ts
import { withScriptFactory } from 'ngx-matomo-client';

await bootstrapApplication(RootComponent, {
  providers: [
    provideMatomo({
      /* ... */
      scriptUrl: 'YOUR_MATOMO_SCRIPT_URL', // your Matomo's script url
    }),
  ],
});
```

<details>
  <summary>See equivalent configuration with <code>@NgModule</code></summary>

```ts
@NgModule({
  imports: [
    MatomoModule({
      /* ... */
      scriptUrl: 'YOUR_MATOMO_SCRIPT_URL', // your Matomo's script url
    }),
  ],
})
export class AppModule {}
```

</details>

### How to define configuration asynchronously? (HTTP fetch...)

In some case, you may want to load your trackers configuration asynchronously. To do so, set the configuration mode
to `'deferred'` and manually call `MatomoInitializerService.initializeTracker(config)` when you are ready:

```ts
await bootstrapApplication(RootComponent, {
  providers: [
    provideMatomo({
      /* ... */
      mode: 'deferred',
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
});
```

<details>
  <summary>See equivalent configuration with <code>@NgModule</code></summary>

```ts
@NgModule({
  imports: [
    MatomoModule.forRoot({
      /* ... */
      mode: 'deferred',
    }),
  ],
  providers: [
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

</details>

All tracking instructions before `initializeTracker` will be queued locally and sent only when this method is called.
**Don't forget to call it!**

If you need to asynchronously load more configuration properties, then
consider [the solution described in this issue](https://github.com/EmmanuelRoux/ngx-matomo-client/issues/31) instead (which has
some drawbacks, such as delaying the whole application startup).

_Side note: only the **trackers** configuration can be deferred, not all configuration properties.
This is required because some properties require to be set **before** any other action is tracked. For
example: `requireConsent` must be set before any other tracking call, `trackAppInitialLoad` should be set before
any navigation occurs._

### How can I test my components which uses `MatomoTracker` or other Matomo features?

Matomo can be easily mocked and tested by declaring either `provideMatomoTesting()` providers or `MatomoTestingModule` in `TestBed`.

All these symbols can be imported from `ngx-matomo-client/testing`.

## Roadmap

[See roadmap here](docs/roadmap.md)

## Contributing

[See guide here](./CONTRIBUTING.md)

## Launch demo app

1. Clone this repository
2. Update `matomoSiteId` and `matomoTrackerUrl` in `projects/demo/src/environments/environment.ts`
3. Launch the app using `npm run demo`. This will build and launch the app on `http://localhost:4200`

Note: if you can't bind to an existing Matomo server, see https://github.com/matomo-org/docker to set-up a local Matomo
instance
