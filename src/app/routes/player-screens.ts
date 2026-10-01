export { isExerciseId } from '@/entities/exercise'
import { repertoire, type PiecesState } from '@/entities/piece'
import { editorTarget } from '@/pages/score-editor'

/** The piece an id names in the learner's repertoire, where it opens in the Player. */
export const pieceIn = (state: PiecesState, id: string) => repertoire(state).piece(id)

/** Whether the score editor writes what an id names: a catalog song, study or listing, or an own song. */
export const editableIn = (state: PiecesState, id: string) => editorTarget(state, id) !== undefined
export { ScoreEditorPage } from '@/pages/score-editor'
export {
  ChromaticPlayerPage,
  ExercisePlayerPage,
  PlayerPage,
  ProgressionPlayerPage,
  WalkPlayerPage,
} from '@/pages/player'
