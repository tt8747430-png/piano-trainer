import { describe, expect, it } from 'vitest'
import { needsMelody } from '@/entities/pattern'
import { melodyOf, pieceById } from '@/entities/piece'
import { note, parseChordSymbol, parseNoteName, parseNumerals } from '@/shared/lib/music'
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
    case 'pattern': {
      const piece = pieceById(block.piece)
      if (!piece) return [block.piece]
      return needsMelody(block.pattern) && !melodyOf(piece)
        ? [`${block.pattern} over ${block.piece}`]
        : []
    }
    case 'progression':
      return unread(() => parseNumerals(block.numerals), block.numerals)
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
        case 'progressions':
          return unread(() => parseNumerals(target.numerals), target.numerals)
        case 'passing-chords':
          return [target.from, target.to].flatMap((symbol) =>
            unread(() => parseChordSymbol(symbol), symbol),
          )
        case 'piece':
          return pieceById(target.piece) ? [] : [target.piece]
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

  it('catch a pattern over no piece, or a tune pattern over a piece with no tune', () => {
    expect(problemsOf({ kind: 'pattern', pattern: 'M1', piece: 'nowhere' })).toEqual(['nowhere'])
    expect(problemsOf({ kind: 'pattern', pattern: 'r5', piece: 'ex3' })).toEqual(['r5 over ex3'])
    expect(problemsOf({ kind: 'pattern', pattern: 'r5', piece: 'otche' })).toEqual([])
  })

  it('catch numerals, chords or a piece a progression or a link cannot read', () => {
    const title = { en: 'a', ru: 'а' }
    expect(problemsOf({ kind: 'progression', numerals: 'I V x', key: C_MAJOR })).toEqual(['I V x'])
    expect(
      problemsOf({
        kind: 'link',
        title,
        target: { place: 'progressions', numerals: 'I Q', key: C_MAJOR },
      }),
    ).toEqual(['I Q'])
    expect(
      problemsOf({
        kind: 'link',
        title,
        target: { place: 'passing-chords', key: C_MAJOR, from: 'C', to: 'Hq' },
      }),
    ).toEqual(['Hq'])
    expect(
      problemsOf({ kind: 'link', title, target: { place: 'piece', piece: 'nowhere' } }),
    ).toEqual(['nowhere'])
    expect(
      problemsOf({
        kind: 'link',
        title,
        target: { place: 'piece', piece: 'otche', pattern: 'r4' },
      }),
    ).toEqual([])
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
    for (const lesson of LESSONS.filter((each) => each.module === 'fundamentals')) {
      expect([1, 2], lesson.id).toContain(lesson.level)
    }
  })

  it('teach accompaniment from bass and chords to reharmonising a melody', () => {
    expect(
      LESSONS.filter((lesson) => lesson.module === 'accompaniment').map((lesson) => lesson.id),
    ).toEqual([
      'bass-and-chords',
      'broken-chords',
      'five-ways',
      'right-hand-techniques',
      'seven-types',
    ])
  })

  it('list the modules in order, each lesson after the one before it', () => {
    const modules = LESSONS.map((lesson) => LESSON_MODULES.indexOf(lesson.module))
    expect(modules).toEqual([...modules].sort((a, b) => a - b))
  })
})
