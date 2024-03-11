export function throwFormNotFoundError(selector: string): never {
  throw new Error(`Directive ${selector} can only be used inside [matomoTrackForm]`);
}
