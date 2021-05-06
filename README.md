# Ngx-Matomo

Matomo (fka. Piwik) client for Angular applications. Compatible with Matomo 3 or 4 and Angular 9+.

[![Angular 11](https://img.shields.io/badge/Angular-11-limegreen.svg?logo=angular)](https://angular.io/)
[![NPM latest version](https://img.shields.io/npm/v/@ngx-matomo/tracker/latest.svg?logo=npm&logoColor=fff&label=NPM+package&color=limegreen)](https://www.npmjs.com/package/@ngx-matomo/tracker)
[![CircleCI](https://img.shields.io/circleci/build/github/EmmanuelRoux/ngx-matomo/main.svg?logo=circleci&logoColor=fff&label=CircleCI)](https://circleci.com/gh/EmmanuelRoux/ngx-matomo)
[![MIT license](https://img.shields.io/badge/License-MIT-limegreen.svg)](https://opensource.org/licenses/MIT)

<!-- toc -->

- [Dependencies](#dependencies)
- [Installation](#installation)
- [Setup](#setup)
  * [Basic setup](#basic-setup)
  * [Setup Angular Router integration](#setup-angular-router-integration)
  * [Setup manually with script tag](#setup-manually-with-script-tag)
- [Usage](#usage)
  * [Tracking page view (with Angular Router & NgxMatomoRouterModule)](#tracking-page-view-with-angular-router--ngxmatomoroutermodule)
  * [Tracking page view (without Angular Router)](#tracking-page-view-without-angular-router)
  * [Tracking simple click events in template](#tracking-simple-click-events-in-template)
  * [Tracking any event in template](#tracking-any-event-in-template)
  * [Tracking events from component/service](#tracking-events-from-componentservice)
  * [Using other Matomo's tracking features: Ecommerce analytics, Marketing Campaigns...](#using-other-matomos-tracking-features-ecommerce-analytics-marketing-campaigns)
- [Launch demo app](#launch-demo-app)
- [Configuration reference](#configuration-reference)
  * [NgxMatomoTrackerModule](#ngxmatomotrackermodule)
  * [NgxMatomoRouterModule](#ngxmatomoroutermodule)

<!-- tocstop -->

## Dependencies

| NgxMatomo | Angular            | Matomo server              |
| --------- | ------------------ | -------------------------- |
| latest    | 9.x / 10.x / 11.x  | Matomo 3 / Matomo 4        |

## Installation

`npm install --save @ngx-matomo/tracker`

Optionally, if you use [Angular router](https://angular.io/guide/router) and want to easily track routed components, you
may also install the NgxMatomo router adapter
([see documentation below](#tracking-page-view-with-angular-router--ngxmatomoroutermodule)):

`npm install --save @ngx-matomo/router`

## Setup

NgxMatomo is able to include Matomo's script for you. **You don't need to copy/paste the tracking code into your
application.** If you still really want to include the tracking code yourself,
[see the explanations below](#setup-manually-with-script-tag).

NgxMatomo is also able to integrate with Angular Router, so you don't need any explicit call to track page views.

### Basic setup

Add `NgxMatomoTrackerModule` module into your application:

```typescript
import {NgModule} from '@angular/core';
import {NgxMatomoTrackerModule} from '@ngx-matomo/tracker';

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
export class AppModule {
}
```

### Setup Angular Router integration

First follow steps described in the previous section. Then add `NgxMatomoRouterModule` module into your application:

```typescript
import {NgModule} from '@angular/core';
import {NgxMatomoRouterModule} from '@ngx-matomo/router';
import {NgxMatomoTrackerModule} from '@ngx-matomo/tracker';

@NgModule({
  imports: [
    // ...
    NgxMatomoTrackerModule.forRoot({
      siteId: 'YOUR_MATOMO_SITE_ID', // your Matomo's site ID (find it in your Matomo's settings)
      trackerUrl: 'YOUR_MATOMO_SERVER_URL', // your matomo server root url
    }),
    NgxMatomoRouterModule, // Add this
  ],
  // ...
})
export class AppModule {
}
```

### Setup manually with script tag

Insert Matomo tracking code into your application
[as explained here](https://developer.matomo.org/guides/tracking-javascript-guide). Tracking code looks like this:

```html
<!-- Matomo -->
<script type="text/javascript">
  var _paq = window._paq = window._paq || [];
  // _paq.push(['trackPageView']);
  // _paq.push(['enableLinkTracking']);
  (function () {
    var u = "//{$MATOMO_URL}/";
    _paq.push(['setTrackerUrl', u + 'matomo.php']);
    _paq.push(['setSiteId', {$IDSITE}]);
    var d = document, g = d.createElement('script'), s = d.getElementsByTagName('script')[0];
    g.type = 'text/javascript';
    g.async = true;
    g.src = u + 'matomo.js';
    s.parentNode.insertBefore(g, s);
  })();
</script>
<!-- End Matomo Code -->
```

Note that you should also probably remove the two instructions commented out in this example, as detailed in
the [Matomo documentation for single-page applications](https://developer.matomo.org/guides/spa-tracking).

Add `NgxMatomoTrackerModule` module into your application, specifying the `MANUAL` setup mode:

```typescript
import {NgModule} from '@angular/core';
import {MatomoInitializationMode, NgxMatomoTrackerModule} from '@ngx-matomo/tracker';

@NgModule({
  // ...
  imports: [
    // ...
    NgxMatomoTrackerModule.forRoot({
      mode: MatomoInitializationMode.MANUAL,
    }),
  ],
  // ...
})
export class AppModule {
}
```

## Usage

### Tracking page view (with Angular Router & NgxMatomoRouterModule)

NgxMatomoRouterModule automatically tracks page views for you after each successful Angular Router navigation event,
detecting current page url & title. Under the hood, it calls `trackPageView`, `setCustomUrl` and `setReferrerUrl` for
you.

By default, page title is grabbed from DOM document title and page url is built from Router url prepended with
application base href. This is fully customizable as described below. Before defining custom services, please consider
`MatomoRouterConfiguration` options.

#### Customize page title

You may provide a custom service to return current page title:

```typescript
import {PageTitleProvider, MATOMO_PAGE_TITLE_PROVIDER} from '@ngx-matomo/router';

@NgModule({
  // ...
  providers: [{
    provide: MATOMO_PAGE_TITLE_PROVIDER,
    useClass: MyPageTitleProvider,
  }],
})
export class AppModule {
}

@Injectable()
export class MyPageTitleProvider implements PageTitleProvider {

  getCurrentPageTitle(event: NavigationEnd): Observable<string> {
    return of('Whatever you want as current page title');
  }

}
```

#### Customize page url

You may provide a custom service to return current page url:

```typescript
import {PageUrlProvider, MATOMO_PAGE_URL_PROVIDER} from '@ngx-matomo/router';

@NgModule({
  // ...
  providers: [{
    provide: MATOMO_PAGE_URL_PROVIDER,
    useClass: MyPageUrlProvider,
  }],
})
export class AppModule {
}

@Injectable()
export class MyPageUrlProvider implements PageUrlProvider {

  getCurrentPageUrl(event: NavigationEnd): Observable<string> {
    return of('Whatever you want as current page url');
  }

}
```

### Tracking page view (without Angular Router)

Call `MatomoTracker.trackPageView()` from wherever you want (typically from your *page components*). You may have to
manually call `setCustomUrl` or `setReferrerUrl`.

```typescript
import {Component, OnInit} from '@angular/core';
import {MatomoTracker} from '@ngx-matomo/tracker';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss'],
})
export class ExampleComponent implements OnInit {

  constructor(private readonly tracker: MatomoTracker) { }

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

<!-- Dynamic bindings/interpolation are available as well -->
<div [matomoClickCategory]="'myCategory'" matomoClickAction="{{'myAction'}}">
  Example #2
</div>

<!-- You may also provide optional Matomo's name/value -->
<button type="button"
        matomoClickCategory="myCategory"
        matomoClickAction="myAction"
        matomoClickName="myName"
        [matomoClickValue]="42">
  Example #3
</button>
```

### Tracking any event in template

```html
<!-- Add 'matomoTracker' directive and set some @Input() properties -->
<input type="text"
       matomoTracker="change"
       matomoCategory="myCategory"
       matomoAction="myAction"
       matomoName="myName"
       [matomoValue]="myValue">

<!-- You may also set multiple events to listen -->
<input type="text"
       [matomoTracker]="['focus', 'blur']"
       matomoCategory="myCategory"
       matomoAction="myAction"
       matomoName="myName">

<!-- For advanced usage, export directive as a variable and call its 'trackEvent()' method -->
<input type="text"
       matomoTracker
       #tracker="matomo"
       matomoCategory="myCategory"
       matomoAction="myAction"
       matomoName="myName"
       [matomoValue]="myValue"
       (change)="tracker.trackEvent()">

<!-- You may also use $event object -->
<input type="text"
       matomoTracker
       #tracker="matomo"
       (change)="tracker.trackEvent('myCategory', 'myAction', $event.name, $event.value)">

<!-- This directive is very flexible: you may set default values as @Input() and overwrite them in method call -->
<input type="text"
       matomoTracker
       #tracker="matomo"
       matomoCategory="myCategory"
       matomoAction="myAction"
       (focus)="tracker.trackEvent('focus')"
       (blur)="tracker.trackEvent('blur')">
```

### Tracking events from component/service

```typescript
import {Component} from '@angular/core';
import {MatomoTracker} from '@ngx-matomo/tracker';

@Component({ /* ... */})
export class ExampleComponent {

  constructor(private readonly tracker: MatomoTracker) { }

  myMethod() {
    // Call trackEvent method
    this.tracker.trackEvent('myCategory', 'myAction');

    // With optional name & value arguments
    this.tracker.trackEvent('myCategory', 'myAction', 'name', 0);
  }

}
```

### Using other Matomo's tracking features: Ecommerce analytics, Marketing Campaigns...

Other Matomo tracking features are available through `MatomoTracker` service. Please refer
to [Matomo documentation](https://fr.matomo.org/docs) for details.

```typescript
import {Component} from '@angular/core';
import {MatomoTracker} from '@ngx-matomo/tracker';

@Component({ /* ... */})
export class ExampleComponent {

  constructor(private readonly tracker: MatomoTracker) { }

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

## Launch demo app

1. Clone this repository
2. Update `matomoSiteId` and `matomoTrackerUrl` in `projects/demo/src/environments/environment.ts`
3. Launch the app using `npm run demo`. This will build and launch the app on `http://localhost:4200`

Note: if you can't bind to an existing Matomo server, see https://github.com/matomo-org/docker to set-up a local Matomo
instance

## Configuration reference

### NgxMatomoTrackerModule

Configuration may be provided either in `NgxMatomoTrackerModule.forRoot(...)` or by adding a provider with injection
token:

```typescript
@NgModule({
  imports: [NgxMatomoTrackerModule],
  providers: [{
    provide: MATOMO_CONFIGURATION,
    useValue: {
      // ...
    } as MatomoConfiguration,
  }],
})
export class AppModule {
}
```

Available options :

```typescript
interface MatomoConfiguration {
  /**
   * Set whether tracking code should be automatically embedded or not.
   * If set to MatomoInitializationMode.MANUAL, most other option cannot be used
   *
   * Optional
   * Default: MatomoInitializationMode.AUTO
   */
  mode?: MatomoInitializationMode,

  /**
   * Your Matomo site id (may be found in your Matomo server's settings)
   *
   * Required unless "trackers" is set
   * Not available if mode is MANUAL
   */
  siteId?: number | string,

  /**
   * Your Matomo server url
   *
   * Required unless "trackers" is set
   * Not available if mode is MANUAL
   */
  trackerUrl?: string,

  /**
   * A list of multiple Matomo servers.
   * Note that tracking code will be downloaded from the FIRST tracker in the list
   *
   * Optional (mutually exclusive with the two previous options)
   * Not available if mode is MANUAL
   */
  trackers?: { siteId: number | string, trackerUrl: string }[],

  /**
   * If set to true, will call trackPageView on application init.
   * This should probably never be used on a routed single-page application.
   *
   * Optional
   * Default: false
   */
  trackAppInitialLoad?: boolean,

  /**
   * Download Matomo tracking code from another source
   *
   * Optional
   * Default is deduced from tracker url
   * Not available if mode is MANUAL
   */
  scriptUrl?: string,

}
```

### NgxMatomoRouterModule

Configuration may be provided either in `NgxMatomoRouterModule.forRoot(...)` or by adding a provider with injection
token:

```typescript
@NgModule({
  imports: [NgxMatomoRouterModule],
  providers: [{
    provide: MATOMO_ROUTER_CONFIGURATION,
    useValue: {
      // ...
    } as MatomoRouterConfiguration,
  }],
})
export class AppModule {
}
```

Available options :

```typescript
interface MatomoRouterConfiguration {

  /**
   * Set whether the application's Base Href should be prepended to current url when tracking page views.
   * Set it to false to disable this behavior.
   *
   * Optional
   * Default: true
   */
  prependBaseHref?: boolean;

  /**
   * Set whether to detect page title when tracking views.
   * By default, page title is automatically detected from DOM document title.
   * Note that if set to `false`, Matomo is likely to still use the initial
   * document title for all tracked page views.
   *
   *
   * Optional
   * Default: true
   */
  trackPageTitle?: boolean;

  /**
   * Set a delay after navigation event before page view is tracked.
   * If your document title is updated asynchronously after Router events, you may
   * have to set a delay to correctly detect document title.
   * If set to 0, tacking is still asynchronous. Set it to -1 to execute tracking synchronously
   *
   * Optional
   * Default: 0 (no delay but still asynchronous)
   *
   * See also previous sections for more advanced page title customization
   */
  delay?: number;

  /**
   * Set some url patterns to exclude from page views tracking
   *
   * Optional
   * Default: []
   */
  exclude?: string | RegExp | string[] | RegExp[];

}
```
