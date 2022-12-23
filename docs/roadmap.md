# Ngx-Matomo

Matomo (fka. Piwik) client for Angular applications

---

[← return to documentation](../README.md)

## Roadmap

Described features are classified either as _short term_ on _long term_.
_Short term_ features are likely to be released in the next weeks, whereas _long term_ features are expected to arrive
in a little more weeks/months.

Don't hesitate to post issues and suggest pull requests!

### tracker

- [x] **short term:** add consent-related methods to MatomoTracker service
- [ ] **short term:** add content-tracking helpers (components, directives...) to ease content impressions/interactions
      tracking
- [ ] **long term:** split MatomoTracker service (extract global configuration methods into another service, to offer
      simpler interface for tracking features)
- [ ] **short term:** provide module using new _Angular 14 way_ of providing modules, standalone components, etc.

### router

- [x] **short term:** simplify current page details customization (url, title, ecommerce features...)
- [ ] **short term:** merge package into main package (no need to have a separate package thanks to tree-shaking in most applications)
