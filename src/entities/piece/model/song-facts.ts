import type { Locale, LocalText } from '@/shared/i18n'
import { withHeaderLine, type ScoreHeader } from './score-header'
import type { Credit } from './types'

/** What a song's page says of it, written in place in Edit (round 28): Flat's score credits. */
export interface SongFacts {
  readonly title: string
  /** Who wrote the music. */
  readonly music: string
  /** Who wrote the words. */
  readonly words: string
  /** What is said about it, in the language written. */
  readonly about: string
}

/** The fields of a piece the facts are read from and written to. */
interface FactsOf {
  readonly title: string
  readonly titleEn?: string
  readonly titleRu?: string
  readonly credits?: readonly Credit[]
  readonly note?: LocalText
  /** What its score prints under its title: its composer and lyricist are who wrote it (round 28). */
  readonly header?: ScoreHeader
}

/** The roles who wrote it are named in: the score's names stand in their place where it has them. */
const WRITTEN = new Set<Credit['role']>(['music', 'words', 'words-and-music'])

/** The title the page shows in this language: its translation where it has one, else as printed. */
const titleField = (piece: FactsOf, locale: Locale) =>
  locale === 'en' && piece.titleEn
    ? 'titleEn'
    : locale === 'ru' && piece.titleRu
      ? 'titleRu'
      : 'title'

const namesOf = (credits: readonly Credit[] | undefined, roles: readonly Credit['role'][]) => {
  const credit = credits?.find((one) => roles.includes(one.role))
  return credit && 'names' in credit ? credit.names : undefined
}

export function songFacts(piece: FactsOf, locale: Locale): SongFacts {
  return {
    title: piece[titleField(piece, locale)] ?? piece.title,
    music: piece.header?.composer ?? namesOf(piece.credits, ['music', 'words-and-music']) ?? '',
    words: piece.header?.lyricist ?? namesOf(piece.credits, ['words', 'words-and-music']) ?? '',
    about: piece.note?.[locale] ?? '',
  }
}

/**
 * The piece with these facts: its title in this language where one is written, who wrote its music
 * and words as its score's composer and lyricist (one place for them, printed under its title and
 * said on its page), and what is said about it in the language written (both, for a first one or a
 * song of one language, `oneLanguage`: a learner's own; none where it is empty). Its credits as the
 * app's content prints them are left as they are.
 */
export function withSongFacts<T extends FactsOf>(
  piece: T,
  facts: SongFacts,
  locale: Locale,
  oneLanguage = false,
): T {
  const about = facts.about.trim()
  const header = withHeaderLine(
    withHeaderLine(piece.header ?? {}, 'composer', facts.music),
    'lyricist',
    facts.words,
  )
  const { note: _note, header: _header, ...rest } = piece
  return {
    ...rest,
    [titleField(piece, locale)]: facts.title.trim() || piece[titleField(piece, locale)],
    ...(Object.keys(header).length > 0 ? { header } : {}),
    ...(about
      ? {
          note:
            piece.note && !oneLanguage
              ? { ...piece.note, [locale]: about }
              : { en: about, ru: about },
        }
      : {}),
  } as T
}

/**
 * The credits a song's page and its information show: who wrote it as its score names them, where
 * it names them, in place of the content's music and words credits; every other credit as it is.
 */
export function shownCredits(piece: FactsOf): readonly Credit[] {
  const { composer, lyricist } = piece.header ?? {}
  if (composer === undefined && lyricist === undefined) return piece.credits ?? []
  const kept = (piece.credits ?? []).filter((credit) => !WRITTEN.has(credit.role))
  const named: Credit[] =
    composer !== undefined && composer === lyricist
      ? [{ role: 'words-and-music', names: composer }]
      : [
          ...(lyricist === undefined ? [] : [{ role: 'words', names: lyricist } as const]),
          ...(composer === undefined ? [] : [{ role: 'music', names: composer } as const]),
        ]
  return [...kept, ...named]
}

const isText = (value: unknown): value is string => typeof value === 'string'
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

/** A saved note, kept where it is written in both languages. */
export function readNote(value: unknown): LocalText | undefined {
  return isRecord(value) && isText(value.en) && isText(value.ru)
    ? { en: value.en.slice(0, 2000), ru: value.ru.slice(0, 2000) }
    : undefined
}
