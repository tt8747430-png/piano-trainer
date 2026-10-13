import {
  LESSON_MODULES,
  nextLesson,
  TAB_MODULES,
  type LearnTab,
  type Lesson,
  type LessonModule,
} from '@/entities/lesson'
import { lessonLearnedId } from '@/entities/progress'
import { lessonGroups } from './lesson-groups'

/**
 * Learn's URL (ADR 0042): the tab shown, and the modules open in it, dot-separated; without `open`, the
 * module the learner is at is open, and with it empty, none.
 */
export interface LearnView {
  readonly tab: LearnTab
  readonly open?: string
}

/** When each lesson was marked learned, by its learned id. */
type Learned = Readonly<Partial<Record<string, string>>>

const isLearned = (learned: Learned, lesson: Lesson) =>
  learned[lessonLearnedId(lesson.id)] !== undefined

/**
 * The lesson to continue with in a tab: the first not learned after the one learned last, along its
 * track; none where nothing in the tab is learned, or nothing after it is left.
 */
export function lessonToContinue(tab: LearnTab, learned: Learned): Lesson | undefined {
  const last = lessonGroups(tab)
    .flatMap((group) => group.lessons)
    .flatMap((lesson) => {
      const date = learned[lessonLearnedId(lesson.id)]
      return date === undefined ? [] : [{ lesson, date }]
    })
    .reduce<{ lesson: Lesson; date: string } | undefined>(
      (latest, each) => (latest === undefined || each.date > latest.date ? each : latest),
      undefined,
    )
  let next = last ? nextLesson(last.lesson.id) : undefined
  while (next && isLearned(learned, next)) next = nextLesson(next.id)
  return next
}

/**
 * The modules open in a tab: the URL's, of this tab; else the one of the lesson to continue with, else
 * the first not all learned, else the first.
 */
export function openModules(view: LearnView, learned: Learned): ReadonlySet<LessonModule> {
  const inTab = TAB_MODULES[view.tab]
  if (view.open !== undefined) {
    const named = new Set(view.open.split('.'))
    return new Set(inTab.filter((module) => named.has(module)))
  }
  const groups = lessonGroups(view.tab)
  const at =
    lessonToContinue(view.tab, learned)?.module ??
    groups.find((group) => group.lessons.some((lesson) => !isLearned(learned, lesson)))?.module ??
    groups[0]?.module
  return new Set(at ? [at] : [])
}

/** The URL's `open` once a module is opened or folded: the modules left open, in Learn's order. */
export function withToggled(open: ReadonlySet<LessonModule>, module: LessonModule): string {
  const next = new Set(open)
  if (next.has(module)) next.delete(module)
  else next.add(module)
  return LESSON_MODULES.filter((each) => next.has(each)).join('.')
}
