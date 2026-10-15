import { COURSES } from '../content/courses'
import { stepIdOf, type Course, type Stage, type Step, type StepId } from './types'

/** A step where the curriculum places it: its course, and its stage. */
export interface PlacedStep {
  readonly id: StepId
  readonly step: Step
  readonly course: Course
  readonly stage: Stage
}

/** A course's steps in the order they are taken: its lessons, then its practice. */
export const stepsOf = (course: Course): readonly Step[] => [
  ...course.lessons.map((lessonId): Step => ({ kind: 'lesson', lessonId })),
  ...course.practice,
]

const STEPS: readonly PlacedStep[] = COURSES.flatMap((course) =>
  stepsOf(course).map((step) => ({ id: stepIdOf(step), step, course, stage: course.stage })),
)
const STEP_BY_ID = new Map(STEPS.map((placed) => [placed.id, placed]))
const COURSE_BY_ID = new Map(COURSES.map((course) => [course.id, course]))

/** Every step of the curriculum, course by course; the same array on every call. */
export const curriculumSteps = (): readonly PlacedStep[] => STEPS

/** A step where the curriculum has it; undefined for one it no longer has. */
export const stepById = (id: StepId): PlacedStep | undefined => STEP_BY_ID.get(id)

/** A step's stage; undefined for a step the curriculum no longer has. */
export const stageOf = (id: StepId): Stage | undefined => STEP_BY_ID.get(id)?.stage

export const courseById = (id: string): Course | undefined => COURSE_BY_ID.get(id)

/** A stage's courses, in the order they are taught. */
export const coursesIn = (stage: Stage): readonly Course[] =>
  COURSES.filter((course) => course.stage === stage)

/** A course's number along the whole curriculum, from 1. */
export const courseNumber = (course: Course): number => COURSES.indexOf(course) + 1

/** The course after this one, into the next stage at a stage's end; none after the last. */
export const nextCourse = (course: Course): Course | undefined =>
  COURSES[COURSES.indexOf(course) + 1]

/** Where a lesson is taught: its course, and its number there from 1. */
export interface LessonPlace {
  readonly course: Course
  readonly n: number
  readonly total: number
}

const PLACES = new Map(
  COURSES.flatMap((course) =>
    course.lessons.map((lessonId, at): [string, LessonPlace] => [
      lessonId,
      { course, n: at + 1, total: course.lessons.length },
    ]),
  ),
)

/** A lesson's course and number; undefined for a lesson no course teaches. */
export const lessonPlace = (lessonId: string): LessonPlace | undefined => PLACES.get(lessonId)

/** The lesson after this one in its course; none after a course's last. */
export function nextLessonId(lessonId: string): string | undefined {
  const place = lessonPlace(lessonId)
  return place?.course.lessons[place.n]
}

/** The first step of a course not yet learned; none once every one is. */
export const firstOpenStep = (
  course: Course,
  isLearned: (id: StepId) => boolean,
): Step | undefined => stepsOf(course).find((step) => !isLearned(stepIdOf(step)))
