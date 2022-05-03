import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID } from '@angular/core';
import { INTERNAL_MATOMO_CONFIGURATION, InternalMatomoConfiguration } from './configuration';
import { initializeMatomoHolder, MatomoHolder } from './holder';
import { Getters } from './types';

declare var window: MatomoHolder;

function trimTrailingUndefinedElements<T>(array: T[]): T[] {
  const trimmed = [...array];

  while (trimmed.length > 0 && trimmed[trimmed.length - 1] === undefined) {
    trimmed.pop();
  }

  return trimmed;
}

export interface MatomoECommerceItem {
  productSKU: string;
  productName?: string;
  productCategory?: string;
  price?: number;
  quantity?: number;
}

export type MatomoECommerceItemView = Omit<MatomoECommerceItem, 'quantity'>;
export type MatomoECommerceCategoryView = Required<Pick<MatomoECommerceItem, 'productCategory'>>;
export type MatomoECommerceView = MatomoECommerceItemView | MatomoECommerceCategoryView;

function isECommerceCategoryView(
  param: string | MatomoECommerceView
): param is MatomoECommerceCategoryView {
  return (
    typeof param === 'object' && Object.keys(param).length === 1 && param.productCategory != null
  );
}

function isECommerceItemView(
  param: string | MatomoECommerceView
): param is MatomoECommerceItemView {
  return typeof param === 'object' && 'productSKU' in param;
}

/** Matomo's internal tracker instance */
export interface MatomoInstance {
  getMatomoUrl(): string;

  getCurrentUrl(): string;

  getLinkTrackingTimer(): number;

  getVisitorId(): string;

  // see https://github.com/matomo-org/matomo/blob/3cee577117ad92db739dd3f22571520207eca02e/js/piwik.js#L3306
  getVisitorInfo(): unknown[];

  /**
   *
   * @return array of getAttributionCampaignName, getAttributionCampaignKeyword, getAttributionReferrerTimestamp, getAttributionReferrerUrl
   */
  getAttributionInfo(): string[];

  getAttributionCampaignName(): string;

  getAttributionCampaignKeyword(): string;

  getAttributionReferrerTimestamp(): string;

  getAttributionReferrerUrl(): string;

  getUserId(): string;

  getCustomVariable(index: number, scope: string): string;

  getCustomDimension(customDimensionId: number): string;

  getEcommerceItems(): MatomoECommerceItem[];

  hasCookies(): boolean;

  getCrossDomainLinkingUrlParameter(): string;

  hasRememberedConsent(): boolean;

  getRememberedConsent(): number | string;

  isConsentRequired(): boolean;

  areCookiesEnabled(): boolean;

  isUserOptedOut(): boolean;
}

export function createMatomoTracker(
  config: InternalMatomoConfiguration,
  platformId: Object
): MatomoTracker {
  return config.disabled || !isPlatformBrowser(platformId)
    ? new NoopMatomoTracker()
    : new StandardMatomoTracker();
}

@Injectable({
  providedIn: 'root',
  useFactory: createMatomoTracker,
  deps: [INTERNAL_MATOMO_CONFIGURATION, PLATFORM_ID],
})
export abstract class MatomoTracker {
  /**
   * Logs a visit to this page.
   *
   * @param [customTitle] Optional title of the visited page.
   */
  trackPageView(customTitle?: string): void {
    this.push(['trackPageView', customTitle]);
  }

  /**
   * Logs an event with an event category (Videos, Music, Games…), an event action (Play, Pause, Duration,
   * Add Playlist, Downloaded, Clicked…), and an optional event name and optional numeric value.
   *
   * @param category Category of the event.
   * @param action Action of the event.
   * @param [name] Optional name of the event.
   * @param [value] Optional value for the event.
   */
  trackEvent(category: string, action: string, name?: string, value?: number): void {
    this.push(['trackEvent', category, action, name, value]);
  }

  /**
   * Logs an internal site search for a specific keyword, in an optional category,
   * specifying the optional count of search results in the page.
   *
   * @param keyword Keywords of the search query.
   * @param [category] Optional category of the search query.
   * @param [resultsCount] Optional number of results returned by the search query.
   */
  trackSiteSearch(keyword: string, category?: string, resultsCount?: number): void {
    this.push(['trackSiteSearch', keyword, category, resultsCount]);
  }

  /**
   * Manually logs a conversion for the numeric goal ID, with an optional numeric custom revenue customRevenue.
   *
   * @param idGoal numeric ID of the goal to log a conversion for.
   * @param [customRevenue] Optional custom revenue to log for the goal.
   */
  trackGoal(idGoal: number, customRevenue?: number): void {
    this.push(['trackGoal', idGoal, customRevenue]);
  }

  /**
   * Manually logs a click from your own code.
   *
   * @param url Full URL which is to be tracked as a click.
   * @param linkType Either 'link' for an outlink or 'download' for a download.
   */
  trackLink(url: string, linkType: 'link' | 'download'): void {
    this.push(['trackLink', url, linkType]);
  }

  /**
   * Scans the entire DOM for all content blocks and tracks all impressions once the DOM ready event has been triggered.
   *
   */
  trackAllContentImpressions(): void {
    this.push(['trackAllContentImpressions']);
  }

