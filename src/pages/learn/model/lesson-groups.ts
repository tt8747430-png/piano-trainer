import { LESSON_MODULES, LESSONS, type Lesson, type LessonModule } from '@/entities/lesson'
import type { LearnFilter } from './learn-filter'

/** The lessons a filter keeps, under their modules in order; a module it empties is left out. */
export function lessonGroups(
  filter: LearnFilter,
  lessons: readonly Lesson[] = LESSONS,
): { readonly module: LessonModule; readonly lessons: readonly Lesson[] }[] {
  const kept = lessons.filter(
    (lesson) =>
      (filter.level === 'any' || lesson.level === filter.level) &&
      (filter.category === 'any' || lesson.category === filter.category),
  )
  return LESSON_MODULES.map((module) => ({
    module,
    lessons: kept.filter((lesson) => lesson.module === module),
  })).filter((group) => group.lessons.length > 0)
}
