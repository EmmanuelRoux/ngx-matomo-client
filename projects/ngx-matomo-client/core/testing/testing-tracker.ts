import { ApplicationInitStatus, inject, Injectable, Provider } from '@angular/core';
import {
  InternalMatomoTracker,
  InternalMatomoTrackerType,
} from '../tracker/internal-matomo-tracker.service';
import { PrefixedType } from '../utils/types';

export function provideTestingTracker(): Provider[] {
  return [
    MatomoTestingTracker,
    {
      provide: InternalMatomoTracker,
      useExisting: MatomoTestingTracker,
    },
  ];
}

@Injectable()
export class MatomoTestingTracker<MATOMO = unknown, PREFIX extends string = ''>
  implements InternalMatomoTrackerType
{
  private readonly initStatus = inject(ApplicationInitStatus);

  /** Get list of all calls until initialization */
  callsOnInit: unknown[][] = [];
  /** Get list of all calls after initialization */
  callsAfterInit: unknown[][] = [];

  /** Get a copy of all calls since application startup */
  get calls(): unknown[] {
    return [...this.callsOnInit, ...this.callsAfterInit];
  }

  countCallsAfterInit(command: string): number {
    return this.callsAfterInit.filter(call => call[0] === command).length;
  }

  reset() {
    this.callsOnInit = [];
    this.callsAfterInit = [];
  }

  /** Asynchronously call provided method name on matomo tracker instance */
  async get<K extends keyof PrefixedType<MATOMO, PREFIX>>(_: K): Promise<never> {
    return Promise.reject('MatomoTracker is disabled');
  }

  push(arg: unknown[]): void {
    if (this.initStatus.done) {
      this.callsAfterInit.push(arg);
    } else {
      this.callsOnInit.push(arg);
    }
  }

  async pushFn<T>(_: (matomo: PrefixedType<MATOMO, PREFIX>) => T): Promise<T> {
    return Promise.reject('MatomoTracker is disabled');
  }
}
