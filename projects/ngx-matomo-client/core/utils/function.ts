function coerceErrorHandler<T, ARGS extends unknown[]>(
  errorOrHandler: string | ((...args: ARGS) => T | never),
): (...args: ARGS) => T | never {
  return typeof errorOrHandler === 'string'
    ? () => {
        throw new Error(errorOrHandler);
      }
    : errorOrHandler;
}

/** Wrap a function to ensure it is called only once, ignoring all subsequent calls */
export function runOnce<T, ARGS extends unknown[]>(
  fn: (...args: ARGS) => T,
): (...args: ARGS) => T | void;
/** Wrap a function to ensure it is called only once, calling an error handler otherwise */
export function runOnce<T, ARGS extends unknown[], U = T>(
  fn: (...args: ARGS) => T,
  errorOrHandler: string | ((...args: ARGS) => U | never),
): (...args: ARGS) => T | U;
export function runOnce<T, ARGS extends unknown[], U = T>(
  fn: (...args: ARGS) => T,
  errorOrHandler?: string | ((...args: ARGS) => U | never),
): (...args: ARGS) => T | U | void {
  const errorHandler = errorOrHandler ? coerceErrorHandler(errorOrHandler) : () => undefined;
  let run = false;

  return (...args: ARGS) => {
    if (run) {
      return errorHandler(...args);
    }

    run = true;

    return fn(...args);
  };
}
