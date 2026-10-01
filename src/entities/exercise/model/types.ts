import type { Level } from '@/entities/path'
import type { LocalText } from '@/shared/i18n'
import type { Inversion, KeyWalk, ScaleKind } from '@/shared/lib/music'
import type { ExerciseChoice, FigureId, Octaves } from './choice'

/** Practice's exercise groups, in the order the page lists them (roadmap §10.5). */
export const EXERCISE_GROUPS = [
  'scales',
  'arpeggios',
  'chords',
  'barryHarris',
  'jonny',
  'progressions',
  'technique',
] as const
export type ExerciseGroup = (typeof EXERCISE_GROUPS)[number]

/** The exercises written by a rule of their own, in the Player at `/play/exercise/$exerciseId`. */
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

interface Described {
  readonly group: ExerciseGroup
  readonly level: Level
  readonly name: LocalText
  /** What it trains, in a line. */
  readonly trains: LocalText
  /** Whose idea it is, as they are known: `Barry Harris`, `Piano With Jonny`. */
  readonly source?: string
}

/** An exercise its own rule writes: its choices, and how it plays when the URL names none. */
export interface RuleExercise extends Described {
  readonly id: ExerciseId
  readonly fields: ExerciseFields
  readonly own: Partial<ExerciseChoice>
  readonly tempo: number
  readonly swing: boolean
}

/** Where an exercise another Player already plays opens, by what it names. */
export type ExerciseWay =
  | { readonly player: 'walk' }
  | { readonly player: 'chromatic' }
  | { readonly player: 'progression'; readonly numerals: string; readonly walk: KeyWalk }

/** An exercise played in another Player: the walk, the chromatic walk, a progression through the keys. */
export interface WayExercise extends Described {
  readonly id: string
  readonly opens: ExerciseWay
}

export type Exercise = RuleExercise | WayExercise

export const isRuleExercise = (exercise: Exercise): exercise is RuleExercise => 'fields' in exercise
