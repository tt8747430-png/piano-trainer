import type { ChordQuality, ReferenceInterval, ScaleKind } from '@/shared/lib/music'
import type { IntervalWay } from '@/shared/lib/schedule'

// The ear trainers' ladders (The Ultimate Piano's ear training, roadmap §10.6).

const STEPS: readonly ReferenceInterval[] = ['m2', 'M2', 'm3', 'M3']
const FOURTHS: readonly ReferenceInterval[] = [...STEPS, 'P4', 'P5']
const SIXTHS: readonly ReferenceInterval[] = [...FOURTHS, 'A4', 'm6', 'M6']
/** The twelve within the octave. */
export const SIMPLE_INTERVALS: readonly ReferenceInterval[] = [...SIXTHS, 'm7', 'M7', 'P8']
export const COMPOUND_INTERVALS: readonly ReferenceInterval[] = [
  'm9',
  'M9',
  'A9',
  'P11',
  'A11',
  'm13',
  'M13',
]

export const INTERVAL_LEVELS = [
  'seconds-thirds',
  'fourths-fifths',
  'tritone-sixths',
  'within-octave',
  'down',
  'together',
  'compound',
] as const
export type IntervalLevel = (typeof INTERVAL_LEVELS)[number]

export const INTERVAL_LEVEL: Readonly<
  Record<
    IntervalLevel,
    { readonly intervals: readonly ReferenceInterval[]; readonly ways: readonly IntervalWay[] }
  >
> = {
  'seconds-thirds': { intervals: STEPS, ways: ['up'] },
  'fourths-fifths': { intervals: FOURTHS, ways: ['up'] },
  'tritone-sixths': { intervals: SIXTHS, ways: ['up'] },
  'within-octave': { intervals: SIMPLE_INTERVALS, ways: ['up'] },
  down: { intervals: SIMPLE_INTERVALS, ways: ['down'] },
  together: { intervals: SIMPLE_INTERVALS, ways: ['together'] },
  compound: { intervals: COMPOUND_INTERVALS, ways: ['up', 'down', 'together'] },
}

/** The chords by ear: the four triads and the four 7ths. */
export const EAR_QUALITIES: readonly ChordQuality[] = [
  'maj',
  'min',
  'dim',
  'aug',
  'maj7',
  'm7',
  'd7',
  'o7',
]

export const QUALITY_LEVELS = [
  'major-minor',
  'diminished-augmented',
  'sevenths',
  'all',
  'arpeggio',
] as const
export type QualityLevel = (typeof QUALITY_LEVELS)[number]

export const QUALITY_LEVEL: Readonly<
  Record<QualityLevel, { readonly qualities: readonly ChordQuality[]; readonly arpeggio: boolean }>
> = {
  'major-minor': { qualities: ['maj', 'min'], arpeggio: false },
  'diminished-augmented': { qualities: ['maj', 'min', 'dim', 'aug'], arpeggio: false },
  sevenths: { qualities: ['maj7', 'm7', 'd7', 'o7'], arpeggio: false },
  all: { qualities: EAR_QUALITIES, arpeggio: false },
  arpeggio: { qualities: EAR_QUALITIES, arpeggio: true },
}

/** The scales by ear: major, natural and harmonic minor, and the modes. */
export const EAR_SCALES: readonly ScaleKind[] = [
  'major',
  'natural',
  'harmonic',
  'dorian',
  'phrygian',
  'lydian',
  'mixolydian',
]

export const SCALE_EAR_LEVELS = ['major-minor', 'harmonic', 'modes', 'descending'] as const
export type ScaleEarLevel = (typeof SCALE_EAR_LEVELS)[number]

export const SCALE_EAR_LEVEL: Readonly<
  Record<ScaleEarLevel, { readonly kinds: readonly ScaleKind[]; readonly descending: boolean }>
> = {
  'major-minor': { kinds: ['major', 'natural'], descending: false },
  harmonic: { kinds: ['major', 'natural', 'harmonic'], descending: false },
  modes: { kinds: EAR_SCALES, descending: false },
  descending: { kinds: EAR_SCALES, descending: true },
}