  /**
   * Scans the entire DOM for all content blocks as soon as the page is loaded.<br />
   * It tracks an impression only if a content block is actually visible.
   *
   * @param checkOnScroll If true, checks for new content blocks while scrolling the page.
   * @param timeInterval Duration, in milliseconds, between two checks upon scroll.
   */
  trackVisibleContentImpressions(checkOnScroll: boolean, timeInterval: number): void {
    this.push(['trackVisibleContentImpressions', checkOnScroll, timeInterval]);
  }

  /**
   * Scans the given DOM node and its children for content blocks and tracks an impression for them
   * if no impression was already tracked for it.
   *
   * @param node DOM node in which to look for content blocks which have not been previously tracked.
   */
  trackContentImpressionsWithinNode(node: Node): void {
    this.push(['trackContentImpressionsWithinNode', node]);
  }

  /**
   * Tracks an interaction with the given DOM node/content block.
   *
   * @param node DOM node for which to track a content interaction.
   * @param contentInteraction Name of the content interaction.
   */
  trackContentInteractionNode(node: Node, contentInteraction: string): void {
    this.push(['trackContentInteractionNode', node, contentInteraction]);
  }

  /**
   * Tracks a content impression using the specified values.
   *
   * @param contentName Content name.
   * @param contentPiece Content piece.
   * @param contentTarget Content target.
   */
  trackContentImpression(contentName: string, contentPiece: string, contentTarget: string): void {
    this.push(['trackContentImpression', contentName, contentPiece, contentTarget]);
  }

  /**
   * Tracks a content interaction using the specified values.
   *
   * @param contentInteraction Content interaction.
   * @param contentName Content name.
   * @param contentPiece Content piece.
   * @param contentTarget Content target.
   */
  trackContentInteraction(
    contentInteraction: string,
    contentName: string,
    contentPiece: string,
    contentTarget: string
  ): void {
    this.push([
      'trackContentInteraction',
      contentInteraction,
      contentName,
      contentPiece,
      contentTarget,
    ]);
  }

  /**
   * Logs all found content blocks within a page to the console. This is useful to debug / test content tracking.
   */
  logAllContentBlocksOnPage(): void {
    this.push(['logAllContentBlocksOnPage']);
  }

  /**
   * Send a ping request
   * <p>
   * Ping requests do not track new actions.
   * If they are sent within the standard visit length, they will update the existing visit time.
   * If sent after the standard visit length, ping requests will be ignored.
   * See also {@link #enableHeartBeatTimer enableHeartBeatTimer()}.
   *
   * @see enableHeartBeatTimer
   */
  ping(): void {
    this.push(['ping']);
  }

  /**
   * Install a Heart beat timer that will regularly send requests to Matomo in order to better measure the time spent on the page.<br />
   * These requests will be sent only when the user is actively viewing the page (when the tab is active and in focus).<br />
   * These requests will not track additional actions or page views.<br />
   * By default, the delay is set to 15 seconds.
   *
   * @param delay Delay, in seconds, between two heart beats to the server.
   */
  enableHeartBeatTimer(delay: number): void {
    this.push(['enableHeartBeatTimer', delay]);
  }

  /**
   * Installs link tracking on all applicable link elements.
   *
   * @param usePseudoClickHandler Set to `true` to use pseudo click-handler (treat middle click and open contextmenu as
   * left click).<br />
   * A right click (or any click that opens the context menu) on a link will be tracked as clicked even if "Open in new tab"
   * is not selected.<br />
   * If "false" (default), nothing will be tracked on open context menu or middle click.
   */
  enableLinkTracking(usePseudoClickHandler = false): void {
    this.push(['enableLinkTracking', usePseudoClickHandler]);
  }

  /** Disables page performance tracking */
  disablePerformanceTracking(): void {
    this.push(['disablePerformanceTracking']);
  }

  /**
   * Enables cross domain linking. By default, the visitor ID that identifies a unique visitor is stored in the browser's
   * first party cookies.<br />
   * This means the cookie can only be accessed by pages on the same domain.<br />
   * If you own multiple domains and would like to track all the actions and pageviews of a specific visitor into the same visit,
   * you may enable cross domain linking.<br />
   * Whenever a user clicks on a link it will append a URL parameter pk_vid to the clicked URL which forwards the current
   * visitor ID value to the page of the different domain.
   *
   */
  enableCrossDomainLinking(): void {
    this.push(['enableCrossDomainLinking']);
  }

  /**
   * By default, the two visits across domains will be linked together when the link is clicked and the page is loaded within
   * a 180 seconds timeout window.
   *
   * @param timeout Timeout, in seconds, between two actions across two domains before creating a new visit.
   */
  setCrossDomainLinkingTimeout(timeout: number): void {
    this.push(['setCrossDomainLinkingTimeout', timeout]);
  }

  /**
   * Get the query parameter to append to links to handle cross domain linking.
   *
   * Use this to add cross domain support for links that are added to the DOM dynamically
   */
  getCrossDomainLinkingUrlParameter(): Promise<string> {
    return this.get('getCrossDomainLinkingUrlParameter');
  }

