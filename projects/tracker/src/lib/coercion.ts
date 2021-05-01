export function requireNonNull<T>(value: T | null | undefined, message: string): T {
  if (value === null || value === undefined) {
    throw new Error('Unexpected ' + value + ' value: ' + message);
  }

  return value;
}
