import { isLearned } from '@/entities/progress'
import { allCourses, courseStepIds, type Course } from '@/entities/course'
import { allJourneys, type Journey } from '@/entities/lesson'
import { isStepId, stepIdOf, stepOf, type Step, type StepId } from '@/entities/step'
import { courseProgress, journeyProgress, journeySteps } from './progress'

type Learned = Readonly<Partial<Record<StepId, string>>>

/** What Continue opens: a step, on the journey or in the course it is taken in. */
export type ContinueStep =
  | { readonly id: StepId; readonly step: Step; readonly journey: Journey }
  | { readonly id: StepId; readonly step: Step; readonly course: Course }

/** A journey's first step not yet learned. */
function openInJourney(journey: Journey, learned: Learned): ContinueStep | undefined {
  const step = journeySteps(journey).find((each) => !isLearned(learned, stepIdOf(each)))
  return step ? { id: stepIdOf(step), step, journey } : undefined
}

/** A course's first step not yet learned: a lesson, then a guided song; none once all are. */
export const openCourseStep = (course: Course, learned: Learned): StepId | undefined =>
  courseStepIds(course).find((each) => !isLearned(learned, each))

/** A course's open step as Continue opens it. */
function openInCourse(course: Course, learned: Learned): ContinueStep | undefined {
  const id = openCourseStep(course, learned)
  const step = id === undefined ? undefined : stepOf(id)
  return id && step ? { id, step, course } : undefined
}

/** The course a step id belongs to: a course lesson's, or the course a song is guided in. */
function courseOf(id: StepId): Course | undefined {
  return allCourses().find((course) => courseStepIds(course).includes(id))
}

/**
 * Continue (ADR 0053): the track the learner last learned something on. After a course's lesson or
 * song, that course's next step while it has one; otherwise the Lessons' next step, journey by
 * journey; null once everything is learned.
 */
export function continueStep(learned: Learned): ContinueStep | null {
  const [latest] = Object.entries(learned)
    .flatMap(([id, at]) => (at === undefined || !isStepId(id) ? [] : [{ id, at: Date.parse(at) }]))
    .sort((a, b) => b.at - a.at)
  const course = latest && courseOf(latest.id)
  const inCourse = course && openInCourse(course, learned)
  if (inCourse) return inCourse
  for (const journey of allJourneys()) {
    const open = openInJourney(journey, learned)
    if (open) return open
  }
  for (const course of allCourses()) {
    const open = openInCourse(course, learned)
    if (open) return open
  }
  return null
}

/**
 * What Continue opens once everything is learned (the LearnLaptop board's "Review ·"): the first
 * journey's first step, to go over again.
 */
export function reviewStep(): ContinueStep | null {
  const journey = allJourneys()[0]
  const step = journey && journeySteps(journey)[0]
  return journey && step ? { id: stepIdOf(step), step, journey } : null
}

/**
 * The journey Lessons opens on: the first with a step not yet learned (where the Lessons' next step
 * is, whichever track Continue is on), else the first journey once every one is learned.
 */
export function currentJourney(learned: Learned): Journey {
  const journeys = allJourneys()
  const first = journeys[0]
  if (!first) throw new Error('The Lessons need a journey')
  return journeys.find((journey) => openInJourney(journey, learned) !== undefined) ?? first
}

/**
 * Where Continue's step stands on its track, as the level's and the course's lines number it: which
 * lesson of how many; for a guided song, how many of the track's steps are learned.
 */
export function continuePlace(
  next: ContinueStep,
  learned: Learned,
):
  | { readonly n: number; readonly count: number }
  | { readonly done: number; readonly total: number } {
  const { step } = next
  if (step.kind === 'lesson' || step.kind === 'course-lesson') {
    const lessonIds =
      'course' in next
        ? next.course.lessons.map((lesson) => lesson.id)
        : next.journey.chapters
            .flatMap((chapter) => chapter.steps)
            .flatMap((each) => (each.kind === 'lesson' ? [each.lessonId] : []))
    return { n: lessonIds.indexOf(step.lessonId) + 1, count: lessonIds.length }
  }
  return 'course' in next
    ? courseProgress(next.course, learned)
    : journeyProgress(next.journey, learned)
}