  /**
   * Overrides document.title
   *
   * @param title Title of the document.
   */
  setDocumentTitle(title: string): void {
    this.push(['setDocumentTitle', title]);
  }

  /**
   * Set array of hostnames or domains to be treated as local.<br />
   * For wildcard subdomains, you can use: `setDomains('.example.com')`; or `setDomains('*.example.com');`.<br />
   * You can also specify a path along a domain: `setDomains('*.example.com/subsite1');`.
   *
   * @param domains List of hostnames or domains, with or without path, to be treated as local.
   */
  setDomains(domains: string[]): void {
    this.push(['setDomains', domains]);
  }

  /**
   * Override the page's reported URL.
   *
   * @param url URL to be reported for the page.
   */
  setCustomUrl(url: string): void {
    this.push(['setCustomUrl', url]);
  }

  /**
   * Overrides the detected Http-Referer.
   *
   * @param url URL to be reported for the referer.
   */
  setReferrerUrl(url: string): void {
    this.push(['setReferrerUrl', url]);
  }

  /**
   * Specifies the website ID.<br />
   * Redundant: can be specified in getTracker() constructor.
   *
   * @param siteId Site ID for the tracker.
   */
  setSiteId(siteId: number | string): void {
    this.push(['setSiteId', siteId]);
  }

  /**
   * Specify the Matomo HTTP API URL endpoint. Points to the root directory of matomo,
   * e.g. http://matomo.example.org/ or https://example.org/matomo/.<br />
   * This function is only useful when the 'Overlay' report is not working.<br />
   * By default, you do not need to use this function.
   *
   * @param url URL for Matomo HTTP API endpoint.
   */
  setApiUrl(url: string): void {
    this.push(['setApiUrl', url]);
  }

  /**
   * Specifies the Matomo server URL.<br />
   * Redundant: can be specified in getTracker() constructor.
   *
   * @param url URL for the Matomo server.
   */
  setTrackerUrl(url: string): void {
    this.push(['setTrackerUrl', url]);
  }

  /**
   * Register an additional Matomo server<br />
   * Redundant: can be specified in getTracker() constructor.
   *
   * @param url URL for the Matomo server.
   * @param siteId Site ID for the tracker
   */
  addTracker(url: string, siteId: number | string): void {
    this.push(['addTracker', url, siteId]);
  }

  /**
   * Returns the Matomo server URL.
   *
   * @returns Promise for the Matomo server URL.
   */
  getMatomoUrl(): Promise<string> {
    return this.get('getMatomoUrl');
  }

  /**
   * Returns the current url of the page that is currently being visited.<br />
   * If a custom URL was set before calling this method, the custom URL will be returned.
   *
   * @returns Promise for the URL of the current page.
   */
  getCurrentUrl(): Promise<string> {
    return this.get('getCurrentUrl');
  }

  /**
   * Set classes to be treated as downloads (in addition to piwik_download).
   *
   * @param classes Class, or list of classes to be treated as downloads.
   */
  setDownloadClasses(classes: string | string[]): void {
    this.push(['setDownloadClasses', classes]);
  }

  /**
   * Set list of file extensions to be recognized as downloads.<br />
   * Example: `'docx'` or `['docx', 'xlsx']`.
   *
   * @param extensions Extension, or list of extensions to be recognized as downloads.
   */
  setDownloadExtensions(extensions: string | string[]): void {
    this.push(['setDownloadExtensions', extensions]);
  }

  /**
   * Set additional file extensions to be recognized as downloads.<br />
   * Example: `'docx'` or `['docx', 'xlsx']`.
   *
   * @param extensions Extension, or list of extensions to be recognized as downloads.
   */
  addDownloadExtensions(extensions: string | string[]): void {
    this.push(['addDownloadExtensions', extensions]);
  }

  /**
   * Set file extensions to be removed from the list of download file extensions.<br />
   * Example: `'docx'` or `['docx', 'xlsx']`.
   *
   * @param extensions Extension, or list of extensions not to be recognized as downloads.
   */
  removeDownloadExtensions(extensions: string | string[]): void {
    this.push(['removeDownloadExtensions', extensions]);
  }

  /**
   * Set classes to be ignored if present in link (in addition to piwik_ignore).
   *
   * @param classes Class, or list of classes to be ignored if present in link.
   */
  setIgnoreClasses(classes: string | string[]): void {
    this.push(['setIgnoreClasses', classes]);
  }

  /**
   * Set classes to be treated as outlinks (in addition to piwik_link).
   *
   * @param classes Class, or list of classes to be treated as outlinks.
   */
  setLinkClasses(classes: string | string[]): void {
    this.push(['setLinkClasses', classes]);
  }

  /**
   * Set delay for link tracking (in milliseconds).
   *
   * @param delay Delay, in milliseconds, for link tracking.
   */
  setLinkTrackingTimer(delay: number): void {
    this.push(['setLinkTrackingTimer', delay]);
  }

  /**
   * Returns delay for link tracking.
   *
   * @returns Promise for the delay in milliseconds.
   */
  getLinkTrackingTimer(): Promise<number> {
    return this.get('getLinkTrackingTimer');
  }

