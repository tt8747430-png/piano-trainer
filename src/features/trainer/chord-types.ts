import { CHORD_QUALITIES, partsOf, type BuiltSize, type ChordQuality } from '@/shared/lib/music'

/** The sizes a chord trainer's Custom asks, as the chord trainer's types sheet names them. */
export const TYPE_SIZES = ['triads', 'sevenths', 'ninths', 'elevenths', 'thirteenths'] as const
/** The suspensions it may add. */
export const TYPE_SUSPENDED = ['sus2', 'sus4'] as const
/** The added tones it may add: a 6th, a 6th and 9th, a 9th. */
export const TYPE_ADDED = ['six', 'sixNine', 'add9'] as const

const SIZE: Readonly<Record<(typeof TYPE_SIZES)[number], BuiltSize>> = {
  triads: 5,
  sevenths: 7,
  ninths: 9,
  elevenths: 11,
  thirteenths: 13,
}

/** The types of chord a run asks: its sizes, then the suspensions, added tones and alterations on. */
export interface ChordTypes {
  readonly sizes: readonly (typeof TYPE_SIZES)[number][]
  readonly suspended: readonly (typeof TYPE_SUSPENDED)[number][]
  readonly added: readonly (typeof TYPE_ADDED)[number][]
  readonly altered: boolean
}

/** The added tones a chord's parts write, as `TYPE_ADDED` names them; null for none. */
function addedType(added: readonly string[]): (typeof TYPE_ADDED)[number] | null {
  if (added.includes('add6')) return added.includes('add9') ? 'sixNine' : 'six'
  return added.includes('add9') ? 'add9' : null
}

/**
 * The table's chords of the types chosen, in the table's order: a chord of a size chosen, whose
 * suspension, added tones and alterations are each on where it has them.
 */
export function chordTypes(types: ChordTypes): ChordQuality[] {
  const sizes = types.sizes.map((size) => SIZE[size])
  return CHORD_QUALITIES.filter((quality) => {
    const parts = partsOf(quality)
    if (!sizes.includes(parts.size)) return false
    if (parts.triad === 'sus2' || parts.triad === 'sus4') {
      if (!types.suspended.includes(parts.triad)) return false
    }
    const added = addedType(parts.added)
    if (added !== null && !types.added.includes(added)) return false
    return parts.alterations.length === 0 || types.altered
  })
}
