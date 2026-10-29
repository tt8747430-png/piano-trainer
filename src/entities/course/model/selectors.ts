import { keptContent } from '@/shared/api/content'
import type { PieceId } from '@/entities/piece'
import { courseLessonStepId, type Stage, type StepId } from '@/entities/step'
import { updatesLesson, type Lesson } from '@/entities/lesson'
import { COURSES } from '../content'
import { updatesCourse, type Course, type Shelf } from './types'

let built = {
  revision: -1,
  courses: COURSES,
  index: new Map(COURSES.map((course) => [course.id, course])) as ReadonlyMap<string, Course>,
}

/**
 * The courses: the app's own, each lesson the database has a newer copy of (kept on the device by
 * `<course>/<lesson>`, ADR 0116) in that copy where it reads as the lesson, and the course's title
 * and summary the database's where they read (round 12). Built again when the kept content changes.
 */
function catalog(): typeof built {
  const kept = keptContent()
  if (kept.revision === built.revision) return built
  const courses = COURSES.map((course) => {
    const lessons = course.lessons.map((lesson) => {
      const body = kept.body('lesson', `${course.id}/${lesson.id}`)
      return updatesLesson(lesson.id, body) ? body : lesson
    })
    const texts = kept.body('course', course.id)
    const renamed = updatesCourse(course.id, texts)
    const relessoned = lessons.some((lesson, i) => lesson !== course.lessons[i])
    if (!renamed && !relessoned) return course
    return {
      ...course,
      ...(renamed ? { title: texts.title, summary: texts.summary } : {}),
      ...(relessoned ? { lessons } : {}),
    }
  })
  built = {
    revision: kept.revision,
    courses,
    index: new Map(courses.map((course) => [course.id, course])),
  }
  return built
}

export const courseById = (id: string): Course | undefined => catalog().index.get(id)

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
