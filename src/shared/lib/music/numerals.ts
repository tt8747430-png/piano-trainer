import {
  qualityIntervals,
  qualitySuffix,
  qualityWithIntervals,
  type Chord,
  type ChordQuality,
} from './chord'
import { readQualitySuffix } from './chord-symbol'
import { spellAbove } from './interval'
import type { Key } from './key'
import { letterIndex, pitchClassOf, plainRoot, type SpelledNote } from './note'
import { pitchClass } from './pitch'
import { keyScale, spellScale } from './scale'
import { scaleChordAt, scaleChords, SIZE_NOTES, type ChordSize } from './scale-chord'
import { availableTensions } from './tensions'
import type { Tone } from './tone'

/**
 * A Roman numeral read: its degree of the key's scale, a chromatic shift, and the chord on it, any of
 * the table's. A plain triad grows with a progression's chord size; any other chord is played as it
 * is written.
 */
export interface Numeral {
  readonly degree: number
  readonly shift: -1 | 0 | 1
  readonly quality: ChordQuality
  /** The degree whose key it is read in (`V/ii`, A in C), where it is applied to another chord. */
  readonly of?: AppliedDegree
}

/**
 * The degree an applied numeral is read from, after its slash: its index and shift, and its key's mode,
 * minor under lower case (`/ii`, D minor in C), major under upper (`/IV`).
 */
export interface AppliedDegree {
  readonly degree: number
  readonly shift: -1 | 0 | 1
  readonly minor: boolean
}

