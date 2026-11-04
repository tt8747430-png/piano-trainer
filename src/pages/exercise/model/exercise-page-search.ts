import type { Octaves, Tonality } from '@/entities/exercise'
import type { HanonNumber, HanonRhythm } from '@/shared/lib/exercise'
import type { NoteParam } from '@/shared/lib/music'
import type { Hands } from '@/shared/lib/schedule'

/** An exercise's page as its URL holds it: what it starts at, each absent for the exercise's own. */
export interface ExercisePageSearch {
  readonly root?: NoteParam | undefined
  readonly tonality?: Tonality | undefined
  readonly hands?: Hands | undefined
  readonly octaves?: Octaves | undefined
  readonly tempo?: number | undefined
  /** Which of Hanon's exercises, for Hanon's page. */
  readonly hanon?: HanonNumber | undefined
  /** The rhythm Hanon's figures are played in. */
  readonly rhythm?: HanonRhythm | undefined
  /** The tempo speed training climbs to; absent, none set. */
  readonly target?: number | undefined
  /** The order Next key takes after each pass: round the circle of fifths, or up by half steps. */
  readonly order?: KeyOrder | undefined
}

/** The orders Next key takes, the circle of fifths absent. */
export type KeyOrder = 'chromatic'