  /**
   * Set to true to not record the hash tag (anchor) portion of URLs.
   *
   * @param value If true, the hash tag portion of the URLs won't be recorded.
   */
  discardHashTag(value: boolean): void {
    this.push(['discardHashTag', value]);
  }

  /**
   * By default Matomo uses the browser DOM Timing API to accurately determine the time it takes to generate and download
   * the page. You may overwrite this value with this function.
   *
   * <b>This feature has been deprecated since Matomo 4. Any call will be ignored with Matomo 4.</b>
   *
   * @param generationTime Time, in milliseconds, of the page generation.
   */
  setGenerationTimeMs(generationTime: number): void {
    this.push(['setGenerationTimeMs', generationTime]);
  }

  /**
   * Appends a custom string to the end of the HTTP request to matomo.php.
   *
   * @param appendToUrl String to append to the end of the HTTP request to matomo.php.
   */
  appendToTrackingUrl(appendToUrl: string): void {
    this.push(['appendToTrackingUrl', appendToUrl]);
  }

  /** Set to `true` to not track users who opt out of tracking using <i>Do Not Track</i> setting */
  setDoNotTrack(doNotTrack: boolean): void {
    this.push(['setDoNotTrack', doNotTrack]);
  }

  /**
   * Enables a frame-buster to prevent the tracked web page from being framed/iframed.
   */
  killFrame(): void {
    this.push(['killFrame']);
  }

  /**
   * Forces the browser to load the live URL if the tracked web page is loaded from a local file
   * (e.g., saved to someone's desktop).
   *
   * @param url URL to track instead of file:// URLs.
   */
  redirectFile(url: string): void {
    this.push(['redirectFile', url]);
  }

  /**
   * Records how long the page has been viewed if the minimumVisitLength is attained;
   * the heartBeatDelay determines how frequently to update the server.
   *
   * @param minimumVisitLength Duration before notifying the server for the duration of the visit to a page.
   * @param heartBeatDelay Delay, in seconds, between two updates to the server.
   */
  setHeartBeatTimer(minimumVisitLength: number, heartBeatDelay: number): void {
    this.push(['setHeartBeatTimer', minimumVisitLength, heartBeatDelay]);
  }

  /**
   * Returns the 16 characters ID for the visitor.
   *
   * @returns Promise for the the 16 characters ID for the visitor.
   */
  getVisitorId(): Promise<string> {
    return this.get('getVisitorId');
  }

  /**
   * Set the 16 characters ID for the visitor
   * <p/>
   * The visitorId needs to be a 16 digit hex string.
   * It won't be persisted in a cookie and needs to be set on every new page load.
   *
   * @param visitorId a 16 digit hex string
   */
  setVisitorId(visitorId: string): void {
    this.push(['setVisitorId', visitorId]);
  }

  /**
   * Returns the visitor cookie contents in an array.
   *
   * @returns Promise for the cookie contents in an array.
   *
   * TODO better return type
   */
  getVisitorInfo(): Promise<unknown[]> {
    return this.get('getVisitorInfo');
  }

  /**
   * Returns the visitor attribution array (Referer information and/or Campaign name & keyword).<br />
   * Attribution information is used by Matomo to credit the correct referrer (first or last referrer)
   * used when a user triggers a goal conversion.
   *
   * @returns Promise for the visitor attribution array (Referer information and/or Campaign name & keyword).
   */
  getAttributionInfo(): Promise<string[]> {
    return this.get('getAttributionInfo');
  }

  /**
   * Returns the attribution campaign name.
   *
   * @returns Promise for the the attribution campaign name.
   */
  getAttributionCampaignName(): Promise<string> {
    return this.get('getAttributionCampaignName');
  }

  /**
   * Returns the attribution campaign keyword.
   *
   * @returns Promise for the attribution campaign keyword.
   */
  getAttributionCampaignKeyword(): Promise<string> {
    return this.get('getAttributionCampaignKeyword');
  }

  /**
   * Returns the attribution referrer timestamp.
   *
   * @returns Promise for the attribution referrer timestamp (as string).
   */
  getAttributionReferrerTimestamp(): Promise<string> {
    return this.get('getAttributionReferrerTimestamp');
  }

  /**
   * Returns the attribution referrer URL.
   *
   * @returns Promise for the attribution referrer URL
   */
  getAttributionReferrerUrl(): Promise<string> {
    return this.get('getAttributionReferrerUrl');
  }

  /**
   * Returns the User ID string if it was set.
   *
   * @returns Promise for the User ID for the visitor.
   */
  getUserId(): Promise<string> {
    return this.get('getUserId');
  }

  /**
   * Set a User ID to this user (such as an email address or a username).
   *
   * @param userId User ID to set for the current visitor.
   */
  setUserId(userId: string): void {
    this.push(['setUserId', userId]);
  }

  /**
   * Reset the User ID which also generates a new Visitor ID.
   *
   */
  resetUserId(): void {
    this.push(['resetUserId']);
  }