const ROMANS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'] as const
const TOKEN = /^([b♭#♯]?)(VII|VI|V|IV|III|II|I|vii|vi|v|iv|iii|ii|i)(.*)$/
/** What follows an applied numeral's slash: a degree alone, so a `6/9` is still a chord. */
const APPLIED = /^(.*)\/([b♭#♯]?)(VII|VI|V|IV|III|II|I|vii|vi|v|iv|iii|ii|i)$/
const SHIFTS = new Map<string, -1 | 0 | 1>([
  ['', 0],
  ['b', -1],
  ['♭', -1],
  ['#', 1],
  ['♯', 1],
])

/**
 * What a lower-case numeral writes after it, for each chord of the table with a minor 3rd: a minor
 * chord's suffix without its `m`, a diminished one's mark.
 */
const LOWER_TAILS: ReadonlyMap<ChordQuality, string> = new Map<ChordQuality, string>([
  ['min', ''],
  ['m6', '6'],
  ['m69', '6/9'],
  ['madd9', 'add9'],
  ['m7', '7'],
  ['mM7', 'Maj7'],
  ['m9', '9'],
  ['mM9', 'Maj9'],
  ['m11', '11'],
  ['dim', '°'],
  ['o7', '°7'],
  ['hd', 'ø7'],
  ['hd9', 'ø9'],
])
const LOWER_QUALITIES = new Map([...LOWER_TAILS].map(([quality, tail]) => [tail, quality] as const))

/** Whether a chord has a minor 3rd, so a numeral writes it in lower case (`ii7`, `vii°`). */
export const hasMinorThird = (quality: ChordQuality): boolean => LOWER_TAILS.has(quality)
/** Other ways a lower-case numeral's tail is typed. */
const TAIL_ALIASES: ReadonlyMap<string, string> = new Map([
  ['o', '°'],
  ['o7', '°7'],
  ['ø', 'ø7'],
  ['maj7', 'Maj7'],
  ['M7', 'Maj7'],
  ['maj9', 'Maj9'],
  ['M9', 'Maj9'],
])

type PlainTriad = 'maj' | 'min' | 'dim' | 'aug'

/** The 7th chord a plain triad that is not the key's own grows to: a major chord a dominant, a minor one a minor 7th. */
const GROWN_SEVENTH: Readonly<Record<PlainTriad, ChordQuality>> = {
  maj: 'd7',
  min: 'm7',
  dim: 'hd',
  aug: 's5',
}

const isPlainTriad = (quality: ChordQuality): quality is PlainTriad => quality in GROWN_SEVENTH

/** Whether a numeral's chord grows with a progression's chord size: a plain triad does, a chord written out does not. */
export const numeralGrows = (numeral: Numeral): boolean => isPlainTriad(numeral.quality)

/** How far above a root the key's next note lies, as a 9th: a ♭9 where it is a semitone up, else a 9. */
function keyNinth(root: SpelledNote, scale: readonly Tone[]): number {
  const above = (letterIndex(root.letter) + 1) % 7
  const next = scale.find((tone) => letterIndex(tone.note.letter) === above)
  return next && pitchClass(next.pitchClass - pitchClassOf(root)) === 1 ? 13 : 14
}

/** A 7th chord grown to the 9th the key has over it, where the chord takes that 9th and the table has the chord. */
function grownNinth(seventh: ChordQuality, ninth: number): ChordQuality {
  const tension = availableTensions(seventh).find((each) => each.semitones === ninth)
  return (tension && qualityWithIntervals([...qualityIntervals(seventh), tension])) ?? seventh
}

/** A lower-case numeral's chord: by its tail, or by a suffix that itself writes a chord with a minor 3rd (`iim7`). */
function lowerQuality(tail: string): ChordQuality | null {
  const short = LOWER_QUALITIES.get(TAIL_ALIASES.get(tail) ?? tail)
  if (short) return short
  const full = readQualitySuffix(tail)
  return full && LOWER_TAILS.has(full) ? full : null
}

/** A degree as Roman numerals write it, in either case, after a ♭ or ♯: its index from the tonic and its shift. */
export function readDegree(
  sign: string,
  roman: string,
): { readonly degree: number; readonly shift: -1 | 0 | 1 } | null {
  const degree = ROMANS.findIndex((each) => each === roman.toUpperCase())
  const shift = SHIFTS.get(sign)
  return degree < 0 || shift === undefined ? null : { degree, shift }
}

/**
 * One numeral: a degree, then what a chord symbol writes after its root. Upper case takes any chord
 * as the table spells it (`V7`, `IMaj7`, `I6`, `Vsus4`, `III+`, the sheets' `IIm7` and `IVm9`); lower
 * case is a chord with a minor 3rd, its suffix without the `m` (`ii`, `ii7`, `i6`, `ii9`, `iMaj7`),
 * a diminished one by its mark (`vii°`, `vii°7`, `iiø7`). After a slash, the degree whose key it is
 * read in (`V/ii`, `ii°/vi`): an applied chord.
 */
export function parseNumeral(token: string): Numeral | null {
  const applied = APPLIED.exec(token)
  if (applied) {
    const [, own = '', sign = '', roman = ''] = applied
    const numeral = parseOwnNumeral(own)
    const of = readDegree(sign, roman)
    return !numeral || !of
      ? null
      : { ...numeral, of: { ...of, minor: roman !== roman.toUpperCase() } }
  }
  return parseOwnNumeral(token)
}

/** A numeral of the key itself, with no slash. */
function parseOwnNumeral(token: string): Numeral | null {
  const match = TOKEN.exec(token)
  if (!match) return null
  const [, sign = '', roman = '', tail = ''] = match
  const read = readDegree(sign, roman)
  const quality = roman === roman.toUpperCase() ? readQualitySuffix(tail) : lowerQuality(tail)
  return !read || !quality ? null : { ...read, quality }
}

/** A line of numerals apart by spaces, commas, hyphens or dashes; null if any cannot be read, or none is there. */
export function parseNumerals(text: string): Numeral[] | null {
  const tokens = text.split(/[\s,\-–—]+/).filter(Boolean)
  const numerals: Numeral[] = []
  for (const token of tokens) {
    const numeral = parseNumeral(token)
    if (!numeral) return null
    numerals.push(numeral)
  }
  return numerals.length > 0 ? numerals : null
}

/**
 * A numeral as it is written, one way: lower case for a chord with a minor 3rd (`ii7`, `viiø7`,
 * `i6`), upper case with the table's suffix for any other (`♭VII`, `IMaj7`, `V7♭9`, `Vsus4`).
 */
export function numeralText(numeral: Numeral): string {
  const sign = numeral.shift < 0 ? '♭' : numeral.shift > 0 ? '#' : ''
  const roman = ROMANS[numeral.degree] ?? ''
  const tail = LOWER_TAILS.get(numeral.quality)
  const own =
    sign +
    (tail === undefined ? roman + qualitySuffix(numeral.quality) : roman.toLowerCase() + tail)
  return numeral.of ? `${own}/${appliedText(numeral.of)}` : own
}

/** The degree after an applied numeral's slash, lower case for a minor key. */
function appliedText(of: AppliedDegree): string {
  const roman = ROMANS[of.degree] ?? ''
  return (of.shift < 0 ? '♭' : of.shift > 0 ? '#' : '') + (of.minor ? roman.toLowerCase() : roman)
}

/** Numerals as a line to read, a dash between them: `ii–V–I`. */
export const numeralsLine = (numerals: readonly Numeral[]): string =>
  numerals.map(numeralText).join('–')

/** Numerals as a URL holds them: joined by hyphens, flats as `b`. */
export const numeralsParam = (numerals: readonly Numeral[]): string =>
  numerals.map(numeralText).join('-').replaceAll('♭', 'b')

/**
 * A half-diminished chord grown to a 9th: its 9th is the natural one whatever the key has over it
 * (locrian ♮2, the tensions table's), for the key's ♭9 is never played over it.
 */
const withOwnNinth = (quality: ChordQuality): ChordQuality => (quality === 'hd' ? 'hd9' : quality)

/**
 * Whether a minor key's chord on this degree stands on its raised 6th or 7th, as melodic and
 * harmonic minor have them: a diminished or half-diminished chord on the 6th (A minor's F♯°, F♯ø7),
 * or any diminished one on the 7th (G♯°, G♯°7, G♯ø7).
 */
const onRaisedDegree = (degree: number, quality: ChordQuality): boolean =>
  (degree === 6 && (quality === 'dim' || quality === 'o7' || quality === 'hd')) ||
  (degree === 5 && (quality === 'dim' || quality === 'hd'))

/** A diminished chord on the 6th or 7th degree, unaltered: in a minor key, on its raised degree. */
const leadingTone = (numeral: Numeral): boolean =>
  numeral.shift === 0 && onRaisedDegree(numeral.degree, numeral.quality)

/**
 * A numeral's chord in a key at a chord size. Any chord but a plain triad is played as written;
 * a triad that is the key's own chord on its degree grows as the scale's does (`scaleChordAt`: a 9th
 * only where it is available), and any other grows as it is: a major chord to a dominant, a minor one
 * to a minor 7th, then to the 9th the key has over it where the chord takes it (a minor key's V to
 * `7♭9`); a half-diminished chord takes its natural 9th (a minor key's ii to `m9♭5`). A major key
 * counts from the major scale, a minor key from natural minor (its diminished vii from harmonic minor,
 * on the leading tone, and its diminished vi from melodic minor, on the raised 6th), a flat in either from the major scale (A minor's ♭VI is F, not F♭: its own VI,
 * grown as the key's).
 */
export function numeralChord(numeral: Numeral, key: Key, size: ChordSize): Chord {
  const { of, ...own } = numeral
  return of ? ownChord(own, appliedKey(of, key), size) : ownChord(own, key, size)
}

/**
 * The key an applied numeral is read in: the tonic on its degree, where the key's chord on that degree
 * has its root (a minor key's `/vii` on its leading tone, as its vii° is), in the mode it writes.
 */
function appliedKey(of: AppliedDegree, key: Key): Key {
  const tonic = ownChord(
    { degree: of.degree, shift: of.shift, quality: of.minor ? 'dim' : 'maj' },
    key,
    'triads',
  ).root
  return { tonic, minor: of.minor }
}

/** A numeral's chord in the key it is written in. */
function ownChord(numeral: Numeral, key: Key, size: ChordSize): Chord {
  const kind = keyScale(key)
  const scale = spellScale(key.tonic, kind)
  // A flat counts from the major scale in either mode, as pop writes a minor key's ♭III ♭VI ♭VII.
  const from = key.minor && numeral.shift < 0 ? spellScale(key.tonic, 'major') : scale
  const tone = from[numeral.degree]
  if (!tone) throw new RangeError(`A scale has no degree ${numeral.degree}`)
  const { quality } = numeral
  // A minor key's diminished vii is on its leading tone, as harmonic minor has it (A minor's G♯°,
  // F♯ minor's E♯°), and its vi° on its raised 6th (F♯°), spelled as the key spells it.
  if (key.minor && leadingTone(numeral)) {
    const root = spellAbove(tone.note, { steps: 0, semitones: 1 })
    if (size === 'triads' || quality !== 'dim') return { root, quality }
    // Grown, the leading tone's is a °7 (G♯°7), the raised 6th's a ø7 (F♯ø7: melodic minor's).
    return { root, quality: numeral.degree === 6 ? 'o7' : 'hd' }
  }
  // The key's own degree as the key spells it (C♯ major's B♯); a chromatic one plain.
  const root =
    numeral.shift === 0
      ? tone.note
      : plainRoot(spellAbove(tone.note, { steps: 0, semitones: numeral.shift }))
  if (!isPlainTriad(quality)) return { root, quality }
  // The key's own chord, wherever its root lies by a flat (A minor's ♭VI is its own VI, F).
  const degree = scale.findIndex((each) => each.pitchClass === pitchClassOf(root))
  const own = degree < 0 ? undefined : scaleChords(key.tonic, kind, 3)[degree]?.quality
  if (own === quality) {
    const grown = scaleChordAt(key.tonic, kind, degree, SIZE_NOTES[size])
    return size === 'ninths' ? { ...grown, quality: withOwnNinth(grown.quality) } : grown
  }
  if (size === 'triads') return { root, quality }
  const seventh = GROWN_SEVENTH[quality]
  if (size === 'sevenths') return { root, quality: seventh }
  return { root, quality: withOwnNinth(grownNinth(seventh, keyNinth(root, scale))) }
}

/**
 * A chord as its numeral in a key (Am in C is vi, C6 is I6); none where its root is more than a
 * semitone from its degree. A minor key's diminished chord on its raised 6th or 7th is that degree's
 * own (G♯° in A minor is vii°), as `numeralChord` reads it back.
 */
export function numeralOf(chord: Chord, key: Key): Numeral | null {
  const degree = (letterIndex(chord.root.letter) - letterIndex(key.tonic.letter) + 7) % 7
  const tone = spellScale(key.tonic, keyScale(key))[degree]
  if (!tone) return null
  const distance = pitchClass(pitchClassOf(chord.root) - tone.pitchClass)
  if (key.minor && distance === 1 && onRaisedDegree(degree, chord.quality)) {
    return { degree, shift: 0, quality: chord.quality }
  }
  const shift = distance === 0 ? 0 : distance === 1 ? 1 : distance === 11 ? -1 : null
  return shift === null ? null : { degree, shift, quality: chord.quality }
}
