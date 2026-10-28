import { INTERVALS, type IntervalName, type LabelledInterval } from './interval'
import {
  noteName,
  pitchClassOf,
  plainRoot,
  plainSpelling,
  rootSpelling,
  type SpelledNote,
} from './note'
import type { PitchClass } from './pitch'
import { toneAbove, type Tone } from './tone'

/** Triads; 6th & add; 7ths; 9ths & more; altered 7ths. */
export const CHORD_FAMILIES = ['tri', 'six', 'sev', 'nin', 'alt'] as const
export type ChordFamily = (typeof CHORD_FAMILIES)[number]

interface QualityEntry {
  readonly family: ChordFamily
  /** Written after the root in a chord symbol: `m7♭5`, `°7`, '' for major. */
  readonly suffix: string
  /** Other ways the suffix is written, all read by the chord-symbol parser. */
  readonly aliases: readonly string[]
  readonly intervals: readonly IntervalName[]
}

const QUALITIES = {
  maj: { family: 'tri', suffix: '', aliases: ['M', 'maj'], intervals: ['r', 'M3', 'P5'] },
  min: {
    family: 'tri',
    suffix: 'm',
    aliases: ['−'],
    intervals: ['r', 'm3', 'P5'],
  },
  dim: {
    family: 'tri',
    suffix: '°',
    aliases: ['dim'],
    intervals: ['r', 'm3', 'd5'],
  },
  aug: { family: 'tri', suffix: '+', aliases: ['aug'], intervals: ['r', 'M3', 'A5'] },
  sus2: { family: 'tri', suffix: 'sus2', aliases: [], intervals: ['r', 'M2', 'P5'] },
  sus4: { family: 'tri', suffix: 'sus4', aliases: ['sus'], intervals: ['r', 'P4', 'P5'] },
  five: { family: 'tri', suffix: '5', aliases: ['(no3)'], intervals: ['r', 'P5'] },
  six: { family: 'six', suffix: '6', aliases: [], intervals: ['r', 'M3', 'P5', 'M6'] },
  m6: {
    family: 'six',
    suffix: 'm6',
    aliases: ['−6'],
    intervals: ['r', 'm3', 'P5', 'M6'],
  },
  s69: { family: 'six', suffix: '6/9', aliases: ['69'], intervals: ['r', 'M3', 'P5', 'M6', 'M9'] },
  m69: {
    family: 'six',
    suffix: 'm6/9',
    aliases: [],
    intervals: ['r', 'm3', 'P5', 'M6', 'M9'],
  },
  add9: {
    family: 'six',
    suffix: 'add9',
    aliases: ['add2', '2'],
    intervals: ['r', 'M3', 'P5', 'M9'],
  },
  madd9: {
    family: 'six',
    suffix: 'm(add9)',
    aliases: ['madd9', 'madd2', 'm(add2)', 'm2'],
    intervals: ['r', 'm3', 'P5', 'M9'],
  },
  add11: {
    family: 'six',
    suffix: 'add11',
    aliases: [],
    intervals: ['r', 'M3', 'P5', 'P11'],
  },
  maj7: {
    family: 'sev',
    suffix: 'Maj7',
    aliases: ['maj7', 'M7', 'Δ7', 'Δ'],
    intervals: ['r', 'M3', 'P5', 'M7'],
  },
  m7: {
    family: 'sev',
    suffix: 'm7',
    aliases: ['−7', 'min7'],
    intervals: ['r', 'm3', 'P5', 'm7'],
  },
  d7: { family: 'sev', suffix: '7', aliases: ['x'], intervals: ['r', 'M3', 'P5', 'm7'] },
  hd: {
    family: 'sev',
    suffix: 'm7♭5',
    aliases: ['ø', 'ø7', 'm7(−5)', 'm7−5'],
    intervals: ['r', 'm3', 'd5', 'm7'],
  },
  o7: {
    family: 'sev',
    suffix: '°7',
    aliases: ['dim7'],
    intervals: ['r', 'm3', 'd5', 'd7'],
  },
  mM7: {
    family: 'sev',
    suffix: 'm(maj7)',
    aliases: ['−Δ', 'm(+7)', 'mMaj7', 'mM7', 'm(Maj7)'],
    intervals: ['r', 'm3', 'P5', 'M7'],
  },
  sus7: {
    family: 'sev',
    suffix: '7sus4',
    aliases: ['7sus'],
    intervals: ['r', 'P4', 'P5', 'm7'],
  },
  M7s11: {
    family: 'sev',
    suffix: 'Maj7#11',
    aliases: ['Δ(+4)'],
    intervals: ['r', 'M3', 'P5', 'M7', 'A11'],
  },
  M7s5: {
    family: 'sev',
    suffix: '+Maj7',
    aliases: ['Δ(+5)', '+maj7'],
    intervals: ['r', 'M3', 'A5', 'M7'],
  },
  m9: {
    family: 'nin',
    suffix: 'm9',
    aliases: ['−9'],
    intervals: ['r', 'm3', 'P5', 'm7', 'M9'],
  },
  maj9: {
    family: 'nin',
    suffix: 'Maj9',
    aliases: ['maj9', 'M9', 'Δ9'],
    intervals: ['r', 'M3', 'P5', 'M7', 'M9'],
  },
  n9: { family: 'nin', suffix: '9', aliases: [], intervals: ['r', 'M3', 'P5', 'm7', 'M9'] },
  sus9: {
    family: 'nin',
    suffix: '9sus4',
    aliases: ['9sus'],
    intervals: ['r', 'P4', 'P5', 'm7', 'M9'],
  },
  mM9: {
    family: 'nin',
    suffix: 'm(maj9)',
    aliases: ['−Δ9', 'm(+9)'],
    intervals: ['r', 'm3', 'P5', 'M7', 'M9'],
  },
  M9s5: {
    family: 'nin',
    suffix: '+Maj9',
    aliases: ['Δ9(+5)', '+maj9'],
    intervals: ['r', 'M3', 'A5', 'M7', 'M9'],
  },
  hd9: {
    family: 'nin',
    suffix: 'm9♭5',
    aliases: ['ø9', 'm9(−5)'],
    intervals: ['r', 'm3', 'd5', 'm7', 'M9'],
  },
  m11: {
    family: 'nin',
    suffix: 'm11',
    aliases: ['−11'],
    intervals: ['r', 'm3', 'P5', 'm7', 'M9', 'P11'],
  },
  n11: {
    family: 'nin',
    suffix: '11',
    aliases: [],
    intervals: ['r', 'M3', 'P5', 'm7', 'M9', 'P11'],
  },
  maj11: {
    family: 'nin',
    suffix: 'Maj11',
    aliases: ['maj11', 'M11', 'Δ11'],
    intervals: ['r', 'M3', 'P5', 'M7', 'M9', 'P11'],
  },
  m13: {
    family: 'nin',
    suffix: 'm13',
    aliases: ['−13', 'min13'],
    intervals: ['r', 'm3', 'P5', 'm7', 'M9', 'P11', 'M13'],
  },
  n13: {
    family: 'nin',
    suffix: '13',
    aliases: [],
    intervals: ['r', 'M3', 'P5', 'm7', 'M9', 'M13'],
  },
  maj13: {
    family: 'nin',
    suffix: 'Maj13',
    aliases: ['maj13', 'M13', 'Δ13'],
    intervals: ['r', 'M3', 'P5', 'M7', 'M9', 'M13'],
  },
  sus13: {
    family: 'nin',
    suffix: '13sus4',
    aliases: ['13sus'],
    intervals: ['r', 'P4', 'P5', 'm7', 'M9', 'M13'],
  },
  b9: {
    family: 'alt',
    suffix: '7♭9',
    aliases: ['7(−9)', '7(♭9)'],
    intervals: ['r', 'M3', 'P5', 'm7', 'm9'],
  },
  b9n13: {
    family: 'alt',
    suffix: '13♭9',
    aliases: ['13(−9)'],
    intervals: ['r', 'M3', 'P5', 'm7', 'm9', 'M13'],
  },
  s9: {
    family: 'alt',
    suffix: '7#9',
    aliases: ['7(+9)'],
    intervals: ['r', 'M3', 'P5', 'm7', 'A9'],
  },
  b5: { family: 'alt', suffix: '7♭5', aliases: ['7(−5)'], intervals: ['r', 'M3', 'd5', 'm7'] },
  s5: {
    family: 'alt',
    suffix: '7#5',
    aliases: ['7(+5)', '7+', '+7', 'aug7'],
    intervals: ['r', 'M3', 'A5', 'm7'],
  },
  s11: {
    family: 'alt',
    suffix: '7#11',
    aliases: ['7(+4)', '7#4'],
    intervals: ['r', 'M3', 'P5', 'm7', 'A11'],
  },
  b13: {
    family: 'alt',
    suffix: '7♭13',
    aliases: ['7♭6'],
    intervals: ['r', 'M3', 'P5', 'm7', 'm13'],
  },
  b9s5: {
    family: 'alt',
    suffix: '7♭9#5',
    aliases: ['7(−9/+5)'],
    intervals: ['r', 'M3', 'A5', 'm7', 'm9'],
  },
  alt: {
    family: 'alt',
    suffix: '7alt',
    aliases: ['alt', '7(−9,+9,+5,−5)'],
    intervals: ['r', 'M3', 'd5', 'A5', 'm7', 'm9', 'A9'],
  },
} as const satisfies Record<string, QualityEntry>

