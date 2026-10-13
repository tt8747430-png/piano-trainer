import { describe, expect, it } from 'vitest'
import { LESSONS, type Lesson } from '@/entities/lesson'
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
  it('groups a tab’s lessons under their modules, modules and lessons in the order taught', () => {
    const lessons = [
      lesson('a', 'gospel'),
      lesson('b', 'fundamentals'),
      lesson('c', 'gospel'),
      lesson('d', 'gorshkov'),
    ]
    expect(
      lessonGroups('subjects', lessons).map((group) => [
        group.module,
        group.lessons.map((each) => each.id),
      ]),
    ).toEqual([
      ['fundamentals', ['b']],
      ['gospel', ['a', 'c']],
    ])
    expect(lessonGroups('courses', lessons).map((group) => group.module)).toEqual(['gorshkov'])
  })

  it('leaves out a module without lessons', () => {
    expect(
      lessonGroups('subjects', [lesson('a', 'accompaniment')]).map((group) => group.module),
    ).toEqual(['accompaniment'])
  })

  it('holds every lesson of the catalogue once, in one tab or the other', () => {
    const ids = (['subjects', 'courses'] as const).flatMap((tab) =>
      lessonGroups(tab).flatMap((group) => group.lessons.map((each) => each.id)),
    )
    expect([...ids].sort()).toEqual(LESSONS.map((each) => each.id).sort())
  })
})
