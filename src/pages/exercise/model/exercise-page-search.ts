import type { Octaves, Tonality } from '@/entities/exercise'
import type { NoteParam } from '@/shared/lib/music'
import type { Hands } from '@/shared/lib/schedule'

/** An exercise's page as its URL holds it: what it starts at, each absent for the exercise's own. */
export interface ExercisePageSearch {
  readonly root?: NoteParam | undefined
  readonly tonality?: Tonality | undefined
  readonly hands?: Hands | undefined
  readonly octaves?: Octaves | undefined
  readonly tempo?: number | undefined
}
