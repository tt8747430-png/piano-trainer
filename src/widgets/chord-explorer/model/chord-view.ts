import {
  buildChord,
  fitChordInversion,
  fitParts,
  sizesOf,
  noteFromParam,
  placeChord,
  TWO_HANDS_FROM,
  type BuiltChord,
  type NoteParam,
  type PlacedChord,
  type Triad,
} from '@/shared/lib/music'
import { type PartsParams, partsFromParams, partsParams } from '@/shared/lib'

/**
 * What the Chords explorer shows: a chord built part by part on a root, in an inversion, in one hand
 * or two. From five notes a chord takes two hands whatever `hands` says (ADR 0035): `hands` stays the
 * learner's choice for the chords one hand holds.
 */
export interface ChordView extends PartsParams {
  readonly root: NoteParam
  readonly inversion: number
  readonly hands: 'rh' | 'both'
}

/** Whether a chord of this many notes is shown in two hands only. */
export const takesTwoHands = (notes: number): boolean => notes >= TWO_HANDS_FROM

/** The chord a view builds, and its keys. */
export function viewChord(view: ChordView): { chord: BuiltChord; placed: PlacedChord } {
  const chord = buildChord(noteFromParam(view.root), partsFromParams(view))
  const placed = placeChord(chord.tones, {
    inversion: view.inversion,
    bothHands: view.hands === 'both' || takesTwoHands(chord.tones.length),
  })
  return { chord, placed }
}

/** A suspended triad: its 3rd's place taken by a 2nd or 4th. */
export const isSuspended = (triad: Triad): triad is 'sus2' | 'sus4' =>
  triad === 'sus2' || triad === 'sus4'

/**
 * A view changed: its parts made to fit one another (a size the triad has, a 7th, added tones and
 * alterations the chord can take; a suspension dropped where the size chosen cannot take it), and its
 * inversion one the chord has, else the nearest under it (`fitChordInversion`).
 */
export function changedView(view: ChordView, change: Partial<ChordView>): ChordView {
  const asked = { ...view, ...change }
  // The size is chosen before the suspension: a size the suspension cannot take drops it, not the size.
  const next =
    change.size !== undefined &&
    isSuspended(asked.triad) &&
    !sizesOf(asked.triad).includes(asked.size)
      ? { ...asked, triad: 'maj' as const }
      : asked
  const parts = fitParts(partsFromParams(next))
  const { tones } = buildChord(noteFromParam(next.root), parts)
  return {
    ...next,
    ...partsParams(parts),
    inversion: fitChordInversion(next.inversion, tones),
  }
}
