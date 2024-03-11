/** Extract from a type T all getter-like method keys, optionally filtered by those returning type U */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Getters<T, U = any> = keyof T &
  {
    [P in keyof T]: T[P] extends () => U ? P : never;
  }[keyof T];

/** Extract all methods from a type T */
export type Methods<T> = keyof T &
  {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [P in keyof T]: T[P] extends (...args: any[]) => any ? P : never;
  }[keyof T];

export type RequireAtLeastOne<T> = {
  [K in keyof T]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<keyof T, K>>>;
}[keyof T];

export type NonEmptyArray<T> = [T, ...T[]];
export type NonEmptyReadonlyArray<T> = Readonly<NonEmptyArray<T>>;

export type PublicInterface<T> = { [K in keyof T]: T[K] };

export type Prefixed<S, PREFIX extends string> = S extends string ? `${PREFIX}${S}` : never;

export type PrefixedType<MATOMO, PREFIX extends string> = {
  [K in keyof MATOMO as Prefixed<K, PREFIX>]: MATOMO[K];
};
