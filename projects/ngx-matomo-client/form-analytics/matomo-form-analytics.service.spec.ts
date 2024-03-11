import { TestBed } from '@angular/core/testing';
import {
  ɵGetters as Getters,
  ɵInternalMatomoTracker as InternalMatomoTracker,
  ɵMethods as Methods,
} from 'ngx-matomo-client/core';
import { MatomoFormAnalytics, MatomoFormAnalyticsInstance } from './matomo-form-analytics.service';

describe('MatomoFormAnalytics', () => {
  let delegate: jasmine.SpyObj<
    InternalMatomoTracker<MatomoFormAnalyticsInstance, 'FormAnalytics::'>
  >;
  let formAnalytics: MatomoFormAnalytics;

  beforeEach(() => {
    delegate = jasmine.createSpyObj<
      InternalMatomoTracker<MatomoFormAnalyticsInstance, 'FormAnalytics::'>
    >(['get', 'push', 'pushFn']);

    TestBed.configureTestingModule({
      providers: [
        {
          provide: InternalMatomoTracker,
          useValue: delegate,
        },
      ],
    });

    formAnalytics = TestBed.inject(MatomoFormAnalytics);
  });

  function expectPush(
    when: (tracker: MatomoFormAnalytics) => void,
    expected: unknown[][],
  ): () => void {
    return () => {
      // When
      when(formAnalytics);
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

  function expectSimpleMethod<M extends Methods<MatomoFormAnalytics>>(
    method: M,
    args: Parameters<MatomoFormAnalytics[M]>,
    expectedArgs: unknown[] = args,
  ): () => void {
    return expectPush(
      t => (t[method] as any)(...args),
      [[`FormAnalytics::${method}`, ...expectedArgs]],
    );
  }

  function expectGetter<T, E extends T = T>(
    getter: Getters<MatomoFormAnalytics, Promise<T>>,
    expected: E,
  ): Promise<void> {
    // Given
    delegate.get.and.returnValue(Promise.resolve(expected) as Promise<any>);

    // When
    return (formAnalytics[getter]() as Promise<any>).then(url => {
      // Then
      expect(url).toEqual(expected);
    });
  }

  it('should disable form analytics', expectSimpleMethod('disableFormAnalytics', []));

  it('should enable form analytics', expectSimpleMethod('enableFormAnalytics', []));

  it('should enable debug mode', expectSimpleMethod('enableDebugMode', []));

  it('should set tracking timer', expectSimpleMethod('setTrackingTimer', [123]));

  it('should scan for forms', expectSimpleMethod('scanForForms', []));

  it(
    'should scan for forms withing provided element',
    expectSimpleMethod('scanForForms', [document.createElement('div')]),
  );

  it('should track form', expectSimpleMethod('trackForm', [document.createElement('form')]));

  it(
    'should track form submit',
    expectSimpleMethod('trackFormSubmit', [document.createElement('form')]),
  );

  it(
    'should track form conversion',
    expectSimpleMethod('trackFormConversion', [document.createElement('form')]),
  );

  it(
    'should track form conversion by name',
    expectSimpleMethod('trackFormConversion', ['my-form-name']),
  );

  it(
    'should track form conversion by id',
    expectSimpleMethod('trackFormConversion', ['', 'my-form-id']),
  );

  it('should check whether debug mode is enabled', () =>
    expectGetter('isFormAnalyticsEnabled', true));
});
