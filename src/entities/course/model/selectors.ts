import { keptContent } from '@/shared/api/content'
import type { PieceId } from '@/entities/piece'
import { courseLessonStepId, type Stage, type StepId } from '@/entities/step'
import { updatesLesson, type Lesson } from '@/entities/lesson'
import { COURSES } from '../content'
import { isWholeCourse, updatesCourse, type Course, type Shelf } from './types'

let built = {
  revision: -1,
  courses: COURSES,
  index: new Map(COURSES.map((course) => [course.id, course])) as ReadonlyMap<string, Course>,
}

/**
 * The courses: the app's own under the database's records (ADR 0116). A kept course record gives the
 * title, the summary and the lessons in order; each listed lesson is the database's copy (kept by
 * `<course>/<lesson>`) where it reads as the lesson, else the app's own, and one with neither is
 * passed over (not yet published). A kept record of a course the app does not have, with its shelf,
 * stage and weeks, is a course an editor made: listed after the app's own. Built again when the kept
 * content changes.
 */
function catalog(): typeof built {
  const kept = keptContent()
  if (kept.revision === built.revision) return built
  // A course's lessons as its record lists them: each the database's copy where it reads, else the
  // app's own; one with neither is passed over (not yet published).
  const lessonsOf = (courseId: string, ids: readonly string[], own: ReadonlyMap<string, Lesson>) =>
    ids.flatMap((id) => {
      const body = kept.body('lesson', `${courseId}/${id}`)
      if (updatesLesson(id, body)) return [body]
      const builtIn = own.get(id)
      return builtIn ? [builtIn] : []
    })
  const own = COURSES.map((course) => {
    const record = kept.body('course', course.id)
    const renamed = updatesCourse(course.id, record)
    const lessonsById = new Map(course.lessons.map((lesson) => [lesson.id, lesson]))
    const ids = renamed && record.lessons ? record.lessons : [...lessonsById.keys()]
    const lessons = lessonsOf(course.id, ids, lessonsById)
    const relessoned =
      lessons.length !== course.lessons.length ||
      lessons.some((lesson, i) => lesson !== course.lessons[i])
    if (!renamed && !relessoned) return course
    return {
      ...course,
      ...(renamed
        ? {
            title: record.title,
            summary: record.summary,
            shelf: record.shelf ?? course.shelf,
            stage: record.stage ?? course.stage,
            weeks: record.weeks ?? course.weeks,
          }
        : {}),
      ...(relessoned ? { lessons } : {}),
    }
  })
  const builtIn = new Set(COURSES.map((course) => course.id))
  const made = kept.ids('course').flatMap((id): Course[] => {
    const record = kept.body('course', id)
    if (builtIn.has(id) || !updatesCourse(id, record) || !isWholeCourse(record)) return []
    const { title, summary, shelf, stage, weeks } = record
    const lessons = lessonsOf(id, record.lessons, new Map())
    return [{ id, title, summary, shelf, stage, weeks, lessons, songs: [] }]
  })
  const courses = [...own, ...made]
  built = {
    revision: kept.revision,
    courses,
    index: new Map(courses.map((course) => [course.id, course])),
  }
  return built
}

export const courseById = (id: string): Course | undefined => catalog().index.get(id)

/** Every course as the learner has it, the app's own then the ones editors made, the database's newer copies in place. */
export const allCourses = (): readonly Course[] => catalog().courses

/** Every course's id, the app's own and the ones editors made: what a new course's id must not be. */
export const courseIds = (): readonly string[] => [...catalog().index.keys()]

/** A shelf's courses, in the order Courses lists them. */
export const coursesOn = (shelf: Shelf): readonly Course[] =>
  catalog().courses.filter((course) => course.shelf === shelf)

/** A course's lesson and its number there from 1; undefined for one the course does not have. */
export interface CourseLessonPlace {
  readonly course: Course
  readonly lesson: Lesson
  readonly n: number
  readonly total: number
}

export function courseLesson(courseId: string, lessonId: string): CourseLessonPlace | undefined {
  const course = courseById(courseId)
  const at = course?.lessons.findIndex((lesson) => lesson.id === lessonId) ?? -1
  const lesson = course?.lessons[at]
  return course && lesson ? { course, lesson, n: at + 1, total: course.lessons.length } : undefined
}

/** The lesson after this one in its course; none after its last. */
export const nextCourseLesson = (place: CourseLessonPlace): Lesson | undefined =>
  place.course.lessons[place.n]

/** The lesson before this one in its course; none before its first. */
export const previousCourseLesson = (place: CourseLessonPlace): Lesson | undefined =>
  place.n > 1 ? place.course.lessons[place.n - 2] : undefined

/** A course's steps in the order they are taken: its lessons, then its songs. */
export const courseStepIds = (course: Course): readonly StepId[] => [
  ...course.lessons.map((lesson) => courseLessonStepId(course.id, lesson.id)),
  ...course.songs.map((id): StepId => `piece:${id}`),
]

const COURSE_OF_PIECE = new Map(
  COURSES.flatMap((course) => course.songs.map((id): [PieceId, Course] => [id, course])),
)

/** A piece's level: its course's; undefined for a piece no course has. */
export const pieceStage = (id: PieceId): Stage | undefined => COURSE_OF_PIECE.get(id)?.stage
