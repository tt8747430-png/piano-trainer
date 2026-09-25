import { parseNoteName, type SpelledNote } from '@/shared/lib/music'

/** `raw` when the guard accepts it, else the fallback: the one rule for a search param. */
export const valueOr = <T>(is: (value: unknown) => value is T, raw: unknown, fallback: T): T =>
  is(raw) ? raw : fallback

/** A whole number from min to max, as a number or as text; else the fallback. */
export function wholeIn<F>(raw: unknown, min: number, max: number, fallback: F): number | F {
  const value = typeof raw === 'string' && raw.trim() !== '' ? Number(raw) : raw
  return typeof value === 'number' && Number.isInteger(value) && value >= min && value <= max
    ? value
    : fallback
}

/** A note with at most one sharp or flat (a URL offers no double accidental); null for anything else. */
export function readNote(raw: unknown): SpelledNote | null {
  const note = typeof raw === 'string' ? parseNoteName(raw) : null
  return note && Math.abs(note.accidental) <= 1 ? note : null
}