  /**
   * Set a custom variable.
   *
   * @param index Index, the number from 1 to 5 where this custom variable name is stored for the current page view.
   * @param name Name, the name of the variable, for example: Category, Sub-category, UserType.
   * @param value Value, for example: "Sports", "News", "World", "Business"…
   * @param scope Scope of the custom variable:<br />
   * - "page" means the custom variable applies to the current page view.
   * - "visit" means the custom variable applies to the current visitor.
   */
  setCustomVariable(
    index: number,
    name: string,
    value: string,
    scope: 'page' | 'visit' | 'event'
  ): void {
    this.push(['setCustomVariable', index, name, value, scope]);
  }

  /**
   * Deletes a custom variable.
   *
   * @param index Index of the custom variable to delete.
   * @param scope Scope of the custom variable to delete.
   */
  deleteCustomVariable(index: number, scope: 'page' | 'visit' | 'event'): void {
    this.push(['deleteCustomVariable', index, scope]);
  }

  /**
   * Deletes all custom variables.
   *
   * @param scope Scope of the custom variables to delete.
   */
  deleteCustomVariables(scope: 'page' | 'visit' | 'event'): void {
    this.push(['deleteCustomVariables', scope]);
  }

  /**
   * Retrieves a custom variable.
   *
   * @param index Index of the custom variable to retrieve.
   * @param scope Scope of the custom variable to retrieve.
   * @returns Promise for the value of custom variable.
   */
  getCustomVariable(index: number, scope: 'page' | 'visit' | 'event'): Promise<string> {
    return this.pushFn(matomo => matomo.getCustomVariable(index, scope));
  }

  /**
   * When called then the Custom Variables of scope "visit" will be stored (persisted) in a first party cookie
   * for the duration of the visit.<br />
   * This is useful if you want to call getCustomVariable later in the visit.<br />
   * (by default custom variables are not stored on the visitor's computer.)
   *
   */
  storeCustomVariablesInCookie(): void {
    this.push(['storeCustomVariablesInCookie']);
  }

  /**
   * Set a custom dimension.<br />
   * (requires Matomo 2.15.1 + Custom Dimensions plugin)
   *
   * @param customDimensionId ID of the custom dimension to set.
   * @param customDimensionValue Value to be set.
   */
  setCustomDimension(customDimensionId: number, customDimensionValue: string): void {
    this.push(['setCustomDimension', customDimensionId, customDimensionValue]);
  }

  /**
   * Deletes a custom dimension.<br />
   * (requires Matomo 2.15.1 + Custom Dimensions plugin)
   *
   * @param customDimensionId ID of the custom dimension to delete.
   */
  deleteCustomDimension(customDimensionId: number): void {
    this.push(['deleteCustomDimension', customDimensionId]);
  }

  /**
   * Retrieve a custom dimension.<br />
   * (requires Matomo 2.15.1 + Custom Dimensions plugin)
   *
   * @param customDimensionId ID of the custom dimension to retrieve.
   * @return Promise for the value for the requested custom dimension.
   */
  getCustomDimension(customDimensionId: number): Promise<string> {
    return this.pushFn(matomo => matomo.getCustomDimension(customDimensionId));
  }

  /**
   * Set campaign name parameter(s).
   *
   * @param name Name of the campaign
   */
  setCampaignNameKey(name: string): void {
    this.push(['setCampaignNameKey', name]);
  }

  /**
   * Set campaign keyword parameter(s).
   *
   * @param keyword Keyword parameter(s) of the campaign.
   */
  setCampaignKeywordKey(keyword: string): void {
    this.push(['setCampaignKeywordKey', keyword]);
  }

  /**
   * Set to true to attribute a conversion to the first referrer.<br />
   * By default, conversion is attributed to the most recent referrer.
   *
   * @param conversionToFirstReferrer If true, Matomo will attribute the Goal conversion to the first referrer used
   * instead of the last one.
   */
  setConversionAttributionFirstReferrer(conversionToFirstReferrer: boolean): void {
    this.push(['setConversionAttributionFirstReferrer', conversionToFirstReferrer]);
  }

  /**
   * Set the current page view as a product page view.<br />
   * When you call setEcommerceView, it must be followed by a call to trackPageView to record the product or category page view.
   *
   * @param productSKU SKU of the viewed product.
   * @param productName Name of the viewed product.
   * @param productCategory Category of the viewed product.
   * @param price Price of the viewed product.
   */
  setEcommerceView(
    productSKU: string,
    productName?: string,
    productCategory?: string,
    price?: number
  ): void;

  /**
   * Set the current page view as a product page view.<br />
   * When you call setEcommerceView, it must be followed by a call to trackPageView to record the product or category page view.
   *
   */
  setEcommerceView(product: MatomoECommerceItemView): void;

  /**
   * Set the current page view as a category page view.<br />
   * When you call setEcommerceView, it must be followed by a call to trackPageView to record the product or category page view.
   *
   */
  setEcommerceView(product: MatomoECommerceCategoryView): void;

  /**
   * Set the current page view as a product or category page view.<br />
   * When you call setEcommerceView, it must be followed by a call to trackPageView to record the product or category page view.
   *
   */
  setEcommerceView(product: MatomoECommerceView): void;

