import { afterEach, describe, expect, it } from 'vitest'
import { keepContent } from '@/shared/api/content'
import { LESSONS } from '../content'
import { lessonById } from './selectors'

afterEach(() => keepContent([]))

describe('the lessons over the kept content', () => {
  const lesson = LESSONS[0]
  if (!lesson) throw new Error('there are lessons')
  const kept = (body: unknown) =>
    keepContent([{ kind: 'lesson', id: lesson.id, version: 'v2', body }])

  it('reads the database’s newer copy of a lesson in its place', () => {
    const newer = { ...lesson, summary: { en: 'Revised', ru: 'Исправлено' } }
    kept(newer)
    expect(lessonById(lesson.id)).toEqual(newer)
  })

  it('passes over what does not read as its lesson', () => {
    for (const body of [
      { ...lesson, sections: 'none' },
      { id: lesson.id },
      { ...lesson, id: 'x' },
    ]) {
      kept(body)
      expect(lessonById(lesson.id)).toBe(lesson)
    }
  })
})
