import { EXERCISES, type ExerciseId } from '@/entities/exercise'
import { allCourses } from '@/entities/course'
import { LESSONS, lessonById, lessonPlace } from '@/entities/lesson'
import type { FolderId } from '@/entities/library'
import type { OwnCourse, OwnLesson } from '@/entities/own-lessons'
import type { BookPattern, PatternRef } from '@/entities/pattern'
import { entryTitles, type Entry, type PieceId } from '@/entities/piece'
import type { OwnProgression } from '@/entities/practice-library'
import { libraryByStyle, libraryLine, progressionMode } from '@/entities/progression-library'
import { localText, type Locale, type LocalText } from '@/shared/i18n'
import { foldText, matchesQuery, WORD_BREAK } from '@/shared/lib'
import {
  CHORD_QUALITIES,
  chordsOfLine,
  chordSymbol,
  keyFromParam,
  note,
  numeralsLine,
  parseNoteName,
  parseNumerals,
  pitchClassOf,
  printedNote,
  printedSymbol,
  qualitySpellings,
  readChordSymbol,
  SCALE_KINDS,
  scaleIntervals,
  spellAbove,
  writtenSymbol,
  type ChordQuality,
  type Key,
  type KeyParam,
  type ScaleKind,
  type SpelledNote,
} from '@/shared/lib/music'
import { PRACTICE_PAGE_IDS, type PracticePageId } from '@/widgets/practice-pages'
import { typedSearch } from '@/widgets/progression-explorer'

/** The kinds of thing the index holds, in the order Search lists them. */
export const INDEX_KINDS = [
  'pages',
  'songs',
  'folders',
  'lessons',
  'courses',
  'chords',
  'scales',
  'progressions',
  'patterns',
  'exercises',
] as const
export type IndexKind = (typeof INDEX_KINDS)[number]

/** What an entry opens, by what it names; Search's row makes it a link. */
export type IndexTarget =
  | { readonly opens: 'page'; readonly page: PracticePageId }
  /** A song, and whether the learner archived it: its row says so (ADR 0106). */
  | { readonly opens: 'piece'; readonly entry: Entry; readonly archived: boolean }
  | { readonly opens: 'folder'; readonly folder: FolderId }
  | { readonly opens: 'lesson'; readonly lesson: string }
  | { readonly opens: 'course'; readonly course: string }
  | { readonly opens: 'course-lesson'; readonly course: string; readonly lesson: string }
  | { readonly opens: 'chord'; readonly root: SpelledNote; readonly quality: ChordQuality }
  /** A scale kind's page, on a tonic where one was typed ("D minor"). */
  | { readonly opens: 'scale'; readonly scale: ScaleKind; readonly root?: SpelledNote }
  /** A progression of the library or the learner's own, on its page (R30-4). */
  | { readonly opens: 'progression'; readonly id: string }
  | { readonly opens: 'pattern'; readonly ref: PatternRef }
  | { readonly opens: 'exercise'; readonly exercise: ExerciseId }
  /** A line of chords typed, on Progressions: its numerals in the key it is read in (ADR 0052). */
  | { readonly opens: 'typed-line'; readonly key: KeyParam; readonly p: string }

/** One named thing of the app: what it is called, a line on it, and what it opens. */
export interface IndexEntry {
  readonly id: string
  readonly kind: IndexKind
  /** Its name in the learner's language. */
  readonly title: string
  readonly detail?: string
  /** Every other name it answers to: its title in the other language, a symbol's other spellings. */
  readonly words: readonly string[]
  readonly target: IndexTarget
}

/** The names the interface gives what content does not name itself. */
export interface IndexNames {
  readonly page: (page: PracticePageId) => { readonly title: string; readonly about: string }
  /** A page's title in every language the app speaks: typed in either, it is found. */
  readonly pageNames: (page: PracticePageId) => readonly string[]
  readonly quality: (quality: ChordQuality) => string
  readonly scale: (kind: ScaleKind) => string
  readonly key: (key: Key) => string
  /** How many songs a folder holds: "Songs: 3". */
  readonly songCount: (count: number) => string
}

/** What the index is projected from, besides the content every learner has. */
export interface IndexSources {
  readonly locale: Locale
  readonly names: IndexNames
  /** Every song, study and listing, as the learner has it, and their own songs. */
  readonly pieces: readonly Entry[]
  /** The library's folders (ADR 0106), each with how many songs it holds. */
  readonly folders: readonly {
    readonly id: FolderId
    readonly name: string
    readonly count: number
  }[]
  /** The songs the learner archived. */
  readonly archived: ReadonlySet<PieceId>
  /** Every pattern of the book, the learner's own too. */
  readonly patterns: readonly BookPattern[]
  /** The progressions the learner keeps, Mine (R30-4). */
  readonly progressions: readonly OwnProgression[]
  /** The lessons and courses the learner made (R30-5). */
  readonly ownLessons: readonly OwnLesson[]
  readonly ownCourses: readonly OwnCourse[]
}

/** The root a chord quality and a scale kind are shown on. */
const C = note('C')

