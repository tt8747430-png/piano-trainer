import { describe, expect, it } from 'vitest'
import { COURSES, courseIcon, COURSE_ICON } from '@/entities/course'
import { BUILT_IN_PATTERNS, partOfShelf, patternNeed, type PatternId } from '@/entities/pattern'
import { pieceById, pieceFit } from '@/entities/piece'
import { isTrainerId } from '@/features/trainer'
import { readProgressionsSearch } from '@/app/routes/explorer-search'
import { typedSearch } from '@/widgets/progression-explorer'
import {
  C_MAJOR,
  chordsHolding,
  chordSymbol,
  HOLDING_GROUPS,
  keyFromParam,
  note,
  numeralChord,
  parseChordSymbol,
  parseNoteName,
  parseNumerals,
  passingChords,
  readChordLine,
  writtenSymbol,
} from '@/shared/lib/music'
import { noteLine, voicingsMusic } from '@/shared/lib/schedule'
import { isMethodBookId } from '@/entities/book'
import {
  JOURNEYS,
  lessonById,
  LESSONS,
  readProgression,
  type Lesson,
  type LessonBlock,
} from '@/entities/lesson'
import { stepIdOf } from '@/entities/step'

/** Every lesson a learner reads: the journeys', then each course's own. */
const WORKSHEETS: readonly Lesson[] = [...LESSONS, ...COURSES.flatMap((course) => course.lessons)]

