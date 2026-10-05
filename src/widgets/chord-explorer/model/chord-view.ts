import {
  buildChord,
  fitInversion,
  fitParts,
  noteFromParam,
  placeChord,
  type BuiltChord,
  type NoteParam,
  type PlacedChord,
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

/**
 * A view changed: its parts made to fit one another (a size the triad has, a 7th, added tone and
 * alterations the chord can take), and its inversion one the chord has, else the last.
 */
export function changedView(view: ChordView, change: Partial<ChordView>): ChordView {
  const next = { ...view, ...change }
  const parts = fitParts(partsFromParams(next))
  const notes = buildChord(noteFromParam(next.root), parts).tones.length
  return {
    ...next,
    ...partsParams(parts),
    inversion: fitInversion(next.inversion, notes),
  }
}
