import {
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
  readonly added: AddedTone
  /** The alterations as a symbol writes them, each once, in order: `b9s11`; '' for none. */
  readonly alter: string
}

const ALTER_PARAM = /^(b5)?(b9)?(s9)?(s11)?(b13)?$/

/** The alterations an `alter` param writes, or none when it writes anything else. */
export function readAlterations(value: unknown): Alteration[] {
  const match = typeof value === 'string' ? ALTER_PARAM.exec(value) : null
  return match ? ALTERATIONS.filter((_, i) => match[i + 1] !== undefined) : []
}

export const partsParams = ({ alterations, ...parts }: ChordParts): PartsParams => ({
  ...parts,
  alter: alterations.join(''),
})

/** The URL params that open the builder on a table quality: a skill's or a chord family's way in. */
export const qualityParams = (quality: ChordQuality): PartsParams => partsParams(partsOf(quality))

export const partsFromParams = ({ alter, ...params }: PartsParams): ChordParts => ({
  ...params,
  alterations: readAlterations(alter),
})