  setEcommerceView(
    productOrSKU: string | MatomoECommerceView,
    productName?: string,
    productCategory?: string,
    price?: number
  ): void {
    if (isECommerceCategoryView(productOrSKU)) {
      this.push(['setEcommerceView', false, false, productOrSKU.productCategory]);
    } else if (isECommerceItemView(productOrSKU)) {
      this.push([
        'setEcommerceView',
        productOrSKU.productSKU,
        productOrSKU.productName,
        productOrSKU.productCategory,
        productOrSKU.price,
      ]);
    } else {
      this.push(['setEcommerceView', productOrSKU, productName, productCategory, price]);
    }
  }

  /**
   * Adds a product into the eCommerce order.<br />
   * Must be called for each product in the order.
   *
   * @param productSKU SKU of the product to add.
   * @param [productName] Optional name of the product to add.
   * @param [productCategory] Optional category of the product to add.
   * @param [price] Optional price of the product to add.
   * @param [quantity] Optional quantity of the product to add.
   */
  addEcommerceItem(
    productSKU: string,
    productName?: string,
    productCategory?: string,
    price?: number,
    quantity?: number
  ): void;

  /**
   * Adds a product into the eCommerce order.<br />
   * Must be called for each product in the order.
   *
   */
  addEcommerceItem(product: MatomoECommerceItem): void;
  addEcommerceItem(
    productOrSKU: string | MatomoECommerceItem,
    productName?: string,
    productCategory?: string,
    price?: number,
    quantity?: number
  ): void {
    if (typeof productOrSKU === 'string') {
      this.push(['addEcommerceItem', productOrSKU, productName, productCategory, price, quantity]);
    } else {
      this.push([
        'addEcommerceItem',
        productOrSKU.productSKU,
        productOrSKU.productName,
        productOrSKU.productCategory,
        productOrSKU.price,
        productOrSKU.quantity,
      ]);
    }
  }

  /**
   * Remove the specified product from the untracked ecommerce order
   *
   * @param productSKU SKU of the product to remove.
   */
  removeEcommerceItem(productSKU: string): void {
    this.push(['removeEcommerceItem', productSKU]);
  }

  /**
   * Remove all products in the untracked ecommerce order
   *
   * Note: This is done automatically after {@link #trackEcommerceOrder trackEcommerceOrder()} is called
   */
  clearEcommerceCart(): void {
    this.push(['clearEcommerceCart']);
  }

  /**
   * Return all ecommerce items currently in the untracked ecommerce order
   * <p/>
   * The returned array will be a copy, so changing it won't affect the ecommerce order.
   * To affect what gets tracked, use the {@link #addEcommerceItem addEcommerceItem()}, {@link #removeEcommerceItem removeEcommerceItem()},
   * {@link #clearEcommerceCart clearEcommerceCart()} methods.
   * Use this method to see what will be tracked before you track an order or cart update.
   */
  getEcommerceItems(): Promise<MatomoECommerceItem[]> {
    return this.get('getEcommerceItems');
  }

  /**
   * Tracks a shopping cart.<br />
   * Call this function every time a user is adding, updating or deleting a product from the cart.
   *
   * @param grandTotal Grand total of the shopping cart.
   */
  trackEcommerceCartUpdate(grandTotal: number): void {
    this.push(['trackEcommerceCartUpdate', grandTotal]);
  }

  /**
   * Tracks an Ecommerce order, including any eCommerce item previously added to the order.<br />
   * orderId and grandTotal (ie.revenue) are required parameters.
   *
   * @param orderId ID of the tracked order.
   * @param grandTotal Grand total of the tracked order.
   * @param [subTotal] Sub total of the tracked order.
   * @param [tax] Taxes for the tracked order.
   * @param [shipping] Shipping fees for the tracked order.
   * @param [discount] Discount granted for the tracked order.
   */
  trackEcommerceOrder(
    orderId: string,
    grandTotal: number,
    subTotal?: number,
    tax?: number,
    shipping?: number,
    discount?: number
  ): void {
    this.push(['trackEcommerceOrder', orderId, grandTotal, subTotal, tax, shipping, discount]);
  }

  /**
   * Require nothing is tracked until a user consents
   *
   * By default the Matomo tracker assumes consent to tracking.
   *
   * @see `requireConsent` module configuration property
   */
  requireConsent(): void {
    this.push(['requireConsent']);
  }

  /**
   * Mark that the current user has consented
   *
   * The consent is one-time only, so in a subsequent browser session, the user will have to consent again.
   * To remember consent, see {@link rememberConsentGiven}.
   */
  setConsentGiven(): void {
    this.push(['setConsentGiven']);
  }

  /**
   * Mark that the current user has consented, and remembers this consent through a browser cookie.
   *
   * The next time the user visits the site, Matomo will remember that they consented, and track them.
   * If you call this method, you do not need to call {@link setConsentGiven}.
   *
   * @param hoursToExpire After how many hours the consent should expire. By default the consent is valid
   *                          for 30 years unless cookies are deleted by the user or the browser prior to this
   */
  rememberConsentGiven(hoursToExpire?: number): void {
    this.push(['rememberConsentGiven', hoursToExpire]);
  }

  /**
   * Remove a user's consent, both if the consent was one-time only and if the consent was remembered.
   *
   * After calling this method, the user will have to consent again in order to be tracked.
   */
  forgetConsentGiven(): void {
    this.push(['forgetConsentGiven']);
  }

