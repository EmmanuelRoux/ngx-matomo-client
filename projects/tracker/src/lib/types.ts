/** Extract from a type T all getter-like method keys, optionally filtered by those returning type U */
export type Getters<T, U = any> = keyof T &
  {
    [P in keyof T]: T[P] extends () => U ? P : never;
  }[keyof T];

/** Extract all methods from a type T */
export type Methods<T> = keyof T &
  {
    [P in keyof T]: T[P] extends (...args: any[]) => any ? P : never;
  }[keyof T];
