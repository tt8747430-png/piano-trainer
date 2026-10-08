import { describe, expect, it } from 'vitest'
import { PATTERNS, patternNeed, type PatternId } from '@/entities/pattern'
import { pieceById, pieceFit } from '@/entities/piece'
import {
  chordsHolding,
  chordSymbol,
  HOLDING_GROUPS,
  note,
  numeralChord,
  parseChordSymbol,
  parseNoteName,
  parseNumerals,
  passingChords,
  writtenSymbol,
} from '@/shared/lib/music'
import { noteLine } from '@/shared/lib/schedule'
import {
  lessonById,
  LESSON_MODULES,
  LESSONS,
  readProgression,
  type Lesson,
  type LessonBlock,
} from '../index'

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

/** A piece that is not there, or a pattern the piece cannot play (a tune it lacks, inside the beat of 6/8). */
function pieceProblems(pieceId: string, pattern: PatternId | undefined): string[] {
  const piece = pieceById(pieceId)
  if (!piece) return [pieceId]
  return pattern && patternNeed(PATTERNS[pattern], pieceFit(piece))
    ? [`${pattern} over ${pieceId}`]
    : []
}

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
    case 'pattern':
      return pieceProblems(block.piece, block.pattern)
    case 'progression':
      return unread(() => readProgression(block), block.numerals)
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
        case 'player':
          return unread(() => readProgression(target), target.numerals)
        case 'passing-chords':
          return [target.from, target.to].flatMap((symbol) =>
            unread(() => parseChordSymbol(symbol), symbol),
          )
        case 'piece':
          return pieceProblems(target.piece, target.pattern)
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
    expect(
      problemsOf({
        kind: 'link',
        title: { en: 'a', ru: 'а' },
        target: { place: 'player', numerals: 'ii Q', key: C_MAJOR },
      }),
    ).toEqual(['ii Q'])
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
    expect(
      problemsOf({ kind: 'link', title, target: { place: 'piece', piece: 'ex3', pattern: 'r5' } }),
    ).toEqual(['r5 over ex3'])
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
      'chord-functions',
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
      'accompanying-a-hymn',
      'common-progressions',
      'thinking-in-degrees',
      'two-five-one',
      'passing-chords',
      'reharmonising-a-melody',
    ])
  })

  it('teach gospel’s progressions, passing chords and reharmonisation', () => {
    expect(
      LESSONS.filter((lesson) => lesson.module === 'gospel').map((lesson) => lesson.id),
    ).toEqual(['gospel-progressions', 'gospel-passing-chords', 'gospel-reharmonisation'])
  })

  it('teach the gospel 7–3–6 as it is played: a half-diminished 7, a dominant 3, the minor 6', () => {
    const section = lessonById('gospel-progressions')?.sections.find(
      (each) => each.heading.en === 'The 7–3–6',
    )
    const chords = (section?.blocks ?? []).flatMap((block) =>
      block.kind === 'progression'
        ? (parseNumerals(block.numerals) ?? []).map((numeral) =>
            chordSymbol(numeralChord(numeral, block.key, block.size ?? 'triads')),
          )
        : [],
    )
    expect(chords).toEqual(['Bm7♭5', 'E7', 'Am7'])
  })

  it('reharmonise E with chords the Reharmonise tool shows under it', () => {
    const held = chordsHolding(note('E'), C_MAJOR)
    const shown = HOLDING_GROUPS.flatMap((group) =>
      held[group].map((each) => writtenSymbol(each.chord)),
    )
    const taught = (lessonById('reharmonising-a-melody')?.sections ?? [])
      .filter((section) => section.heading.en !== 'Try it')
      .flatMap((section) =>
        section.blocks.flatMap((block) => (block.kind === 'chords' ? block.symbols : [])),
      )
    expect(taught).toHaveLength(6)
    for (const symbol of taught) expect(shown, symbol).toContain(symbol)
  })

  it('link a row of passing chords to the tool that shows it: the row’s last chord, its chords between', () => {
    const written = (symbol: string) => chordSymbol(parseChordSymbol(symbol))
    const linked = LESSONS.flatMap((lesson) =>
      lesson.sections.flatMap((section) => {
        const row = section.blocks.flatMap((block) =>
          block.kind === 'chords' ? block.symbols : [],
        )
        return section.blocks.flatMap((block) =>
          block.kind === 'link' && block.target.place === 'passing-chords'
            ? [{ at: `${lesson.id}: ${row.join(' ')}`, row, target: block.target }]
            : [],
        )
      }),
    )
    expect(linked).toHaveLength(8)
    for (const { at, row, target } of linked) {
      expect(written(target.to), at).toBe(written(row.at(-1) ?? ''))
      const between = row.slice(row[0] === target.from ? 1 : 0, -1).map(written)
      const ways = passingChords(
        parseChordSymbol(target.from),
        parseChordSymbol(target.to),
        target.key,
      ).map((way) => way.chords.map(chordSymbol))
      expect(ways, at).toContainEqual(between)
    }
  })

  it('list the modules in order, each lesson after the one before it', () => {
    const modules = LESSONS.map((lesson) => LESSON_MODULES.indexOf(lesson.module))
    expect(modules).toEqual([...modules].sort((a, b) => a - b))
  })
})
