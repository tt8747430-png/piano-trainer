import type { Locale, LocalText } from '@/shared/i18n'
import { CREDIT_ROLES, type Credit } from './types'

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
}

/** The roles the facts write; every other credit (its authors, its harmony…) is kept as it is. */
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
    music: namesOf(piece.credits, ['music', 'words-and-music']) ?? '',
    words: namesOf(piece.credits, ['words', 'words-and-music']) ?? '',
    about: piece.note?.[locale] ?? '',
  }
}

/**
 * The piece with these facts: its title in this language where one is written, who wrote the music and the words
 * (one credit where they are the same names), the credits not written here kept first, and what is
 * said about it in the language written (both, for a first one or a song of one language,
 * `oneLanguage`: a learner's own; none where it is empty).
 */
export function withSongFacts<T extends FactsOf>(
  piece: T,
  facts: SongFacts,
  locale: Locale,
  oneLanguage = false,
): T {
  const [music, words, about] = [facts.music.trim(), facts.words.trim(), facts.about.trim()]
  const kept = (piece.credits ?? []).filter((credit) => !WRITTEN.has(credit.role))
  const written: Credit[] =
    music && music === words
      ? [{ role: 'words-and-music', names: music }]
      : [
          ...(words ? [{ role: 'words', names: words } as const] : []),
          ...(music ? [{ role: 'music', names: music } as const] : []),
        ]
  const credits = [...kept, ...written]
  const { credits: _credits, note: _note, ...rest } = piece
  return {
    ...rest,
    [titleField(piece, locale)]: facts.title.trim() || piece[titleField(piece, locale)],
    ...(credits.length > 0 ? { credits } : {}),
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

const isText = (value: unknown): value is string => typeof value === 'string'
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

/** Saved credits, kept where each reads as a role and its names; none where none do. */
export function readCredits(value: unknown): readonly Credit[] | undefined {
  if (!Array.isArray(value)) return undefined
  const credits = value.flatMap((credit): Credit[] => {
    if (!isRecord(credit)) return []
    if (credit.role === 'unknown') return [{ role: 'unknown' }]
    const role = CREDIT_ROLES.find((known) => known === credit.role)
    return role && isText(credit.names) && credit.names.trim()
      ? [{ role, names: credit.names.trim().slice(0, 200) }]
      : []
  })
  return credits.length > 0 ? credits : undefined
}

/** A saved note, kept where it is written in both languages. */
export function readNote(value: unknown): LocalText | undefined {
  return isRecord(value) && isText(value.en) && isText(value.ru)
    ? { en: value.en.slice(0, 2000), ru: value.ru.slice(0, 2000) }
    : undefined
}
