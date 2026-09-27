import { describe, expect, it } from 'vitest'
import { parseChordSymbol } from '@/shared/lib/music'
import { lessonById, LESSONS, type Lesson } from '../index'

/** Every text a learner reads in a lesson. */
const texts = (lesson: Lesson) => [
  lesson.title,
  lesson.summary,
  ...lesson.sections.flatMap((section) => [
    section.heading,
    ...section.blocks.flatMap((block) => {
      switch (block.kind) {
        case 'text':
          return block.lead ? [block.lead, block.text] : [block.text]
        case 'note':
          return [block.text]
        case 'steps':
          return block.steps
        case 'chords':
          return []
      }
    }),
  ]),
]

describe('the lessons', () => {
  it('have unique ids, each found by its id', () => {
    const ids = LESSONS.map((lesson) => lesson.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const lesson of LESSONS) expect(lessonById(lesson.id)).toBe(lesson)
    expect(lessonById('nothing')).toBeUndefined()
  })

  it('say everything in English and Russian', () => {
    for (const lesson of LESSONS) {
      for (const text of texts(lesson)) {
        expect(text.en.trim(), lesson.id).not.toBe('')
        expect(text.ru.trim(), lesson.id).not.toBe('')
      }
    }
  })

  it('give only chord examples the kernel reads', () => {
    for (const lesson of LESSONS) {
      for (const section of lesson.sections) {
        for (const block of section.blocks) {
          if (block.kind !== 'chords') continue
          for (const symbol of block.symbols) {
            expect(() => parseChordSymbol(symbol), symbol).not.toThrow()
          }
        }
      }
    }
  })

  it('open with reading chord symbols, a beginner’s chords lesson', () => {
    expect(LESSONS[0]).toMatchObject({ id: 'reading-chord-symbols', level: 1, category: 'chords' })
  })
})
