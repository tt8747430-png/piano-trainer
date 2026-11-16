import {
  ADDED_TONES,
  ALTERATIONS,
  partsOfKind,
  type AddedTone,
  type Alteration,
  type BuiltSize,
  type ChordKind,
  type ChordParts,
  type Seventh,
  type Triad,
} from '@/shared/lib/music'

/** A chord's parts as a URL holds them. */
export interface PartsParams {
  readonly triad: Triad
  readonly size: BuiltSize
  readonly seventh: Seventh
  /**
   * Its colour notes over the stack (A33), as a symbol writes them, ♯ and ♭ as `#` and `b`, comma
   * separated, alterations first: `b9,#11`, `6,9`; '' for none.
   */
  readonly colour: string
}

/** How the URL writes each alteration and added tone; a triad's `#11` is added, a 7th chord's altered. */
const ALTERATION_PARAM: Readonly<Record<Alteration, string>> = {
  b5: 'b5',
  b9: 'b9',
  s9: '#9',
  s11: '#11',
  b13: 'b13',
}
const ADDED_PARAM: Readonly<Record<AddedTone, string>> = {
  add2: '2',
  add4: '4',
  add6: '6',
  add9: '9',
  add11: '11',
  addS11: '#11',
  add13: '13',
}

/** A `colour` param read at a size: its alterations (a 7th chord's, a triad's ♭5) and added tones, unknown words left out. */
export function readColour(
  value: unknown,
  size: BuiltSize,
): { added: AddedTone[]; alterations: Alteration[] } {
  // A URL reads a lone number as one: `colour=9`.
  const text = typeof value === 'number' ? String(value) : value
  const words = typeof text === 'string' ? text.split(',') : []
  // A triad's one alteration is its ♭5 (`(♭5)`); its `#11` is added.
  const alterations = ALTERATIONS.filter(
    (each) => words.includes(ALTERATION_PARAM[each]) && (size > 5 || each === 'b5'),
  )
  const added = ADDED_TONES.filter(
    (tone) =>
      words.includes(ADDED_PARAM[tone]) && !(tone === 'addS11' && alterations.includes('s11')),
  )
  return { added, alterations }
}

export const partsParams = ({ added, alterations, ...parts }: ChordParts): PartsParams => ({
  ...parts,
  colour: [
    ...alterations.map((each) => ALTERATION_PARAM[each]),
    ...added.map((tone) => ADDED_PARAM[tone]),
  ].join(','),
})

/** The URL params that open the builder on a chord's kind: a skill's, a chord family's or a typed chord's way in. */
export const qualityParams = (quality: ChordKind): PartsParams => partsParams(partsOfKind(quality))

export const partsFromParams = ({ colour, ...params }: PartsParams): ChordParts => ({
  ...params,
  ...readColour(colour, params.size),
})
