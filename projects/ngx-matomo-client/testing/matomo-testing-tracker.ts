import { inject, Injectable } from '@angular/core';
import { MatomoInstance, MatomoTracker } from 'ngx-matomo-client/core';
import { MATOMO_TESTING_INSTANCE } from './matomo-testing-instance';

/**
 * No-op implementation of {@link MatomoTracker}
 *
 * All commands are memoized and can later be retrieved using
 * {@link getAllCommands getAllCommands()} or {@link getCommand getCommand(index)}.
 *
 * All <i>getter</i> methods will immediately resolve to an <i>empty value</i>.
 * This can be customized by setting a custom Matomo instance with {@link setMatomoInstance setMatomoInstance()}.
 */
@Injectable()
export class MatomoTestingTracker extends MatomoTracker {
  #fakeInstance: MatomoInstance = inject(MATOMO_TESTING_INSTANCE);
  #paq: unknown[][] = [];

  /** Retrieve the current Matomo instance */
  getMatomoInstance(): MatomoInstance {
    return this.#fakeInstance;
  }

  /**
   * Set the current matomo instance
   *
   * @deprecated will be removed in a future version and injected from DI token `MATOMO_TESTING_INSTANCE` instead
   * @see MATOMO_TESTING_INSTANCE
   */
  setMatomoInstance(instance: MatomoInstance) {
    this.#fakeInstance = instance;
  }

  /** Retrieve all memoized commands */
  getAllCommands(): unknown[][] {
    return [...this.#paq];
  }

  /** Retrieve nth memoized command */
  getCommand(index: number): unknown[] | undefined {
    return this.#paq[index];
  }

  /** Clear all memoized commands */
  reset() {
    this.#paq = [];
  }

  protected push(command: unknown[]): void {
    this.#paq.push(command);
  }

  protected async pushFn<T>(fn: (matomo: MatomoInstance) => T): Promise<T> {
    return fn(this.#fakeInstance);
  }
}
