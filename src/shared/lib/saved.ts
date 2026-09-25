/** A saved object's fields, each still to be checked: stored JSON is untrusted. */
export type Saved<T> = Partial<Record<keyof T, unknown>>

/** Whether stored JSON is an object with fields: not null, not an array. */
export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

/** Stored JSON read as an object whose fields are still to be checked; anything else has none. */
export const savedObject = <T>(value: unknown): Saved<T> =>
  (isRecord(value) ? value : {}) as Saved<T>
