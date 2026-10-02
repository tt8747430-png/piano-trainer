import type { Duration } from '@/shared/lib/notation'

/** Each value's word, as the locales' `values` (the value's button) and `caret.values` key it. */
export const VALUE_WORDS = {
  1: 'whole',
  2: 'half',
  4: 'quarter',
  8: 'eighth',
  16: 'sixteenth',
  32: 'thirtySecond',
} as const satisfies Readonly<Record<Duration['value'], string>>
