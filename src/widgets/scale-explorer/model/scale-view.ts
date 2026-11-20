import {
  type ComparedScale,
  type Fingering,
  type NoteParam,
  type ScaleKind,
} from '@/shared/lib/music'
import type { Hands, PracticeRhythm, RunDirection } from '@/shared/lib/schedule'

/**
 * The one layer of labels the run's staff shows (R34, D3), chosen in place: the playing hand's
 * fingers, each note's degree, or the whole and half steps between the notes.
 */
export const STAFF_MARKS = ['fingers', 'degrees', 'steps'] as const
export type StaffMarks = (typeof STAFF_MARKS)[number]

/** A run's octaves on the Scales page: one to four, as the scale books practise them (R29-P9). */
export const MIN_OCTAVES = 1
export const MAX_OCTAVES = 4
export type RunOctaves = 1 | 2 | 3 | 4

/** What the Scales explorer shows: the scale, what its keys carry, and how it is practised. */
export interface ScaleView {
  readonly root: NoteParam
  readonly kind: ScaleKind
  /** The degree the run starts on, 1 the tonic. */
  readonly start: number
  /** The staff's one layer of labels. */
  readonly marks: StaffMarks
  /** How many octaves the run climbs: one to four. */
  readonly octaves: RunOctaves
  /** Which way the run goes; absent, up and back down. */
  readonly direction?: Exclude<RunDirection, 'both'>
  /** The scale on the same tonic its notes are compared with (Scale view, A43); absent, none. */
  readonly compare?: ComparedScale
  /** How the run is fingered; absent, as its start is (`ownFingering`). */
  readonly fingering?: Fingering
  readonly rhythm: PracticeRhythm
  readonly tempo: number
  /** The hand that plays the run, or both; its fingers stand under the keys (the right hand's for both). */
  readonly hands: Hands
}
