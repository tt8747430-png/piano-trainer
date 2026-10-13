import type { ExerciseGroup } from '@/entities/exercise'

/**
 * The groups the Exercises page lists, in its order: a scale's and a chord's exercises open from their
 * own pages.
 */
export const LISTED_GROUPS = [
  'technique',
  'barryHarris',
  'jonny',
] as const satisfies readonly ExerciseGroup[]
export type ListedGroup = (typeof LISTED_GROUPS)[number]
