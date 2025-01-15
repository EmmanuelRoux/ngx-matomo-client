## [7.0.1](https://github.com/EmmanuelRoux/ngx-matomo-client/compare/v7.0.0...v7.0.1) (2025-01-15)


### Bug Fixes

* export `MATOMO_TESTING_INSTANCE` token ([81abc32](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/81abc32ec305368107347980b5982db121297569)), closes [#108](https://github.com/EmmanuelRoux/ngx-matomo-client/issues/108)

# [7.0.0](https://github.com/EmmanuelRoux/ngx-matomo-client/compare/v6.4.1...v7.0.0) (2025-01-14)


### Bug Fixes

* correctly inject legacy `MatomoRouterModule` and `NgxMatomoRouterModule` ([c2f7fda](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/c2f7fda1c2f34325a6212a8a22cdc0996902cf30)), closes [#105](https://github.com/EmmanuelRoux/ngx-matomo-client/issues/105) [#104](https://github.com/EmmanuelRoux/ngx-matomo-client/issues/104)
* correctly resolve deferred configuration when using `manual` initialization mode ([f0bb6c1](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/f0bb6c125dd76c5656117c5e3689392bad2eb7f1)), closes [#102](https://github.com/EmmanuelRoux/ngx-matomo-client/issues/102)
* prepare testing api update ([0471e41](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/0471e4168236a29d31393106de1fbaf42bf462c7))


### Features

* add compatibility with Angular 19 (#101) ([bfae2b7](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/bfae2b75aafbb8a5ae71860e4652f9e8a7f9b938)), closes [#99](https://github.com/EmmanuelRoux/ngx-matomo-client/issues/99) [#103](https://github.com/EmmanuelRoux/ngx-matomo-client/issues/103)
* add new `withPageUrlProvider` feature and allow functional-style provider ([3d002d8](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/3d002d80a48300888dc72f2a54b5481da4bd0c7a))
* allow providing Matomo in lazy-loaded components/modules (#98) ([2982fc4](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/2982fc4bd7f609538517d126a9e405271ca9fcb4)), closes [#97](https://github.com/EmmanuelRoux/ngx-matomo-client/issues/97)
* allow providing page url as promise ([5bb76a4](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/5bb76a4daf99ed6e421410686705d8e86b423019))


### Breaking changes

* Angular v19 is now required as peer dependency
* Some of your tests may be broken, you may need to provide Matomo in `TestBed` using `provideMatomoTesting()`.

### Deprecations

* `MatomoTestingTracker.setMatomoInstance` has been deprecated, provide a `MATOMO_TESTING_INSTANCE` DI token instead

## [6.4.1](https://github.com/EmmanuelRoux/ngx-matomo-client/compare/v6.4.0...v6.4.1) (2025-01-14)


### Reverts

* feat: allow providing Matomo in lazy-loaded components/modules ([#98](https://github.com/EmmanuelRoux/ngx-matomo-client/issues/98)) ([3c20676](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/3c206769524bfd50def32f4d23237c3e77af3011))
* fix: correctly resolve deferred configuration when using `manual` initialization mode ([a2ca6c4](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/a2ca6c4ce4c60003b93390c553db28d08c34be79))

# [6.4.0](https://github.com/EmmanuelRoux/ngx-matomo-client/compare/v6.3.1...v6.4.0) (2025-01-03)


### Bug Fixes

* correctly resolve deferred configuration when using `manual` initialization mode ([da82506](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/da82506d81738fd12b72b75967596e473d09951f)), closes [#102](https://github.com/EmmanuelRoux/ngx-matomo-client/issues/102)


### Features

* add `getCustomData` and `setCustomData` tracker API methods ([e76564c](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/e76564c8f0a80926063e4f670f92a5f6d9eeadc6))
* add optional _custom data_ parameter to event tracking ([0cdda40](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/0cdda4007773e1aaf308742e4a4bf4874fc89890))
* add optional _custom data_ parameter to goal tracking ([6e21b91](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/6e21b91f98bed53414b17d3c89fc4e02a354d1b4))
* add optional _custom data_ parameter to link tracking ([cfb42b1](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/cfb42b1cbc5718cdb3437ec32dd6d8a8547c305a))
* add optional _custom data_ parameter to site search tracking ([fa35f1c](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/fa35f1c21474ab107562a6a1a55e5b97c4446f76)), closes [#96](https://github.com/EmmanuelRoux/ngx-matomo-client/issues/96)
* allow providing Matomo in lazy-loaded components/modules ([#98](https://github.com/EmmanuelRoux/ngx-matomo-client/issues/98)) ([45a5a0e](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/45a5a0edef4756391e82588b97122d5f6ffa8695))

## [6.3.1](https://github.com/EmmanuelRoux/ngx-matomo-client/compare/v6.3.0...v6.3.1) (2024-09-15)


### Bug Fixes

* **router, form-analytics:** disable page tracking on server ([#94](https://github.com/EmmanuelRoux/ngx-matomo-client/issues/94)) ([229083b](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/229083b0137080f385a5fae4b8a25e0a62bda5ad))

# [6.3.0](https://github.com/EmmanuelRoux/ngx-matomo-client/compare/v6.2.0...v6.3.0) (2024-07-18)


### Features

* **core:** introduce literal type `MatomoConsentRequirement` ([e517efd](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/e517efd5f922d2393d6e27889d3043ed24171142))
* **core:** introduce literal type `MatomoInitializationBehavior` ([0cac720](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/0cac720066d6115ece75b55aded2c9b7096d8cf5))
* **router:** add functional interceptors support ([6002d77](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/6002d778b011672c2e3f598718e6d8647a28ea43))


### Deprecations

* **core:** `MatomoConsentMode` enum is deprecated, use `MatomoConsentRequirement` instead.
* **core:** `MatomoInitializationMode` enum is deprecated, use `MatomoInitializationBehavior` instead.

# [6.2.0](https://github.com/EmmanuelRoux/ngx-matomo-client/compare/v6.1.3...v6.2.0) (2024-05-28)


### Bug Fixes

* **tracker:** add default value for `acceptDoNotTrack` option ([243fc46](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/243fc46059fe964f7b54325732c3d98c8f98e6d6))
* upgrade schematics to non-deprecated module names ([946ef9f](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/946ef9f79ce62fcfe020acee0c1ef7f44a2ce7dd))


### Features

* add compatibility with Angular 18 ([7828aed](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/7828aedcfe6f682603ccccfa6eabeca5c6d7ed64)), closes [#90](https://github.com/EmmanuelRoux/ngx-matomo-client/issues/90)
* add FormAnalytics support ([ccdcfac](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/ccdcfac316dacb177fe6205d55166b4befd1bdd2))
* **router:** allow ignoring subsequent navigation to the same url ([#89](https://github.com/EmmanuelRoux/ngx-matomo-client/issues/89)) ([1cb504c](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/1cb504c9df4369557757842ca49206a511b78f66)), closes [#72](https://github.com/EmmanuelRoux/ngx-matomo-client/issues/72)
* **tracker:** add new `disableCampaignParameters` configuration option ([88258fa](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/88258fa60c143de1107be7cba181f19c84346a3a))
* **tracker:** add new `disableCampaignParameters` tracker method ([4cfda65](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/4cfda65f981e8f83c200975073048420390c304b))

## [6.1.3](https://github.com/EmmanuelRoux/ngx-matomo-client/compare/v6.1.2...v6.1.3) (2024-04-09)


### Bug Fixes

* add `Injectable` decorator to `MatomoTestingTracker` ([#86](https://github.com/EmmanuelRoux/ngx-matomo-client/issues/86)) ([5e651eb](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/5e651eb8d39f6f06aba1deb17d4962a44252675f)), closes [#85](https://github.com/EmmanuelRoux/ngx-matomo-client/issues/85)

## [6.1.2](https://github.com/EmmanuelRoux/ngx-matomo-client/compare/v6.1.1...v6.1.2) (2024-03-31)


### Bug Fixes

* fix GitHub redirection problem after renaming project ([13ed0f1](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/13ed0f176a0dc46c9c4a16ec1d6ce3dab92179a0))

## [6.1.1](https://github.com/EmmanuelRoux/ngx-matomo-client/compare/v6.1.0...v6.1.1) (2024-03-31)


### Bug Fixes

* **release:** fix publish problem with 6.1.0 release ([f9b9ba2](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/f9b9ba2bea762ef1d180d0a5dbb7bfab7546d5dd))

# [6.1.0](https://github.com/EmmanuelRoux/ngx-matomo-client/compare/v6.0.2...v6.1.0) (2024-03-31)


### Features

* provide testing implementation ([ef5d358](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/ef5d358d151a35b94769d781701ff61c313d6497))

## [6.0.2](https://github.com/EmmanuelRoux/ngx-matomo-client/compare/v6.0.1...v6.0.2) (2024-01-30)


### Bug Fixes

* **router:** retrieve Base Href from `LocationStrategy` and correctly handle nulls ([73e8442](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/73e84424688cb17970a5c4404ae3b96eef0db4a9)), closes [#82](https://github.com/EmmanuelRoux/ngx-matomo-client/issues/82)

## [6.0.1](https://github.com/EmmanuelRoux/ngx-matomo-client/compare/v6.0.0...v6.0.1) (2024-01-15)


### Bug Fixes

* **router:** fix router module constructor token declaration ([82e0aa2](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/82e0aa2acd14d87027182411b6044d3f00b52956)), closes [#79](https://github.com/EmmanuelRoux/ngx-matomo-client/issues/79)

# [6.0.0](https://github.com/EmmanuelRoux/ngx-matomo-client/compare/v5.0.4...v6.0.0) (2023-11-12)


### Bug Fixes

* `MatomoOptOutFormComponent` now waits for default server url from possibly deferred configuration ([c60b134](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/c60b1343f1e8bb10c8f239e967188bb914c10cde))


### Code Refactoring

* rename `NgxMatomoModule` to `MatomoModule` ([eb70405](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/eb70405e21b0e77dbf1e8420dd0efb1085e6b87e))
* rename `NgxMatomoRouterModule` to `MatomoRouterModule` ([8795a05](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/8795a0522752760ec9875c179267c37667d7f0ce))


### Features

* add `setPageViewId` and `getPageViewId` to tracker api ([b234a7b](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/b234a7b9f3758c777f66c31c384eb3ed23087436))
* compatibility with Matomo 5 ([35ad9e1](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/35ad9e1ee25d95eb2a355126f299786049e5f8ab))
* upgrade to Angular 17 ([9ac9a10](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/9ac9a10e3fa64893b1f316cede484388fc32d533))


### Breaking changes

* Angular v17 is now required as peer dependency

### Deprecations

* `NgxMatomoRouterModule` has been deprecated, use `MatomoRouterModule` instead
* `NgxMatomoModule` has been deprecated, use `MatomoModule` instead

## [5.0.4](https://github.com/EmmanuelRoux/ngx-matomo-client/compare/v5.0.3...v5.0.4) (2023-09-04)


### Bug Fixes

* **README:** add missing Angular 15 compatibility statement to compatibility table ([182ad2b](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/182ad2b7c9bfa8d97517cedac1702a7e5b699dfb))

## [5.0.3](https://github.com/EmmanuelRoux/ngx-matomo-client/compare/v5.0.2...v5.0.3) (2023-09-02)


### Bug Fixes

* add secondary entry points ([89f9344](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/89f9344a2b69b569c4afb9b36d74930911641a6d))


### Performance Improvements

* optimize package size ([d3be36c](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/d3be36cd6fed49e1c92aceaed12995ebd16910b2))

## [5.0.2](https://github.com/EmmanuelRoux/ngx-matomo-client/compare/v5.0.1...v5.0.2) (2023-07-25)


### Bug Fixes

* **router:** fix `NgxMatomoRouterModule` not being correctly enabled without `.forRoot()` call ([61603b6](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/61603b6758149bc6678f211bbd6053c395424cc9)), closes [#68](https://github.com/EmmanuelRoux/ngx-matomo-client/issues/68)

## [5.0.1](https://github.com/EmmanuelRoux/ngx-matomo-client/compare/v5.0.0...v5.0.1) (2023-07-03)


### Bug Fixes

* **README:** fix legacy documentation link and images size ([ef38fda](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/ef38fdae3a5e5b1d1cdb1c9ba9d3a753117b7d80))

# [5.0.0](https://github.com/EmmanuelRoux/ngx-matomo-client/compare/v4.1.0...v5.0.0) (2023-07-03)


### Bug Fixes

* **schematics:** correctly remove legacy packages during install ([5cc6a8c](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/5cc6a8c1924c07b1d597d5db0f20f69b9e93dd2a))
* **tracker:** add missing public exports ([27973ca](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/27973ca78a1f50c47a19ff819619077ec9773937))


### Code Refactoring

* merge `@ngx-matomo/router` into main package ([dca634a](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/dca634aa3d2360d64e16f483ef0df298ad0e6dee))
* rename library to `ngx-matomo-client` ([be8f65e](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/be8f65e196c20aef01293ff117ada9e59d185a1a))
* **router:** remove `MatomoRouteDataInterceptor` and `MatomoRouteInterceptorBase` constructor arguments ([5c5086d](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/5c5086dcd08d787de0e3f3257159f9d91788cbb3))
* **router:** replace `init()` method with `initialize()` for naming consistency ([f82c013](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/f82c0131df663c814c1d1e5885a01df6228a544f))
* **tracker:** rename `NgxMatomoTrackerModule` to `NgxMatomoModule` ([96c8f2e](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/96c8f2ed351a4925690c4b1349fcf6ef7a78c494))


### Features

* add new `NgModule`-free providers ([2dbe82d](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/2dbe82d2bb9c60501564c7ce39e4a6dcea5a23fe))
* **router:** allow custom key for route data lookup ([936176d](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/936176da56a84b7d427087f484352e29d374d546))
* **schematics:** support new providers-style setup ([057223a](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/057223a59f3fd185ad2f910a38632801ea4b2df7))
* **tracker, router:** add support for pseudo-clicks with `enableLinkTracking` config property ([641a255](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/641a255c3ab31b9e0fc0bb3fac9e404ae179b078))
* **tracker:** add `disableBrowserFeatureDetection` and `enableBrowserFeatureDetection` methods ([d462941](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/d462941c75a5b00a7850c17f8c8461ad5190b2a8))
* **tracker:** add `getExcludedReferrers` and `setExcludedReferrers` methods ([b725de8](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/b725de85ea7f733cca154d542a9378d7c9542f69))
* **tracker:** add `getRememberedCookieConsent` method ([7504381](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/7504381d89718f7247d314af9dede83eefd38e98))
* **tracker:** add public export for `MATOMO_DIRECTIVES` ([f0362e9](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/f0362e9542773f8ab54b79aab8ede93136908ae6))
* **tracker:** allow `inject` calls in script factory ([bb2aae0](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/bb2aae0eb3b4e29ba5d58d7c2f0dbd526890a686))
* **tracker:** allow route tracking customization using route data ([480f30e](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/480f30e931f69ed2d4a4e854da4dd573c379fc63))
* **tracker:** automatically enable or disable initial page view tracking ([eeccb3e](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/eeccb3e6a484b448fbd494716df848a0cea99210))
* **tracker:** make Matomo directives standalone ([27c2ecc](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/27c2ecc5366bd54dc61f4ec3ecb790e1ade0b0ca))


### Breaking changes

* **tracker:** Configuration option `trackAppInitialLoad` is now `true` by default, unless router feature is enabled (it previously was always `false` by default).
For applications with router enabled, nothing changes. It can still be manually configured like before.
This should not affect most applications, because tracking initial page view is not recommended when router feature is enabled.
* **router:** `MatomoRouteDataInterceptor` and `MatomoRouteInterceptorBase` constructors are now argument-less. They now require to be instantiated in an injection context instead.
* **tracker, router:** `enableLinkTracking` now don't enable pseudo-click tracking by default after each page view. This is consistent with the default Matomo behavior.
To restore previous behavior, set `enableLinkTracking` configuration property to `'enable-pseudo'`.
* Library's npm package has been renamed to `ngx-matomo-client`.
Legacy packages should not be used anymore: please migrate all imports from `@ngx-matomo/tracker` and `@ngx-matomo/router` to `ngx-matomo-client` instead.
* Package `@ngx-matomo/router` is no longer necessary.
It should be removed from your project.
  - `NgxMatomoRouterModule` is now available from the main library package
  - All your imports should be migrated and imported from the main library package

### Deprecations

* **router:** Method `MatomoRouter.init()` has been deprecated, use `MatomoRouter.initialize()` instead
* **tracker:** `NgxMatomoTrackerModule` is deprecated, use `NgxMatomoModule` instead

# [4.1.0](https://github.com/EmmanuelRoux/ngx-matomo-client/compare/v4.0.1...v4.1.0) (2023-05-03)


### Bug Fixes

* **tracker:** perform initialization checks earlier to prevent running pre-init tasks multiple times ([771e24d](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/771e24de2d447d15bcba244f37a91ab98ebf4210))


### Features

* add Angular 16 support ([c40cca8](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/c40cca802ba8948ad1343aa8b1c79d827e03c54a))
* **tracker:** add new method to enable file tracking ([b595d99](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/b595d9923b9e145a44a2480cb99481b2ea419d2a))
* **tracker:** add performance timings getter ([fc0674d](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/fc0674dc222abcf97badfba02762632b7953b3f9))

## [4.0.1](https://github.com/EmmanuelRoux/ngx-matomo-client/compare/v4.0.0...v4.0.1) (2022-11-25)


### Bug Fixes

* **tracker:** add the option to run tracking outside of angular zone ([6d26eac](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/6d26eac28b9a9341dfd269f969d151c9ccd1cc35)), closes [#60](https://github.com/EmmanuelRoux/ngx-matomo-client/issues/60)

# [4.0.0](https://github.com/EmmanuelRoux/ngx-matomo-client/compare/v3.2.0...v4.0.0) (2022-11-24)


### Features

* add Angular 15 support ([ac91861](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/ac91861291a7900118031a80a9b028b61d2c855d))


### Breaking changes

* Angular version 15 is now required as a peer dependency

# [3.2.0](https://github.com/EmmanuelRoux/ngx-matomo-client/compare/v3.1.0...v3.2.0) (2022-07-26)


### Bug Fixes

* **tracker:** add missing generic parameter constraint ([5c1e4e8](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/5c1e4e8903cbccb23e7fd351b03e2abb4500727c))
* **tracker:** add missing symbol to public api ([eb79fc0](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/eb79fc0f3383b5762c36d0ecfe608d7db6786dc7))
* **tracker:** fix custom script factory provider ([c31342b](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/c31342b9c63f2888d6507076ac83016cac20c93e)), closes [#56](https://github.com/EmmanuelRoux/ngx-matomo-client/issues/56)


### Features

* **tracker:** add setPagePerformanceTiming tracking method ([4e92fe7](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/4e92fe798a98258faa03fbb4f8f5395bbdb8ba4b))

# [3.1.0](https://github.com/EmmanuelRoux/ngx-matomo-client/compare/v3.0.0...v3.1.0) (2022-07-22)


### Bug Fixes

* **tracker:** prevent initializing Matomo more than once ([784b1de](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/784b1de06c5397820c1b5a6c185773813b06632f))


### Code Refactoring

* **tracker:** replace init() method with initialized() for naming consistency ([8e23baf](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/8e23baf6c99f9ba16cd35706fc40fe7d9de2c010))


### Features

* **tracker:** allow deferred trackers configuration ([cd51156](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/cd5115691d974e3bd08d13a9ad0a791f8b82b1ab)), closes [#31](https://github.com/EmmanuelRoux/ngx-matomo-client/issues/31) [#54](https://github.com/EmmanuelRoux/ngx-matomo-client/issues/54)


### Deprecations

* **tracker:** Method `MatomoInitializerService.init()` has been deprecated.
Use `MatomoInitializerService.initialize()` instead.

# [3.0.0](https://github.com/EmmanuelRoux/ngx-matomo-client/compare/v2.4.2...v3.0.0) (2022-06-08)


### Features

* upgrade to Angular 14 ([d80fe7d](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/d80fe7df7c371c81ddf2a1b5aecce9e1553d23c5)), closes [#47](https://github.com/EmmanuelRoux/ngx-matomo-client/issues/47)


### Breaking changes

* Angular version 14 is now required as a peer dependency

## [2.4.2](https://github.com/EmmanuelRoux/ngx-matomo-client/compare/v2.4.1...v2.4.2) (2022-05-03)


### Bug Fixes

* **tracker:** add enableJSErrorTracking as configuration option ([1586d78](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/1586d7816b0238d56221c4bc4aa0272c30ad835d))
* **tracker:** add enableJSErrorTracking tracker method ([68136d5](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/68136d5bc0d40d055b37a63778111033adf1c334)), closes [#37](https://github.com/EmmanuelRoux/ngx-matomo-client/issues/37)

## [2.4.1](https://github.com/EmmanuelRoux/ngx-matomo-client/compare/v2.4.0...v2.4.1) (2022-03-31)


### Bug Fixes

* **router:** use correct rxjs import path ([fe15b20](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/fe15b20c5ccea09d7529145ae76b6e59ee69e867)), closes [#42](https://github.com/EmmanuelRoux/ngx-matomo-client/issues/42)

# [2.4.0](https://github.com/EmmanuelRoux/ngx-matomo-client/compare/v2.3.0...v2.4.0) (2022-03-16)


### Bug Fixes

* **router:** check for invalid interceptors config ([0b6686d](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/0b6686d4fbb7031a81c94bddd99abebf6bc7ba0c))
* **router:** correctly queue concurrent tracking calls ([54882b4](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/54882b4668f1af4d04a621632a4e659328d9ef37)), closes [#33](https://github.com/EmmanuelRoux/ngx-matomo-client/issues/33)
* **router:** export missing public api symbol ([d77aba0](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/d77aba0385de19128a0cc423f16926f80376dabd))
* **router:** simplify interceptors config ([ce407dd](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/ce407ddb081c15e58d46fa9c20b5cf6f63949bca)), closes [#12](https://github.com/EmmanuelRoux/ngx-matomo-client/issues/12)
* **schematics:** use correct version in schematics ([d0c7667](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/d0c7667bbfd94d140b51261c485cd201201b3ca5))
* **tracker:** allow tracking ecommerce category page ([9e14ca5](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/9e14ca5fdd1ccc70ccdae5c69c73e7568a527417)), closes [#34](https://github.com/EmmanuelRoux/ngx-matomo-client/issues/34)
* **tracker:** make ecommerce parameters optional ([382f5dc](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/382f5dc479beef7365776d78ad54aed728abdc2b))


### Documentation

* **router:** deprecate PageTitleProvider and MATOMO_PAGE_TITLE_PROVIDER ([61db04a](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/61db04a42e4e702b74facee03bf23d810b739df9))


### Features

* **router:** add built-in route data interceptor ([dfd9409](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/dfd9409f24de18b8c8e9096c0210f8434ae5d5f7)), closes [#12](https://github.com/EmmanuelRoux/ngx-matomo-client/issues/12)
* **router:** provide base implementation for interceptors depending on ActivatedRoute ([39904e7](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/39904e7c4432878eebd1e036ea94ef0c2e71a613)), closes [#12](https://github.com/EmmanuelRoux/ngx-matomo-client/issues/12)
* **tracker:** add support for pre-defined tracker ([ee9364d](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/ee9364d5667121763765b13980b239ca8b610568)), closes [#32](https://github.com/EmmanuelRoux/ngx-matomo-client/issues/32)


### Deprecations

* **router:** Interface `PageTitleProvider` and injection token `MATOMO_PAGE_TITLE_PROVIDER` are now deprecated.
Use `MatomoRouterInterceptor` instead, for example declared in `NgxMatomoRouterModule.forRoot()`.
See documentation for details on how to configure interceptors.

# [2.4.0-next.3](https://github.com/EmmanuelRoux/ngx-matomo-client/compare/v2.4.0-next.2...v2.4.0-next.3) (2022-03-16)


### Bug Fixes

* **router:** correctly queue concurrent tracking calls ([54882b4](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/54882b4668f1af4d04a621632a4e659328d9ef37)), closes [#33](https://github.com/EmmanuelRoux/ngx-matomo-client/issues/33)


### Documentation

* **router:** deprecate PageTitleProvider and MATOMO_PAGE_TITLE_PROVIDER ([61db04a](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/61db04a42e4e702b74facee03bf23d810b739df9))


### Features

* **tracker:** add support for pre-defined tracker ([ee9364d](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/ee9364d5667121763765b13980b239ca8b610568)), closes [#32](https://github.com/EmmanuelRoux/ngx-matomo-client/issues/32)


### Deprecations

* **router:** Interface `PageTitleProvider` and injection token `MATOMO_PAGE_TITLE_PROVIDER` are now deprecated.
Use `MatomoRouterInterceptor` instead, for example declared in `NgxMatomoRouterModule.forRoot()`.
See documentation for details on how to configure interceptors.

# [2.4.0-next.2](https://github.com/EmmanuelRoux/ngx-matomo-client/compare/v2.4.0-next.1...v2.4.0-next.2) (2022-03-16)


### Bug Fixes

* **schematics:** use correct version in schematics ([d0c7667](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/d0c7667bbfd94d140b51261c485cd201201b3ca5))

# [2.4.0-next.1](https://github.com/EmmanuelRoux/ngx-matomo-client/compare/v2.3.0...v2.4.0-next.1) (2022-03-16)


### Bug Fixes

* **router:** check for invalid interceptors config ([0b6686d](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/0b6686d4fbb7031a81c94bddd99abebf6bc7ba0c))
* **router:** export missing public api symbol ([d77aba0](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/d77aba0385de19128a0cc423f16926f80376dabd))
* **router:** simplify interceptors config ([ce407dd](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/ce407ddb081c15e58d46fa9c20b5cf6f63949bca)), closes [#12](https://github.com/EmmanuelRoux/ngx-matomo-client/issues/12)
* **tracker:** allow tracking ecommerce category page ([9e14ca5](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/9e14ca5fdd1ccc70ccdae5c69c73e7568a527417)), closes [#34](https://github.com/EmmanuelRoux/ngx-matomo-client/issues/34)
* **tracker:** make ecommerce parameters optional ([382f5dc](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/382f5dc479beef7365776d78ad54aed728abdc2b))


### Features

* **router:** add built-in route data interceptor ([dfd9409](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/dfd9409f24de18b8c8e9096c0210f8434ae5d5f7)), closes [#12](https://github.com/EmmanuelRoux/ngx-matomo-client/issues/12)
* **router:** provide base implementation for interceptors depending on ActivatedRoute ([39904e7](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/39904e7c4432878eebd1e036ea94ef0c2e71a613)), closes [#12](https://github.com/EmmanuelRoux/ngx-matomo-client/issues/12)

# [2.3.0](https://github.com/EmmanuelRoux/ngx-matomo-client/compare/v2.2.1...v2.3.0) (2022-02-28)


### Bug Fixes

* **tracker:** expose missing types as public api ([52501ee](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/52501ee3d36a05afc813572cffa257e49a849268))
* add missing ng-update package-group ([e186300](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/e1863007a86a7a96eb9f90fbe2f3b8a6ba08772c))


### Features

* **router:** add router interceptor api ([9ca105c](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/9ca105cc0cd10d1dc3c6c1cfd2aba47da19ce61c))

## [2.2.1](https://github.com/EmmanuelRoux/ngx-matomo-client/compare/v2.2.0...v2.2.1) (2022-01-28)


### Bug Fixes

* **tracker:** add option to override the matomo.php suffix which is automatically appended to the trackerUrl ([bd93470](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/bd93470e478e4e90d15ded5f7c15e981de481cd8)), closes [EmmanuelRoux/ngx-matomo-client#24](https://github.com/EmmanuelRoux/ngx-matomo-client/issues/24)

# [2.2.0](https://github.com/EmmanuelRoux/ngx-matomo-client/compare/v2.1.0...v2.2.0) (2022-01-16)


### Bug Fixes

* auto-disable tracker on non-browser platforms ([4547bf9](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/4547bf92eacb61860e31124b66f0878f8fa8c45e)), closes [#23](https://github.com/EmmanuelRoux/ngx-matomo-client/issues/23)


### Features

* add support for custom script tags ([1586af4](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/1586af4fc2ee6495880466550b67f4b1294c93db)), closes [#22](https://github.com/EmmanuelRoux/ngx-matomo-client/issues/22)

# [2.1.0](https://github.com/EmmanuelRoux/ngx-matomo-client/compare/v2.0.0...v2.1.0) (2021-11-29)


### Features

* add ng-add schematics ([524cc76](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/524cc76500db587e20a40eb3e7533418d752bc24))

# [2.0.0](https://github.com/EmmanuelRoux/ngx-matomo-client/compare/v1.3.3...v2.0.0) (2021-11-22)


### Bug Fixes

* **tracker:** remove tracker initialization check ([8cc72c8](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/8cc72c85097a3179a0bb8f2f321f19dc62090e32))


### Features

* migrate to Angular 13 ([4358341](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/4358341fd5b9ae1b22a2def719799a1331674d1f))


### BREAKING CHANGES

* Angular version 13 is now required as peer dependency

# [2.0.0-next.2](https://github.com/EmmanuelRoux/ngx-matomo-client/compare/v2.0.0-next.1...v2.0.0-next.2) (2021-11-14)


### Bug Fixes

* **tracker:** remove tracker initialization check ([8cc72c8](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/8cc72c85097a3179a0bb8f2f321f19dc62090e32))

# [2.0.0-next.1](https://github.com/EmmanuelRoux/ngx-matomo-client/compare/v1.3.3...v2.0.0-next.1) (2021-11-13)


### Features

* migrate to Angular 13 ([4358341](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/4358341fd5b9ae1b22a2def719799a1331674d1f))


### BREAKING CHANGES

* Angular version 13 is now required as peer dependency

## [1.3.3](https://github.com/EmmanuelRoux/ngx-matomo-client/compare/v1.3.2...v1.3.3) (2021-09-10)


### Bug Fixes

* **tracker:** lazily check tracker initialization ([c3250ba](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/c3250badbba13bbf5c90cdf20a6cad6e9faea4f1)), closes [#15](https://github.com/EmmanuelRoux/ngx-matomo-client/issues/15)

## [1.3.2](https://github.com/EmmanuelRoux/ngx-matomo-client/compare/v1.3.1...v1.3.2) (2021-07-20)


### Bug Fixes

* **tracker:** allow auto link tracking without tracking initial page view ([df13f9f](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/df13f9f4498c03d47ac24e8331c954d5d788953c)), closes [#11](https://github.com/EmmanuelRoux/ngx-matomo-client/issues/11)

## [1.3.1](https://github.com/EmmanuelRoux/ngx-matomo-client/compare/v1.3.0...v1.3.1) (2021-06-25)


### Bug Fixes

* **tracker:** fix opt-out form parameters encoding ([f160199](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/f160199c587d7547eaa917de3bad59b9b4e248dc)), closes [#9](https://github.com/EmmanuelRoux/ngx-matomo-client/issues/9)

# [1.3.0](https://github.com/EmmanuelRoux/ngx-matomo-client/compare/v1.2.0...v1.3.0) (2021-06-09)


### Bug Fixes

* **tracker:** add missing configuration property documentation to README ([4b4ba6c](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/4b4ba6c0dae470845a085d9ece10aadffe8850f2))
* **tracker:** fix initial page load track not respecting do-not-track setting ([6f6d0ff](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/6f6d0ffe694dcd24ecf98317ba49ae624fe10b50))
* **tracker:** fix scope parameter type ([6d57154](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/6d57154a782a283e3092c4c5c6cda99964f732b6))
* **tracker:** fix setSiteId parameter type ([a1cdd9d](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/a1cdd9dc618255037535410eae0beeb3e9af5f2f))
* **tracker:** fix test case ([7c5a8cd](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/7c5a8cd884f3c812df87cc1ba28f80dbc667f91b))
* **tracker:** fix test name ([b0b2227](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/b0b2227d469606c0ded3b471c62db22bf8083b20))


### Features

* **tracker:** add addTracker method ([b72b989](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/b72b989dee85e76c980332f5a308359fb2adbebc))
* **tracker:** add configuration option for DoNotTrack ([2166ee2](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/2166ee21e03229e29ab372f16c72a48da8a008c3))
* **tracker:** add disablePerformanceTracking method ([973966e](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/973966e21a12ba84bb81e22915a9e541b26e3a40))
* **tracker:** add methods to enable/disable sendBeacon ([2a69ff5](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/2a69ff5205ac3292514741ee3e1c3e9233918f4c))
* **tracker:** add missing cross-domain linking parameter getter ([ed4b7e6](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/ed4b7e6715324b94baec9255ea717308a0d50fd9))
* **tracker:** add missing ecommerce methods ([317812e](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/317812e8b562f6c655ca28a73c7be02110eb1b20))
* **tracker:** add missing ping function ([3c9bdfd](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/3c9bdfd2e9c27017ae167d862bb5eb9447650788))
* **tracker:** add missing queue request functions ([75a9df8](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/75a9df8d3e5d089bd4fa916f194185c8dbf32fd9))
* **tracker:** add opt-out form component ([c2a03b5](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/c2a03b54e6e7360a69b36b4dd8ed727666460d5c))
* **tracker:** add setCookieSameSite method ([a27f8d6](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/a27f8d69cf60c001b3dc1c6b5befed3a5c661a2a))
* **tracker:** add setVisitorId method ([3c18822](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/3c18822a53cac45a85d8fa347c54036ae6fcbe68))
* **tracker:** add support for lazy-loaded modules ([f958a9d](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/f958a9dfa2f721f5d9fb395009a89e95bd56b98d)), closes [#7](https://github.com/EmmanuelRoux/ngx-matomo-client/issues/7)
* **tracker:** add tracking-consent support ([4f426a2](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/4f426a2df4b55573644d4e8615413c8d326a9905))
* **tracker:** set default value of enableLinkTracking parameter to false ([56578a6](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/56578a67e21436c95d80db7a913e81d973b0f1e6))

# [1.3.0-next.5](https://github.com/EmmanuelRoux/ngx-matomo-client/compare/v1.3.0-next.4...v1.3.0-next.5) (2021-06-09)


### Bug Fixes

* **tracker:** fix test name ([b0b2227](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/b0b2227d469606c0ded3b471c62db22bf8083b20))

# [1.3.0-next.4](https://github.com/EmmanuelRoux/ngx-matomo-client/compare/v1.3.0-next.3...v1.3.0-next.4) (2021-06-09)


### Features

* **tracker:** add support for lazy-loaded modules ([f958a9d](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/f958a9dfa2f721f5d9fb395009a89e95bd56b98d)), closes [#7](https://github.com/EmmanuelRoux/ngx-matomo-client/issues/7)

# [1.3.0-next.3](https://github.com/EmmanuelRoux/ngx-matomo-client/compare/v1.3.0-next.2...v1.3.0-next.3) (2021-06-08)


### Bug Fixes

* **tracker:** add missing configuration property documentation to README ([4b4ba6c](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/4b4ba6c0dae470845a085d9ece10aadffe8850f2))
* **tracker:** fix initial page load track not respecting do-not-track setting ([6f6d0ff](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/6f6d0ffe694dcd24ecf98317ba49ae624fe10b50))
* **tracker:** fix setSiteId parameter type ([a1cdd9d](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/a1cdd9dc618255037535410eae0beeb3e9af5f2f))


### Features

* **tracker:** add addTracker method ([b72b989](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/b72b989dee85e76c980332f5a308359fb2adbebc))
* **tracker:** add opt-out form component ([c2a03b5](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/c2a03b54e6e7360a69b36b4dd8ed727666460d5c))
* **tracker:** add tracking-consent support ([4f426a2](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/4f426a2df4b55573644d4e8615413c8d326a9905))

# [1.3.0-next.2](https://github.com/EmmanuelRoux/ngx-matomo-client/compare/v1.3.0-next.1...v1.3.0-next.2) (2021-06-01)


### Bug Fixes

* **tracker:** fix scope parameter type ([6d57154](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/6d57154a782a283e3092c4c5c6cda99964f732b6))


### Features

* **tracker:** add configuration option for DoNotTrack ([2166ee2](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/2166ee21e03229e29ab372f16c72a48da8a008c3))
* **tracker:** add disablePerformanceTracking method ([973966e](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/973966e21a12ba84bb81e22915a9e541b26e3a40))
* **tracker:** add missing cross-domain linking parameter getter ([ed4b7e6](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/ed4b7e6715324b94baec9255ea717308a0d50fd9))
* **tracker:** add missing ping function ([3c9bdfd](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/3c9bdfd2e9c27017ae167d862bb5eb9447650788))
* **tracker:** add missing queue request functions ([75a9df8](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/75a9df8d3e5d089bd4fa916f194185c8dbf32fd9))
* **tracker:** add setCookieSameSite method ([a27f8d6](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/a27f8d69cf60c001b3dc1c6b5befed3a5c661a2a))
* **tracker:** add setVisitorId method ([3c18822](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/3c18822a53cac45a85d8fa347c54036ae6fcbe68))
* **tracker:** set default value of enableLinkTracking parameter to false ([56578a6](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/56578a67e21436c95d80db7a913e81d973b0f1e6))

# [1.3.0-next.1](https://github.com/EmmanuelRoux/ngx-matomo-client/compare/v1.2.0...v1.3.0-next.1) (2021-06-01)


### Bug Fixes

* **tracker:** fix test case ([7c5a8cd](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/7c5a8cd884f3c812df87cc1ba28f80dbc667f91b))


### Features

* **tracker:** add methods to enable/disable sendBeacon ([2a69ff5](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/2a69ff5205ac3292514741ee3e1c3e9233918f4c))
* **tracker:** add missing ecommerce methods ([317812e](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/317812e8b562f6c655ca28a73c7be02110eb1b20))

# [1.2.0](https://github.com/EmmanuelRoux/ngx-matomo-client/compare/v1.1.0...v1.2.0) (2021-05-27)


### Features

* **tracker:** add option to disable tracking ([900c617](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/900c61729e35cc0de2779881b8dea6a09688633b)), closes [#3](https://github.com/EmmanuelRoux/ngx-matomo-client/issues/3)


### Performance Improvements

* **router:** avoid unnecessary subscription if disabled ([23cc580](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/23cc580648b2c285a861618b90d40b54554ee49a))

# [1.1.0](https://github.com/EmmanuelRoux/ngx-matomo-client/compare/v1.0.3...v1.1.0) (2021-05-25)


### Features

* migrate to Angular 12 ([db57d89](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/db57d890dbcce7dd7a607b4b68f1606412d242b5)), closes [#1](https://github.com/EmmanuelRoux/ngx-matomo-client/issues/1)

# [1.1.0-next.1](https://github.com/EmmanuelRoux/ngx-matomo-client/compare/v1.0.3...v1.1.0-next.1) (2021-05-25)


### Features

* migrate to Angular 12 ([db57d89](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/db57d890dbcce7dd7a607b4b68f1606412d242b5)), closes [#1](https://github.com/EmmanuelRoux/ngx-matomo-client/issues/1)

## [1.0.3](https://github.com/EmmanuelRoux/ngx-matomo-client/compare/v1.0.2...v1.0.3) (2021-05-05)


### Bug Fixes

* **packaging:** fix peer dependency ([2c727c4](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/2c727c4a60ad4072a9e21e0d7fd8364c1df03293))

## [1.0.3-beta.1](https://github.com/EmmanuelRoux/ngx-matomo-client/compare/v1.0.2...v1.0.3-beta.1) (2021-05-02)


### Bug Fixes

* **packaging:** fix peer dependency ([2c727c4](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/2c727c4a60ad4072a9e21e0d7fd8364c1df03293))

## [1.0.2](https://github.com/EmmanuelRoux/ngx-matomo-client/compare/v1.0.1...v1.0.2) (2021-05-02)


### Bug Fixes

* **demo:** translate text into english ([17ba193](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/17ba193a6c1f396aa133f86fe633ad64da403c46))

## [1.0.1](https://github.com/EmmanuelRoux/ngx-matomo-client/compare/v1.0.0...v1.0.1) (2021-05-01)


### Bug Fixes

* **packaging:** add npm package metadata ([64e7074](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/64e70748c601aef2023429df7adfc790aef50543))

# 1.0.0 (2021-05-01)


### Features

* initiate project ([e521701](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/e521701db78daabe8bfbf5b264afb8c6c758b67c))
* **semantic-release:** add library dist tags ([54f1a03](https://github.com/EmmanuelRoux/ngx-matomo-client/commit/54f1a033a5d180c9e514f0f30f02a77b77072c74))
