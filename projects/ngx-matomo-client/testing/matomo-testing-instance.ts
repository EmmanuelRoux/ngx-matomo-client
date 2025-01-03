import { MatomoECommerceItem, MatomoInstance } from 'ngx-matomo-client/core';

/**
 * No-op implementation of {@link MatomoInstance}
 */
export class MatomoTestingInstance implements MatomoInstance {
  areCookiesEnabled(): boolean {
    return false;
  }

  getAttributionCampaignKeyword(): string {
    return '';
  }

  getAttributionCampaignName(): string {
    return '';
  }

  getAttributionInfo(): string[] {
    return [];
  }

  getAttributionReferrerTimestamp(): string {
    return '';
  }

  getAttributionReferrerUrl(): string {
    return '';
  }

  getCrossDomainLinkingUrlParameter(): string {
    return '';
  }

  getCurrentUrl(): string {
    return '';
  }

  getCustomDimension(_customDimensionId: number): string {
    return '';
  }

  getCustomPagePerformanceTiming(): string {
    return '';
  }

  getCustomVariable(_index: number, _scope: string): string {
    return '';
  }

  getEcommerceItems(): MatomoECommerceItem[] {
    return [];
  }

  getExcludedReferrers(): string[] {
    return [];
  }

  getLinkTrackingTimer(): number {
    return 0;
  }

  getMatomoUrl(): string {
    return '';
  }

  getPageViewId(): string {
    return '';
  }

  getCustomData(): unknown {
    return undefined;
  }

  getPiwikUrl(): string {
    return '';
  }

  getRememberedConsent(): number | string {
    return '';
  }

  getRememberedCookieConsent(): number | string {
    return '';
  }

  getUserId(): string {
    return '';
  }

  getVisitorId(): string {
    return '';
  }

  getVisitorInfo(): unknown[] {
    return [];
  }

  hasCookies(): boolean {
    return false;
  }

  hasRememberedConsent(): boolean {
    return false;
  }

  isConsentRequired(): boolean {
    return false;
  }

  isUserOptedOut(): boolean {
    return false;
  }
}
