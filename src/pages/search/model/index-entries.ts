import { EXERCISES, type ExerciseId } from '@/entities/exercise'
import { COURSES, courseById } from '@/entities/course'
import { LESSONS, lessonById, lessonPlace } from '@/entities/lesson'
import type { FolderId } from '@/entities/library'
import type { BookPattern, PatternRef } from '@/entities/pattern'
import { entryTitles, type Entry, type PieceId } from '@/entities/piece'
import {
  LIBRARY_BY_STYLE,
  libraryLine,
  libraryParam,
  progressionMode,
} from '@/entities/progression-library'
import { TRAINER_IDS, type TrainerId } from '@/features/trainer'
import { localText, type Locale, type LocalText } from '@/shared/i18n'
import { foldText, matchesQuery, WORD_BREAK } from '@/shared/lib'
import {
  CHORD_QUALITIES,
  chordsOfLine,
  chordSymbol,
  keyFromParam,
  note,
  pitchClassOf,
  qualitySpellings,
  readChordSymbol,
  SCALE_KINDS,
  writtenSymbol,
  type ChordQuality,
  type ChordSize,
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
  'quiz',
] as const
type IndexKind = (typeof INDEX_KINDS)[number]

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
  | { readonly opens: 'scale'; readonly scale: ScaleKind }
  | {
      readonly opens: 'progression'
      /** Its line as the URL writes it, in the mode it opens in. */
      readonly p: string
      readonly minor: boolean
      readonly size?: ChordSize
    }
  | { readonly opens: 'pattern'; readonly ref: PatternRef }
  | { readonly opens: 'exercise'; readonly exercise: ExerciseId }
  | { readonly opens: 'trainer'; readonly trainer: TrainerId }
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
  readonly quality: (quality: ChordQuality) => string
  readonly scale: (kind: ScaleKind) => string
  readonly trainer: (trainer: TrainerId) => { readonly title: string; readonly about: string }
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
}: IndexSources): IndexEntry[] {
  return [
    ...PRACTICE_PAGE_IDS.map((page): IndexEntry => {
      const { title, about } = names.page(page)
      return {
        id: `pages:${page}`,
        kind: 'pages',
        title,
        detail: about,
        words: [],
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
    ...COURSES.map((bundled) => courseById(bundled.id) ?? bundled).flatMap(
      (course): IndexEntry[] => [
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
      ],
    ),
    ...CHORD_QUALITIES.map((quality): IndexEntry => {
      const [symbol = '', ...others] = qualitySpellings(quality).map((suffix) =>
        writtenSymbol({ root: C, suffix }),
      )
      return {
        id: `chords:${quality}`,
        kind: 'chords',
        title: names.quality(quality),
        detail: symbol,
        words: others,
        target: { opens: 'chord', root: C, quality },
      }
    }),
    ...SCALE_KINDS.map((scale): IndexEntry => ({
      id: `scales:${scale}`,
      kind: 'scales',
      title: names.scale(scale),
      words: [],
      target: { opens: 'scale', scale },
    })),
    ...LIBRARY_BY_STYLE.flatMap((style) => style.progressions).map((progression): IndexEntry => {
      // The mode it has: its major line where it has one.
      const minor = progressionMode(progression, false)
      return {
        id: `progressions:${progression.id}`,
        kind: 'progressions',
        ...named(progression.name, locale),
        detail: libraryLine(progression, minor),
        target: {
          opens: 'progression',
          p: libraryParam(progression, minor),
          minor,
          ...(progression.size ? { size: progression.size } : {}),
        },
      }
    }),
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
    ...TRAINER_IDS.map((trainer): IndexEntry => {
      const { title, about } = names.trainer(trainer)
      return {
        id: `quiz:${trainer}`,
        kind: 'quiz',
        title,
        detail: about,
        words: [],
        target: { opens: 'trainer', trainer },
      }
    }),
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
