import type { Key } from './key'
import { pitchClassOf } from './note'
import { hasMinorThird, numeralChord, numeralText, type Numeral } from './numerals'

/** The ways a progression leads into each of its chords (ADR 0112): by the chord's own V, or its ii–V. */
export const LEAD_INS = ['v', 'ii-v'] as const
export type LeadIn = (typeof LEAD_INS)[number]

/**
 * The chords that lead into one: its V, after its ii for `ii-v` (a half-diminished ii before a chord
 * with a minor 3rd, the minor ii–V). The key's tonic in the key's mode takes the key's own ii and V;
 * any other chord takes them applied, read in its key (`V/vi`, `ii°/vi`).
 */
function leadInto(chord: Numeral, lead: LeadIn, key: Key): Numeral[] {
  const minor = hasMinorThird(chord.quality)
  const home = chord.degree === 0 && chord.shift === 0 && minor === key.minor
  const of = home ? {} : { of: { degree: chord.degree, shift: chord.shift, minor } }
  const dominant: Numeral = { degree: 4, shift: 0, quality: 'maj', ...of }
  const two: Numeral = { degree: 1, shift: 0, quality: minor ? 'dim' : 'min', ...of }
  return lead === 'v' ? [dominant] : [two, dominant]
}

/**
 * A progression with each chord led into, made a key for a moment: after its own V, or its ii–V
 * (`leadInto`). A chord held from the one before and a chord already applied (`V/vi`) take none, and a
 * lead-in starts after a chord it would repeat: a chord after the chord that sounds as its V is not
 * led again, and after the one that sounds as its ii takes its V alone.
 */
export function withLeadIns(numerals: readonly Numeral[], lead: LeadIn, key: Key): Numeral[] {
  // A chord as it sounds in the key: its root, and whether its 3rd is minor.
  const sound = (numeral: Numeral) =>
    `${pitchClassOf(numeralChord(numeral, key, 'triads').root)} ${hasMinorThird(numeral.quality)}`
  const played: Numeral[] = []
  numerals.forEach((chord, at) => {
    const before = numerals[at - 1]
    const held = before !== undefined && numeralText(before) === numeralText(chord)
    if (!chord.of && !held) {
      const leads = leadInto(chord, lead, key)
      const last = played.at(-1)
      // After the lead-in's V nothing more; after its ii, its V alone.
      const from = last ? leads.findLastIndex((leading) => sound(leading) === sound(last)) : -1
      played.push(...leads.slice(from + 1))
    }
    played.push(chord)
  })
  return played
}
