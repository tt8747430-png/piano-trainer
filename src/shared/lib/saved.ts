/** A saved object's fields, each still to be checked: stored JSON is untrusted. */
type Saved<T> = Partial<Record<keyof T, unknown>>

/** Whether stored JSON is an object with fields: not null, not an array. */
export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

/** Stored JSON read as an object whose fields are still to be checked; anything else has none. */
export function savedObject<T>(value: unknown): Saved<T> {
  const saved: Saved<T> = {}
  if (isRecord(value)) Object.assign(saved, value)
  return saved
}
