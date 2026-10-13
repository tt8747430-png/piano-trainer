import {
  LESSONS,
  TAB_MODULES,
  type LearnTab,
  type Lesson,
  type LessonModule,
} from '@/entities/lesson'

export interface LessonGroup {
  readonly module: LessonModule
  readonly lessons: readonly Lesson[]
}

/** A tab's lessons under their modules, both in the order they are taught; a module without lessons is left out. */
export function lessonGroups(tab: LearnTab, lessons: readonly Lesson[] = LESSONS): LessonGroup[] {
  return TAB_MODULES[tab]
    .map((module) => ({ module, lessons: lessons.filter((lesson) => lesson.module === module) }))
    .filter((group) => group.lessons.length > 0)
}
