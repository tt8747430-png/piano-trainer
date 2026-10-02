import {
  exerciseChoice,
  type ExerciseChoice,
  type ExerciseParams,
  type RuleExercise,
} from '@/entities/exercise'
import { noteParam, pitchClassOf } from '@/shared/lib/music'
import type { PracticeView } from '@/widgets/practice-player'

/**
 * An exercise's URL: how the Player goes, and the exercise's choices; absent is its own, swing too
 * (the 2-5-1 scale is swung).
 */
export type ExerciseSearch = Omit<PracticeView, 'swing'> & {
  readonly swing?: boolean
} & ExerciseParams

/** What an exercise's Setup changes: any of its choices. */
export type ExerciseChange = Partial<ExerciseChoice>

/** The Player's view of an exercise: its swing, or the exercise's own. */
export const exerciseView = (exercise: RuleExercise, search: ExerciseSearch): PracticeView => ({
  ...search,
  swing: search.swing ?? exercise.swing,
})

/** A change of the Player's view as the URL writes it: swing as the exercise's own is left out. */
export const viewPatch = (
  exercise: RuleExercise,
  patch: Partial<PracticeView>,
): Partial<ExerciseSearch> =>
  'swing' in patch
    ? { ...patch, swing: patch.swing === exercise.swing ? undefined : patch.swing }
    : patch

/** A choice as the URL writes it: none where it is the exercise's own. */
const unlessOwn = <T>(value: T | undefined, own: T): T | undefined =>
  value === own ? undefined : value

/**
 * A Setup change as the exercise's URL writes it: the root as a param, and each choice its own when
 * the exercise would play it anyway, left out; a choice the change does not name stays as it is.
 */
export function exercisePatch(
  exercise: RuleExercise,
  change: ExerciseChange,
): Partial<ExerciseSearch> {
  const own = exerciseChoice(exercise, {})
  const { root } = change
  return {
    ...('root' in change && {
      root: root && pitchClassOf(root) !== pitchClassOf(own.root) ? noteParam(root) : undefined,
    }),
    ...('kind' in change && { kind: unlessOwn(change.kind, own.kind) }),
    ...('octaves' in change && { octaves: unlessOwn(change.octaves, own.octaves) }),
    ...('start' in change && { start: unlessOwn(change.start, own.start) }),
    ...('fingering' in change && { fingering: unlessOwn(change.fingering, own.fingering) }),
    ...('quality' in change && { quality: unlessOwn(change.quality, own.quality) }),
    ...('inversion' in change && { inversion: unlessOwn(change.inversion, own.inversion) }),
    ...('figure' in change && { figure: unlessOwn(change.figure, own.figure) }),
    ...('voicing' in change && { voicing: unlessOwn(change.voicing, own.voicing) }),
    ...('from' in change && { from: unlessOwn(change.from, own.from) }),
    ...('tonality' in change && { tonality: unlessOwn(change.tonality, own.tonality) }),
  }
}
