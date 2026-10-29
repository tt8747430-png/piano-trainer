import { afterEach, describe, expect, it } from 'vitest'
import { keepContent } from '@/shared/api/content'
import { COURSES } from '../content'
import { courseById, courseLesson } from './selectors'

afterEach(() => keepContent([]))

describe('the courses over the kept content', () => {
  const course = COURSES[0]
  const lesson = course?.lessons[0]
  if (!course || !lesson) throw new Error('there are courses with lessons')
  const kept = (body: unknown) =>
    keepContent([{ kind: 'lesson', id: `${course.id}/${lesson.id}`, version: 'v2', body }])

  it('reads the database’s newer copy of a course’s lesson in its place, by course and lesson', () => {
    const newer = { ...lesson, summary: { en: 'Revised', ru: 'Исправлено' } }
    kept(newer)
    expect(courseLesson(course.id, lesson.id)?.lesson).toEqual(newer)
    expect(COURSES.find(({ id }) => id === course.id)?.lessons[0]).toBe(lesson)
  })

  it('passes over a lesson of another id', () => {
    kept({ ...lesson, id: 'x' })
    expect(courseById(course.id)).toBe(course)
  })
})
