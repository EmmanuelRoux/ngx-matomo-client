export const ROUTER_ALREADY_INITIALIZED_ERROR = 'MatomoRouter has already been initialized';

export function invalidInterceptorsProviderError(): Error {
  return new Error(
    'An invalid MATOMO_ROUTER_INTERCEPTORS provider was configured. Did you forget to set "multi: true" ?',
  );
}
