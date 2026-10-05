import {
  ADDED_TONES,
  ALTERATIONS,
  partsOf,
  type AddedTone,
  type Alteration,
  type BuiltSize,
  type ChordParts,
  type ChordQuality,
  type Seventh,
  type Triad,
} from '@/shared/lib/music'

/** A chord's parts as a URL holds them. */
export interface PartsParams {
  readonly triad: Triad
  readonly size: BuiltSize
  readonly seventh: Seventh
  /** The added tones by their ids, each once, in order: `add6add9`; '' for none. */
  readonly added: string
  /** The alterations as a symbol writes them, each once, in order: `b9s11`; '' for none. */
  readonly alter: string
}

const ALTER_PARAM = /^(b5)?(b9)?(s9)?(s11)?(b13)?$/

/** The alterations an `alter` param writes, or none when it writes anything else. */
export function readAlterations(value: unknown): Alteration[] {
  const match = typeof value === 'string' ? ALTER_PARAM.exec(value) : null
  return match ? ALTERATIONS.filter((_, i) => match[i + 1] !== undefined) : []
}

const ADDED_PARAM = new RegExp(`^${ADDED_TONES.map((tone) => `(${tone})?`).join('')}$`)

/** The added tones an `added` param writes, or none when it writes anything else. */
export function readAdded(value: unknown): AddedTone[] {
  const match = typeof value === 'string' ? ADDED_PARAM.exec(value) : null
  return match ? ADDED_TONES.filter((_, i) => match[i + 1] !== undefined) : []
}

export const partsParams = ({ added, alterations, ...parts }: ChordParts): PartsParams => ({
  ...parts,
  added: added.join(''),
  alter: alterations.join(''),
})

/** The URL params that open the builder on a table quality: a skill's or a chord family's way in. */
export const qualityParams = (quality: ChordQuality): PartsParams => partsParams(partsOf(quality))

export const partsFromParams = ({ added, alter, ...params }: PartsParams): ChordParts => ({
  ...params,
  added: readAdded(added),
  alterations: readAlterations(alter),
})
