import { INTERVALS, type IntervalName, type LabelledInterval } from './interval'
import { noteName, pitchClassOf, rootSpelling, type SpelledNote } from './note'
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
  maj: { family: 'tri', suffix: '', aliases: [], intervals: ['r', 'M3', 'P5'] },
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
  six: { family: 'six', suffix: '6', aliases: [], intervals: ['r', 'M3', 'P5', 'M6'] },
  m6: {
    family: 'six',
    suffix: 'm6',
    aliases: ['−6'],
    intervals: ['r', 'm3', 'P5', 'M6'],
  },
  s69: { family: 'six', suffix: '6/9', aliases: [], intervals: ['r', 'M3', 'P5', 'M6', 'M9'] },
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
  maj7: {
    family: 'sev',
    suffix: 'Maj7',
    aliases: ['maj7', 'M7', 'maj', 'Δ7', 'Δ', 'M'],
    intervals: ['r', 'M3', 'P5', 'M7'],
  },
  m7: {
    family: 'sev',
    suffix: 'm7',
    aliases: ['−7'],
    intervals: ['r', 'm3', 'P5', 'm7'],
  },
  d7: { family: 'sev', suffix: '7', aliases: ['x'], intervals: ['r', 'M3', 'P5', 'm7'] },
  hd: {
    family: 'sev',
    suffix: 'm7♭5',
    aliases: ['ø', 'm7(−5)'],
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
    aliases: ['−Δ', 'm(+7)'],
    intervals: ['r', 'm3', 'P5', 'M7'],
  },
  sus7: {
    family: 'sev',
    suffix: '7sus4',
    aliases: ['7sus', '11'],
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
  n13: {
    family: 'nin',
    suffix: '13',
    aliases: [],
    intervals: ['r', 'M3', 'P5', 'm7', 'M9', 'M13'],
  },
  b9: {
    family: 'alt',
    suffix: '7♭9',
    aliases: ['7(−9)'],
    intervals: ['r', 'M3', 'P5', 'm7', 'm9'],
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
    aliases: ['7(+5)', '7+'],
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

/** All 36, in table order: family by family. */
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
 * The root a chord on this pitch class is named from when no key decides: C♯ and G♯ over D♭ and A♭
 * when the chord has a minor 3rd or a minor 9th, which read better from a sharp root (C♯m, not D♭m
 * with its F♭).
 */
export const chordRootSpelling = (
  pc: PitchClass,
  intervals: readonly { readonly degree: string }[],
): SpelledNote =>
  rootSpelling(
    pc,
    intervals.some(({ degree }) => degree === '♭3' || degree === '♭9'),
  )

/** The chord's tones from the root up, each spelled by letter steps from the root. */
export function spellChord(root: SpelledNote, quality: ChordQuality): Tone[] {
  return entry(quality).intervals.map((name) => toneAbove(root, INTERVALS[name]))
}

/** Whether a note, in any octave, is one of the chord's notes: its tones, or the bass after a slash. */
export function chordHolds(chord: Chord, pc: PitchClass): boolean {
  if (chord.bass && pitchClassOf(chord.bass) === pc) return true
  return spellChord(chord.root, chord.quality).some((tone) => pitchClassOf(tone.note) === pc)
}

export const chordSymbol = (chord: Chord): string =>
  noteName(chord.root) +
  qualitySuffix(chord.quality) +
  (chord.bass ? `/${noteName(chord.bass)}` : '')

/** A bass that is a chord tone is spelled as that tone (`D#/G` is `D#/F𝄪`); any other as written. */
export function chordBass(
  root: SpelledNote,
  quality: ChordQuality,
  bass: SpelledNote,
): SpelledNote {
  const pc = pitchClassOf(bass)
  return spellChord(root, quality).find((tone) => tone.pitchClass === pc)?.note ?? bass
}
