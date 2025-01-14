import { DOCUMENT } from '@angular/common';
import { inject, Injectable, INJECTOR, runInInjectionContext } from '@angular/core';
import { MATOMO_SCRIPT_FACTORY } from '../tracker/script-factory';
import { requireNonNull } from './coercion';

@Injectable({ providedIn: 'root' })
export class ScriptInjector {
  private readonly scriptFactory = inject(MATOMO_SCRIPT_FACTORY);
  private readonly injector = inject(INJECTOR);
  private readonly document = inject(DOCUMENT);

  injectDOMScript(scriptUrl: string): void {
    const scriptElement = runInInjectionContext(this.injector, () =>
      this.scriptFactory(scriptUrl, this.document),
    );
    const selfScript = requireNonNull(
      this.document.getElementsByTagName('script')[0],
      'no existing script found',
    );
    const parent = requireNonNull(selfScript.parentNode, "no script's parent node found");

    parent.insertBefore(scriptElement, selfScript);
  }
}
