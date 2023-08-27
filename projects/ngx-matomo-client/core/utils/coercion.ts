export type CssSizeInput = string | number | null | undefined;

export function requireNonNull<T>(value: T | null | undefined, message: string): T {
  if (value === null || value === undefined) {
    throw new Error('Unexpected ' + value + ' value: ' + message);
  }

  return value;
}

/** Coerce a data-bound value to a boolean */
export function coerceCssSizeBinding(value: CssSizeInput): string {
  if (value == null) {
    return '';
  }

  return typeof value === 'string' ? value : `${value}px`;
}
