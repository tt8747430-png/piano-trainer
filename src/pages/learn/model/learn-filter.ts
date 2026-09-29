import type { LessonCategory } from '@/entities/lesson'
import type { Level } from '@/entities/path'

/** What narrows Learn's lessons: a level, a category. */
export interface LearnFilter {
  readonly level: Level | 'any'
  readonly category: LessonCategory | 'any'
}
