// Make vitest utility types globally available in spec files,
// matching the way vitest/globals makes vi, describe, etc. available at runtime.
declare type Mocked<T> = import('vitest').Mocked<T>;
declare type MockedFunction<T extends (...args: any[]) => any> = import('vitest').MockedFunction<T>;
