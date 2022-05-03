import { InternalMatomoConfiguration } from './configuration';
import { MatomoHolder } from './holder';
import {
  createMatomoTracker,
  MatomoECommerceItem,
  MatomoInstance,
  MatomoTracker,
} from './matomo-tracker.service';
import { Getters, Methods } from './types';

declare var window: MatomoHolder;

// Extracted from https://github.com/angular/angular/blob/b66e479cdb1e474a29ff676f10a5fcc3d7eae799/packages/common/src/platform_id.ts
const PLATFORM_BROWSER_ID = 'browser';
const PLATFORM_SERVER_ID = 'server';

describe('MatomoTracker', () => {
  function createTracker(disabled = false, platform: Object = PLATFORM_BROWSER_ID): MatomoTracker {
    return createMatomoTracker({ disabled } as InternalMatomoConfiguration, platform);
  }

  beforeEach(() => {
    window._paq = [];
  });

  function expectPush(when: (tracker: MatomoTracker) => void, expected: unknown[][]): () => void {
    return () => {
      // When
      when(createTracker());
      // Then
      expect(window._paq).toEqual(expected);
    };
  }

  function expectSimpleMethod<M extends Methods<MatomoTracker>>(
    method: M,
    args: Parameters<MatomoTracker[M]>,
    expectedArgs: unknown[] = args
  ): () => void {
    return expectPush(t => (t[method] as any)(...args), [[method, ...expectedArgs]]);
  }

  it('should track page view', expectSimpleMethod('trackPageView', []));

  it(
    'should track page view with custom title',
    expectSimpleMethod('trackPageView', ['custom title'])
  );

  it(
    'should track event',
    expectSimpleMethod('trackEvent', ['myCategory', 'myAction', 'myName', 42])
  );

  it(
    'should track event without name/value',
    expectSimpleMethod('trackEvent', ['myCategory', 'myAction'])
  );

  it(
    'should track site search',
    expectSimpleMethod('trackSiteSearch', ['myKeyword', 'myCategory', 0])
  );

  it('should track goal', expectSimpleMethod('trackGoal', [1, 2]));

  it('should track link', expectSimpleMethod('trackLink', ['http://myUrl', 'link']));

  it('should track download', expectSimpleMethod('trackLink', ['http://myUrl', 'download']));

  it('should track content impressions', expectSimpleMethod('trackAllContentImpressions', []));

  it(
    'should track visible content impressions',
    expectSimpleMethod('trackVisibleContentImpressions', [true, 42])
  );

  it(
    'should track content impressions within node',
    expectSimpleMethod('trackContentImpressionsWithinNode', [document.createElement('div')])
  );

  it(
    'should track content interaction with node',
    expectSimpleMethod('trackContentInteractionNode', [document.createElement('div'), 'test'])
  );

  it(
    'should track content impression',
    expectSimpleMethod('trackContentImpression', ['myContentName', 'myPiece', 'myTarget'])
  );

  it(
    'should track content interaction',
    expectSimpleMethod('trackContentInteraction', [
      'myInteraction',
      'myContentName',
      'myPiece',
      'myTarget',
    ])
  );

  it(
    'should log all content blocks on page (for debugging purpose)',
    expectSimpleMethod('logAllContentBlocksOnPage', [])
  );

  it('should enable heartbeat timer', expectSimpleMethod('enableHeartBeatTimer', [42]));

  it(
    'should enable link tracking with pseudo-handler',
    expectSimpleMethod('enableLinkTracking', [true])
  );

  it(
    'should enable link tracking with standard click handler',
    expectSimpleMethod('enableLinkTracking', [], [false])
  );

  it('should disable performance tracking', expectSimpleMethod('disablePerformanceTracking', []));

  it('should enable cross domain linking', expectSimpleMethod('enableCrossDomainLinking', []));

  it(
    'should set cross domain linking timeout',
    expectSimpleMethod('setCrossDomainLinkingTimeout', [42])
  );

  it('should get cross domain linking url parameter', done => {
    expectGetter(
      'getCrossDomainLinkingUrlParameter',
      {
        getCrossDomainLinkingUrlParameter(): string {
          return 'foo=bar';
        },
      },
      'foo=bar'
    ).then(done);
  });

  it('should set document title', expectSimpleMethod('setDocumentTitle', ['test']));

  it('should set domains', expectSimpleMethod('setDomains', [['domain1', 'domain2']]));

  it('should set custom url', expectSimpleMethod('setCustomUrl', ['http://url']));

  it('should set referrer url', expectSimpleMethod('setReferrerUrl', ['http://url']));

  it('should set site id', expectSimpleMethod('setSiteId', [100]));

  it('should set api url', expectSimpleMethod('setApiUrl', ['http://url']));

  it('should set tracker url', expectSimpleMethod('setTrackerUrl', ['http://url']));

  it('should add tracker', expectSimpleMethod('addTracker', ['http://url', '1']));

  it('should set download classes', expectSimpleMethod('setDownloadClasses', ['myClass']));

  it('should set download extensions', expectSimpleMethod('setDownloadExtensions', ['docx']));

  it('should add download extensions', expectSimpleMethod('addDownloadExtensions', ['docx']));

  it('should remove download extensions', expectSimpleMethod('removeDownloadExtensions', ['docx']));

  it('should set ignored classes', expectSimpleMethod('setIgnoreClasses', ['myClass']));

  it('should set link classes', expectSimpleMethod('setLinkClasses', ['myClass']));

  it('should set link tracking timer', expectSimpleMethod('setLinkTrackingTimer', [42]));

  it('should set discard hashtag', expectSimpleMethod('discardHashTag', [true]));

  it('should set generation time', expectSimpleMethod('setGenerationTimeMs', [42]));

  it('should append to tracking url', expectSimpleMethod('appendToTrackingUrl', ['?toAppend']));

  it('should set "DoNotTrack"', expectSimpleMethod('setDoNotTrack', [true]));

  it('should kill frame', expectSimpleMethod('killFrame', []));

  it('should redirect file', expectSimpleMethod('redirectFile', ['http://url']));

  it('should set heart beat timer', expectSimpleMethod('setHeartBeatTimer', [42, 42]));

  it('should set user id', expectSimpleMethod('setUserId', ['foo']));

  it('should reset user id', expectSimpleMethod('resetUserId', []));

  it(
    'should set custom variable',
    expectSimpleMethod('setCustomVariable', [1, 'name', 'value', 'page'])
  );

  it('should delete custom variable', expectSimpleMethod('deleteCustomVariable', [1, 'page']));

  it('should delete custom variables', expectSimpleMethod('deleteCustomVariables', ['page']));

  it(
    'should store custom variables in cookie',
    expectSimpleMethod('storeCustomVariablesInCookie', [])
  );

  it('should set custom dimension', expectSimpleMethod('setCustomDimension', [1, 'value']));

  it('should delete custom dimension', expectSimpleMethod('deleteCustomDimension', [1]));

  it('should set campaign name key', expectSimpleMethod('setCampaignNameKey', ['test']));

  it('should set campaign keyword key', expectSimpleMethod('setCampaignKeywordKey', ['test']));

  it(
    'should set conversion attribution first referrer',
    expectSimpleMethod('setConversionAttributionFirstReferrer', [true])
  );

  it(
    'should set ecommerce view',
    expectPush(
      tracker => {
        tracker.setEcommerceView('sku1', 'name1', 'cat1', 42);
        tracker.setEcommerceView({
          productSKU: 'sku2',
          productName: 'name2',
          productCategory: 'cat2',
          price: 42,
        });
        tracker.setEcommerceView({
          productCategory: 'cat3',
        });
      },
      [
        ['setEcommerceView', 'sku1', 'name1', 'cat1', 42],
        ['setEcommerceView', 'sku2', 'name2', 'cat2', 42],
        ['setEcommerceView', false, false, 'cat3'],
      ]
    )
  );

  it(
    'should add ecommerce item',
    expectPush(
      tracker => {
        tracker.addEcommerceItem('sku1', 'name1', 'cat1', 42, 100);
        tracker.addEcommerceItem({
          productSKU: 'sku2',
          productName: 'name2',
          productCategory: 'cat2',
          price: 42,
          quantity: 100,
        });
      },
      [
        ['addEcommerceItem', 'sku1', 'name1', 'cat1', 42, 100],
        ['addEcommerceItem', 'sku2', 'name2', 'cat2', 42, 100],
      ]
    )
  );

  it('should remove ecommerce item', expectSimpleMethod('removeEcommerceItem', ['sku']));

  it('should clear ecommerce cart', expectSimpleMethod('clearEcommerceCart', []));

  it('should get ecommerce items', done => {
    expectGetter<unknown[], 'getEcommerceItems'>(
      'getEcommerceItems',
      {
        getEcommerceItems(): MatomoECommerceItem[] {
          return [{ productSKU: 'test' }];
        },
      },
      [{ productSKU: 'test' }]
    ).then(done);
  });

  it('should track ecommerce cart update', expectSimpleMethod('trackEcommerceCartUpdate', [999]));

  it('should track ecommerce order', expectSimpleMethod('trackEcommerceOrder', ['orderId', 999]));

  it('should require consent', expectSimpleMethod('requireConsent', []));

  it('should set consent given', expectSimpleMethod('setConsentGiven', []));

  it('should remember consent given', expectSimpleMethod('rememberConsentGiven', []));

  it('should forget consent given', expectSimpleMethod('forgetConsentGiven', []));

  it('should return whether has remembered consent', done => {
    expectGetter(
      'hasRememberedConsent',
      {
        hasRememberedConsent(): boolean {
          return true;
        },
      },
      true
    ).then(done);
  });

  it('should return remembered consent', done => {
    expectGetter(
      'getRememberedConsent',
      {
        getRememberedConsent(): string | number {
          return 99999;
        },
      },
      99999
    ).then(done);
  });

  it('should return whether consent is required', done => {
    expectGetter(
      'isConsentRequired',
      {
        isConsentRequired(): boolean {
          return true;
        },
      },
      true
    ).then(done);
  });

  it('should require cookie consent', expectSimpleMethod('requireCookieConsent', []));

  it('should set cookie consent given', expectSimpleMethod('setCookieConsentGiven', []));

  it('should remember cookie consent given', expectSimpleMethod('rememberCookieConsentGiven', []));

  it('should forget cookie consent given', expectSimpleMethod('forgetCookieConsentGiven', []));

  it('should return whether cookies are enabled', done => {
    expectGetter(
      'areCookiesEnabled',
      {
        areCookiesEnabled(): boolean {
          return true;
        },
      },
      true
    ).then(done);
  });

  it('should opt user out', expectSimpleMethod('optUserOut', []));

  it('should forget user opt out', expectSimpleMethod('forgetUserOptOut', []));

  it('should return whether user opted out', done => {
    expectGetter(
      'isUserOptedOut',
      {
        isUserOptedOut(): boolean {
          return true;
        },
      },
      true
    ).then(done);
  });

  it('should disable cookies', expectSimpleMethod('disableCookies', []));

  it('should delete cookies', expectSimpleMethod('deleteCookies', []));

  it('should set cookie name prefix', expectSimpleMethod('setCookieNamePrefix', ['prefix']));

  it('should set cookie domain', expectSimpleMethod('setCookieDomain', ['example']));

  it('should set cookie path', expectSimpleMethod('setCookiePath', ['/example']));

  it('should set secure cookie', expectSimpleMethod('setSecureCookie', [true]));

  it('should set cookie "same-site"', expectSimpleMethod('setCookieSameSite', ['Strict']));

  it('should set visitor id', expectSimpleMethod('setVisitorId', ['0000000000000000']));

  it('should set visitor cookie timeout', expectSimpleMethod('setVisitorCookieTimeout', [42]));

  it('should set referral cookie timeout', expectSimpleMethod('setReferralCookieTimeout', [42]));

  it('should set session cookie timeout', expectSimpleMethod('setSessionCookieTimeout', [42]));

  it(
    'should add element click listener',
    expectSimpleMethod('addListener', [document.createElement('div')])
  );

  it('should set request method', expectSimpleMethod('setRequestMethod', ['method']));

  it(
    'should set custom request processing',
    expectSimpleMethod('setCustomRequestProcessing', [() => null])
  );

  it(
    'should set request content type',
    expectSimpleMethod('setRequestContentType', ['application/test'])
  );

  it('should disable sendBeacon', expectSimpleMethod('disableAlwaysUseSendBeacon', []));

  it('should enable sendBeacon', expectSimpleMethod('alwaysUseSendBeacon', []));

  it('should send ping request', expectSimpleMethod('ping', []));

  it('should disable queue request', expectSimpleMethod('disableQueueRequest', []));

  it('should set requestQueueInterval', expectSimpleMethod('setRequestQueueInterval', [4200]));

  it('should enable JS error tracking', expectSimpleMethod('enableJSErrorTracking', []));

  function expectGetter<T, G extends Getters<MatomoTracker, Promise<T>>, E extends T = T>(
    getter: G,
    mockInstance: Partial<MatomoInstance>,
    expected: E
  ): Promise<void> {
    // Given
    const tracker = createTracker();

    spyOn(window._paq, 'push').and.callFake(((...args: any[]) => {
      args[0][0].call(mockInstance);
    }) as any);

    // When
    return (tracker[getter]() as Promise<any>).then(url => {
      // Then
      expect(url).toEqual(expected);
    });
  }

  it('should get Matomo url', done => {
    expectGetter(
      'getMatomoUrl',
      {
        getMatomoUrl(): string {
          return 'http://fakeUrl';
        },
      },
      'http://fakeUrl'
    ).then(done);
  });

  it('should get current url', done => {
    expectGetter(
      'getCurrentUrl',
      {
        getCurrentUrl(): string {
          return 'http://fakeUrl';
        },
      },
      'http://fakeUrl'
    ).then(done);
  });

  it('should get link tracking timer', done => {
    expectGetter(
      'getLinkTrackingTimer',
      {
        getLinkTrackingTimer(): number {
          return 42;
        },
      },
      42
    ).then(done);
  });

  it('should get visitor id', done => {
    expectGetter(
      'getVisitorId',
      {
        getVisitorId(): string {
          return 'foo';
        },
      },
      'foo'
    ).then(done);
  });

  it('should get visitor info', done => {
    expectGetter(
      'getVisitorInfo',
      {
        getVisitorInfo(): unknown[] {
          return ['foo'];
        },
      },
      ['foo'] as unknown[]
    ).then(done);
  });

  it('should get attribution info', done => {
    expectGetter(
      'getAttributionInfo',
      {
        getAttributionInfo(): string[] {
          return ['foo'];
        },
      },
      ['foo']
    ).then(done);
  });

  it('should get attribution campaign name', done => {
    expectGetter(
      'getAttributionCampaignName',
      {
        getAttributionCampaignName(): string {
          return 'test';
        },
      },
      'test'
    ).then(done);
  });

  it('should get attribution campaign keyword', done => {
    expectGetter(
      'getAttributionCampaignKeyword',
      {
        getAttributionCampaignKeyword(): string {
          return 'test';
        },
      },
      'test'
    ).then(done);
  });

  it('should get attribution referrer timestamp', done => {
    expectGetter(
      'getAttributionReferrerTimestamp',
      {
        getAttributionReferrerTimestamp(): string {
          return 'test';
        },
      },
      'test'
    ).then(done);
  });

  it('should get attribution referrer url', done => {
    expectGetter(
      'getAttributionReferrerUrl',
      {
        getAttributionReferrerUrl(): string {
          return 'test';
        },
      },
      'test'
    ).then(done);
  });

  it('should get user id', done => {
    expectGetter(
      'getUserId',
      {
        getUserId(): string {
          return 'test';
        },
      },
      'test'
    ).then(done);
  });

  it('should get has cookies', done => {
    expectGetter(
      'hasCookies',
      {
        hasCookies(): boolean {
          return true;
        },
      },
      true
    ).then(done);
  });

  it('should get custom variable', done => {
    // Given
    const tracker = createTracker();
    const mockInstance = {
      getCustomVariable(...args: any[]): string {
        return args.join('|');
      },
    } as Partial<MatomoInstance> as MatomoInstance;

    spyOn(window._paq, 'push').and.callFake(((...args: any[]) => {
      args[0][0].call(mockInstance);
    }) as any);

    // When
    tracker
      .getCustomVariable(0, 'page')
      .then(url => {
        // Then
        expect(url).toEqual('0|page');
      })
      .then(done);
  });

  it('should get custom variable', done => {
    // Given
    const tracker = createTracker();
    const mockInstance = {
      getCustomDimension(...args: any[]): string {
        return 'dim-' + args.join('|');
      },
    } as Partial<MatomoInstance> as MatomoInstance;

    spyOn(window._paq, 'push').and.callFake(((...args: any[]) => {
      args[0][0].call(mockInstance);
    }) as any);

    // When
    tracker
      .getCustomDimension(42)
      .then(url => {
        // Then
        expect(url).toEqual('dim-42');
      })
      .then(done);
  });

  it('should ignore calls when disabled', () => {
    // Given
    const tracker = createTracker(true);
    (window as any)._paq = undefined;

    // Then
    expect(() => tracker.trackPageView()).not.toThrow();
    expect(window._paq).toBeUndefined();
  });

  it('should reject all promises when disabled', done => {
    // Given
    const tracker = createTracker(true);

    // Then
    tracker
      .getCustomDimension(0)
      .then(() => fail('rejected promise expected'))
      .catch(() => {
        expect().nothing();
        done();
      });
  });

  it('should ignore calls when platform is not browser', () => {
    // Given
    const tracker = createTracker(false, PLATFORM_SERVER_ID);
    (window as any)._paq = undefined;

    // Then
    expect(() => tracker.trackPageView()).not.toThrow();
    expect(window._paq).toBeUndefined();
  });

  it('should reject all promises when platform is not browser', done => {
    // Given
    const tracker = createTracker(false, PLATFORM_SERVER_ID);

    // Then
    tracker
      .getCustomDimension(0)
      .then(() => fail('rejected promise expected'))
      .catch(() => {
        expect().nothing();
        done();
      });
  });
});
