import { describe, expect, it } from 'vitest'
import { COURSES } from '../content'
import { courseLesson, nextCourseLesson, previousCourseLesson } from './selectors'

describe('a course lesson’s neighbours', () => {
  const course = COURSES.find((each) => each.lessons.length > 1)!
  const [first, second] = course.lessons

  it('are the lessons before and after it, none past the course’s ends', () => {
    const one = courseLesson(course.id, first!.id)!
    const two = courseLesson(course.id, second!.id)!
    expect(nextCourseLesson(one)).toBe(second)
    expect(previousCourseLesson(two)).toBe(first)
    expect(previousCourseLesson(one)).toBeUndefined()
    const last = courseLesson(course.id, course.lessons.at(-1)!.id)!
    expect(nextCourseLesson(last)).toBeUndefined()
  })
})
