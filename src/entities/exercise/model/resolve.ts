import {
  fingeringsOf,
  note,
  noteFromParam,
  ownFingering,
  pitchClassOf,
  qualityRootSpelling,
  scaleIntervals,
  scaleRootSpelling,
  tonicSpelling,
  type NoteParam,
  type PitchClass,
  type SpelledNote,
} from '@/shared/lib/music'
import type { ExerciseChoice } from './choice'
import type { Exercise } from './types'

/** An exercise's params as its URL holds them, each read and checked by the router; absent is its own. */
export type ExerciseParams = {
  readonly root?: NoteParam
} & Partial<Omit<ExerciseChoice, 'root'>>

/** What every exercise plays when neither it nor its URL names a choice. */
const BASE: ExerciseChoice = {
  root: note('C'),
  kind: 'major',
  octaves: 1,
  start: 0,
  fingering: 'scale',
  quality: 'maj',
  inversion: 0,
  figure: '1234',
  voicing: 'close',
  from: 'root',
  tonality: 'major',
}

/** A value the exercise allows, or its own. */
const allowed = <T>(value: T | undefined, allows: readonly T[] | true | undefined, own: T): T =>
  value !== undefined && (allows === true || allows?.includes(value)) ? value : own

/** A root spelled by the exercise's rule: as its scale, its chord or its key. */
export function exerciseRootSpelling(
  exercise: Exercise,
  pc: PitchClass,
  choice: Pick<ExerciseChoice, 'kind' | 'quality' | 'tonality'>,
): SpelledNote {
  switch (exercise.fields.root) {
    case 'scale':
      return scaleRootSpelling(pc, choice.kind)
    case 'chord':
      return qualityRootSpelling(pc, choice.quality)
    case 'key':
      return tonicSpelling(pc, choice.tonality === 'minor')
  }
}

/**
 * An exercise's choice from its URL: each param it takes and allows, else its own, else the base; a
 * Start on past its scale's notes is the tonic, and a fingering the run cannot take its own.
 */
export function exerciseChoice(exercise: Exercise, params: ExerciseParams): ExerciseChoice {
  const { fields } = exercise
  const own = { ...BASE, ...exercise.own }
  const kind = allowed(params.kind, fields.kind, own.kind)
  const startParam = fields.start ? (params.start ?? own.start) : own.start
  const start = startParam < scaleIntervals(kind).length ? startParam : 0
  const fingering = allowed(
    fields.fingering ? params.fingering : undefined,
    fingeringsOf(kind, start),
    ownFingering(kind, start),
  )
  const rest = {
    kind,
    octaves: allowed(params.octaves, fields.octaves, own.octaves),
    start,
    fingering,
    quality: allowed(params.quality, fields.quality, own.quality),
    inversion: allowed(params.inversion, fields.inversion, own.inversion),
    figure: allowed(params.figure, fields.figure, own.figure),
    voicing: allowed(params.voicing, fields.voicing, own.voicing),
    from: allowed(params.from, fields.from, own.from),
    tonality: allowed(params.tonality, fields.tonality, own.tonality),
  }
  const root = params.root ? noteFromParam(params.root) : own.root
  return { root: exerciseRootSpelling(exercise, pitchClassOf(root), rest), ...rest }
}
