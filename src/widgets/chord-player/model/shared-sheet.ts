import type { ChordSheet, SheetSection } from '@/shared/lib/arrangement'
import type { Key } from '@/shared/lib/music'

/** The most parts kept: well over a long song's sections, at a few keys. */
const MOST = 256
const sections = new Map<string, SheetSection>()
const keys = new Map<string, Key>()

/** The value kept for one like it, else this one, kept. */
function kept<T>(cache: Map<string, T>, value: T): T {
  const id = JSON.stringify(value)
  const there = cache.get(id)
  if (there) return there
  if (cache.size >= MOST) cache.clear()
  cache.set(id, value)
  return value
}

/**
 * A sheet whose key and sections are the very objects of an earlier sheet's like them: the sheet is
 * read again from its text on every edit, and an edit to one section then redraws that section's
 * chords alone (a long song's 127 boxes otherwise, each time).
 */
export function shareSections(sheet: ChordSheet): ChordSheet {
  return {
    ...sheet,
    key: kept(keys, sheet.key),
    sections: sheet.sections.map((section) => kept(sections, section)),
  }
}