export type ChordQuality = keyof typeof QUALITIES

/** All 46, in table order: family by family. */
export const CHORD_QUALITIES = Object.keys(QUALITIES) as readonly ChordQuality[]

const entry = (quality: ChordQuality): QualityEntry => QUALITIES[quality]

export interface Chord {
  readonly root: SpelledNote
  readonly quality: ChordQuality
  /** The lowest note when it is not the root: the part after the slash. */
  readonly bass?: SpelledNote
}

export const chordFamily = (quality: ChordQuality): ChordFamily => entry(quality).family

export const qualitySuffix = (quality: ChordQuality): string => entry(quality).suffix

/** Every way the quality is written: the suffix first, then the aliases. */
export const qualitySpellings = (quality: ChordQuality): readonly string[] => [
  entry(quality).suffix,
  ...entry(quality).aliases,
]

export const qualitiesIn = (family: ChordFamily): readonly ChordQuality[] =>
  CHORD_QUALITIES.filter((quality) => chordFamily(quality) === family)

export const qualityIntervals = (quality: ChordQuality): readonly LabelledInterval[] =>
  entry(quality).intervals.map((name) => INTERVALS[name])

/** The table's quality whose intervals are exactly these, from the root up, if one is. */
export const qualityWithIntervals = (
  intervals: readonly { readonly semitones: number }[],
): ChordQuality | undefined =>
  CHORD_QUALITIES.find((quality) => {
    const own = entry(quality).intervals
    return (
      own.length === intervals.length &&
      own.every((name, i) => INTERVALS[name].semitones === intervals[i]?.semitones)
    )
  })

