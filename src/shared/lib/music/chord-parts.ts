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

/**
 * A tone a chord adds beside the ones it stacks, in the order a hand finds them: a 2nd, 4th or 6th
 * inside the triad, a 9th, 11th, raised 11th or 13th over it.
 */
export const ADDED_TONES = ['add2', 'add4', 'add6', 'add9', 'add11', 'addS11', 'add13'] as const
export type AddedTone = (typeof ADDED_TONES)[number]

/** The tones a 7th chord with a major 3rd may raise or lower, in the order a symbol writes them. */
export const ALTERATIONS = ['b5', 'b9', 's9', 's11', 'b13'] as const
export type Alteration = (typeof ALTERATIONS)[number]

/** A chord as the Chords explorer builds it, part by part. */
export interface ChordParts {
  readonly triad: Triad
  readonly size: BuiltSize
  /** A 7th chord's and up; `minor` below them. */
  readonly seventh: Seventh
  /** In `ADDED_TONES` order; only those `addedOf` offers. */
  readonly added: readonly AddedTone[]
  /** In `ALTERATIONS` order; only those `alterationsOf` offers. */
  readonly alterations: readonly Alteration[]
}

/** A chord built from its parts: its tones from the root up, its suffix, and the table's quality where it is one. */
export interface BuiltChord {
  readonly root: SpelledNote
  readonly tones: readonly Tone[]
  /** The table's suffix where the table has the chord, else the rule's: `13sus4`, `m(add9)`, `7(add13)`. */
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
const ADDED_INTERVAL: Readonly<Record<AddedTone, IntervalName>> = {
  add2: 'M2',
  add4: 'P4',
  add6: 'M6',
  add9: 'M9',
  add11: 'P11',
  addS11: 'A11',
  add13: 'M13',
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
const ADDED_SYMBOL: Readonly<Record<AddedTone, string>> = {
  add2: 'add2',
  add4: 'add4',
  add6: '6',
  add9: 'add9',
  add11: 'add11',
  addS11: 'add#11',
  add13: 'add13',
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
 * The tones a triad adds, as chord dictionaries name them: the major triad its 2nd to its raised 11th
 * (the Lydian triad's), the minor triad all but that, a sus4 its 6th and 9th, a sus2 its 6th (`6sus2`;
 * its 9th is its 2nd), the augmented triad its 9th (`+(add9)`), the diminished triad none.
 */
const TRIAD_ADDS: Readonly<Record<Triad, readonly AddedTone[]>> = {
  maj: ['add2', 'add4', 'add6', 'add9', 'add11', 'addS11'],
  min: ['add2', 'add4', 'add6', 'add9', 'add11'],
  dim: [],
  aug: ['add9'],
  sus2: ['add6'],
  sus4: ['add6', 'add9'],
}

/**
 * The tones a chord may add, as chord dictionaries name them: a triad its own; a 7th chord only a tone
 * its stack skipped. Over a 7th chord that is the 13th (a major 9th's is the 13th chord as the builder
 * writes it, so only a 7th's and a minor 9th's) and, under a minor 3rd, a 7th chord's 11th: an 11th
 * clashes with a major 3rd, and is left out of the 13th for it. A 9th added is the 9th chord.
 */
export function addedOf({ triad, size }: Pick<ChordParts, 'triad' | 'size'>): readonly AddedTone[] {
  if (size === 5) return TRIAD_ADDS[triad]
  const eleventh = size === 7 && (triad === 'min' || triad === 'dim')
  const thirteenth = (triad === 'maj' && size === 7) || (triad === 'min' && size <= 9)
  return ADDED_TONES.filter(
    (tone) => (tone === 'add11' && eleventh) || (tone === 'add13' && thirteenth),
  )
}

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

/** Parts that cannot stand together: `a` and `b` in either order. */
const paired =
  <T>(pairs: readonly (readonly [T, T])[]) =>
  (a: T, b: T): boolean =>
    pairs.some(([first, second]) => (first === a && second === b) || (first === b && second === a))

/** Alterations that land on the same key, the first kept when both are asked for: a ♭5 is a #11. */
const clash = paired<Alteration>([['b5', 's11']])

/** Added tones that are one choice, the first kept when both are asked for: a tone and its octave, an 11th and its raised one. */
const addedClash = paired<AddedTone>([
  ['add2', 'add9'],
  ['add4', 'add11'],
  ['add4', 'addS11'],
  ['add11', 'addS11'],
])

/** An added tone is the natural tone an alteration takes out: a 13th added over a ♭13. */
const crosses = (tone: AddedTone, alteration: Alteration): boolean =>
  ADDED_INTERVAL[tone] === ALTERED[alteration].takes

/** A list without what clashes with something before it: the first of two kept. */
const firstKept = <T>(list: readonly T[], clashes: (a: T, b: T) => boolean): T[] =>
  list.filter((each, i) => !list.slice(0, i).some((earlier) => clashes(earlier, each)))

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
  const adds = addedOf({ triad: parts.triad, size })
  const added = firstKept(
    ADDED_TONES.filter((each) => parts.added.includes(each) && adds.includes(each)),
    addedClash,
  )
  const fitted = { triad: parts.triad, size, seventh, added, alterations: [] }
  const offered = alterationsOf(fitted)
  const alterations = firstKept(
    ALTERATIONS.filter((each) => parts.alterations.includes(each) && offered.includes(each)),
    clash,
  )
  return {
    ...fitted,
    alterations: alterations.filter((each) => !added.some((tone) => crosses(tone, each))),
  }
}

/** What is chosen next of a list: one just chosen turns off the ones it clashes with. */
const lastKept = <T>(
  before: readonly T[],
  chosen: readonly T[],
  clashes: (a: T, b: T) => boolean,
): { kept: T[]; fresh: T[] } => {
  const fresh = chosen.filter((each) => !before.includes(each))
  return {
    kept: chosen.filter(
      (each) => fresh.includes(each) || !fresh.some((other) => clashes(other, each)),
    ),
    fresh,
  }
}

/**
 * Parts with the alterations chosen next: one just chosen turns off the one it clashes with (a #11 a
 * ♭5) and the added tone it alters (a ♭13 an added 13th).
 */
export function withAlterations(parts: ChordParts, chosen: readonly Alteration[]): ChordParts {
  const { kept, fresh } = lastKept(parts.alterations, chosen, clash)
  return fitParts({
    ...parts,
    added: parts.added.filter((tone) => !fresh.some((each) => crosses(tone, each))),
    alterations: kept,
  })
}

/**
 * Parts with the added tones chosen next: one just chosen turns off its octave (an add9 an add2) and
 * the alteration of its degree (an added 13th a ♭13).
 */
export function withAdded(parts: ChordParts, chosen: readonly AddedTone[]): ChordParts {
  const { kept, fresh } = lastKept(parts.added, chosen, addedClash)
  return fitParts({
    ...parts,
    added: kept,
    alterations: parts.alterations.filter((each) => !fresh.some((tone) => crosses(tone, each))),
  })
}

/**
 * The intervals parts build, from the root up: the triad; from a 7th chord, its 7th and the natural
 * 9th, 11th and 13th up to the size (the 11th left out of a 13th over a major 3rd, where it clashes
 * with the 3rd, and a sus4's 11th, which is its 4th), each alteration in place of its natural tone, or
 * added (a ♭5 under a raised 5th: the altered chord); then the tones it adds.
 */
function builtIntervals(parts: ChordParts): LabelledInterval[] {
  const names = new Set<IntervalName>(TRIAD_INTERVALS[parts.triad])
  if (parts.size > 5) {
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
  for (const tone of parts.added) names.add(ADDED_INTERVAL[tone])
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
  sus2: { lead: '', trail: 'sus2' },
  sus4: { lead: '', trail: 'sus4' },
}

/** A name with the tones it adds after it in brackets, a lone one bare where nothing stands before it: `add9`, `m(add9)`, `(add2,add4)`. */
function withAddedTones(name: string, tones: readonly AddedTone[]): string {
  const [only, ...more] = tones.map((tone) => ADDED_SYMBOL[tone])
  if (only === undefined) return name
  return name === '' && more.length === 0 ? only : `${name}(${[only, ...more].join(',')})`
}

/**
 * A triad's suffix with the tones it adds: its 6th written first, with its 9th as `6/9` (`6`, `m6/9`,
 * `6sus4`), then the rest (`add9`, `m(add9)`, `6(add11)`).
 */
function triadRuleSuffix(parts: ChordParts): string {
  const six = parts.added.includes('add6') ? SIX[parts.triad] : undefined
  if (!six) return withAddedTones(triadSuffix(parts.triad), parts.added)
  const sixNine = parts.added.includes('add9')
  return withAddedTones(
    `${six.lead}${sixNine ? '6/9' : '6'}${six.trail}`,
    parts.added.filter((tone) => tone !== 'add6' && !(sixNine && tone === 'add9')),
  )
}

/**
 * A chord's suffix by rule: a triad's with the tones it adds; a 7th chord's name around its highest
 * natural number (`m11`, `13sus4`, `Maj9`), then each alteration in order (`9#11`, `7♭5♭9`,
 * `Maj13#11`), then the tones it adds (`7(add13)`, `m7(add11)`).
 */
function ruleSuffix(parts: ChordParts): string {
  if (parts.size === 5) return triadRuleSuffix(parts)
  const { lead, trail } = seventhName([
    ...triadSemitones(parts.triad),
    INTERVALS[SEVENTH_INTERVAL[parts.seventh]].semitones,
  ])
  const altered = parts.alterations.map((each) => ALTERATION_SIGN[each]).join('')
  return withAddedTones(`${lead}${highestNatural(parts)}${trail}${altered}`, parts.added)
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
 * Every chord the builder makes, each once, simplest first: by triad, size and 7th, then the fewest
 * added tones, then the fewest alterations. Where two parts build the same chord (a 7th with a ♭9 and
 * a 9th with its 9th lowered; an added 2nd and 9th, which fit to the 2nd alone), the first is kept.
 */
export const CHORD_PARTS: readonly ChordParts[] = (() => {
  const all = TRIADS.flatMap((triad) =>
    sizesOf(triad).flatMap((size) =>
      (size === 5 ? [DEFAULT_SEVENTH] : seventhsOf(triad, size)).flatMap((seventh) => {
        const parts: ChordParts = { triad, size, seventh, added: [], alterations: [] }
        return subsetsOf(addedOf(parts)).flatMap((added) =>
          subsetsOf(alterationsOf(parts)).map((alterations) =>
            fitParts({ ...parts, added, alterations }),
          ),
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
