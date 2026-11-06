import { CHURCH_MODES, parseNumerals, type ChurchMode } from '@/shared/lib/music'

/**
 * The libraries of Practice a learner keeps favourites in (R30-4): the exercises and the
 * progressions. Accompaniment's patterns keep theirs in `pt-patterns` (the Player's pattern picker
 * reads them there) and its studies in `pt-library`, as every piece's.
 */
export const PRACTICE_KINDS = ['exercises', 'progressions'] as const
export type PracticeKind = (typeof PRACTICE_KINDS)[number]

/** A progression the learner typed and kept: `mine-` and its number, never reused. */
export type OwnProgressionId = `mine-${number}`

/** The longest name a progression of the learner's own takes. */
export const OWN_PROGRESSION_NAME_MAX = 40

/**
 * A progression of the learner's own, Mine in the Progressions library: a name over a line of
 * numerals as the URL holds them (`I-V-vi-IV`), read in a major or a minor key, or in a church mode
 * on that key's tonic.
 */
export interface OwnProgression {
  readonly id: OwnProgressionId
  readonly name: string
  readonly line: string
  readonly minor: boolean
  readonly mode?: ChurchMode
}

const OWN_ID = /^mine-[1-9]\d*$/

export const isOwnProgressionId = (value: unknown): value is OwnProgressionId =>
  typeof value === 'string' && OWN_ID.test(value)

export const ownProgressionId = (number: number): OwnProgressionId => `mine-${number}`

/** The number an own id carries. */
export const ownProgressionNumber = (id: OwnProgressionId): number =>
  Number(id.slice('mine-'.length))

/** A name as kept: trimmed, 1 to 40 characters; null for one that is not. */
export function ownProgressionName(name: string): string | null {
  const kept = name.trim()
  return kept.length > 0 && kept.length <= OWN_PROGRESSION_NAME_MAX ? kept : null
}

/** Whether a line of numerals reads (`parseNumerals`), at least one chord. */
export const readsAsLine = (line: unknown): line is string =>
  typeof line === 'string' && (parseNumerals(line)?.length ?? 0) > 0

export const isChurchMode = (value: unknown): value is ChurchMode =>
  CHURCH_MODES.some((mode) => mode === value)
