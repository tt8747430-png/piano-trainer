import { describe, expect, it } from 'vitest'
import type { Lesson } from '@/entities/lesson'
import { lessonGroups } from './lesson-groups'

const lesson = (id: string, module: Lesson['module']): Lesson => ({
  id,
  title: { en: id, ru: id },
  summary: { en: id, ru: id },
  level: 1,
  category: 'chords',
  module,
  sections: [],
})

describe('lessonGroups', () => {
  it('groups every lesson under its module, modules and lessons in the order taught', () => {
    const lessons = [lesson('a', 'gospel'), lesson('b', 'fundamentals'), lesson('c', 'gospel')]
    expect(
      lessonGroups(lessons).map((group) => [group.module, group.lessons.map((each) => each.id)]),
    ).toEqual([
      ['fundamentals', ['b']],
      ['gospel', ['a', 'c']],
    ])
  })

  it('leaves out a module without lessons', () => {
    expect(lessonGroups([lesson('a', 'accompaniment')]).map((group) => group.module)).toEqual([
      'accompaniment',
    ])
  })

  it('holds every lesson of the catalogue once', () => {
    expect(lessonGroups().flatMap((group) => group.lessons)).toHaveLength(
      new Set(lessonGroups().flatMap((group) => group.lessons.map((each) => each.id))).size,
    )
  })
})
