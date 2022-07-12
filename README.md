# Ngx-Matomo

Matomo (fka. Piwik) client for Angular applications

[![Angular 14](https://img.shields.io/badge/Angular-14-limegreen.svg?logo=angular)](https://angular.io/)
[![NPM latest version](https://img.shields.io/npm/v/@ngx-matomo/tracker/latest.svg?logo=npm&logoColor=fff&label=NPM+package&color=limegreen)](https://www.npmjs.com/package/@ngx-matomo/tracker)
[![build](https://github.com/EmmanuelRoux/ngx-matomo/actions/workflows/main.yml/badge.svg)](https://github.com/EmmanuelRoux/ngx-matomo/actions/workflows/main.yml)
[![CodeQL](https://github.com/EmmanuelRoux/ngx-matomo/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/EmmanuelRoux/ngx-matomo/actions/workflows/codeql-analysis.yml)
[![Coverage Status](https://coveralls.io/repos/github/EmmanuelRoux/ngx-matomo/badge.svg?branch=main)](https://coveralls.io/github/EmmanuelRoux/ngx-matomo?branch=main)
[![MIT license](https://img.shields.io/badge/License-MIT-limegreen.svg)](https://opensource.org/licenses/MIT)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-limegreen.svg?logo=prettier)](https://github.com/prettier/prettier)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-limegreen.svg)](https://github.com/semantic-release/semantic-release)

<!-- prettier-ignore-start -->

<!-- toc -->

- [Installation](#installation)
- [Usage](#usage)
  * [Tracking page views with Angular Router](#tracking-page-views-with-angular-router)
  * [Tracking page views without Angular Router](#tracking-page-views-without-angular-router)
  * [Tracking simple click events in template](#tracking-simple-click-events-in-template)
  * [Tracking any event in template](#tracking-any-event-in-template)
  * [Using other Matomo's tracking features: Ecommerce analytics, Marketing Campaigns...](#using-other-matomos-tracking-features-ecommerce-analytics-marketing-campaigns)
  * [Disable tracking in some environments](#disable-tracking-in-some-environments)
  * [Managing user consent: opt-in/opt-out for tracking & cookies](#managing-user-consent-opt-inopt-out-for-tracking--cookies)
- [Configuration reference](#configuration-reference)
- [Advanced use cases](#advanced-use-cases)
  * [Customizing script tag](#customizing-script-tag)
  * [Server-side rendering (SSR) with Angular Universal](#server-side-rendering-ssr-with-angular-universal)
  * [Scripts with pre-defined (embedded) tracker configuration (Tag Manager variable...)](#scripts-with-pre-defined-embedded-tracker-configuration-tag-manager-variable)
- [Roadmap](#roadmap)
- [Launch demo app](#launch-demo-app)

<!-- tocstop -->

<!-- prettier-ignore-end -->

## Installation

_The latest version supports Angular 14 and newer. If you need NgxMatomo for an older Angular version,
see compatibility table below._

`ng add @ngx-matomo/tracker`

This will prompt you for some information such as your Matomo's server address and site ID. You can find your site ID in
Matomo admin panel.

It will also ask if you want to enable automatic page views tracking. **This requires @angular/router to be installed.**

This command will take care of importing `NgxMatomoTrackerModule` (and `NgxMatomoRouterModule` if needed), along with
basic configuration, into your root `AppModule`. Use the `--module [module]` flag to specify a different root module.

_Note #1: If you're not using Angular CLI, [follow instructions here](docs/installation-without-cli.md) instead._

_Note #2: NgxMatomo includes Matomo's tracking script for you.
**You don't need to copy/paste the tracking code into your application.**
If for some reason you want to manually include the script tag yourself, install as described in previous sections then
follow the [instructions described here](docs/manual-installation.md)._

**Compatiblity table:**

| Angular     | NgxMatomo                                                                   | Matomo        |
| ----------- | --------------------------------------------------------------------------- | ------------- |
| 9.x to 12.x | 1.x ([docs](https://github.com/EmmanuelRoux/ngx-matomo/blob/1.x/README.md)) | Matomo 3 or 4 |
| 13.x        | 2.x ([docs](https://github.com/EmmanuelRoux/ngx-matomo/blob/2.x/README.md)) | Matomo 3 or 4 |
| 14.x        | 3.x                                                                         | Matomo 3 or 4 |

## Usage

As a general rule, either use provided directives and components in your templates, or inject `MatomoTracker` service
into your components, services... and use its methods. See next subsections for more detailed usage examples.

### Tracking page views with Angular Router

If you followed installation instructions, `NgxMatomoRouterModule` automatically tracks page views for you after each
successful Angular Router navigation event. Under the hood, it calls tracker methods such as
`trackPageView`, `setCustomUrl` and `setReferrerUrl` for you.

By default, page title is grabbed from DOM document title and page url is built from Router url. This is fully
customizable as described in following subsections.

#### Customize page title

By default, Matomo's router tracks page view _right after_ `NavigationEnd` event is emitted by Angular router and
retrieves title from Angular `Title` service. Delay is configurable with the `delay`
[configuration property](docs/configuration-reference.md#ngxmatomoroutermodule).

As of Angular 14, and as long as you don't set `delay` to `-1`, customizing page title by setting `title` property of
Angular route config is natively supported. See Angular tutorial
here: [Setting the page title](https://angular.io/guide/router#setting-the-page-title).

If you still need more customization, you can define a `MatomoRouterInterceptor`
calling `MatomoTracker.setDocumentTitle()` as detailed in
the [dedicated section below](#customize-anything-page-title-ecommerce-view).

#### Customize page url

By default, the _current_ url will be sent to Matomo. You may provide a service
to return a custom page url:

```typescript
import { PageUrlProvider, MATOMO_PAGE_URL_PROVIDER } from '@ngx-matomo/router';

@NgModule({
  // ...
  providers: [
    {
      provide: MATOMO_PAGE_URL_PROVIDER,
      useClass: MyPageUrlProvider,
    },
  ],
})
export class AppModule {}

@Injectable()
export class MyPageUrlProvider implements PageUrlProvider {
  getCurrentPageUrl(event: NavigationEnd): Observable<string> {
    return of('Whatever you want as current page url');
  }
}
```

#### Customize anything (page title, ecommerce view...)

You may hook into the tracking process right before `trackPageView` is called. To do so, declare some interceptors using
the router's configuration `interceptors` property (see [configuration reference](#configuration-reference)).

A built-in interceptor is provided to collect tracking information from Route data:

```typescript
const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: {
      matomo: {
        title: 'My Home Page Title',
      },
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
        } as MatomoECommerceView,
      },
    },
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    NgxMatomoRouterModule.forRoot({
      // Declare built-in MatomoRouteDataInterceptor
      interceptors: [MatomoRouteDataInterceptor],
    }),
  ],
})
export class AppModule {}
```

If you need custom logic to extract data, provide custom interceptor implementation:

```typescript
@NgModule({
  imports: [
    NgxMatomoRouterModule.forRoot({
      interceptors: [MySimpleInterceptor, MyAsyncInterceptor],
    }),
  ],
})
export class AppModule {}

@Injectable()
export class MySimpleInterceptor implements MatomoRouterInterceptor {
  constructor(private readonly tracker: MatomoTracker) {}

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

Alternatively, declare your interceptors providers using `MATOMO_ROUTER_INTERCEPTORS` token:

```typescript
import { MatomoRouterInterceptor, MATOMO_ROUTER_INTERCEPTORS } from '@ngx-matomo/router';

@NgModule({
  // ...
  providers: [
    {
      provide: MATOMO_ROUTER_INTERCEPTORS,
      multi: true,
      useFactory: myInterceptorFactory,
    },
  ],
})
export class AppModule {}
```

### Tracking page views without Angular Router

Call `MatomoTracker.trackPageView()` from wherever you want (typically from your _page components_). You may have to
manually call `setCustomUrl` or `setReferrerUrl`.

```typescript
import { Component, OnInit } from '@angular/core';
import { MatomoTracker } from '@ngx-matomo/tracker';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss'],
})
export class ExampleComponent implements OnInit {
  constructor(private readonly tracker: MatomoTracker) {}

  ngOnInit() {
    this.tracker.trackPageView();

    // With custom page title
    this.tracker.trackPageView('My page title');
  }
}
```

### Tracking simple click events in template

```html
<!-- Simple bindings -->
<button type="button" matomoClickCategory="myCategory" matomoClickAction="myAction">
  Example #1
</button>

<!-- You may also provide optional Matomo's name/value -->
<button
  type="button"
  matomoClickCategory="myCategory"
  matomoClickAction="myAction"
  matomoClickName="myName"
  [matomoClickValue]="42"
>
  Example #2
</button>
```

### Tracking any event in template

```html
<!-- Add 'matomoTracker' directive and set some @Input() properties -->
<input
  type="text"
  matomoTracker="change"
  matomoCategory="myCategory"
  matomoAction="myAction"
  matomoName="myName"
  [matomoValue]="myValue"
/>

<!-- You may also set multiple events to listen -->
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

<!-- You may also use $event object -->
<input
  type="text"
  matomoTracker
  #tracker="matomo"
  (change)="tracker.trackEvent('myCategory', 'myAction', $event.name, $event.value)"
/>

<!-- This directive is very flexible: you may set default values as @Input() and overwrite them in method call -->
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

### Using other Matomo's tracking features: Ecommerce analytics, Marketing Campaigns...

Other Matomo tracking features are available through `MatomoTracker` service. Please refer
to [Matomo documentation](https://fr.matomo.org/docs) for details.

```typescript
import { Component } from '@angular/core';
import { MatomoTracker } from '@ngx-matomo/tracker';

@Component({
  /* ... */
})
export class ExampleComponent {
  constructor(private readonly tracker: MatomoTracker) {}

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
`trackPageView`, so be careful when using router adapter!
You may want to look at [how to use interceptors](#customize-anything-page-title-ecommerce-view).

### Disable tracking in some environments

You may want to disable tracker in dev environments to avoid tracking some unwanted usage: local dev usage, end-to-end
tests...

To do so just set the `disabled` configuration switch:

```typescript
import { NgModule } from '@angular/core';
import { NgxMatomoTrackerModule } from '@ngx-matomo/tracker';
import { environment } from './environment';

@NgModule({
  imports: [
    // ...
    NgxMatomoTrackerModule.forRoot({
      disabled: !environment.production,
      // include here your normal Matomo config
    }),
  ],
  // ...
})
export class AppModule {}
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

## Configuration reference

[See all options here](docs/configuration-reference.md)

## Advanced use cases

### Customizing script tag

By default, Matomo's script is injected using a basic script tag looking
like `<script src="..." defer async type="text/javascript">`.

To customize this script tag, provide a custom factory function to module's `.forRoot()`:

```ts
import { createDefaultMatomoScriptElement } from '@ngx-matomo/tracker';

@NgModule({
  imports: [
    // ...
    NgxMatomoTrackerModule.forRoot(
      {
        /* your config here */
      },
      (scriptUrl: string, document: Document) => {
        // Create using default factory...
        const script = createDefaultMatomoScriptElement(scriptUrl, document);

        // ...or if you prefer do it yourself
        // const script = document.createElement('script')
        // script.url = scriptUrl;

        script.setAttribute('data-cookieconsent', 'statistics');

        return script;
      }
    ),
  ],
})
export class AppModule {}
```

If you need more advanced customization, you can directly provide your factory using `MATOMO_SCRIPT_FACTORY` injection
token.

### Server-side rendering (SSR) with Angular Universal

Ngx-matomo cannot be used server-side and automatically disables itself on non-browser platforms.

### Scripts with pre-defined (embedded) tracker configuration (Tag Manager variable...)

If your tracker configuration is embedded in JS client (e.g. from a Tag Manager _variable_), you don't have to set
yourself the `trackerUrl` and `siteId`.

During install with `ng add`, leave `serverUrl` and `siteId` blank and provide a value for `scriptUrl`.

Your configuration should look like that:

```typescript
import { NgModule } from '@angular/core';
import { NgxMatomoTrackerModule } from '@ngx-matomo/tracker';

@NgModule({
  imports: [
    NgxMatomoTrackerModule.forRoot({
      scriptUrl: 'YOUR_MATOMO_SCRIPT_URL', // your Matomo's script url
    }),
  ],
})
export class AppModule {}
```

## Roadmap

[See roadmap here](docs/roadmap.md)

## Launch demo app

1. Clone this repository
2. Update `matomoSiteId` and `matomoTrackerUrl` in `projects/demo/src/environments/environment.ts`
3. Launch the app using `npm run demo`. This will build and launch the app on `http://localhost:4200`

Note: if you can't bind to an existing Matomo server, see https://github.com/matomo-org/docker to set-up a local Matomo
instance
