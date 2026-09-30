import { midi, parseNoteName, PIANO, type Midi, type SpelledNote } from '@/shared/lib/music'

/** `raw` when the guard accepts it, else the fallback: the one rule for a search param. */
export const valueOr = <T>(is: (value: unknown) => value is T, raw: unknown, fallback: T): T =>
  is(raw) ? raw : fallback

/** Text as typed; a number as written, since the router reads `?q=1999` as one; else the fallback. */
export function readText(raw: unknown, fallback: string): string {
  return typeof raw === 'string' ? raw : typeof raw === 'number' ? String(raw) : fallback
}

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

/** Keys written `60-64-67` (one key a number): each a whole number on the piano, each once, lowest first. */
export function readKeyList(raw: unknown): Midi[] {
  const written = typeof raw === 'number' ? [raw] : typeof raw === 'string' ? raw.split('-') : []
  const keys = written
    .map(Number)
    .filter((key) => Number.isInteger(key) && key >= PIANO.from && key <= PIANO.to)
  return [...new Set(keys)].sort((a, b) => a - b).map((key) => midi(key))
}

/** Keys as a URL holds them, `60-64-67`: each once, lowest first. */
export const keyListParam = (keys: readonly Midi[]): string =>
  [...new Set(keys)].sort((a, b) => a - b).join('-')
