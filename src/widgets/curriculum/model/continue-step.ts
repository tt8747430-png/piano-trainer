import { COURSES, courseStepIds, type Course } from '@/entities/course'
import { JOURNEYS, type Journey } from '@/entities/lesson'
import { stepIdOf, stepOf, type Step, type StepId } from '@/entities/step'
import { journeySteps } from './progress'

type Learned = Readonly<Partial<Record<StepId, string>>>

/** What Continue opens: a step, on the journey or in the course it is taken in. */
export type ContinueStep =
  | { readonly id: StepId; readonly step: Step; readonly journey: Journey }
  | { readonly id: StepId; readonly step: Step; readonly course: Course }

/** A journey's first step not yet learned. */
function openInJourney(journey: Journey, learned: Learned): ContinueStep | undefined {
  const step = journeySteps(journey).find((each) => learned[stepIdOf(each)] === undefined)
  return step ? { id: stepIdOf(step), step, journey } : undefined
}

/** A course's first step not yet learned: a lesson, then a guided song; none once all are. */
export const openCourseStep = (course: Course, learned: Learned): StepId | undefined =>
  courseStepIds(course).find((each) => learned[each] === undefined)

/** A course's open step as Continue opens it. */
function openInCourse(course: Course, learned: Learned): ContinueStep | undefined {
  const id = openCourseStep(course, learned)
  const step = id === undefined ? undefined : stepOf(id)
  return id && step ? { id, step, course } : undefined
}

/** The course a step id belongs to: a course lesson's, or the course a song is guided in. */
function courseOf(id: StepId): Course | undefined {
  return COURSES.find((course) => courseStepIds(course).includes(id))
}

/**
 * Continue (ADR 0053): the track the learner last learned something on. After a course's lesson or
 * song, that course's next step while it has one; otherwise the Lessons' next step, journey by
 * journey; null once everything is learned.
 */
export function continueStep(learned: Learned): ContinueStep | null {
  const [latest] = (Object.entries(learned) as [StepId, string | undefined][])
    .flatMap(([id, at]) => (at === undefined ? [] : [{ id, at: Date.parse(at) }]))
    .sort((a, b) => b.at - a.at)
  const course = latest && courseOf(latest.id)
  const inCourse = course && openInCourse(course, learned)
  if (inCourse) return inCourse
  for (const journey of JOURNEYS) {
    const open = openInJourney(journey, learned)
    if (open) return open
  }
  for (const course of COURSES) {
    const open = openInCourse(course, learned)
    if (open) return open
  }
  return null
}

/**
 * The journey Lessons opens on: the first with a step not yet learned (where the Lessons' next step
 * is, whichever track Continue is on), else the first journey once every one is learned.
 */
export function currentJourney(learned: Learned): Journey {
  const first = JOURNEYS[0]
  if (!first) throw new Error('The Lessons need a journey')
  return JOURNEYS.find((journey) => openInJourney(journey, learned) !== undefined) ?? first
}
