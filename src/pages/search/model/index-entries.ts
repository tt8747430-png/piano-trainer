import { EXERCISES, type ExerciseId } from '@/entities/exercise'
import { LESSONS, type LessonModule } from '@/entities/lesson'
import type { BookPattern, PatternRef } from '@/entities/pattern'
import { entryTitles, type Entry } from '@/entities/piece'
import {
  LIBRARY_BY_STYLE,
  libraryLine,
  libraryParam,
  progressionMode,
} from '@/entities/progression-library'
import { TRAINER_IDS, type TrainerId } from '@/features/trainer'
import { localText, type Locale, type LocalText } from '@/shared/i18n'
import { matchesQuery } from '@/shared/lib'
import {
  CHORD_QUALITIES,
  chordsOfLine,
  chordSymbol,
  keysOfChords,
  note,
  pitchClassOf,
  qualitySpellings,
  readChordSymbol,
  SCALE_KINDS,
  writtenSymbol,
  type ChordQuality,
  type ChordSize,
  type Key,
  type ScaleKind,
  type SpelledNote,
} from '@/shared/lib/music'
import { PRACTICE_PAGE_IDS, type PracticePageId } from '@/widgets/practice-pages'

/** The kinds of thing the index holds, in the order Search lists them. */
export const INDEX_KINDS = [
  'pages',
  'songs',
  'lessons',
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
  | { readonly opens: 'piece'; readonly entry: Entry }
  | { readonly opens: 'lesson'; readonly lesson: string }
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
  /** A line of chords typed, on Transpose: as typed. */
  | { readonly opens: 'transpose'; readonly chords: string }

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
  readonly module: (module: LessonModule) => string
  readonly key: (key: Key) => string
}

/** What the index is projected from, besides the content every learner has. */
export interface IndexSources {
  readonly locale: Locale
  readonly names: IndexNames
  /** Every song, study and listing, as the learner has it, and their own songs. */
  readonly pieces: readonly Entry[]
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
 * The index: every named thing the app has, each once (ADR 0044). A projection of the registries the
 * pages themselves read, so a thing added to one is found here with no second list to keep.
 */
export function indexEntries({ locale, names, pieces, patterns }: IndexSources): IndexEntry[] {
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
        target: { opens: 'piece', entry },
      }
    }),
    ...LESSONS.map((lesson): IndexEntry => ({
      id: `lessons:${lesson.id}`,
      kind: 'lessons',
      ...named(lesson.title, locale),
      detail: names.module(lesson.module),
      target: { opens: 'lesson', lesson: lesson.id },
    })),
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
 * Asus4`), as Transpose on them, with the key they are in (ADR 0045); none for anything else.
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
  const [found] = line ? keysOfChords(line) : []
  if (!line || !found) return undefined
  return {
    id: 'pages:transpose-typed',
    kind: 'pages',
    title: line.map(chordSymbol).join(' '),
    detail: `${names.page('transpose').title} · ${names.key(found.key)}`,
    words: [],
    target: { opens: 'transpose', chords: query.trim() },
  }
}

/** A kind's entries that a query found. */
export interface IndexGroup {
  readonly kind: IndexKind
  readonly entries: readonly IndexEntry[]
}

/**
 * What a query finds, by kind in the index's order, the kinds with nothing left out; with no query,
 * the whole index. A title, a line or another name holds the query, in either case and without
 * accents. What was typed leads: first of its kind, and its kind first of the kinds.
 */
export function searchIndex(
  entries: readonly IndexEntry[],
  query: string,
  typed?: IndexEntry,
): IndexGroup[] {
  const found = entries.filter((entry) =>
    matchesQuery([entry.title, entry.detail ?? '', ...entry.words], query),
  )
  const kinds: readonly IndexKind[] = typed
    ? [typed.kind, ...INDEX_KINDS.filter((kind) => kind !== typed.kind)]
    : INDEX_KINDS
  return kinds
    .map((kind) => ({
      kind,
      entries: [
        ...(typed?.kind === kind ? [typed] : []),
        ...found.filter((entry) => entry.kind === kind),
      ],
    }))
    .filter((group) => group.entries.length > 0)
}
