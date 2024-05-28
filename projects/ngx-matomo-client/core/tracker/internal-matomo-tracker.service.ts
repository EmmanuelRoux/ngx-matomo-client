import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, NgZone, PLATFORM_ID } from '@angular/core';
import { initializeMatomoHolder, MatomoHolder } from '../holder';
import { Getters, NonEmptyArray, PrefixedType } from '../utils/types';
import { INTERNAL_MATOMO_CONFIGURATION } from './configuration';

declare const window: MatomoHolder;

type ReturnType<T> = T extends (...args: any) => infer R ? R : any;

function trimTrailingUndefinedElements<T>(array: T[]): T[] {
  const trimmed = [...array];

  while (trimmed.length > 0 && trimmed[trimmed.length - 1] === undefined) {
    trimmed.pop();
  }

  return trimmed;
}

type InternalMatomoTrackerType = Pick<
  InternalMatomoTracker<unknown, string>,
  'get' | 'push' | 'pushFn'
>;

export function createInternalMatomoTracker(): InternalMatomoTrackerType {
  const disabled = inject(INTERNAL_MATOMO_CONFIGURATION).disabled;
  const isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  return disabled || !isBrowser ? new NoopMatomoTracker() : new InternalMatomoTracker();
}

@Injectable({
  providedIn: 'root',
  useFactory: createInternalMatomoTracker,
})
export class InternalMatomoTracker<MATOMO, PREFIX extends string = ''> {
  private readonly ngZone = inject(NgZone);
  private readonly config = inject(INTERNAL_MATOMO_CONFIGURATION);

  constructor() {
    initializeMatomoHolder();
  }

  /** Asynchronously call provided method name on matomo tracker instance */
  get<K extends Getters<PrefixedType<MATOMO, PREFIX>>>(
    getter: K extends keyof PrefixedType<MATOMO, PREFIX> ? K : never,
  ): Promise<ReturnType<PrefixedType<MATOMO, PREFIX>[K]>> {
    return this.pushFn(matomo => (matomo[getter as keyof PrefixedType<MATOMO, PREFIX>] as any)());
  }

  pushFn<T>(fn: (matomo: PrefixedType<MATOMO, PREFIX>) => T): Promise<T> {
    return new Promise(resolve => {
      this.push([
        function (this: PrefixedType<MATOMO, PREFIX>): void {
          resolve(fn(this));
        },
      ]);
    });
  }

  push(args: NonEmptyArray<unknown>): void {
    if (this.config.runOutsideAngularZone) {
      this.ngZone.runOutsideAngular(() => {
        window._paq.push(trimTrailingUndefinedElements(args));
      });
    } else {
      window._paq.push(trimTrailingUndefinedElements(args));
    }
  }
}

export class NoopMatomoTracker<MATOMO = unknown, PREFIX extends string = ''>
  implements InternalMatomoTrackerType
{
  /** Asynchronously call provided method name on matomo tracker instance */
  async get<K extends keyof PrefixedType<MATOMO, PREFIX>>(_: K): Promise<never> {
    return Promise.reject('MatomoTracker is disabled');
  }

  push(_: unknown[]): void {
    // No-op
  }

  async pushFn<T>(_: (matomo: PrefixedType<MATOMO, PREFIX>) => T): Promise<T> {
    return Promise.reject('MatomoTracker is disabled');
  }
}
