import { chordRootSpelling, qualitySuffix, qualityWithIntervals, type ChordQuality } from './chord'
import { seventhName, triadName } from './chord-name'
import { INTERVALS, type IntervalName, type LabelledInterval } from './interval'
import type { SpelledNote } from './note'
import type { PitchClass } from './pitch'
import { toneAbove, type Tone } from './tone'

/** A chord's base: its 3rd and 5th, or a tone suspended in place of the 3rd. */
export const TRIADS = ['maj', 'min', 'dim', 'aug', 'sus2', 'sus4'] as const
export type Triad = (typeof TRIADS)[number]

/** How far a chord stacks, by its highest number: a triad's is its 5th. */
export const BUILT_SIZES = [5, 7, 9, 11, 13] as const
export type BuiltSize = (typeof BUILT_SIZES)[number]

/** The 7th over the triad, from a 7th chord up. */
export const SEVENTHS = ['minor', 'major', 'diminished'] as const
export type Seventh = (typeof SEVENTHS)[number]

/** A tone a triad adds: the 6th, the 6th and 9th, or a 2nd, 4th, 9th, 11th or raised 11th. */
export const ADDED_TONES = [
  'none',
  'six',
  'sixNine',
  'add2',
  'add4',
  'add9',
  'add11',
  'addS11',
] as const
export type AddedTone = (typeof ADDED_TONES)[number]

/** The tones a 7th chord with a major 3rd may raise or lower, in the order a symbol writes them. */
export const ALTERATIONS = ['b5', 'b9', 's9', 's11', 'b13'] as const
export type Alteration = (typeof ALTERATIONS)[number]

/** A chord as the Chords reference builds it, part by part. */
export interface ChordParts {
  readonly triad: Triad
  readonly size: BuiltSize
  /** A 7th chord's and up; `minor` below them. */
  readonly seventh: Seventh
  /** A triad's; `none` from a 7th chord up. */
  readonly added: AddedTone
  /** In `ALTERATIONS` order; only those `alterationsOf` offers. */
  readonly alterations: readonly Alteration[]
}

/** A chord built from its parts: its tones from the root up, its suffix, and the table's quality where it is one. */
export interface BuiltChord {
  readonly root: SpelledNote
  readonly tones: readonly Tone[]
  /** The table's suffix where the table has the chord, else the rule's: `13sus4`, `m(add9)`, `9#11`. */
  readonly suffix: string
  readonly quality?: ChordQuality
}

const TRIAD_INTERVALS: Readonly<Record<Triad, readonly IntervalName[]>> = {
  maj: ['r', 'M3', 'P5'],
  min: ['r', 'm3', 'P5'],
  dim: ['r', 'm3', 'd5'],
  aug: ['r', 'M3', 'A5'],
  sus2: ['r', 'M2', 'P5'],
  sus4: ['r', 'P4', 'P5'],
}
const SEVENTH_INTERVAL: Readonly<Record<Seventh, IntervalName>> = {
  minor: 'm7',
  major: 'M7',
  diminished: 'd7',
}
const ADDED_INTERVALS: Readonly<Record<AddedTone, readonly IntervalName[]>> = {
  none: [],
  six: ['M6'],
  sixNine: ['M6', 'M9'],
  add2: ['M2'],
  add4: ['P4'],
  add9: ['M9'],
  add11: ['P11'],
  addS11: ['A11'],
}
/** What an alteration puts in, and the natural tone it takes out. */
const ALTERED: Readonly<
  Record<Alteration, { readonly adds: IntervalName; readonly takes: IntervalName }>
> = {
  b5: { adds: 'd5', takes: 'P5' },
  b9: { adds: 'm9', takes: 'M9' },
  s9: { adds: 'A9', takes: 'M9' },
  s11: { adds: 'A11', takes: 'P11' },
  b13: { adds: 'm13', takes: 'M13' },
}

/** The semitones of a triad's 3rd (or suspended tone) and 5th: what names it. */
const triadSemitones = (triad: Triad): readonly number[] =>
  TRIAD_INTERVALS[triad].slice(1).map((name) => INTERVALS[name].semitones)

/** A triad's own suffix: '' for major, `m`, `°`, `+`, `sus2`, `sus4`. */
export const triadSuffix = (triad: Triad): string => triadName(triadSemitones(triad)).suffix

/** How each 7th is written as a degree, as the keys label it: ♭7, 7, 𝄫7. */
export const SEVENTH_DEGREE: Readonly<Record<Seventh, string>> = {
  minor: INTERVALS.m7.degree,
  major: INTERVALS.M7.degree,
  diminished: INTERVALS.d7.degree,
}

/** How each part is written in a symbol. */
export const ADDED_SYMBOL: Readonly<Record<Exclude<AddedTone, 'none'>, string>> = {
  six: '6',
  sixNine: '6/9',
  add2: 'add2',
  add4: 'add4',
  add9: 'add9',
  add11: 'add11',
  addS11: 'add#11',
}
export const ALTERATION_SIGN: Readonly<Record<Alteration, string>> = {
  b5: '♭5',
  b9: '♭9',
  s9: '#9',
  s11: '#11',
  b13: '♭13',
}

