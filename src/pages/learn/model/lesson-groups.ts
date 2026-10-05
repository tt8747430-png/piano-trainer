import { LESSON_MODULES, LESSONS, type Lesson, type LessonModule } from '@/entities/lesson'

/** The lessons under their modules, both in the order they are taught; a module without lessons is left out. */
export function lessonGroups(
  lessons: readonly Lesson[] = LESSONS,
): { readonly module: LessonModule; readonly lessons: readonly Lesson[] }[] {
  return LESSON_MODULES.map((module) => ({
    module,
    lessons: lessons.filter((lesson) => lesson.module === module),
  })).filter((group) => group.lessons.length > 0)
}
