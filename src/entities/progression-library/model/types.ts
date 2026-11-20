import { isRecord } from '@/shared/lib'
import type { PatternId } from '@/entities/pattern'
import { isLocalText, isWrittenText, type LocalText } from '@/shared/i18n'
import { parseNumerals, type ChordSize, type ChurchMode } from '@/shared/lib/music'

/** The styles the Progressions library groups its progressions by. */
export const PROGRESSION_STYLES = [
  'pop',
  'rock',
  'jazz',
  'blues',
  'classical',
  'soul',
  'gospel',
  'modal',
  'theory',
] as const
export type ProgressionStyle = (typeof PROGRESSION_STYLES)[number]

/**
 * A progression's lines of numerals as `parseNumerals` reads them, one for each mode it has (ADR 0112):
 * a major key's (`I V vi IV`), a minor key's counted from natural minor (`i VI III VII`), or both.
 */
export type ModeLines =
  | { readonly major: string; readonly minor?: string }
  | { readonly major?: undefined; readonly minor: string }

/**
 * A named progression in Roman numerals, read in any key: the one model of a progression that is
 * practised, one idea with its line in each mode it has, so the key's Major · Minor shows the other.
 */
export type LibraryProgression = ModeLines & ProgressionDetails

/** What a library progression is besides its lines. */
export interface ProgressionDetails {
  readonly id: string
  readonly style: ProgressionStyle
  readonly name: LocalText
  /** How it sounds, in one short line under its name. */
  readonly character: LocalText
  /** The pattern its Player opens with, where it has one of its own. */
  readonly pattern?: PatternId
  /** The chord size it opens at, where triads would lose what it teaches. */
  readonly size?: ChordSize
  /** The church mode it is heard in (a Dorian vamp), its lines written against its major or minor key. */
  readonly mode?: ChurchMode
}

const readsAsLine = (line: unknown): line is string =>
  typeof line === 'string' && (parseNumerals(line)?.length ?? 0) > 0

/**
 * Whether a body from the database reads as the progression `id` (content as data, ADR 0116): a
 * style, a name and a character in both languages, and a line of numerals that reads in a major key,
 * a minor key, or both.
 */
export function readsAsProgression(id: string, body: unknown): body is LibraryProgression {
  if (!isRecord(body)) return false
  const progression = body
  const { major, minor } = progression
  return (
    progression.id === id &&
    PROGRESSION_STYLES.some((style) => style === progression.style) &&
    isWrittenText(progression.name) &&
    isWrittenText(progression.character) &&
    (major !== undefined || minor !== undefined) &&
    (major === undefined || readsAsLine(major)) &&
    (minor === undefined || readsAsLine(minor))
  )
}

/**
 * Whether a body reads as a draft of the progression `id`, words or lines missing or not: what its
 * editor opens on; publishing asks `readsAsProgression`.
 */
export function isProgressionDraft(id: string, body: unknown): body is LibraryProgression {
  if (!isRecord(body)) return false
  const draft = body
  return (
    draft.id === id &&
    PROGRESSION_STYLES.some((style) => style === draft.style) &&
    isLocalText(draft.name) &&
    isLocalText(draft.character) &&
    (draft.major === undefined || typeof draft.major === 'string') &&
    (draft.minor === undefined || typeof draft.minor === 'string')
  )
}

/** A progression an editor starts: its name in English, a pop line to write over, the rest to write. */
export const blankProgression = (id: string, name: string): LibraryProgression => ({
  id,
  style: 'pop',
  major: 'I IV V I',
  name: { en: name, ru: '' },
  character: { en: '', ru: '' },
})
