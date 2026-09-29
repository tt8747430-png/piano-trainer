import { describe, expect, it } from 'vitest'
import type { Lesson } from '@/entities/lesson'
import { lessonGroups } from './lesson-groups'

const lesson = (id: string, level: Lesson['level'], category: Lesson['category']): Lesson => ({
  id,
  title: { en: id, ru: id },
  summary: { en: id, ru: id },
  level,
  category,
  module: 'fundamentals',
  sections: [],
})
const LESSONS = [lesson('a', 1, 'chords'), lesson('b', 2, 'scales'), lesson('c', 1, 'scales')]

describe('lessonGroups', () => {
  it('groups every lesson under its module, in order, with no filter', () => {
    expect(
      lessonGroups({ level: 'any', category: 'any' }, LESSONS).map((group) => [
        group.module,
        group.lessons.map((each) => each.id),
      ]),
    ).toEqual([['fundamentals', ['a', 'b', 'c']]])
  })

  it('keeps the lessons of a level and a category', () => {
    expect(
      lessonGroups({ level: 1, category: 'scales' }, LESSONS).flatMap((group) =>
        group.lessons.map((each) => each.id),
      ),
    ).toEqual(['c'])
  })

  it('leaves out a module the filter empties', () => {
    expect(lessonGroups({ level: 4, category: 'any' }, LESSONS)).toEqual([])
  })
})
