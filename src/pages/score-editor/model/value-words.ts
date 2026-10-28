import type { Duration, TupletCount } from '@/shared/lib/notation'

/** Each value's word, as the locales' `values` (the value's button) and `caret.values` key it. */
export const VALUE_WORDS = {
  1: 'whole',
  2: 'half',
  4: 'quarter',
  8: 'eighth',
  16: 'sixteenth',
  32: 'thirtySecond',
  64: 'sixtyFourth',
} as const satisfies Readonly<Record<Duration['value'], string>>

/** Each value's glyph (Noto Music). */
export const VALUE_GLYPHS = {
  1: '𝅝',
  2: '𝅗𝅥',
  4: '𝅘𝅥',
  8: '𝅘𝅥𝅮',
  16: '𝅘𝅥𝅯',
  32: '𝅘𝅥𝅰',
  64: '𝅘𝅥𝅱',
} as const satisfies Readonly<Record<Duration['value'], string>>

/** Each tuplet's word, as the locales' `tuplets` (its key) and `caret.tuplets` key it (ADR 0097). */
export const TUPLET_WORDS = {
  2: 'duplet',
  3: 'triplet',
  4: 'quadruplet',
  5: 'quintuplet',
  6: 'sextuplet',
  7: 'septuplet',
  8: 'octuplet',
  9: 'nonuplet',
} as const satisfies Readonly<Record<TupletCount, string>>
