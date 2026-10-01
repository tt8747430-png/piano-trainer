import { isOneOf } from '@/shared/lib'
import {
  FINGERINGS,
  INVERSIONS,
  SCALE_KINDS,
  type ChordQuality,
  type Fingering,
  type Inversion,
  type ScaleKind,
  type SpelledNote,
} from '@/shared/lib/music'
import type { ChordToneFrom } from '@/shared/lib/exercise'

// What an exercise is played from, as its URL holds it: apart from the rules that write it, so the
// router's validators carry no generator into the first paint.

export const OCTAVES = [1, 2, 3, 4] as const
export type Octaves = (typeof OCTAVES)[number]

/** The arpeggio types (roadmap §10.4): minor, major and neutral by feel. */
export const ARPEGGIO_QUALITIES = [
  'maj',
  'min',
  'dim',
  'aug',
  'sus2',
  'sus4',
  'd7',
  'maj7',
  'm7',
  'mM7',
  'hd',
  'o7',
  's5',
] as const satisfies readonly ChordQuality[]
export type ArpeggioQuality = (typeof ARPEGGIO_QUALITIES)[number]

/** A sequence's figure, by the degrees it plays from where it starts (1 is that note). */
export const FIGURES = {
  '1234': [0, 1, 2, 3],
  '1324': [0, 2, 1, 3],
  '1235': [0, 1, 2, 4],
  '1353': [0, 2, 4, 2],
  '3212': [2, 1, 0, 1],
} as const satisfies Record<string, readonly number[]>
export type FigureId = keyof typeof FIGURES
export const FIGURE_IDS = Object.keys(FIGURES) as FigureId[]

export const VOICINGS = ['close', 'drop2'] as const
export type Voicing = (typeof VOICINGS)[number]

/** The chord tone a line starts on. */
export const CHORD_TONES = [
  'root',
  'third',
  'fifth',
  'seventh',
] as const satisfies readonly ChordToneFrom[]

export const TONALITIES = ['major', 'minor'] as const
export type Tonality = (typeof TONALITIES)[number]

/** Everything an exercise can be played from; each exercise reads only what its fields name. */
export interface ExerciseChoice {
  readonly root: SpelledNote
  readonly kind: ScaleKind
  readonly octaves: Octaves
  /** Start on: a degree of the scale, 0 its tonic. */
  readonly start: number
  readonly fingering: Fingering
  readonly quality: ArpeggioQuality
  readonly inversion: Inversion
  readonly figure: FigureId
  readonly voicing: Voicing
  readonly from: ChordToneFrom
  readonly tonality: Tonality
}

export const isOctaves = isOneOf(OCTAVES)
export const isArpeggioQuality = isOneOf(ARPEGGIO_QUALITIES)
export const isFigureId = isOneOf(FIGURE_IDS)
export const isVoicing = isOneOf(VOICINGS)
export const isChordTone = isOneOf(CHORD_TONES)
export const isTonality = isOneOf(TONALITIES)
export const isFingering = isOneOf(FINGERINGS)
export const isExerciseInversion = isOneOf(INVERSIONS)
export const isExerciseKind = isOneOf(SCALE_KINDS)
