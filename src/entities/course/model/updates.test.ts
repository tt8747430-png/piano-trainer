import { afterEach, describe, expect, it } from 'vitest'
import { keepContent } from '@/shared/api/content'
import { COURSES } from '../content'
import { courseById, courseLesson, coursesOn } from './selectors'
import { courseTexts, updatesCourse } from './types'

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

describe('a course’s texts over the kept content (round 12)', () => {
  const course = COURSES[0]
  if (!course) throw new Error('there are courses')
  const texts = {
    id: course.id,
    title: { en: 'Renamed', ru: 'Новое имя' },
    summary: { en: 'Said anew', ru: 'Сказано заново' },
  }
  const kept = (body: unknown) =>
    keepContent([{ kind: 'course', id: course.id, version: 'v2', body }])

  it('holds a course’s title and summary, as the database keeps them', () => {
    expect(courseTexts(course)).toEqual({
      id: course.id,
      title: course.title,
      summary: course.summary,
    })
    expect(updatesCourse(course.id, courseTexts(course))).toBe(true)
  })

  it('reads the database’s newer title and summary over the course, its lessons as they were', () => {
    kept(texts)
    const read = courseById(course.id)
    expect(read).toMatchObject({ title: texts.title, summary: texts.summary })
    expect(read?.lessons).toBe(course.lessons)
    expect(coursesOn(course.shelf)).toContain(read)
  })

  it('passes over texts of another course, or texts that do not read in both languages', () => {
    for (const body of [
      { ...texts, id: 'x' },
      { ...texts, title: { en: 'Only English' } },
      { ...texts, summary: 'flat' },
      { ...texts, title: { en: ' ', ru: 'Имя' } },
      null,
    ]) {
      kept(body)
      expect(courseById(course.id)).toBe(course)
    }
  })
})
