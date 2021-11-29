# [2.1.0](https://github.com/EmmanuelRoux/ngx-matomo/compare/v2.0.0...v2.1.0) (2021-11-29)


### Features

* add ng-add schematics ([524cc76](https://github.com/EmmanuelRoux/ngx-matomo/commit/524cc76500db587e20a40eb3e7533418d752bc24))

# [2.0.0](https://github.com/EmmanuelRoux/ngx-matomo/compare/v1.3.3...v2.0.0) (2021-11-22)


### Bug Fixes

* **tracker:** remove tracker initialization check ([8cc72c8](https://github.com/EmmanuelRoux/ngx-matomo/commit/8cc72c85097a3179a0bb8f2f321f19dc62090e32))


### Features

* migrate to Angular 13 ([4358341](https://github.com/EmmanuelRoux/ngx-matomo/commit/4358341fd5b9ae1b22a2def719799a1331674d1f))


### BREAKING CHANGES

* Angular version 13 is now required as peer dependency

# [2.0.0-next.2](https://github.com/EmmanuelRoux/ngx-matomo/compare/v2.0.0-next.1...v2.0.0-next.2) (2021-11-14)


### Bug Fixes

* **tracker:** remove tracker initialization check ([8cc72c8](https://github.com/EmmanuelRoux/ngx-matomo/commit/8cc72c85097a3179a0bb8f2f321f19dc62090e32))

# [2.0.0-next.1](https://github.com/EmmanuelRoux/ngx-matomo/compare/v1.3.3...v2.0.0-next.1) (2021-11-13)


### Features

* migrate to Angular 13 ([4358341](https://github.com/EmmanuelRoux/ngx-matomo/commit/4358341fd5b9ae1b22a2def719799a1331674d1f))


### BREAKING CHANGES

* Angular version 13 is now required as peer dependency

## [1.3.3](https://github.com/EmmanuelRoux/ngx-matomo/compare/v1.3.2...v1.3.3) (2021-09-10)


### Bug Fixes

* **tracker:** lazily check tracker initialization ([c3250ba](https://github.com/EmmanuelRoux/ngx-matomo/commit/c3250badbba13bbf5c90cdf20a6cad6e9faea4f1)), closes [#15](https://github.com/EmmanuelRoux/ngx-matomo/issues/15)

## [1.3.2](https://github.com/EmmanuelRoux/ngx-matomo/compare/v1.3.1...v1.3.2) (2021-07-20)


### Bug Fixes

* **tracker:** allow auto link tracking without tracking initial page view ([df13f9f](https://github.com/EmmanuelRoux/ngx-matomo/commit/df13f9f4498c03d47ac24e8331c954d5d788953c)), closes [#11](https://github.com/EmmanuelRoux/ngx-matomo/issues/11)

## [1.3.1](https://github.com/EmmanuelRoux/ngx-matomo/compare/v1.3.0...v1.3.1) (2021-06-25)


### Bug Fixes

* **tracker:** fix opt-out form parameters encoding ([f160199](https://github.com/EmmanuelRoux/ngx-matomo/commit/f160199c587d7547eaa917de3bad59b9b4e248dc)), closes [#9](https://github.com/EmmanuelRoux/ngx-matomo/issues/9)

# [1.3.0](https://github.com/EmmanuelRoux/ngx-matomo/compare/v1.2.0...v1.3.0) (2021-06-09)


### Bug Fixes

* **tracker:** add missing configuration property documentation to README ([4b4ba6c](https://github.com/EmmanuelRoux/ngx-matomo/commit/4b4ba6c0dae470845a085d9ece10aadffe8850f2))
* **tracker:** fix initial page load track not respecting do-not-track setting ([6f6d0ff](https://github.com/EmmanuelRoux/ngx-matomo/commit/6f6d0ffe694dcd24ecf98317ba49ae624fe10b50))
* **tracker:** fix scope parameter type ([6d57154](https://github.com/EmmanuelRoux/ngx-matomo/commit/6d57154a782a283e3092c4c5c6cda99964f732b6))
* **tracker:** fix setSiteId parameter type ([a1cdd9d](https://github.com/EmmanuelRoux/ngx-matomo/commit/a1cdd9dc618255037535410eae0beeb3e9af5f2f))
* **tracker:** fix test case ([7c5a8cd](https://github.com/EmmanuelRoux/ngx-matomo/commit/7c5a8cd884f3c812df87cc1ba28f80dbc667f91b))
* **tracker:** fix test name ([b0b2227](https://github.com/EmmanuelRoux/ngx-matomo/commit/b0b2227d469606c0ded3b471c62db22bf8083b20))


### Features

* **tracker:** add addTracker method ([b72b989](https://github.com/EmmanuelRoux/ngx-matomo/commit/b72b989dee85e76c980332f5a308359fb2adbebc))
* **tracker:** add configuration option for DoNotTrack ([2166ee2](https://github.com/EmmanuelRoux/ngx-matomo/commit/2166ee21e03229e29ab372f16c72a48da8a008c3))
* **tracker:** add disablePerformanceTracking method ([973966e](https://github.com/EmmanuelRoux/ngx-matomo/commit/973966e21a12ba84bb81e22915a9e541b26e3a40))
* **tracker:** add methods to enable/disable sendBeacon ([2a69ff5](https://github.com/EmmanuelRoux/ngx-matomo/commit/2a69ff5205ac3292514741ee3e1c3e9233918f4c))
* **tracker:** add missing cross-domain linking parameter getter ([ed4b7e6](https://github.com/EmmanuelRoux/ngx-matomo/commit/ed4b7e6715324b94baec9255ea717308a0d50fd9))
* **tracker:** add missing ecommerce methods ([317812e](https://github.com/EmmanuelRoux/ngx-matomo/commit/317812e8b562f6c655ca28a73c7be02110eb1b20))
* **tracker:** add missing ping function ([3c9bdfd](https://github.com/EmmanuelRoux/ngx-matomo/commit/3c9bdfd2e9c27017ae167d862bb5eb9447650788))
* **tracker:** add missing queue request functions ([75a9df8](https://github.com/EmmanuelRoux/ngx-matomo/commit/75a9df8d3e5d089bd4fa916f194185c8dbf32fd9))
* **tracker:** add opt-out form component ([c2a03b5](https://github.com/EmmanuelRoux/ngx-matomo/commit/c2a03b54e6e7360a69b36b4dd8ed727666460d5c))
* **tracker:** add setCookieSameSite method ([a27f8d6](https://github.com/EmmanuelRoux/ngx-matomo/commit/a27f8d69cf60c001b3dc1c6b5befed3a5c661a2a))
* **tracker:** add setVisitorId method ([3c18822](https://github.com/EmmanuelRoux/ngx-matomo/commit/3c18822a53cac45a85d8fa347c54036ae6fcbe68))
* **tracker:** add support for lazy-loaded modules ([f958a9d](https://github.com/EmmanuelRoux/ngx-matomo/commit/f958a9dfa2f721f5d9fb395009a89e95bd56b98d)), closes [#7](https://github.com/EmmanuelRoux/ngx-matomo/issues/7)
* **tracker:** add tracking-consent support ([4f426a2](https://github.com/EmmanuelRoux/ngx-matomo/commit/4f426a2df4b55573644d4e8615413c8d326a9905))
* **tracker:** set default value of enableLinkTracking parameter to false ([56578a6](https://github.com/EmmanuelRoux/ngx-matomo/commit/56578a67e21436c95d80db7a913e81d973b0f1e6))

# [1.3.0-next.5](https://github.com/EmmanuelRoux/ngx-matomo/compare/v1.3.0-next.4...v1.3.0-next.5) (2021-06-09)


### Bug Fixes

* **tracker:** fix test name ([b0b2227](https://github.com/EmmanuelRoux/ngx-matomo/commit/b0b2227d469606c0ded3b471c62db22bf8083b20))

# [1.3.0-next.4](https://github.com/EmmanuelRoux/ngx-matomo/compare/v1.3.0-next.3...v1.3.0-next.4) (2021-06-09)


### Features

* **tracker:** add support for lazy-loaded modules ([f958a9d](https://github.com/EmmanuelRoux/ngx-matomo/commit/f958a9dfa2f721f5d9fb395009a89e95bd56b98d)), closes [#7](https://github.com/EmmanuelRoux/ngx-matomo/issues/7)

# [1.3.0-next.3](https://github.com/EmmanuelRoux/ngx-matomo/compare/v1.3.0-next.2...v1.3.0-next.3) (2021-06-08)


### Bug Fixes

* **tracker:** add missing configuration property documentation to README ([4b4ba6c](https://github.com/EmmanuelRoux/ngx-matomo/commit/4b4ba6c0dae470845a085d9ece10aadffe8850f2))
* **tracker:** fix initial page load track not respecting do-not-track setting ([6f6d0ff](https://github.com/EmmanuelRoux/ngx-matomo/commit/6f6d0ffe694dcd24ecf98317ba49ae624fe10b50))
* **tracker:** fix setSiteId parameter type ([a1cdd9d](https://github.com/EmmanuelRoux/ngx-matomo/commit/a1cdd9dc618255037535410eae0beeb3e9af5f2f))


### Features

* **tracker:** add addTracker method ([b72b989](https://github.com/EmmanuelRoux/ngx-matomo/commit/b72b989dee85e76c980332f5a308359fb2adbebc))
* **tracker:** add opt-out form component ([c2a03b5](https://github.com/EmmanuelRoux/ngx-matomo/commit/c2a03b54e6e7360a69b36b4dd8ed727666460d5c))
* **tracker:** add tracking-consent support ([4f426a2](https://github.com/EmmanuelRoux/ngx-matomo/commit/4f426a2df4b55573644d4e8615413c8d326a9905))

# [1.3.0-next.2](https://github.com/EmmanuelRoux/ngx-matomo/compare/v1.3.0-next.1...v1.3.0-next.2) (2021-06-01)


### Bug Fixes

* **tracker:** fix scope parameter type ([6d57154](https://github.com/EmmanuelRoux/ngx-matomo/commit/6d57154a782a283e3092c4c5c6cda99964f732b6))


### Features

* **tracker:** add configuration option for DoNotTrack ([2166ee2](https://github.com/EmmanuelRoux/ngx-matomo/commit/2166ee21e03229e29ab372f16c72a48da8a008c3))
* **tracker:** add disablePerformanceTracking method ([973966e](https://github.com/EmmanuelRoux/ngx-matomo/commit/973966e21a12ba84bb81e22915a9e541b26e3a40))
* **tracker:** add missing cross-domain linking parameter getter ([ed4b7e6](https://github.com/EmmanuelRoux/ngx-matomo/commit/ed4b7e6715324b94baec9255ea717308a0d50fd9))
* **tracker:** add missing ping function ([3c9bdfd](https://github.com/EmmanuelRoux/ngx-matomo/commit/3c9bdfd2e9c27017ae167d862bb5eb9447650788))
* **tracker:** add missing queue request functions ([75a9df8](https://github.com/EmmanuelRoux/ngx-matomo/commit/75a9df8d3e5d089bd4fa916f194185c8dbf32fd9))
* **tracker:** add setCookieSameSite method ([a27f8d6](https://github.com/EmmanuelRoux/ngx-matomo/commit/a27f8d69cf60c001b3dc1c6b5befed3a5c661a2a))
* **tracker:** add setVisitorId method ([3c18822](https://github.com/EmmanuelRoux/ngx-matomo/commit/3c18822a53cac45a85d8fa347c54036ae6fcbe68))
* **tracker:** set default value of enableLinkTracking parameter to false ([56578a6](https://github.com/EmmanuelRoux/ngx-matomo/commit/56578a67e21436c95d80db7a913e81d973b0f1e6))

# [1.3.0-next.1](https://github.com/EmmanuelRoux/ngx-matomo/compare/v1.2.0...v1.3.0-next.1) (2021-06-01)


### Bug Fixes

* **tracker:** fix test case ([7c5a8cd](https://github.com/EmmanuelRoux/ngx-matomo/commit/7c5a8cd884f3c812df87cc1ba28f80dbc667f91b))


### Features

* **tracker:** add methods to enable/disable sendBeacon ([2a69ff5](https://github.com/EmmanuelRoux/ngx-matomo/commit/2a69ff5205ac3292514741ee3e1c3e9233918f4c))
* **tracker:** add missing ecommerce methods ([317812e](https://github.com/EmmanuelRoux/ngx-matomo/commit/317812e8b562f6c655ca28a73c7be02110eb1b20))

# [1.2.0](https://github.com/EmmanuelRoux/ngx-matomo/compare/v1.1.0...v1.2.0) (2021-05-27)


### Features

* **tracker:** add option to disable tracking ([900c617](https://github.com/EmmanuelRoux/ngx-matomo/commit/900c61729e35cc0de2779881b8dea6a09688633b)), closes [#3](https://github.com/EmmanuelRoux/ngx-matomo/issues/3)


### Performance Improvements

* **router:** avoid unnecessary subscription if disabled ([23cc580](https://github.com/EmmanuelRoux/ngx-matomo/commit/23cc580648b2c285a861618b90d40b54554ee49a))

# [1.1.0](https://github.com/EmmanuelRoux/ngx-matomo/compare/v1.0.3...v1.1.0) (2021-05-25)


### Features

* migrate to Angular 12 ([db57d89](https://github.com/EmmanuelRoux/ngx-matomo/commit/db57d890dbcce7dd7a607b4b68f1606412d242b5)), closes [#1](https://github.com/EmmanuelRoux/ngx-matomo/issues/1)

# [1.1.0-next.1](https://github.com/EmmanuelRoux/ngx-matomo/compare/v1.0.3...v1.1.0-next.1) (2021-05-25)


### Features

* migrate to Angular 12 ([db57d89](https://github.com/EmmanuelRoux/ngx-matomo/commit/db57d890dbcce7dd7a607b4b68f1606412d242b5)), closes [#1](https://github.com/EmmanuelRoux/ngx-matomo/issues/1)

## [1.0.3](https://github.com/EmmanuelRoux/ngx-matomo/compare/v1.0.2...v1.0.3) (2021-05-05)


### Bug Fixes

* **packaging:** fix peer dependency ([2c727c4](https://github.com/EmmanuelRoux/ngx-matomo/commit/2c727c4a60ad4072a9e21e0d7fd8364c1df03293))

## [1.0.3-beta.1](https://github.com/EmmanuelRoux/ngx-matomo/compare/v1.0.2...v1.0.3-beta.1) (2021-05-02)


### Bug Fixes

* **packaging:** fix peer dependency ([2c727c4](https://github.com/EmmanuelRoux/ngx-matomo/commit/2c727c4a60ad4072a9e21e0d7fd8364c1df03293))

## [1.0.2](https://github.com/EmmanuelRoux/ngx-matomo/compare/v1.0.1...v1.0.2) (2021-05-02)


### Bug Fixes

* **demo:** translate text into english ([17ba193](https://github.com/EmmanuelRoux/ngx-matomo/commit/17ba193a6c1f396aa133f86fe633ad64da403c46))

## [1.0.1](https://github.com/EmmanuelRoux/ngx-matomo/compare/v1.0.0...v1.0.1) (2021-05-01)


### Bug Fixes

* **packaging:** add npm package metadata ([64e7074](https://github.com/EmmanuelRoux/ngx-matomo/commit/64e70748c601aef2023429df7adfc790aef50543))

# 1.0.0 (2021-05-01)


### Features

* initiate project ([e521701](https://github.com/EmmanuelRoux/ngx-matomo/commit/e521701db78daabe8bfbf5b264afb8c6c758b67c))
* **semantic-release:** add library dist tags ([54f1a03](https://github.com/EmmanuelRoux/ngx-matomo/commit/54f1a033a5d180c9e514f0f30f02a77b77072c74))
