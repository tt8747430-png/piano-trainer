import { blankLesson } from '@/entities/lesson'
import {
  MOST_OWN,
  ownLessonId,
  ownName,
  ownTitle,
  type OwnLesson,
  type OwnLessonId,
  type OwnLessonsStore,
} from '@/entities/own-lessons'

/**
 * New lesson (R30-5): a blank lesson of this name, last in Your lessons, under the next number.
 * Hands back its id; null, and nothing made, for a name empty once trimmed or too long, or past the
 * most kept.
 */
export function createOwnLesson(store: OwnLessonsStore, name: string): OwnLessonId | null {
  const kept = ownName(name)
  const { lessons, nextLesson } = store.getState()
  if (!kept || lessons.length >= MOST_OWN) return null
  const id = ownLessonId(nextLesson)
  const lesson: OwnLesson = { ...blankLesson(id), id, title: ownTitle(kept) }
  store.setState({ lessons: [...lessons, lesson], nextLesson: nextLesson + 1 })
  return id
}
