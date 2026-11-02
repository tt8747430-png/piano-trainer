import { describe, expect, it } from 'vitest'
import { inCourseOrder, isCourseOrder } from './order'

const courses = ['a', 'b', 'c', 'd'].map((id) => ({ id }))

describe('the courses’ own order', () => {
  it('puts the courses it names in its order, the rest after them as they stood', () => {
    expect(inCourseOrder(courses, { courses: ['c', 'a'] }).map(({ id }) => id)).toEqual([
      'c',
      'a',
      'b',
      'd',
    ])
  })

  it('leaves the courses as they are without one, and passes over ids no course has', () => {
    expect(inCourseOrder(courses, undefined)).toBe(courses)
    expect(inCourseOrder(courses, { courses: ['x', 'd'] }).map(({ id }) => id)).toEqual([
      'd',
      'a',
      'b',
      'c',
    ])
  })

  it('reads only a list of ids', () => {
    expect(isCourseOrder({ courses: ['a'] })).toBe(true)
    expect(isCourseOrder({ courses: [1] })).toBe(false)
    expect(isCourseOrder(null)).toBe(false)
  })
})
