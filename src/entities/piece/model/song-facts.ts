import type { Locale, LocalText } from '@/shared/i18n'
import { withHeaderLine, type ScoreHeader } from './score-header'
import type { Credit } from './types'

/**
 * What a song's page says of it and writes in its Edit (R30): its title and what is said about it.
 * Who wrote it is the score's (its composer and lyricist, printed and edited on the score).
 */
export interface SongFacts {
  readonly title: string
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

export function songFacts(piece: FactsOf, locale: Locale): SongFacts {
  return {
    title: piece[titleField(piece, locale)] ?? piece.title,
    about: piece.note?.[locale] ?? '',
  }
}

/**
 * The piece with these facts: its title in this language where one is written, and what is said about
 * it in the language written (both, for a first one or a song of one language, `oneLanguage`: a
 * learner's own; none where it is empty). Its score's lines and its credits are left as they are.
 */
export function withSongFacts<T extends FactsOf>(
  piece: T,
  facts: SongFacts,
  locale: Locale,
  oneLanguage = false,
): T {
  const about = facts.about.trim()
  const { note: _note, ...rest } = piece
  return {
    ...rest,
    [titleField(piece, locale)]: facts.title.trim() || piece[titleField(piece, locale)],
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
 * it names them, in place of the content's music and words credits (its arranger in place of its
 * harmony credit); every other credit as it is.
 */
export function shownCredits(piece: FactsOf): readonly Credit[] {
  const { composer, lyricist, arranger } = piece.header ?? {}
  const written = composer !== undefined || lyricist !== undefined
  if (!written && arranger === undefined) return piece.credits ?? []
  const kept = (piece.credits ?? []).filter(
    (credit) =>
      !(written && WRITTEN.has(credit.role)) &&
      !(arranger !== undefined && credit.role === 'harmony'),
  )
  const named: Credit[] =
    composer !== undefined && composer === lyricist
      ? [{ role: 'words-and-music', names: composer }]
      : [
          ...(lyricist === undefined ? [] : [{ role: 'words', names: lyricist } as const]),
          ...(composer === undefined ? [] : [{ role: 'music', names: composer } as const]),
        ]
  return [
    ...kept,
    ...named,
    ...(arranger === undefined ? [] : [{ role: 'harmony', names: arranger } as const]),
  ]
}

/** The credits a song's Details edit (R32-C): the lines its score prints for them. */
export const SONG_CREDITS = ['composer', 'lyricist', 'arranger'] as const
export type SongCredit = (typeof SONG_CREDITS)[number]

/** The roles each credit stands for among the content's credits. */
const CREDIT_ROLES: Readonly<Record<SongCredit, readonly Credit['role'][]>> = {
  composer: ['music', 'words-and-music'],
  lyricist: ['words', 'words-and-music'],
  arranger: ['harmony'],
}

/** Who a song's credit names (its Music, Words or Arranger), as its page shows it; '' where none. */
export function songCredit(piece: FactsOf, field: SongCredit): string {
  const credit = shownCredits(piece).find((each) => CREDIT_ROLES[field].includes(each.role))
  return credit && credit.role !== 'unknown' ? credit.names : ''
}

/**
 * The piece with one of its credits written as its score prints it (R32-C): the score's line, and the
 * content's credit it stands for gone, so an emptied line takes the credit away. A shared Words and
 * music splits into its two lines first.
 */
export function withSongCredit<T extends FactsOf>(piece: T, field: SongCredit, text: string): T {
  const credits = piece.credits ?? []
  const shared = credits.find((credit) => credit.role === 'words-and-music')
  const split =
    shared && shared.role !== 'unknown' && field !== 'arranger'
      ? { composer: shared.names, lyricist: shared.names, ...piece.header }
      : (piece.header ?? {})
  const header = withHeaderLine(split, field, text)
  const gone = new Set<Credit['role']>(CREDIT_ROLES[field])
  if (field !== 'arranger') gone.add('words-and-music')
  return { ...piece, header, credits: credits.filter((credit) => !gone.has(credit.role)) }
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
