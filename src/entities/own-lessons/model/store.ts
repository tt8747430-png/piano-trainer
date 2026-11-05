import type { StoreApi } from 'zustand/vanilla'
import { updatesLesson } from '@/entities/lesson'
import { createSavedStore, isRecord, savedObject, type SavingOptions } from '@/shared/lib'
import {
  isOwnCourseId,
  isOwnLessonId,
  MOST_OWN,
  OWN_LINE_MAX,
  ownLook,
  ownName,
  ownNumber,
  type OwnCourse,
  type OwnLesson,
  type OwnLessonId,
} from './types'

export const OWN_LESSONS_STORAGE_KEY = 'pt-own-lessons'
export const OWN_LESSONS_VERSION = 1

/** The lessons and courses the learner made (R30-5), each in the order made. */
export interface OwnLessonsState {
  readonly lessons: readonly OwnLesson[]
  readonly courses: readonly OwnCourse[]
  /** The next own lesson's and course's numbers: a deleted id is never given again. */
  readonly nextLesson: number
  readonly nextCourse: number
}

export type OwnLessonsStore = StoreApi<OwnLessonsState>

export const INITIAL_OWN_LESSONS: OwnLessonsState = {
  lessons: [],
  courses: [],
  nextLesson: 1,
  nextCourse: 1,
}

export const createOwnLessonsStore = (saving: SavingOptions = {}): OwnLessonsStore =>
  createSavedStore(
    {
      key: OWN_LESSONS_STORAGE_KEY,
      version: OWN_LESSONS_VERSION,
      initial: INITIAL_OWN_LESSONS,
      read: sanitize,
    },
    saving,
  )

/** An id a course may list: an own lesson's, or an app lesson's (a word of letters, digits, dashes). */
const isLessonRef = (value: unknown): value is string =>
  typeof value === 'string' && /^[a-z0-9][a-z0-9-]{0,99}$/.test(value)

/** A saved own lesson that reads as a lesson under its own id. */
const ownLesson = (saved: unknown): OwnLesson | null =>
  isRecord(saved) && isOwnLessonId(saved['id']) && updatesLesson(saved['id'], saved)
    ? { ...saved, id: saved['id'] }
    : null

/** A saved own course: its id, a name, a line, a cover, and lessons that are there, each once. */
function ownCourse(saved: unknown, own: ReadonlySet<OwnLessonId>): OwnCourse | null {
  if (!isRecord(saved)) return null
  const { id, title, line, look, lessons } = saved
  const name = typeof title === 'string' ? ownName(title) : null
  if (!isOwnCourseId(id) || !name) return null
  const refs = (Array.isArray(lessons) ? lessons : []).filter(
    (ref): ref is string => isLessonRef(ref) && (!isOwnLessonId(ref) || own.has(ref)),
  )
  return {
    id,
    title: name,
    line: typeof line === 'string' ? line.trim().slice(0, OWN_LINE_MAX) : '',
    look: ownLook(look),
    lessons: [...new Set(refs)],
  }
}

/** Each item once, by id, up to the most kept. */
function once<T extends { readonly id: string }>(items: readonly (T | null)[]): T[] {
  const seen = new Set<string>()
  return items.flatMap((item) => {
    if (!item || seen.has(item.id) || seen.size >= MOST_OWN) return []
    seen.add(item.id)
    return [item]
  })
}

const counter = (value: unknown, past: number) =>
  Math.max(typeof value === 'number' && Number.isSafeInteger(value) ? value : 1, past, 1)

/** Stored JSON is untrusted: what reads is kept, a course listing only own lessons still there. */
function sanitize(persisted: unknown): OwnLessonsState {
  const saved = savedObject<OwnLessonsState>(persisted)
  const lessons = once((Array.isArray(saved.lessons) ? saved.lessons : []).map(ownLesson))
  const own = new Set(lessons.map((lesson) => lesson.id))
  const courses = once(
    (Array.isArray(saved.courses) ? saved.courses : []).map((course) => ownCourse(course, own)),
  )
  return {
    lessons,
    courses,
    nextLesson: counter(saved.nextLesson, Math.max(0, ...lessons.map((l) => ownNumber(l.id))) + 1),
    nextCourse: counter(saved.nextCourse, Math.max(0, ...courses.map((c) => ownNumber(c.id))) + 1),
  }
}