/** A text in the learner's language, answering to the other one too. */
const named = (text: LocalText, locale: Locale) => ({
  title: localText(text, locale),
  words: [text.en, text.ru],
})

/**
 * The index: every named thing the app has, each once (ADR 0052). A projection of the registries the
 * pages themselves read, so a thing added to one is found here with no second list to keep.
 */
export function indexEntries({
  locale,
  names,
  pieces,
  folders,
  archived,
  patterns,
  progressions,
  ownLessons,
  ownCourses,
}: IndexSources): IndexEntry[] {
  return [
    ...PRACTICE_PAGE_IDS.map((page): IndexEntry => {
      const { title, about } = names.page(page)
      return {
        id: `pages:${page}`,
        kind: 'pages',
        title,
        detail: about,
        words: names.pageNames(page),
        target: { opens: 'page', page },
      }
    }),
    ...pieces.map((entry): IndexEntry => {
      const { primary, secondary } = entryTitles(entry, locale)
      return {
        id: `songs:${entry.id}`,
        kind: 'songs',
        title: primary,
        ...(secondary ? { detail: secondary } : {}),
        words: [entry.title, entry.titleEn ?? '', entry.titleRu ?? ''],
        target: { opens: 'piece', entry, archived: archived.has(entry.id) },
      }
    }),
    ...folders.map((folder): IndexEntry => ({
      id: `folders:${folder.id}`,
      kind: 'folders',
      title: folder.name,
      detail: names.songCount(folder.count),
      words: [],
      target: { opens: 'folder', folder: folder.id },
    })),
    ...LESSONS.map((bundled): IndexEntry => {
      const lesson = lessonById(bundled.id) ?? bundled
      const place = lessonPlace(lesson.id)
      return {
        id: `lessons:${lesson.id}`,
        kind: 'lessons',
        ...named(lesson.title, locale),
        detail: place
          ? `${localText(place.journey.title, locale)} · ${localText(place.chapter.title, locale)}`
          : localText(lesson.summary, locale),
        target: { opens: 'lesson', lesson: lesson.id },
      }
    }),
    // The learner's own, each written once and read alike in both languages (R30-5).
    ...ownLessons.map((lesson): IndexEntry => ({
      id: `lessons:${lesson.id}`,
      kind: 'lessons',
      ...named(lesson.title, locale),
      detail: localText(lesson.summary, locale),
      target: { opens: 'lesson', lesson: lesson.id },
    })),
    ...ownCourses.map((course): IndexEntry => ({
      id: `courses:${course.id}`,
      kind: 'courses',
      title: course.title,
      detail: course.line,
      words: [],
      target: { opens: 'course', course: course.id },
    })),
    ...allCourses().flatMap((course): IndexEntry[] => [
      {
        id: `courses:${course.id}`,
        kind: 'courses',
        ...named(course.title, locale),
        detail: localText(course.summary, locale),
        target: { opens: 'course', course: course.id },
      },
      ...course.lessons.map((lesson): IndexEntry => ({
        id: `courses:${course.id}/${lesson.id}`,
        kind: 'courses',
        ...named(lesson.title, locale),
        detail: localText(course.title, locale),
        target: { opens: 'course-lesson', course: course.id, lesson: lesson.id },
      })),
    ]),
    ...CHORD_QUALITIES.map((quality): IndexEntry => {
      const [symbol = '', ...others] = qualitySpellings(quality).map((suffix) =>
        writtenSymbol({ root: C, suffix }),
      )
      return {
        id: `chords:${quality}`,
        kind: 'chords',
        title: names.quality(quality),
        detail: printedSymbol(symbol),
        words: others,
        target: { opens: 'chord', root: C, quality },
      }
    }),
    ...SCALE_KINDS.map((scale): IndexEntry => ({
      id: `scales:${scale}`,
      kind: 'scales',
      title: names.scale(scale),
      // Its notes on C, as a chord's entry shows its symbol on C.
      detail: scaleIntervals(scale)
        .map((interval) => printedNote(spellAbove(C, interval)))
        .join(' '),
      words: [],
      target: { opens: 'scale', scale },
    })),
    ...libraryByStyle()
      .flatMap((style) => style.progressions)
      .map((progression): IndexEntry => ({
        id: `progressions:${progression.id}`,
        kind: 'progressions',
        ...named(progression.name, locale),
        // Its line in the mode it has: its major line where it has one.
        detail: libraryLine(progression, progressionMode(progression, false)),
        target: { opens: 'progression', id: progression.id },
      })),
    ...progressions.map((progression): IndexEntry => ({
      id: `progressions:${progression.id}`,
      kind: 'progressions',
      title: progression.name,
      detail: numeralsLine(parseNumerals(progression.line) ?? []),
      words: [],
      target: { opens: 'progression', id: progression.id },
    })),
    ...patterns.map((pattern): IndexEntry => ({
      id: `patterns:${pattern.ref}`,
      kind: 'patterns',
      ...named(pattern.name, locale),
      detail: localText(pattern.idea, locale),
      target: { opens: 'pattern', ref: pattern.ref },
    })),
    ...EXERCISES.map((exercise): IndexEntry => ({
      id: `exercises:${exercise.id}`,
      kind: 'exercises',
      ...named(exercise.name, locale),
      detail: localText(exercise.trains, locale),
      target: { opens: 'exercise', exercise: exercise.id },
    })),
  ]
}

