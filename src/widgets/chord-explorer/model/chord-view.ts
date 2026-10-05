import {
  buildChord,
  fitInversion,
  fitParts,
  sizesOf,
  noteFromParam,
  placeChord,
  type BuiltChord,
  type NoteParam,
  type PlacedChord,
  type Triad,
} from '@/shared/lib/music'
import { type PartsParams, partsFromParams, partsParams } from '@/shared/lib'

/** What the Chords explorer shows: a chord built part by part on a root, in an inversion, in one hand or two. */
export interface ChordView extends PartsParams {
  readonly root: NoteParam
  readonly inversion: number
  readonly hands: 'rh' | 'both'
}

/** The chord a view builds, and its keys. */
export function viewChord(view: ChordView): { chord: BuiltChord; placed: PlacedChord } {
  const chord = buildChord(noteFromParam(view.root), partsFromParams(view))
  const placed = placeChord(chord.tones, {
    inversion: view.inversion,
    bothHands: view.hands === 'both',
  })
  return { chord, placed }
}

/** A suspended triad: its 3rd's place taken by a 2nd or 4th. */
export const isSuspended = (triad: Triad): triad is 'sus2' | 'sus4' =>
  triad === 'sus2' || triad === 'sus4'

/**
 * A view changed: its parts made to fit one another (a size the triad has, a 7th, added tones and
 * alterations the chord can take; a suspension dropped where the size chosen cannot take it), and its
 * inversion one the chord has, else the last.
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
  const notes = buildChord(noteFromParam(next.root), parts).tones.length
  return {
    ...next,
    ...partsParams(parts),
    inversion: fitInversion(next.inversion, notes),
  }
}
