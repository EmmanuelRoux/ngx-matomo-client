import { TestBed } from '@angular/core/testing';
import { Getters, Methods } from '../utils/types';
import { InternalMatomoTracker } from './internal-matomo-tracker.service';
import { MatomoInstance, MatomoTracker } from './matomo-tracker.service';

describe('MatomoTracker', () => {
  let delegate: jasmine.SpyObj<InternalMatomoTracker<MatomoInstance>>;
  let tracker: MatomoTracker;

  beforeEach(() => {
    delegate = jasmine.createSpyObj<InternalMatomoTracker<MatomoInstance>>([
      'get',
      'push',
      'pushFn',
    ]);

    TestBed.configureTestingModule({
      providers: [
        MatomoTracker,
        {
          provide: InternalMatomoTracker,
          useValue: delegate,
        },
      ],
    });

    tracker = TestBed.inject(MatomoTracker);
  });

  function expectPush(when: (tracker: MatomoTracker) => void, expected: unknown[][]): () => void {
    return () => {
      // When
      when(tracker);
      // Then
      const allArgs = delegate.push.calls.allArgs();

      expect(allArgs.length).toEqual(expected.length);

      for (let callIndex = 0; callIndex < allArgs.length; callIndex++) {
        const callArgs = allArgs[callIndex];
        expect(callArgs).toHaveSize(1);

        for (let argIndex = 0; argIndex < callArgs[0].length; argIndex++) {
          expect(callArgs[0][argIndex]).toEqual(expected[callIndex][argIndex]);
        }
      }
    };
  }

  function expectSimpleMethod<M extends Methods<MatomoTracker>>(
    method: M,
    args: Parameters<MatomoTracker[M]>,
    expectedArgs: unknown[] = args,
  ): () => void {
    return expectPush(t => (t[method] as any)(...args), [[method, ...expectedArgs]]);
  }

  function expectGetter<T, G extends Getters<MatomoTracker, Promise<T>>, E extends T = T>(
    getter: G,
    expected: E,
  ): Promise<void> {
    // Given
    delegate.get.and.returnValue(Promise.resolve(expected) as Promise<any>);

    // When
    return (tracker[getter]() as Promise<any>).then(url => {
      // Then
      expect(url).toEqual(expected);
    });
  }

  it('should track page view', expectSimpleMethod('trackPageView', []));

  it(
    'should track page view with custom title',
    expectSimpleMethod('trackPageView', ['custom title']),
  );

  it(
    'should track event',
    expectSimpleMethod('trackEvent', ['myCategory', 'myAction', 'myName', 42]),
  );

  it(
    'should track event without name/value',
    expectSimpleMethod('trackEvent', ['myCategory', 'myAction']),
  );

  it(
    'should track event with custom data',
    expectSimpleMethod('trackEvent', ['myCategory', 'myAction', 'name', 99, { customData: 'foo' }]),
  );

  it(
    'should track site search',
    expectSimpleMethod('trackSiteSearch', ['myKeyword', 'myCategory', 0, { customData: 'foo' }]),
  );

  it('should track goal', expectSimpleMethod('trackGoal', [1, 2, { customData: 'foo' }]));

  it(
    'should track link',
    expectSimpleMethod('trackLink', ['http://myUrl', 'link', { customData: 'foo' }]),
  );

  it(
    'should track download',
    expectSimpleMethod('trackLink', ['http://myUrl', 'download', { customData: 'foo' }]),
  );

  it('should track content impressions', expectSimpleMethod('trackAllContentImpressions', []));

  it(
    'should track visible content impressions',
    expectSimpleMethod('trackVisibleContentImpressions', [true, 42]),
  );

  it(
    'should track content impressions within node',
    expectSimpleMethod('trackContentImpressionsWithinNode', [document.createElement('div')]),
  );

  it(
    'should track content interaction with node',
    expectSimpleMethod('trackContentInteractionNode', [document.createElement('div'), 'test']),
  );

  it(
    'should track content impression',
    expectSimpleMethod('trackContentImpression', ['myContentName', 'myPiece', 'myTarget']),
  );

  it(
    'should track content interaction',
    expectSimpleMethod('trackContentInteraction', [
      'myInteraction',
      'myContentName',
      'myPiece',
      'myTarget',
    ]),
  );

  it(
    'should log all content blocks on page (for debugging purpose)',
    expectSimpleMethod('logAllContentBlocksOnPage', []),
  );

  it('should enable heartbeat timer', expectSimpleMethod('enableHeartBeatTimer', [42]));

  it(
    'should enable link tracking with pseudo-handler',
    expectSimpleMethod('enableLinkTracking', [true]),
  );

  it(
    'should enable link tracking with standard click handler',
    expectSimpleMethod('enableLinkTracking', [], [false]),
  );

  it('should disable performance tracking', expectSimpleMethod('disablePerformanceTracking', []));

  it('should enable cross domain linking', expectSimpleMethod('enableCrossDomainLinking', []));

  it(
    'should set cross domain linking timeout',
    expectSimpleMethod('setCrossDomainLinkingTimeout', [42]),
  );

  it('should get cross domain linking url parameter', done => {
    expectGetter('getCrossDomainLinkingUrlParameter', 'foo=bar').then(done);
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

  it(
    'should set performance timings',
    expectPush(
      tracker => {
        tracker.setPagePerformanceTiming(42, undefined, 100, undefined);
        tracker.setPagePerformanceTiming({ networkTimeInMs: 10, transferTimeInMs: 20 });
      },
      [
        ['setPagePerformanceTiming', 42, undefined, 100],
        ['setPagePerformanceTiming', 10, undefined, 20],
      ],
    ),
  );

  it('should get performance timings', done => {
    expectGetter('getCustomPagePerformanceTiming', 'test').then(done);
  });

  it('should append to tracking url', expectSimpleMethod('appendToTrackingUrl', ['?toAppend']));

  it('should set "DoNotTrack"', expectSimpleMethod('setDoNotTrack', [true]));

  it('should kill frame', expectSimpleMethod('killFrame', []));

  it('should redirect file', expectSimpleMethod('redirectFile', ['http://url']));

  it('should set heart beat timer', expectSimpleMethod('setHeartBeatTimer', [42, 42]));

  it('should set user id', expectSimpleMethod('setUserId', ['foo']));

  it('should reset user id', expectSimpleMethod('resetUserId', []));

  it('should set page view id', expectSimpleMethod('setPageViewId', ['my-id']));

  it('should get page view id', done => {
    expectGetter('getPageViewId', 'fake-id').then(done);
  });

  it(
    'should set custom data by key/value',
    expectPush(
      tracker => {
        tracker.setCustomData('customKey1', 'customValue1');
        tracker.setCustomData('customKey2', 'customValue2');
      },
      [
        ['setCustomData', 'customKey1', 'customValue1'],
        ['setCustomData', 'customKey2', 'customValue2'],
      ],
    ),
  );

  it('should overwrite custom data', expectSimpleMethod('setCustomData', [{ foo: 'bar' }]));

  it('should get custom data', done => {
    expectGetter('getCustomData', { foo: 'bar' }).then(done);
  });

  it(
    'should set custom variable',
    expectSimpleMethod('setCustomVariable', [1, 'name', 'value', 'page']),
  );

  it('should delete custom variable', expectSimpleMethod('deleteCustomVariable', [1, 'page']));

  it('should delete custom variables', expectSimpleMethod('deleteCustomVariables', ['page']));

  it(
    'should store custom variables in cookie',
    expectSimpleMethod('storeCustomVariablesInCookie', []),
  );

  it('should set custom dimension', expectSimpleMethod('setCustomDimension', [1, 'value']));

  it('should delete custom dimension', expectSimpleMethod('deleteCustomDimension', [1]));

  it('should set campaign name key', expectSimpleMethod('setCampaignNameKey', ['test']));

  it('should set campaign keyword key', expectSimpleMethod('setCampaignKeywordKey', ['test']));

  it(
    'should set conversion attribution first referrer',
    expectSimpleMethod('setConversionAttributionFirstReferrer', [true]),
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
      ],
    ),
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
      ],
    ),
  );

  it('should remove ecommerce item', expectSimpleMethod('removeEcommerceItem', ['sku']));

  it('should clear ecommerce cart', expectSimpleMethod('clearEcommerceCart', []));

  it('should get ecommerce items', done => {
    expectGetter<unknown[], 'getEcommerceItems'>('getEcommerceItems', [
      { productSKU: 'test' },
    ]).then(done);
  });

  it('should track ecommerce cart update', expectSimpleMethod('trackEcommerceCartUpdate', [999]));

  it('should track ecommerce order', expectSimpleMethod('trackEcommerceOrder', ['orderId', 999]));

  it('should require consent', expectSimpleMethod('requireConsent', []));

  it('should set consent given', expectSimpleMethod('setConsentGiven', []));

  it('should remember consent given', expectSimpleMethod('rememberConsentGiven', []));

  it('should forget consent given', expectSimpleMethod('forgetConsentGiven', []));

  it('should return whether has remembered consent', done => {
    expectGetter('hasRememberedConsent', true).then(done);
  });

  it('should return remembered consent', done => {
    expectGetter('getRememberedConsent', 99999).then(done);
  });

  it('should return whether consent is required', done => {
    expectGetter('isConsentRequired', true).then(done);
  });

  it('should require cookie consent', expectSimpleMethod('requireCookieConsent', []));

  it('should set cookie consent given', expectSimpleMethod('setCookieConsentGiven', []));

  it('should remember cookie consent given', expectSimpleMethod('rememberCookieConsentGiven', []));

  it('should forget cookie consent given', expectSimpleMethod('forgetCookieConsentGiven', []));

  it('should return remembered cookie consent', done => {
    expectGetter('getRememberedCookieConsent', 42).then(done);
  });

  it('should return whether cookies are enabled', () => expectGetter('areCookiesEnabled', true));

  it('should opt user out', expectSimpleMethod('optUserOut', []));

  it('should forget user opt out', expectSimpleMethod('forgetUserOptOut', []));

  it('should return whether user opted out', done => {
    expectGetter('isUserOptedOut', true).then(done);
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
    expectSimpleMethod('addListener', [document.createElement('div')]),
  );

  it('should set request method', expectSimpleMethod('setRequestMethod', ['method']));

  it(
    'should set custom request processing',
    expectSimpleMethod('setCustomRequestProcessing', [() => null]),
  );

  it(
    'should set request content type',
    expectSimpleMethod('setRequestContentType', ['application/test']),
  );

  it('should disable sendBeacon', expectSimpleMethod('disableAlwaysUseSendBeacon', []));

  it('should enable sendBeacon', expectSimpleMethod('alwaysUseSendBeacon', []));

  it('should send ping request', expectSimpleMethod('ping', []));

  it('should disable queue request', expectSimpleMethod('disableQueueRequest', []));

  it('should set requestQueueInterval', expectSimpleMethod('setRequestQueueInterval', [4200]));

  it('should enable JS error tracking', expectSimpleMethod('enableJSErrorTracking', []));

  it('should enable file tracking', expectSimpleMethod('enableFileTracking', []));

  it(
    'should set excluded single referrer',
    expectSimpleMethod('setExcludedReferrers', ['referrer'], [['referrer']]),
  );

  it(
    'should set multiple excluded referrers',
    expectSimpleMethod(
      'setExcludedReferrers',
      ['referrer1', 'referrer2', ['referrer3']],
      [['referrer1', 'referrer2', 'referrer3']],
    ),
  );

  it('should get Matomo url', done => {
    expectGetter('getMatomoUrl', 'http://fakeUrl').then(done);
  });

  it('should get Matomo url (deprecated)', done => {
    expectGetter('getPiwikUrl', 'http://fakeUrl').then(done);
  });

  it('should get current url', done => {
    expectGetter('getCurrentUrl', 'http://fakeUrl').then(done);
  });

  it('should get link tracking timer', done => {
    expectGetter('getLinkTrackingTimer', 42).then(done);
  });

  it('should get visitor id', done => {
    expectGetter('getVisitorId', 'foo').then(done);
  });

  it('should get visitor info', done => {
    expectGetter('getVisitorInfo', ['foo'] as unknown[]).then(done);
  });

  it('should get attribution info', done => {
    expectGetter('getAttributionInfo', ['foo']).then(done);
  });

  it('should get attribution campaign name', done => {
    expectGetter('getAttributionCampaignName', 'test').then(done);
  });

  it('should get attribution campaign keyword', done => {
    expectGetter('getAttributionCampaignKeyword', 'test').then(done);
  });

  it('should get attribution referrer timestamp', done => {
    expectGetter('getAttributionReferrerTimestamp', 'test').then(done);
  });

  it('should get attribution referrer url', done => {
    expectGetter('getAttributionReferrerUrl', 'test').then(done);
  });

  it('should get user id', done => {
    expectGetter('getUserId', 'test').then(done);
  });

  it('should get has cookies', done => {
    expectGetter('hasCookies', true).then(done);
  });

  it('should get custom variable', async () => {
    // Given
    const mockInstance = {
      getCustomVariable(...args: any[]): string {
        return args.join('|');
      },
    } as Partial<MatomoInstance> as MatomoInstance;

    delegate.pushFn.and.callFake(fn => Promise.resolve(fn(mockInstance)));

    // When
    const result = await tracker.getCustomVariable(0, 'page');

    expect(result).toEqual('0|page');
  });

  it('should get custom dimension', async () => {
    // Given
    const mockInstance = {
      getCustomDimension(...args: any[]): string {
        return 'dim-' + args.join('|');
      },
    } as Partial<MatomoInstance> as MatomoInstance;

    delegate.pushFn.and.callFake(fn => Promise.resolve(fn(mockInstance)));

    // When
    const result = await tracker.getCustomDimension(42);

    expect(result).toEqual('dim-42');
  });

  it('should get excluded referrers', () => expectGetter('getExcludedReferrers', ['referrer1']));

  it(
    'should disable browser feature detection',
    expectSimpleMethod('disableBrowserFeatureDetection', []),
  );

  it(
    'should enable browser feature detection',
    expectSimpleMethod('enableBrowserFeatureDetection', []),
  );

  it('should disable campaign parameters', expectSimpleMethod('disableCampaignParameters', []));
});
