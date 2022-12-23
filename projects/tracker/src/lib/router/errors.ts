export function invalidInterceptorsProviderError(): Error {
  return new Error(
    'An invalid MATOMO_ROUTER_INTERCEPTORS provider was configured. Did you forget to set "multi: true" ?'
  );
}
