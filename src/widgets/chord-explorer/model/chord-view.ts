import {
  blockFingering,
  buildChord,
  chordInversions,
  fitChordInversion,
  fitParts,
  sizesOf,
  noteFromParam,
  placeChord,
  placedFingering,
  TWO_HANDS_FROM,
  voiceChord,
  voicingBar,
  type ChordFingers,
  type Finger,
  type Hand,
  type SpelledNote,
  type Voicing,
  type BuiltChord,
  type Midi,
  type NoteParam,
  type PlacedChord,
  type Triad,
} from '@/shared/lib/music'
import { type PartsParams, partsFromParams, partsParams } from '@/shared/lib'

/**
 * What the Chords explorer shows: a chord built part by part on a root, in a voicing, in an inversion,
 * in one hand or two. Close, from five notes a chord takes two hands whatever `hands` says (ADR
 * 0046): `hands` stays the learner's choice for the chords one hand holds; every other voicing says
 * its own hands.
 */
export interface ChordView extends PartsParams {
  readonly root: NoteParam
  readonly voicing: Voicing
  readonly inversion: number
  readonly hands: 'rh' | 'both'
}

/** Whether a chord of this many notes is shown in two hands only. */
export const takesTwoHands = (notes: number): boolean => notes >= TWO_HANDS_FROM

/** The chord a view builds, its keys in the view's voicing, and each hand's fingers on them. */
export function viewChord(view: ChordView): {
  chord: BuiltChord
  placed: PlacedChord
  fingers: ChordFingers
} {
  const chord = buildChord(noteFromParam(view.root), partsFromParams(view))
  const placed =
    view.voicing === 'close'
      ? placeChord(chord.tones, {
          inversion: view.inversion,
          bothHands: view.hands === 'both' || takesTwoHands(chord.tones.length),
        })
      : voiceChord(chord.tones, view.voicing, view.inversion)
  return { chord, placed, fingers: placedFingering(placed) }
}

/** The keys a chord's placement strikes, the left hand's first: what its Play sounds. */
export function chordKeys(view: ChordView): Midi[] {
  const { placed } = viewChord(view)
  return [...placed.lh, ...placed.rh].map((key) => key.midi)
}

/** A suspended triad: its 3rd's place taken by a 2nd or 4th. */
export const isSuspended = (triad: Triad): triad is 'sus2' | 'sus4' =>
  triad === 'sus2' || triad === 'sus4'

/**
 * A view changed: its parts made to fit one another (a size the triad has, a 7th, added tones and
 * alterations the chord can take; a suspension dropped where the size chosen cannot take it), its
 * inversion one the chord has, else the nearest under it (`fitChordInversion`), and its voicing one
 * that can lay the chord out, else close.
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
    voicing: voicingBar(tones, next.voicing) ? 'close' : next.voicing,
    inversion: fitChordInversion(next.inversion, tones),
  }
}

/** One hand's keys in a row of the fingering table: each note's name and the finger on it. */
export interface HandRow {
  readonly notes: readonly SpelledNote[]
  readonly fingers: readonly Finger[]
}

/** A row of the fingering table: an inversion of the close chord, or the keys as voiced. */
export interface FingeringRow {
  readonly inversion: number | 'voiced'
  /** The row the keys show. */
  readonly current: boolean
  readonly hands: Readonly<Record<Hand, HandRow>>
}

/**
 * The chord's fingering table. Close, up to four notes: a row an inversion, each hand fingering the
 * whole chord (`blockFingering`), as the books teach a chord. From five notes, or in another voicing:
 * one row, each hand's own keys as they are laid out.
 */
export function fingeringRows(view: ChordView): FingeringRow[] {
  const { chord, placed, fingers } = viewChord(view)
  if (view.voicing !== 'close' || takesTwoHands(chord.tones.length)) {
    const hand = (side: Hand): HandRow => ({
      notes: placed[side].map((key) => key.tone.note),
      fingers: fingers[side],
    })
    return [{ inversion: 'voiced', current: true, hands: { lh: hand('lh'), rh: hand('rh') } }]
  }
  const rows = blockFingering(chord.tones)
  return chordInversions(chord.tones).map((inversion, i) => {
    const notes = placeChord(chord.tones, { inversion, bothHands: false }).rh.map(
      (key) => key.tone.note,
    )
    const row = rows[i] ?? { lh: [], rh: [] }
    return {
      inversion,
      current: inversion === view.inversion,
      hands: { lh: { notes, fingers: row.lh }, rh: { notes, fingers: row.rh } },
    }
  })
}
