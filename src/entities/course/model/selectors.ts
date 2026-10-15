import type { PieceId } from '@/entities/piece'
import { courseLessonStepId, type Stage, type StepId } from '@/entities/step'
import type { Lesson } from '@/entities/lesson'
import { COURSES } from '../content'
import type { Course, Shelf } from './types'

const COURSE_BY_ID = new Map(COURSES.map((course) => [course.id, course]))

export const courseById = (id: string): Course | undefined => COURSE_BY_ID.get(id)

/** A shelf's courses, in the order Courses lists them. */
export const coursesOn = (shelf: Shelf): readonly Course[] =>
  COURSES.filter((course) => course.shelf === shelf)

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

/** A course's steps in the order they are taken: its lessons, then its songs. */
export const courseStepIds = (course: Course): readonly StepId[] => [
  ...course.lessons.map((lesson) => courseLessonStepId(course.id, lesson.id)),
  ...course.songs.map((id): StepId => `piece:${id}`),
]

const COURSE_OF_PIECE = new Map(
  COURSES.flatMap((course) => course.songs.map((id): [PieceId, Course] => [id, course])),
)

/** The course a piece is a guided song of; undefined for a piece no course has. */
export const courseOfPiece = (id: PieceId): Course | undefined => COURSE_OF_PIECE.get(id)

/** A piece's level: its course's; undefined for a piece no course has. */
export const pieceStage = (id: PieceId): Stage | undefined => COURSE_OF_PIECE.get(id)?.stage
