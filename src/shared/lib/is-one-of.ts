/** A guard for a list's values: `isOneOf(THEMES)` tells a Theme from anything else. */
export const isOneOf =
  <T>(values: readonly T[]) =>
  (value: unknown): value is T =>
    (values as readonly unknown[]).includes(value)
