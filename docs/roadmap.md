# <img src="https://github.com/EmmanuelRoux/ngx-matomo-client/blob/ef38fdae3a5e5b1d1cdb1c9ba9d3a753117b7d80/logo-small.png" alt="matomo-logo" style="height: 24px; vertical-align: middle;" /> ngx-matomo-client

[← return to documentation](/README.md)

## Roadmap

Described features are classified either as _short term_ or _long term_.
_Short term_ features are likely to be released in the next weeks or months, whereas _long term_ features are expected to arrive
later.

**All contributions are appreciated! Fell free to post issues and suggest pull requests!**

Planned features:

- [ ] **short term:** add content-tracking helpers (components, directives...) to ease content impressions/interactions
      tracking
- [ ] **short term:** improve schematics to fully support `NgModule`-free set-up

Uncertain features (not planned):

- [ ] **short term** enable `withRouteData()` by default with default data key
- [ ] **long term:** split MatomoTracker service (extract global configuration methods into another service, to offer
      simpler interface for tracking features)
- [ ] **short term:** improve schematics to allow updating an existing configuration

Done:

- [x] **short term:** provide library using new _Angular 14+ way_ of providing features (module-free apps, standalone
      components, etc.)
- [x] **short term:** merge router package into main package (no need to have a separate package thanks to tree-shaking
      in most applications)
- [x] **short term:** add consent-related methods to MatomoTracker service
- [x] **short term:** simplify current page details customization (url, title, ecommerce features...)
- [x] **short term:** improve schematics to provide basic support for `NgModule`-free set-up