  /** Return whether the current visitor has given consent previously or not */
  hasRememberedConsent(): Promise<boolean> {
    return this.get('hasRememberedConsent');
  }

  /**
   * If consent was given, returns the timestamp when the visitor gave consent
   *
   * Only works if {@link rememberConsentGiven} was used and not when {@link setConsentGiven} was used.
   * The timestamp is the local timestamp which depends on the visitors time.
   */
  getRememberedConsent(): Promise<string | number> {
    return this.get('getRememberedConsent');
  }

  /** Return whether {@link requireConsent} was called previously */
  isConsentRequired(): Promise<boolean> {
    return this.get('isConsentRequired');
  }

  /**
   * Require no cookies are used
   *
   * By default the Matomo tracker assumes consent to using cookies
   */
  requireCookieConsent(): void {
    this.push(['requireCookieConsent']);
  }

  /**
   * Mark that the current user has consented to using cookies
   *
   * The consent is one-time only, so in a subsequent browser session, the user will have to consent again.
   * To remember cookie consent, see {@link rememberCookieConsentGiven}.
   */
  setCookieConsentGiven(): void {
    this.push(['setCookieConsentGiven']);
  }

  /**
   * Mark that the current user has consented to using cookies, and remembers this consent through a browser cookie.
   *
   * The next time the user visits the site, Matomo will remember that they consented, and use cookies.
   * If you call this method, you do not need to call {@link setCookieConsentGiven}.
   *
   * @param hoursToExpire After how many hours the cookie consent should expire. By default the consent is valid
   *                          for 30 years unless cookies are deleted by the user or the browser prior to this
   */
  rememberCookieConsentGiven(hoursToExpire?: number): void {
    this.push(['rememberCookieConsentGiven', hoursToExpire]);
  }

  /**
   * Remove a user's cookie consent, both if the consent was one-time only and if the consent was remembered.
   *
   * After calling this method, the user will have to consent again in order for cookies to be used.
   */
  forgetCookieConsentGiven(): void {
    this.push(['forgetCookieConsentGiven']);
  }

  /** Return whether cookies are currently enabled or disabled */
  areCookiesEnabled(): Promise<boolean> {
    return this.get('areCookiesEnabled');
  }

  /** After calling this function, the user will be opted out and no longer be tracked */
  optUserOut(): void {
    this.push(['optUserOut']);
  }

  /** After calling this method the user will be tracked again */
  forgetUserOptOut(): void {
    this.push(['forgetUserOptOut']);
  }

  /**
   * Return whether the user is opted out or not
   *
   * Note: This method might not return the correct value if you are using the opt out iframe.
   */
  isUserOptedOut(): Promise<boolean> {
    return this.get('isUserOptedOut');
  }

  /**
   * Disables all first party cookies.<br />
   * Existing Matomo cookies for this websites will be deleted on the next page view.
   */
  disableCookies(): void {
    this.push(['disableCookies']);
  }

  /**
   * Deletes the tracking cookies currently set (useful when creating new visits).
   */
  deleteCookies(): void {
    this.push(['deleteCookies']);
  }

  /**
   * Returns whether cookies are enabled and supported by this browser.
   *
   * @returns Promise for the support and activation of cookies.
   */
  hasCookies(): Promise<boolean> {
    return this.get('hasCookies');
  }

  /**
   * Set the tracking cookie name prefix.<br />
   * Default prefix is 'pk'.
   *
   * @param prefix Prefix for the tracking cookie names.
   */
  setCookieNamePrefix(prefix: string): void {
    this.push(['setCookieNamePrefix', prefix]);
  }

  /**
   * Set the domain of the tracking cookies.<br />
   * Default is the document domain.<br />
   * If your website can be visited at both www.example.com and example.com, you would use: `'.example.com'` or `'*.example.com'`.
   *
   * @param domain Domain of the tracking cookies.
   */
  setCookieDomain(domain: string): void {
    this.push(['setCookieDomain', domain]);
  }

  /**
   * Set the path of the tracking cookies.<br />
   * Default is '/'.
   *
   * @param path Path of the tracking cookies.
   */
  setCookiePath(path: string): void {
    this.push(['setCookiePath', path]);
  }

  /**
   * Set to true to enable the Secure cookie flag on all first party cookies.<br />
   * This should be used when your website is only available under HTTPS so that all tracking cookies are always sent
   * over secure connection.
   *
   * @param secure If true, the secure cookie flag will be set on all first party cookies.
   */
  setSecureCookie(secure: boolean): void {
    this.push(['setSecureCookie', secure]);
  }

  /**
   * Set cookie <i>same site</i>
   * <p/>
   * Defaults to Lax.
   * Can be set to None or Strict.
   * None requires all traffic to be on HTTPS and will also automatically set the secure cookie.
   * It can be useful for example if the tracked website is an iframe.
   * Strict only works if your Matomo and the website runs on the very same domain.
   */
  setCookieSameSite(sameSite: 'Strict' | 'Lax' | 'None'): void {
    this.push(['setCookieSameSite', sameSite]);
  }

