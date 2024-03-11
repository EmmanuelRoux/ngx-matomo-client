export function appendTrailingSlash(str: string): string {
  return str.endsWith('/') ? str : `${str}/`;
}
