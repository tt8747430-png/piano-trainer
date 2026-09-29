import { describe, expect, it } from 'vitest'
import { note, parseChordSymbol, parseNoteName } from '@/shared/lib/music'
import { noteLine } from '@/shared/lib/schedule'
import { lessonById, LESSON_MODULES, LESSONS, type Lesson, type LessonBlock } from '../index'

const C_MAJOR = { tonic: note('C'), minor: false }

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
        case 'quiz':
          return [block.ask]
        case 'link':
          return [block.title]
        default:
          return []
      }
    }),
  ]),
]

/** What in a block the kernel cannot read, or a link that leads nowhere. */
function problemsOf(block: LessonBlock): string[] {
  const unread = (read: () => unknown, what: string) => {
    try {
      return read() === null ? [what] : []
    } catch {
      return [what]
    }
  }
  switch (block.kind) {
    case 'chords':
      return block.symbols.flatMap((symbol) => unread(() => parseChordSymbol(symbol), symbol))
    case 'notes':
      return unread(
        () =>
          noteLine(block.notes, {
            hand: 'rh',
            meter: block.meter ?? '4/4',
            key: block.key ?? C_MAJOR,
          }),
        block.notes,
      )
    case 'quiz': {
      const { answer } = block
      return 'chord' in answer
        ? unread(() => parseChordSymbol(answer.chord), answer.chord)
        : answer.notes.flatMap((name) => unread(() => parseNoteName(name), name))
    }
    case 'link': {
      const { target } = block
      switch (target.place) {
        case 'chords':
          return unread(() => parseChordSymbol(target.chord), target.chord)
        case 'lesson':
          return lessonById(target.lesson) ? [] : [target.lesson]
        default:
          return []
      }
    }
    default:
      return []
  }
}

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

  it('give only examples, quizzes and links the kernel reads', () => {
    for (const lesson of LESSONS) {
      for (const section of lesson.sections) {
        for (const block of section.blocks) expect(problemsOf(block), lesson.id).toEqual([])
      }
    }
  })

  it('catch a symbol, a note line, an answer or a link they cannot read', () => {
    expect(problemsOf({ kind: 'chords', symbols: ['Cm', 'Cq'] })).toEqual(['Cq'])
    expect(problemsOf({ kind: 'notes', clef: 'treble', notes: 'C4 X9' })).toEqual(['C4 X9'])
    expect(
      problemsOf({ kind: 'quiz', ask: { en: 'a', ru: 'а' }, answer: { notes: ['F', 'H'] } }),
    ).toEqual(['H'])
    expect(
      problemsOf({
        kind: 'link',
        title: { en: 'a', ru: 'а' },
        target: { place: 'lesson', lesson: 'nowhere' },
      }),
    ).toEqual(['nowhere'])
  })

  it('each belong to a module, every module with a lesson', () => {
    for (const module of LESSON_MODULES) {
      expect(
        LESSONS.some((lesson) => lesson.module === module),
        module,
      ).toBe(true)
    }
  })

  it('teach the fundamentals in order, from finding home to key signatures', () => {
    expect(
      LESSONS.filter((lesson) => lesson.module === 'fundamentals').map((lesson) => lesson.id),
    ).toEqual([
      'finding-home',
      'reading-notes',
      'rhythm-and-meter',
      'whole-and-half-steps',
      'major-scales',
      'chromatic-scale',
      'intervals',
      'triads',
      'seventh-chords',
      'reading-chord-symbols',
      'inversions',
      'minor-scales',
      'chord-family',
      'key-signatures',
    ])
  })

  it('start at the beginning: every fundamentals lesson a Beginner’s or an Elementary one', () => {
    for (const lesson of LESSONS) expect([1, 2], lesson.id).toContain(lesson.level)
  })
})
