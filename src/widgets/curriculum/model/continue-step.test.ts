import { describe, expect, it } from 'vitest'
import { COURSES } from '@/entities/course'
import { JOURNEYS } from '@/entities/lesson'
import { stepIdOf, type StepId } from '@/entities/step'
import { continueStep, currentJourney } from './continue-step'
import { journeySteps } from './progress'

const at = (minute: number) => `2026-10-15T10:${String(minute).padStart(2, '0')}:00.000Z`
const firstJourney = JOURNEYS[0]!
const firstSteps = journeySteps(firstJourney).map(stepIdOf)

describe('continueStep', () => {
  it('opens the Lessons’ first step to a new learner', () => {
    expect(continueStep({})).toMatchObject({ id: firstSteps[0], journey: firstJourney })
    expect(currentJourney({})).toBe(firstJourney)
  })

  it('goes on along the journey after a journey lesson', () => {
    const learned = { [firstSteps[0]!]: at(1) }
    expect(continueStep(learned)?.id).toBe(firstSteps[1])
  })

  it('goes on in the course whose lesson was learned last', () => {
    const course = COURSES.find((each) => each.lessons.length > 1)!
    const [first, second] = course.lessons
    const learned: Partial<Record<StepId, string>> = {
      [firstSteps[0]!]: at(1),
      [`course:${course.id}/${first!.id}`]: at(2),
    }
    expect(continueStep(learned)).toMatchObject({
      id: `course:${course.id}/${second!.id}`,
      course,
    })
  })

  it('returns to the Lessons once the course last worked in is complete', () => {
    const course = COURSES.find((each) => each.lessons.length > 0)!
    const learned: Partial<Record<StepId, string>> = Object.fromEntries([
      ...course.lessons.map((lesson) => [`course:${course.id}/${lesson.id}`, at(2)]),
      ...course.songs.map((song) => [`piece:${song}`, at(3)]),
    ])
    expect(continueStep(learned)).toMatchObject({ id: firstSteps[0], journey: firstJourney })
  })

  it('opens the next journey once one is learned, and nothing once all is', () => {
    const all: Partial<Record<StepId, string>> = Object.fromEntries(
      firstSteps.map((id) => [id, at(1)]),
    )
    expect(currentJourney(all)).toBe(JOURNEYS[1])
    const everything: Partial<Record<StepId, string>> = Object.fromEntries([
      ...JOURNEYS.flatMap((journey) =>
        journeySteps(journey).map((step) => [stepIdOf(step), at(1)]),
      ),
      ...COURSES.flatMap((course) => [
        ...course.lessons.map((lesson) => [`course:${course.id}/${lesson.id}`, at(1)]),
        ...course.songs.map((song) => [`piece:${song}`, at(1)]),
      ]),
    ])
    expect(continueStep(everything)).toBeNull()
  })
})
