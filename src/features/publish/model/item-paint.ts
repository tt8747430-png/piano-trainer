import type { Paint } from '@/shared/ui'

/** The paints a published item's tile may wear: every one of the chrome's. */
const PAINTS = ['sky', 'sand', 'grass', 'lilac', 'yellow'] as const satisfies readonly Paint[]

/**
 * What a published song's or pattern's tile is painted (or its author's mark): one of the chrome's
 * paints, drawn from its id, so the Public library's rows read apart as Songs' folders do and an item
 * wears the same paint wherever it shows.
 */
export function itemPaint(id: string): Paint {
  let hash = 0
  for (const char of id) hash = (hash * 31 + (char.codePointAt(0) ?? 0)) >>> 0
  return PAINTS[hash % PAINTS.length] ?? 'sky'
}
