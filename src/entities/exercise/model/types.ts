import type { Level } from '@/entities/path'
import type { LocalText } from '@/shared/i18n'
import type { Inversion, ScaleKind } from '@/shared/lib/music'
import type { ExerciseChoice, FigureId, Octaves } from './choice'

/** The exercise groups, in the catalogue's order: a scale's and a chord's open from their pages, the rest from Exercises. */
export const EXERCISE_GROUPS = ['scales', 'arpeggios', 'barryHarris', 'jonny', 'technique'] as const
export type ExerciseGroup = (typeof EXERCISE_GROUPS)[number]

/** The exercises, each written by a rule of its own, in the Player at `/play/exercise/$exerciseId`. */
export const EXERCISE_IDS = [
  'scale',
  'thirds',
  'sixths',
  'groups',
  'contrary',
  'arpeggio',
  'sixth-diminished',
  'sixth-diminished-chords',
  'dominant-scale',
  'from-third',
  'drop-two',
  'two-five-one-scale',
  'inner-voice',
  'modes',
  'rapid-switch',
  'pattern-shifting',
  'five-finger',
  'hanon',
] as const
export type ExerciseId = (typeof EXERCISE_IDS)[number]

/**
 * The choices an exercise's rule takes, each with what it allows; what an exercise leaves out it
 * plays its own way. Its root is always a choice, spelled by its rule: as its scale, its chord, or its
 * key.
 */
export interface ExerciseFields {
  readonly root: 'scale' | 'chord' | 'key'
  readonly kind?: readonly ScaleKind[]
  readonly octaves?: readonly Octaves[]
  readonly start?: true
  readonly fingering?: true
  readonly quality?: true
  readonly inversion?: readonly Inversion[]
  readonly figure?: readonly FigureId[]
  readonly voicing?: true
  readonly from?: true
  readonly tonality?: true
}
export type ExerciseField = Exclude<keyof ExerciseFields, 'root'>

/** An exercise: what it is called and trains, the choices its rule takes, and how it plays when the URL names none. */
export interface Exercise {
  readonly id: ExerciseId
  readonly group: ExerciseGroup
  readonly level: Level
  readonly name: LocalText
  /** What it trains, in a line (whose idea it is, its group says). */
  readonly trains: LocalText
  readonly fields: ExerciseFields
  readonly own: Partial<ExerciseChoice>
  readonly tempo: number
  readonly swing: boolean
}
