import { describe, expect, it } from 'vitest'
import { courseById } from '@/entities/course'
import { courseProgress, isComplete } from './course-progress'

const firstSteps = courseById('first-steps')!

describe('courseProgress', () => {
  it('counts a course’s steps learned, its lessons and its practice alike', () => {
    expect(courseProgress(firstSteps, {})).toEqual({ done: 0, total: 5 })
    const progress = courseProgress(firstSteps, {
      'lesson:finding-home': '2026-10-01',
      'piece:ode': '2026-10-02',
      'lesson:triads': '2026-10-02',
    })
    expect(progress).toEqual({ done: 2, total: 5 })
    expect(isComplete(progress)).toBe(false)
  })

  it('calls a course complete once every step is learned', () => {
    const all = Object.fromEntries(
      [...firstSteps.lessons.map((id) => `lesson:${id}`), 'piece:ode'].map((id) => [id, 'x']),
    )
    expect(isComplete(courseProgress(firstSteps, all))).toBe(true)
  })
})