/** Every text a learner reads in a lesson. */
const texts = (lesson: Lesson) => [
  lesson.title,
  lesson.summary,
  ...lesson.sections.flatMap((section) => [
    section.heading,
    ...(section.takeaway ? [section.takeaway] : []),
    ...section.blocks.flatMap((block) => {
      switch (block.kind) {
        case 'text':
          return block.lead ? [block.lead, block.text] : [block.text]
        case 'note':
          return block.rule ? [block.rule, block.text] : [block.text]
        case 'variants':
          return block.variants.flatMap((variant) => [
            variant.label,
            variant.caption,
            ...(variant.text ? [variant.text] : []),
          ])
        case 'steps':
          return block.steps
        case 'question':
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
  return pattern && patternNeed(BUILT_IN_PATTERNS.require(pattern), pieceFit(piece))
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
    case 'voicings':
      return block.voicings.flatMap((voicing) =>
        unread(() => voicingsMusic([voicing], block.key), voicing.hands),
      )
    case 'pattern':
      return pieceProblems(block.piece, block.pattern)
    case 'progression':
      return unread(() => readProgression(block), block.numerals)
    case 'variants':
      return [
        ...(block.variants.length < 2 ? ['a variants block of one'] : []),
        ...block.variants.flatMap((variant) => problemsOf(variant.example)),
      ]
    case 'question': {
      const { answer } = block
      return 'chord' in answer
        ? unread(() => parseChordSymbol(answer.chord), answer.chord)
        : answer.notes.flatMap((name) => unread(() => parseNoteName(name), name))
    }
    case 'link': {
      const { target } = block
      switch (target.opens) {
        case 'chords':
          return unread(() => parseChordSymbol(target.chord), target.chord)
        case 'lesson':
          return lessonById(target.lesson) ? [] : [target.lesson]
        case 'quiz':
          return isTrainerId(target.trainer) ? [] : [target.trainer]
        case 'progressions':
        case 'player':
          return unread(() => readProgression(target), target.numerals)
        case 'between':
          return [target.from, target.to].flatMap((symbol) =>
            unread(() => parseChordSymbol(symbol), symbol),
          )
        case 'piece':
          return pieceProblems(target.piece, target.pattern)
        case 'song-chords': {
          const { chords, unread } = readChordLine(target.chords)
          return chords.length > 0 && unread.length === 0 ? [] : [target.chords]
        }
        default:
          return []
      }
    }
    default:
      return []
  }
}

describe('the lessons, a journey’s and a course’s', () => {
  it('name as their prerequisites only earlier lessons of their own journey or course', () => {
    const journeyLessons = JOURNEYS.map((journey) =>
      journey.chapters.flatMap((chapter) =>
        chapter.steps.flatMap((step) => (step.kind === 'lesson' ? [step.lessonId] : [])),
      ),
    )
    const tracks = [
      ...journeyLessons.map((ids) => ({
        ids,
        lessons: ids.flatMap((id) => {
          const lesson = lessonById(id)
          return lesson ? [lesson] : []
        }),
      })),
      ...COURSES.map((course) => ({
        ids: course.lessons.map((lesson) => lesson.id),
        lessons: course.lessons,
      })),
    ]
    const problems = tracks.flatMap(({ ids, lessons }) =>
      lessons.flatMap((lesson) =>
        (lesson.after ?? []).flatMap((id) =>
          ids.indexOf(id) >= 0 && ids.indexOf(id) < ids.indexOf(lesson.id)
            ? []
            : [`${lesson.id} after ${id}`],
        ),
      ),
    )
    expect(problems).toEqual([])
  })

  it('have unique ids, each journey lesson found by its id', () => {
    const ids = LESSONS.map((lesson) => lesson.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const lesson of LESSONS) expect(lessonById(lesson.id)).toBe(lesson)
    expect(lessonById('nothing')).toBeUndefined()
  })

  it('say everything in English and Russian', () => {
    for (const lesson of WORKSHEETS) {
      for (const text of texts(lesson)) {
        expect(text.en.trim(), lesson.id).not.toBe('')
        expect(text.ru.trim(), lesson.id).not.toBe('')
      }
    }
  })

  it('give only examples, questions and links the kernel reads', () => {
    for (const lesson of WORKSHEETS) {
      for (const section of lesson.sections) {
        for (const block of section.blocks) expect(problemsOf(block), lesson.id).toEqual([])
      }
    }
  })

  it('catch a symbol, a note line, an answer or a link they cannot read', () => {
    expect(problemsOf({ kind: 'chords', symbols: ['Cm', 'Cq'] })).toEqual(['Cq'])
    expect(problemsOf({ kind: 'notes', clef: 'treble', notes: 'C4 X9' })).toEqual(['C4 X9'])
    expect(
      problemsOf({ kind: 'question', ask: { en: 'a', ru: 'а' }, answer: { notes: ['F', 'H'] } }),
    ).toEqual(['H'])
    expect(
      problemsOf({
        kind: 'link',
        title: { en: 'a', ru: 'а' },
        target: { opens: 'lesson', lesson: 'nowhere' },
      }),
    ).toEqual(['nowhere'])
    expect(
      problemsOf({
        kind: 'link',
        title: { en: 'a', ru: 'а' },
        target: { opens: 'player', numerals: 'ii Q', key: C_MAJOR },
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
        target: { opens: 'progressions', numerals: 'I Q', key: C_MAJOR },
      }),
    ).toEqual(['I Q'])
    expect(
      problemsOf({
        kind: 'link',
        title,
        target: { opens: 'between', key: C_MAJOR, from: 'C', to: 'Hq' },
      }),
    ).toEqual(['Hq'])
    expect(
      problemsOf({ kind: 'link', title, target: { opens: 'piece', piece: 'nowhere' } }),
    ).toEqual(['nowhere'])
    expect(
      problemsOf({
        kind: 'link',
        title,
        target: { opens: 'piece', piece: 'otche', pattern: 'r4' },
      }),
    ).toEqual([])
    expect(
      problemsOf({ kind: 'link', title, target: { opens: 'piece', piece: 'ex3', pattern: 'r5' } }),
    ).toEqual(['r5 over ex3'])
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
    const linked = WORKSHEETS.flatMap((lesson) =>
      lesson.sections.flatMap((section) => {
        const row = section.blocks.flatMap((block) =>
          block.kind === 'chords' ? block.symbols : [],
        )
        return section.blocks.flatMap((block) =>
          block.kind === 'link' && block.target.opens === 'between'
            ? [{ at: `${lesson.id}: ${row.join(' ')}`, row, target: block.target }]
            : [],
        )
      }),
    )
    expect(linked.length).toBeGreaterThan(0)
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

  it('open Between on the very chords a link names, its slash bass kept, and the chords it teaches', () => {
    const written = (symbol: string) => chordSymbol(parseChordSymbol(symbol))
    const links = WORKSHEETS.flatMap((lesson) =>
      lesson.sections.flatMap((section) => {
        const row = section.blocks.flatMap((block) =>
          block.kind === 'chords' ? block.symbols : [],
        )
        return section.blocks.flatMap((block) =>
          block.kind === 'link' && block.target.opens === 'between'
            ? [{ at: `${lesson.id}: ${block.title.en}`, row, target: block.target }]
            : [],
        )
      }),
    )
    expect(links.length).toBeGreaterThan(0)
    for (const { at, row, target } of links) {
      // As the link opens Progressions and the page builds its row from the URL's numerals.
      const search = typedSearch(`${target.from} ${target.to}`, target.key)
      expect(search, at).not.toBeNull()
      const view = readProgressionsSearch({ ...search })
      const key = keyFromParam(view.key)
      const built = (parseNumerals(view.p) ?? []).map((numeral) =>
        numeralChord(numeral, key, view.size),
      )
      expect(built.map(chordSymbol), at).toEqual([written(target.from), written(target.to)])
      const [from, to] = built
      if (!from || !to) continue
      const ways = passingChords(from, to, key).map((way) => way.chords.map(chordSymbol))
      if (written(row.at(-1) ?? '') !== written(target.to)) continue
      const between = row.slice(row[0] === target.from ? 1 : 0, -1).map(written)
      expect(ways, at).toContainEqual(between)
    }
  })
})

/** Every piece of a lesson's prose, in both languages: text, steps, notes and questions' asks. */
function proseOf(lesson: Lesson): string[] {
  const texts = (local: { readonly en: string; readonly ru: string }) => [local.en, local.ru]
  return lesson.sections.flatMap((section) => [
    ...(section.takeaway ? texts(section.takeaway) : []),
    ...section.blocks.flatMap((block) => {
      switch (block.kind) {
        case 'text':
        case 'note':
          return texts(block.text)
        case 'variants':
          return block.variants.flatMap((variant) => (variant.text ? texts(variant.text) : []))
        case 'steps':
          return block.steps.flatMap(texts)
        case 'question':
          return texts(block.ask)
        default:
          return []
      }
    }),
  ])
}

/** The blocks a learner reads rather than plays: a section's example is any other. */
const READ = new Set<LessonBlock['kind']>(['text', 'note', 'steps', 'link'])
/** The most a section says in English: two short lines and a definition, the example doing the rest. */
const SECTION_WORDS = 35

function wordsOf(block: LessonBlock): string[] {
  switch (block.kind) {
    case 'text':
      return [block.lead?.en ?? '', block.text.en]
    case 'note':
      return [block.text.en]
    case 'steps':
      return block.steps.map((step) => step.en)
    default:
      return []
  }
}

describe('the lessons’ prose', () => {
  it('reads in short sentences, none run on with a semicolon (the research checklist)', () => {
    for (const lesson of WORKSHEETS) {
      for (const prose of proseOf(lesson)) {
        expect(prose, lesson.id).not.toContain(';')
        // A sentence ends at . ? or : before a capital; quoted titles and examples count too.
        for (const sentence of prose.split(/[.?!]\s+/)) {
          expect(sentence.split(/\s+/).length, `${lesson.id}: ${sentence}`).toBeLessThanOrEqual(30)
        }
      }
    }
  })

  it('leads each section with its example: at most one text before it, and a few lines in all', () => {
    const problems = WORKSHEETS.flatMap((lesson) =>
      lesson.sections.flatMap((section) => {
        const where = `${lesson.id} / ${section.heading.en}`
        const first = section.blocks.findIndex((block) => !READ.has(block.kind))
        const words = section.blocks
          .flatMap((block) => wordsOf(block))
          .join(' ')
          .split(/\s+/)
          .filter(Boolean).length
        return [
          ...(first < 0 ? [`${where}: shows nothing`] : []),
          ...(first > 1 ? [`${where}: talks before it shows`] : []),
          ...(words > SECTION_WORDS ? [`${where}: says ${words} words`] : []),
        ]
      }),
    )
    expect(problems).toEqual([])
  })
})

/** The pieces a lesson plays or opens. */
const piecesOf = (lesson: Lesson): string[] =>
  lesson.sections.flatMap((section) =>
    section.blocks.flatMap((block) =>
      block.kind === 'pattern'
        ? [block.piece]
        : block.kind === 'link' && block.target.opens === 'piece'
          ? [block.target.piece]
          : [],
    ),
  )

/** The built-in patterns a lesson shows or opens a piece with. */
const patternsOf = (lesson: Lesson): PatternId[] =>
  lesson.sections.flatMap((section) =>
    section.blocks.flatMap((block) =>
      block.kind === 'pattern'
        ? [block.pattern]
        : block.kind === 'link' && block.target.opens === 'piece' && block.target.pattern
          ? [block.target.pattern]
          : [],
    ),
  )

/** The lessons a lesson links to. */
const lessonLinksOf = (lesson: Lesson): string[] =>
  lesson.sections.flatMap((section) =>
    section.blocks.flatMap((block) =>
      block.kind === 'link' && block.target.opens === 'lesson' ? [block.target.lesson] : [],
    ),
  )

/** The method books by their names in either language, as a lesson would mention one. */
const BOOK_NAMES = [
  'Called to Play',
  'Призван играть',
  'Savchenko',
  'Савченко',
  'Bobrova',
  'Боброва',
  'Бобровой',
  'Gorshkov',
  'Горшков',
]
const mentionsBook = (lesson: Lesson): string[] =>
  texts(lesson).flatMap((text) =>
    BOOK_NAMES.filter((name) => text.en.includes(name) || text.ru.includes(name)),
  )

describe('the journeys', () => {
  const steps = JOURNEYS.flatMap((journey) =>
    journey.chapters.flatMap((chapter) => chapter.steps.map(stepIdOf)),
  )

  it('read every lesson of the Lessons in exactly one chapter, and every chapter’s lesson is one', () => {
    const read = steps.filter((id) => id.startsWith('lesson:'))
    expect(read).toEqual(LESSONS.map((lesson) => `lesson:${lesson.id}`))
  })

  it('check each chord family and scale in one chapter at most, after a chapter’s lessons', () => {
    expect(new Set(steps).size).toBe(steps.length)
    for (const chapter of JOURNEYS.flatMap((journey) => journey.chapters)) {
      const firstCheck = chapter.steps.findIndex((step) => step.kind !== 'lesson')
      if (firstCheck >= 0) {
        expect(
          chapter.steps.slice(firstCheck).every((step) => step.kind !== 'lesson'),
          chapter.id,
        ).toBe(true)
      }
      expect(
        chapter.steps.some((step) => step.kind === 'lesson'),
        chapter.id,
      ).toBe(true)
    }
  })

  it('climb the four stages, one journey to each, with unique chapter ids', () => {
    expect(JOURNEYS.map((journey) => journey.stage)).toEqual([
      'beginner',
      'intermediate',
      'advanced',
      'professional',
    ])
    const chapters = JOURNEYS.flatMap((journey) => journey.chapters.map((chapter) => chapter.id))
    expect(new Set(chapters).size).toBe(chapters.length)
  })

  it('keep their lessons free of the courses: no piece, no pattern, no book, links only to Lessons', () => {
    const leaks = LESSONS.flatMap((lesson) => [
      ...piecesOf(lesson).map((piece) => `${lesson.id}: plays ${piece}`),
      ...patternsOf(lesson).map((pattern) => `${lesson.id}: shows ${pattern}`),
      ...mentionsBook(lesson).map((name) => `${lesson.id}: names ${name}`),
      ...lessonLinksOf(lesson)
        .filter((id) => lessonById(id) === undefined)
        .map((id) => `${lesson.id}: links ${id}`),
    ])
    expect(leaks).toEqual([])
  })
})

describe('the courses', () => {
  it('have unique ids, an icon each, and say what they teach in both languages', () => {
    const ids = COURSES.map((course) => course.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(Object.keys(COURSE_ICON).sort()).toEqual([...ids].sort())
    for (const course of COURSES) {
      expect(courseIcon(course.id), course.id).toBeDefined()
      for (const text of [course.title, course.summary]) {
        expect(text.en.trim(), course.id).not.toBe('')
        expect(text.ru.trim(), course.id).not.toBe('')
      }
      expect(course.weeks, course.id).toBeGreaterThan(0)
    }
  })

  it('each teach lessons of their own, every id unique within the course', () => {
    for (const course of COURSES) {
      const ids = course.lessons.map((lesson) => lesson.id)
      expect(ids.length, course.id).toBeGreaterThan(0)
      expect(new Set(ids).size, course.id).toBe(ids.length)
    }
  })

  it('give each guided song to one course, every one a piece there is', () => {
    const songs = COURSES.flatMap((course) => course.songs)
    expect(new Set(songs).size).toBe(songs.length)
    for (const id of songs) expect(pieceById(id), id).toBeDefined()
  })

  it('a method book’s course is its book, by its id', () => {
    for (const course of COURSES) {
      expect(course.shelf === 'method-books', course.id).toBe(isMethodBookId(course.id))
    }
  })

  it('keep their lessons to themselves: their own songs, their own book, no lesson links', () => {
    const leaks = COURSES.flatMap((course) =>
      course.lessons.flatMap((lesson) => {
        const where = `${course.id}/${lesson.id}`
        const book = isMethodBookId(course.id) ? course.id : null
        // Level 2 of Called to Play plays level 1's patterns in its new meters.
        const books: readonly (string | null)[] =
          book === 'called-to-play-2' ? [book, 'called-to-play'] : [book]
        return [
          ...piecesOf(lesson)
            .filter((piece) => !course.songs.includes(piece))
            .map((piece) => `${where}: plays ${piece}, not its song`),
          ...patternsOf(lesson)
            .filter((pattern) => {
              const of = partOfShelf(BUILT_IN_PATTERNS.require(pattern).group)
              return isMethodBookId(of) && !books.includes(of)
            })
            .map((pattern) => `${where}: shows ${pattern}, another book’s`),
          ...lessonLinksOf(lesson).map((id) => `${where}: links lesson ${id}`),
          ...mentionsBook(lesson)
            .filter(() => book === null)
            .map((name) => `${where}: names ${name}`),
        ]
      }),
    )
    expect(leaks).toEqual([])
  })
})
