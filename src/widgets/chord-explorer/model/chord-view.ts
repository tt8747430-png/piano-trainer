import {
  buildChord,
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
  type Voicing,
  type BuiltChord,
  type Midi,
  type KeyParam,
  type NoteParam,
  type PlacedChord,
  type Triad,
} from '@/shared/lib/music'
import { type PartsParams, partsFromParams, partsParams } from '@/shared/lib'
import type { PerformanceNote } from '@/shared/lib/arrangement'

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
  /** The key the chord was opened in (Harmony's or Progressions' chords): its colour notes follow its degree. */
  readonly key?: KeyParam | undefined
  /**
   * The chords on the staff, where there are two or more (up to `MOST_CHORDS`), and the one chosen:
   * the view's own parts are the chosen chord's, so its entry here is read from the view, never from
   * the list.
   */
  readonly chords?: readonly ChordStep[] | undefined
  readonly at?: number | undefined
}

/** One chord on the staff: its root, its type and its inversion; the voicing and hands are the page's. */
export interface ChordStep extends PartsParams {
  readonly root: NoteParam
  readonly inversion: number
}

/** The most chords the staff holds, as the canvas's. */
export const MOST_CHORDS = 8

/** The chord a view shows, as a step on the staff. */
export const stepOf = ({
  root,
  triad,
  size,
  seventh,
  colour,
  inversion,
}: ChordView): ChordStep => ({
  root,
  triad,
  size,
  seventh,
  colour,
  inversion,
})

/** The chords on the staff as steps, the chosen one read from the view. */
export function chordSteps(view: ChordView): ChordStep[] {
  const at = view.at ?? 0
  return view.chords && view.chords.length > 1
    ? view.chords.map((step, i) => (i === at ? stepOf(view) : step))
    : [stepOf(view)]
}

/** The page's own choices with a step's chord in them, fitted as a change is (`changedView`). */
const stepView = (view: ChordView, step: ChordStep): ChordView => changedView(view, step)

/** Each chord on the staff as a view of its own, in the page's voicing and hands. */
export const chordViews = (view: ChordView): ChordView[] =>
  chordSteps(view).map((step, i) => (i === (view.at ?? 0) ? view : stepView(view, step)))

/** The view with the steps given and the one at `at` chosen: one chord drops the list. */
function withSteps(view: ChordView, steps: readonly ChordStep[], at: number): ChordView {
  const step = steps[at] ?? stepOf(view)
  const chosen = stepView(view, step)
  return steps.length > 1
    ? { ...chosen, chords: steps.map((each, i) => (i === at ? stepOf(chosen) : each)), at }
    : { ...chosen, chords: undefined, at: undefined }
}

/** The chord at `at` chosen. */
export const choseChord = (view: ChordView, at: number): ChordView =>
  withSteps(view, chordSteps(view), at)

/** A chord added after the last, and chosen; none past `MOST_CHORDS`. */
export function addedChord(view: ChordView, step: ChordStep): ChordView {
  const steps = chordSteps(view)
  if (steps.length >= MOST_CHORDS) return view
  return withSteps(view, [...steps, step], steps.length)
}

/** The chord at `at` changed to another, and chosen. */
export const changedChord = (view: ChordView, at: number, step: ChordStep): ChordView =>
  withSteps(
    view,
    chordSteps(view).map((each, i) => (i === at ? step : each)),
    at,
  )

/** The chord at `at` taken off the staff, the one before it chosen; the last chord stays. */
export function removedChord(view: ChordView, at: number): ChordView {
  const steps = chordSteps(view)
  if (steps.length < 2) return view
  return withSteps(
    view,
    steps.filter((_, i) => i !== at),
    Math.max(0, at - 1),
  )
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

/** How long the hands hold a chord on the stage: as long as the page shows it. */
const HELD_TICKS = 1_000_000

/**
 * The chord as the hands play it on the stage (the 3D piano): each hand's keys held from the start,
 * each pressed by its finger, as the Player's hands play a performance's notes.
 */
export function chordPerformance(view: ChordView): PerformanceNote[] {
  const { placed, fingers } = viewChord(view)
  return (['lh', 'rh'] as const).flatMap((side) =>
    placed[side].map((key, at) => {
      const finger = fingers[side][at]
      return {
        midi: key.midi,
        spelled: key.tone.note,
        hand: side,
        startTick: 0,
        durationTicks: HELD_TICKS,
        velocity: 80,
        ...(finger === undefined ? {} : { finger }),
      }
    }),
  )
}
