import { BookOpen, Hand } from 'lucide-react'
import type { Tile } from '@/shared/ui'
import type { ExerciseGroup } from '../model/types'

/**
 * The books of exercises listed on their own, in order (R30-4; a scale's and a chord's exercises open
 * from their pages), each with its tile, the same on Practice and in the Exercises library: technique
 * the hand, the masters' books a book.
 */
export const EXERCISE_BOOKS = {
  technique: { icon: Hand, paint: 'yellow' },
  barryHarris: { icon: BookOpen, paint: 'lilac' },
  jonny: { icon: BookOpen, paint: 'sky' },
} as const satisfies Partial<Record<ExerciseGroup, Tile>>
export type ExerciseBook = keyof typeof EXERCISE_BOOKS
export const BOOK_IDS: readonly ExerciseBook[] = ['technique', 'barryHarris', 'jonny']
