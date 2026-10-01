export { isExerciseId } from '@/entities/exercise'
import { repertoire, type PiecesState } from '@/entities/piece'

/** The piece an id names in the learner's repertoire, where it opens in the Player. */
export const pieceIn = (state: PiecesState, id: string) => repertoire(state).piece(id)
export {
  ChromaticPlayerPage,
  ExercisePlayerPage,
  PlayerPage,
  ProgressionPlayerPage,
  WalkPlayerPage,
} from '@/pages/player'