/**
 * What a typed query names besides the index's own entries: a chord symbol (`F#m7b5`), as an entry
 * that opens it, none for a chord on C, which the index already shows; or a line of chords (`Dm7 Gm9
 * Asus4`), on Progressions in the key it is read in (ADR 0052); none for anything else.
 */
export function typedEntry(query: string, names: IndexNames): IndexEntry | undefined {
  const chord = readChordSymbol(query)
  if (chord) {
    if (pitchClassOf(chord.root) === pitchClassOf(C)) return undefined
    const { root, quality } = chord
    return {
      id: 'chords:typed',
      kind: 'chords',
      title: chordSymbol({ root, quality }),
      detail: names.quality(quality),
      words: [],
      target: { opens: 'chord', root, quality },
    }
  }
  const scale = typedScale(query, names)
  if (scale) return scale
  const line = chordsOfLine(query)
  const search = line ? typedSearch(query, { tonic: C, minor: false }) : null
  if (!line || !search) return undefined
  return {
    id: 'progressions:typed',
    kind: 'progressions',
    title: line.map(chordSymbol).join(' '),
    detail: `${names.page('progressions').title} · ${names.key(keyFromParam(search.key))}`,
    words: [],
    target: { opens: 'typed-line', ...search },
  }
}

/**
 * A scale typed with its tonic, as a musician says it ("D minor", "F# dorian", "Bb harmonic minor"):
 * its page on that tonic. "minor" alone is the natural minor.
 */
function typedScale(query: string, names: IndexNames): IndexEntry | undefined {
  const typed = /^([a-g])([#♯b♭]{0,2})\s+(.+)$/iu.exec(query.trim())
  if (!typed) return undefined
  const [, letter = '', accidental = '', said = ''] = typed
  const root = parseNoteName(letter.toUpperCase() + accidental)
  const wanted = foldText(said)
  const kind =
    wanted === foldText(names.scale('natural').split(' ').at(-1) ?? '')
      ? 'natural'
      : SCALE_KINDS.find((each) => each === wanted || foldText(names.scale(each)) === wanted)
  if (!root || !kind) return undefined
  const name = names.scale(kind)
  return {
    id: 'scales:typed',
    kind: 'scales',
    title: `${printedNote(root)} ${name.charAt(0).toLocaleLowerCase()}${name.slice(1)}`,
    detail: names.page('scales').title,
    words: [],
    target: { opens: 'scale', scale: kind, root },
  }
}

/** A kind's entries that a query found. */
export interface IndexGroup {
  readonly kind: IndexKind
  readonly entries: readonly IndexEntry[]
}

/**
 * How near an entry answers a folded query, lowest nearest: its title or another of its names itself
 * (a chord's symbol), a title starting with it, a word of its title, a word of another of its names,
 * a part of any.
 */
function nearness(entry: IndexEntry, wanted: string): number {
  const title = foldText(entry.title)
  const others = [entry.detail ?? '', ...entry.words]
  if (title === wanted || others.some((name) => foldText(name) === wanted)) return 0
  if (title.startsWith(wanted)) return 1
  const startsAWord = (field: string) =>
    foldText(field)
      .split(WORD_BREAK)
      .some((word) => word.startsWith(wanted))
  if (startsAWord(entry.title)) return 2
  if (others.some(startsAWord)) return 3
  return 4
}

/**
 * The entries a query finds, by kind, the kinds with nothing left out: an entry's title, line and
 * other names hold every word of the query, in either case and without accents. Each kind's nearest
 * first, and the kind with the nearest entry first (the kinds' own order between equals); what was
 * typed (a chord or a song's chords) leads, first of its kind and its kind first of all. No query
 * lists the whole index in its order.
 */
export function searchIndex(
  entries: readonly IndexEntry[],
  query: string,
  typed?: IndexEntry,
): IndexGroup[] {
  const wanted = foldText(query.trim())
  const found = entries
    .filter((entry) => matchesQuery([entry.title, entry.detail ?? '', ...entry.words], query))
    .map((entry) => ({ entry, near: wanted === '' ? 0 : nearness(entry, wanted) }))
    .toSorted((a, b) => a.near - b.near)
  return INDEX_KINDS.map((kind) => {
    const ofKind = found.filter(({ entry }) => entry.kind === kind)
    return {
      kind,
      near: typed?.kind === kind ? -1 : (ofKind[0]?.near ?? Infinity),
      entries: [...(typed?.kind === kind ? [typed] : []), ...ofKind.map(({ entry }) => entry)],
    }
  })
    .filter((group) => group.entries.length > 0)
    .toSorted((a, b) => a.near - b.near)
    .map(({ kind, entries: inKind }) => ({ kind, entries: inKind }))
}