/**
 * The sizes a triad stacks to: a suspension stops where its own tone would stack again (a sus2's 2nd
 * is its 9th; a sus4's 4th is its 11th, so it skips to the 13th), and the diminished and augmented
 * triads where chord dictionaries stop naming them.
 */
const SIZES: Readonly<Record<Triad, readonly BuiltSize[]>> = {
  maj: [5, 7, 9, 11, 13],
  min: [5, 7, 9, 11, 13],
  dim: [5, 7, 9, 11],
  aug: [5, 7, 9],
  sus2: [5, 7],
  sus4: [5, 7, 9, 13],
}
export const sizesOf = (triad: Triad): readonly BuiltSize[] => SIZES[triad]

/** The 7ths over a triad at a size: a diminished 7th only over a diminished triad, and only as a 7th chord. */
export function seventhsOf(triad: Triad, size: BuiltSize): readonly Seventh[] {
  if (triad !== 'dim') return ['minor', 'major']
  return size === 7 ? ['minor', 'diminished'] : ['minor']
}

/**
 * The tones a triad adds: the major triad every one (its raised 11th the Lydian triad's), the minor
 * triad all but that, a sus4 its 6th and 9th, the rest none.
 */
const ADDED: Readonly<Record<Triad, readonly AddedTone[]>> = {
  maj: ADDED_TONES,
  min: ADDED_TONES.filter((tone) => tone !== 'addS11'),
  dim: ['none'],
  aug: ['none'],
  sus2: ['none'],
  sus4: ['none', 'six', 'add9'],
}
export const addedOf = (triad: Triad): readonly AddedTone[] => ADDED[triad]

/**
 * The alterations a chord takes, its available tensions: a dominant 7th (a major 3rd under a minor
 * 7th) every one but a ♭13 over a raised 5th, which is that 5th; a major 7th its #11; a 7sus4 its ♭9;
 * the rest none.
 */
export function alterationsOf(parts: ChordParts): readonly Alteration[] {
  if (parts.size === 5) return []
  if (parts.triad === 'sus4') return parts.seventh === 'minor' ? ['b9'] : []
  if (parts.triad !== 'maj' && parts.triad !== 'aug') return []
  if (parts.seventh === 'major') return ['s11']
  return parts.triad === 'aug' ? ALTERATIONS.filter((each) => each !== 'b13') : ALTERATIONS
}

/** Alterations that land on the same key, the first kept when both are asked for: a ♭5 is a #11. */
const CLASHES: readonly (readonly [Alteration, Alteration])[] = [['b5', 's11']]
const clash = (a: Alteration, b: Alteration): boolean =>
  CLASHES.some(([first, second]) => (first === a && second === b) || (first === b && second === a))

const DEFAULT_SEVENTH: Seventh = 'minor'

/** Parts made to fit one another: a size the triad has (else the largest below), and each other part the chord can take, or its default. */
export function fitParts(parts: ChordParts): ChordParts {
  const sizes = sizesOf(parts.triad)
  const size = sizes.includes(parts.size)
    ? parts.size
    : (sizes.filter((each) => each < parts.size).at(-1) ?? 5)
  const seventh =
    size > 5 && seventhsOf(parts.triad, size).includes(parts.seventh)
      ? parts.seventh
      : DEFAULT_SEVENTH
  const added = size === 5 && addedOf(parts.triad).includes(parts.added) ? parts.added : 'none'
  const fitted = { triad: parts.triad, size, seventh, added, alterations: [] }
  const offered = alterationsOf(fitted)
  const alterations = ALTERATIONS.filter(
    (each) => parts.alterations.includes(each) && offered.includes(each),
  )
  return {
    ...fitted,
    alterations: alterations.filter(
      (each, i) => !alterations.slice(0, i).some((earlier) => clash(earlier, each)),
    ),
  }
}

/** Parts with the alterations chosen next: one just chosen turns off the one it clashes with (a #11 a ♭5). */
export function withAlterations(parts: ChordParts, chosen: readonly Alteration[]): ChordParts {
  const fresh = chosen.filter((each) => !parts.alterations.includes(each))
  return fitParts({
    ...parts,
    alterations: chosen.filter(
      (each) => fresh.includes(each) || !fresh.some((other) => clash(other, each)),
    ),
  })
}

/**
 * The intervals parts build, from the root up: the triad; then its added tone, or its 7th and the
 * natural 9th, 11th and 13th up to the size (the 11th left out of a 13th over a major 3rd, where it
 * clashes with the 3rd, and a sus4's 11th, which is its 4th); each alteration in place of its natural
 * tone, or added (a ♭5 under a raised 5th: the altered chord).
 */
