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

/**
 * A Setup change as the exercise's URL writes it: the root as a param, and each choice its own when
 * the exercise would play it anyway, left out.
 */
export function exercisePatch(
  exercise: RuleExercise,
  change: ExerciseChange,
): Partial<ExerciseSearch> {
  const own = exerciseChoice(exercise, {})
  const patch: Record<string, unknown> = {}
  for (const [field, value] of Object.entries(change) as [keyof ExerciseChoice, unknown][]) {
    if (field === 'root') {
      const root = change.root
      patch.root =
        root && pitchClassOf(root) !== pitchClassOf(own.root) ? noteParam(root) : undefined
    } else patch[field] = value === own[field] ? undefined : value
  }
  return patch as Partial<ExerciseSearch>
}