/**
 * The root a chord on this pitch class is named from when no key decides: of its sharp and flat
 * names, the one that spells the chord with no double accidental and the fewest accidentals (D♯°,
 * not E♭° with its B𝄫; G♭+, not F♯+ with its C𝄪). Where both spell it as plainly, C♯ and G♯ over D♭
 * and A♭ when the chord has a minor 3rd or a minor 9th, which read better from a sharp root (C♯m,
 * not D♭m with its F♭), and E♭, F♯ and B♭ over their others.
 */
export function chordRootSpelling(
  pc: PitchClass,
  intervals: readonly LabelledInterval[],
): SpelledNote {
  const leaning = rootSpelling(
    pc,
    intervals.some(({ degree }) => degree === '♭3' || degree === '♭9'),
  )
  const other = plainSpelling(pc, leaning.accidental < 0)
  return plainness(other, intervals) < plainness(leaning, intervals) ? other : leaning
}

/** How plainly a root spells a chord: its accidentals counted, a double one counting past any count. */
function plainness(root: SpelledNote, intervals: readonly LabelledInterval[]): number {
  const accidentals = intervals.map((interval) =>
    Math.abs(toneAbove(root, interval).note.accidental),
  )
  return accidentals.some((count) => count > 1)
    ? Number.POSITIVE_INFINITY
    : accidentals.reduce((sum, count) => sum + count, 0)
}

/** The chord's tones from the root up, each spelled by letter steps from the root. */
export function spellChord(root: SpelledNote, quality: ChordQuality): Tone[] {
  return entry(quality).intervals.map((name) => toneAbove(root, INTERVALS[name]))
}

/** The root a chord of `quality` on this pitch class is named from (`chordRootSpelling` over its intervals). */
export const qualityRootSpelling = (pc: PitchClass, quality: ChordQuality): SpelledNote =>
  chordRootSpelling(pc, qualityIntervals(quality))

/** A chord written from its root and suffix, over its bass when that is not the root: `Dm7`, `C/E`. */
export const writtenSymbol = (
  chord: { readonly root: SpelledNote; readonly suffix: string },
  bass?: SpelledNote,
): string => noteName(chord.root) + chord.suffix + (bass ? `/${noteName(bass)}` : '')

export const chordSymbol = (chord: Chord): string =>
  writtenSymbol({ root: chord.root, suffix: qualitySuffix(chord.quality) }, chord.bass)

/**
 * A bass that is a chord tone is spelled as that tone (`E/Ab` is `E/G#`), unless that writes it
 * oddly, a double accidental or a B♯ for a C, as no lead sheet does (`Gbm6/A`, not `G♭m6/B𝄫`); then,
 * and for any other bass, as written.
 */
export function chordBass(
  root: SpelledNote,
  quality: ChordQuality,
  bass: SpelledNote,
): SpelledNote {
  const pc = pitchClassOf(bass)
  const tone = spellChord(root, quality).find((each) => each.pitchClass === pc)?.note
  return tone && plainRoot(tone) === tone ? tone : bass
}
