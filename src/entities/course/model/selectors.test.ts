import { describe, expect, it } from 'vitest'
import { COURSES } from '../content/courses'
import {
  courseById,
  courseNumber,
  curriculumSteps,
  firstOpenStep,
  lessonPlace,
  nextCourse,
  nextLessonId,
  stageOf,
  stepById,
  stepsOf,
} from './selectors'
import { stepIdOf } from './types'

const firstSteps = courseById('first-steps')!

describe('curriculum selectors', () => {
  it('read a step’s stage: its course’s', () => {
    expect(stageOf('lesson:finding-home')).toBe('beginner')
    expect(stageOf('piece:bz5')).toBe('intermediate')
    expect(stageOf('chords:alt')).toBe('professional')
    expect(stageOf('piece:nope')).toBeUndefined()
  })

  it('find a step with its course', () => {
    expect(stepById('lesson:triads')).toMatchObject({
      id: 'lesson:triads',
      stage: 'beginner',
      course: { id: 'chord-basics' },
    })
    expect(stepById('piece:nope')).toBeUndefined()
  })

  it('take a course’s lessons, then its practice', () => {
    expect(stepsOf(firstSteps)).toEqual([
      { kind: 'lesson', lessonId: 'finding-home' },
      { kind: 'lesson', lessonId: 'hands-and-fingers' },
      { kind: 'lesson', lessonId: 'both-hands' },
      { kind: 'lesson', lessonId: 'sustain-pedal' },
      { kind: 'piece', pieceId: 'ode' },
    ])
    expect(curriculumSteps().map(({ id }) => id)).toEqual(
      COURSES.flatMap((course) => stepsOf(course).map(stepIdOf)),
    )
    expect(curriculumSteps()).toBe(curriculumSteps())
  })

  it('place a lesson in its course, and lead to the next one there', () => {
    expect(lessonPlace('both-hands')).toEqual({ course: firstSteps, n: 3, total: 4 })
    expect(nextLessonId('both-hands')).toBe('sustain-pedal')
    expect(nextLessonId('sustain-pedal')).toBeUndefined()
    expect(lessonPlace('nope')).toBeUndefined()
  })

  it('number the courses along the curriculum, each leading to the next', () => {
    expect(courseNumber(firstSteps)).toBe(1)
    expect(nextCourse(firstSteps)?.id).toBe('reading-music')
    expect(nextCourse(COURSES.at(-1)!)).toBeUndefined()
  })

  it('find a course’s first step not learned', () => {
    const learned = new Set(['lesson:finding-home', 'lesson:hands-and-fingers'])
    expect(firstOpenStep(firstSteps, (id) => learned.has(id))).toEqual({
      kind: 'lesson',
      lessonId: 'both-hands',
    })
    expect(firstOpenStep(firstSteps, () => true)).toBeUndefined()
  })
})