function builtIntervals(parts: ChordParts): LabelledInterval[] {
  const names = new Set<IntervalName>(TRIAD_INTERVALS[parts.triad])
  if (parts.size === 5) {
    for (const name of ADDED_INTERVALS[parts.added]) names.add(name)
  } else {
    const major3rd = names.has('M3')
    names.add(SEVENTH_INTERVAL[parts.seventh])
    if (parts.size >= 9) names.add('M9')
    if (parts.size >= 11 && parts.triad !== 'sus4' && !(parts.size === 13 && major3rd)) {
      names.add('P11')
    }
    if (parts.size === 13) names.add('M13')
    for (const alteration of parts.alterations) {
      names.delete(ALTERED[alteration].takes)
      names.add(ALTERED[alteration].adds)
    }
  }
  return [...names].map((name) => INTERVALS[name]).sort((a, b) => a.semitones - b.semitones)
}

/** The highest natural extension a 7th chord keeps: the number its symbol carries. */
export function highestNatural(parts: ChordParts): 7 | 9 | 11 | 13 {
  const has = (alteration: Alteration) => parts.alterations.includes(alteration)
  if (parts.size === 13 && !has('b13')) return 13
  if (parts.size === 11 && !has('s11')) return 11
  if (parts.size >= 9 && !has('b9') && !has('s9')) return 9
  return 7
}

/** What a 6th chord writes before and after its `6`. */
const SIX: Readonly<Partial<Record<Triad, { readonly lead: string; readonly trail: string }>>> = {
  maj: { lead: '', trail: '' },
  min: { lead: 'm', trail: '' },
  sus4: { lead: '', trail: 'sus4' },
}

/**
 * A chord's suffix by rule: a triad's, with its added tone (`6`, `m6/9`, `6sus4`, `add9`,
 * `m(add9)`); a 7th chord's name around its highest natural number (`m11`, `13sus4`, `Maj9`), then each
 * alteration in order (`9#11`, `7♭5♭9`, `Maj13#11`).
 */
function ruleSuffix(parts: ChordParts): string {
  if (parts.size === 5) {
    const triad = triadSuffix(parts.triad)
    if (parts.added === 'none') return triad
    const six = SIX[parts.triad]
    if ((parts.added === 'six' || parts.added === 'sixNine') && six) {
      return `${six.lead}${ADDED_SYMBOL[parts.added]}${six.trail}`
    }
    return triad ? `${triad}(${ADDED_SYMBOL[parts.added]})` : ADDED_SYMBOL[parts.added]
  }
  const { lead, trail } = seventhName([
    ...triadSemitones(parts.triad),
    INTERVALS[SEVENTH_INTERVAL[parts.seventh]].semitones,
  ])
  const altered = parts.alterations.map((each) => ALTERATION_SIGN[each]).join('')
  return `${lead}${highestNatural(parts)}${trail}${altered}`
}

/** A chord from its parts on a root: its tones spelled by letter steps, named as the table or the rule names it. */
export function buildChord(root: SpelledNote, parts: ChordParts): BuiltChord {
  const intervals = builtIntervals(parts)
  const quality = qualityWithIntervals(intervals)
  return {
    root,
    tones: intervals.map((interval) => toneAbove(root, interval)),
    suffix: quality ? qualitySuffix(quality) : ruleSuffix(parts),
    ...(quality ? { quality } : {}),
  }
}

/** The root the built chord on this pitch class is named from, by the table's rule. */
export const builtRootSpelling = (pc: PitchClass, parts: ChordParts): SpelledNote =>
  chordRootSpelling(pc, builtIntervals(parts))

/** Every subset of a list, fewest first, each in the list's order. */
const subsetsOf = <T>(list: readonly T[]): T[][] =>
  list
    .reduce<T[][]>(
      (subsets, each) => [...subsets, ...subsets.map((subset) => [...subset, each])],
      [[]],
    )
    .sort((a, b) => a.length - b.length)

/**
 * Every chord the builder makes, each once, simplest first: by triad, size, 7th and added tone, then
 * the fewest alterations. Where two parts build the same chord (a 7th with a ♭9 and a 9th with its 9th
 * lowered), the smaller size is kept.
 */
export const CHORD_PARTS: readonly ChordParts[] = (() => {
  const all = TRIADS.flatMap((triad) =>
    sizesOf(triad).flatMap((size) =>
      size === 5
        ? addedOf(triad).map((added) => ({
            triad,
            size,
            seventh: DEFAULT_SEVENTH,
            added,
            alterations: [],
          }))
        : seventhsOf(triad, size).flatMap((seventh) => {
            const parts: ChordParts = { triad, size, seventh, added: 'none', alterations: [] }
            return subsetsOf(alterationsOf(parts)).map((alterations) =>
              fitParts({ ...parts, alterations }),
            )
          }),
    ),
  )
  const seen = new Set<string>()
  return all.filter((parts) => {
    const key = builtIntervals(parts)
      .map((interval) => interval.semitones)
      .join(' ')
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
})()

/** The parts that build a table quality: how a chord family's step opens the builder. */
export function partsOf(quality: ChordQuality): ChordParts {
  const parts = CHORD_PARTS.find((each) => qualityWithIntervals(builtIntervals(each)) === quality)
  if (!parts) throw new RangeError(`No parts build ${quality}`)
  return parts
}