  /**
   * Set the visitor cookie timeout.<br />
   * Default is 13 months.
   *
   * @param timeout Timeout, in seconds, for the visitor cookie timeout.
   */
  setVisitorCookieTimeout(timeout: number): void {
    this.push(['setVisitorCookieTimeout', timeout]);
  }

  /**
   * Set the referral cookie timeout.<br />
   * Default is 6 months.
   *
   * @param timeout Timeout, in seconds, for the referral cookie timeout.
   */
  setReferralCookieTimeout(timeout: number): void {
    this.push(['setReferralCookieTimeout', timeout]);
  }

  /**
   * Set the session cookie timeout.<br />
   * Default is 30 minutes.
   *
   * @param timeout Timeout, in seconds, for the session cookie timeout.
   */
  setSessionCookieTimeout(timeout: number): void {
    this.push(['setSessionCookieTimeout', timeout]);
  }

  /**
   * Adds a click listener to a specific link element.<br />
   * When clicked, Matomo will log the click automatically.
   *
   * @param element Element on which to add a click listener.
   */
  addListener(element: Element): void {
    this.push(['addListener', element]);
  }

  /**
   * Set the request method to either "GET" or "POST". (The default is "GET".)<br />
   * To use the POST request method, either:<br />
   * 1) the Matomo host is the same as the tracked website host (Matomo installed in the same domain as your tracked website), or<br />
   * 2) if Matomo is not installed on the same host as your website, you need to enable CORS (Cross domain requests).
   *
   * @param method HTTP method for sending information to the Matomo server.
   */
  setRequestMethod(method: string): void {
    this.push(['setRequestMethod', method]);
  }

  /**
   * Set a function that will process the request content.<br />
   * The function will be called once the request (query parameters string) has been prepared, and before the request content is sent.
   *
   * @param callback Function that will process the request content.
   */
  setCustomRequestProcessing(callback: (queryParameters: string) => void): void {
    this.push(['setCustomRequestProcessing', callback]);
  }

  /**
   * Set request Content-Type header value.<br />
   * Applicable when "POST" request method is used via setRequestMethod.
   *
   * @param contentType Value for Content-Type HTTP header.
   */
  setRequestContentType(contentType: string): void {
    this.push(['setRequestContentType', contentType]);
  }

  /**
   * Disable the feature which groups together multiple tracking requests and send them as a bulk POST request.
   * <p/>
   * Disabling this feature is useful when you want to be able to replay all logs:
   * one must use disableQueueRequest to disable this behaviour to later be able to replay logged
   * Matomo logs (otherwise a subset of the requests wouldn't be able to be replayed).
   */
  disableQueueRequest(): void {
    this.push(['disableQueueRequest']);
  }

  /**
   * Defines after how many ms a queued requests will be executed after the request was queued initially
   * <p/>
   * The higher the value the more tracking requests can be sent together at once
   *
   * @param interval Interval in milliseconds, must be at least 1000, defaults to 2500
   */
  setRequestQueueInterval(interval: number): void {
    this.push(['setRequestQueueInterval', interval]);
  }

  /** Disable sending tracking requests using `navigator.sendBeacon` which is enabled by default */
  disableAlwaysUseSendBeacon(): void {
    this.push(['disableAlwaysUseSendBeacon']);
  }

  /** Enable sending tracking requests using `navigator.sendBeacon` (enabled by default) */
  alwaysUseSendBeacon(): void {
    this.push(['alwaysUseSendBeacon']);
  }

  /**
   * Enable Javascript errors tracking. JS errors are then tracked as events with category
   * "JavaScript Errors". Refer to official doc for more details.
   *
   * @see https://matomo.org/faq/how-to/how-do-i-enable-basic-javascript-error-tracking-and-reporting-in-matomo-browser-console-error-messages/
   */
  enableJSErrorTracking(): void {
    this.push(['enableJSErrorTracking']);
  }

  /** Asynchronously call provided method name on matomo tracker instance */
  protected get<G extends Getters<MatomoInstance>>(
    getter: G
  ): Promise<ReturnType<MatomoInstance[G]>> {
    return this.pushFn(matomo => matomo[getter]() as ReturnType<MatomoInstance[G]>);
  }

  /**
   * Asynchronously call provided method with matomo tracker instance as argument
   *
   * @return Promise resolving to the return value of given method
   */
  protected abstract pushFn<T>(fn: (matomo: MatomoInstance) => T): Promise<T>;

  protected abstract push(args: unknown[]): void;
}

export class StandardMatomoTracker extends MatomoTracker {
  constructor() {
    super();
    initializeMatomoHolder();
  }

  protected pushFn<T>(fn: (matomo: MatomoInstance) => T): Promise<T> {
    return new Promise(resolve => {
      this.push([
        function (this: MatomoInstance): void {
          resolve(fn(this));
        },
      ]);
    });
  }

  protected push(args: unknown[]): void {
    window._paq.push(trimTrailingUndefinedElements(args));
  }
}

export class NoopMatomoTracker extends MatomoTracker {
  protected push(args: unknown[]): void {
    // No-op
  }

  protected pushFn<T>(fn: (matomo: MatomoInstance) => T): Promise<T> {
    return Promise.reject('MatomoTracker is disabled');
  }
}
