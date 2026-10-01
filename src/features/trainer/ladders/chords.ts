import {
  note,
  PITCH_CLASSES,
  qualityRootSpelling,
  scaleChordAt,
  type ChordQuality,
  type ScaleKind,
  type SpelledNote,
} from '@/shared/lib/music'
import type { ChordItem } from '../draw'

// The chords ladder (The Ultimate Piano's, roadmap §10.6): sixteen levels from C's three main chords
// to diminished and augmented on every root.

const C = note('C')
const G = note('G')
const F = note('F')
const A = note('A')

/** A key's chords on these degrees, as its scale stacks them (3 notes a triad, 4 a 7th). */
const ofKey = (
  root: SpelledNote,
  kind: ScaleKind,
  degrees: readonly number[],
  notes: 3 | 4,
): Omit<ChordItem, 'inversion'>[] => degrees.map((d) => scaleChordAt(root, kind, d, notes))

const ALL = [0, 1, 2, 3, 4, 5, 6] as const
const MAIN = [0, 3, 4] as const

/** Chords in each of these inversions (null: any voicing). */
const inInversions = (
  chords: readonly Omit<ChordItem, 'inversion'>[],
  inversions: readonly (number | null)[],
): ChordItem[] =>
  chords.flatMap((chord) => inversions.map((inversion) => ({ ...chord, inversion })))

/** These qualities on all twelve roots, each spelled as its chord spells it. */
const onEveryRoot = (qualities: readonly ChordQuality[]): Omit<ChordItem, 'inversion'>[] =>
  qualities.flatMap((quality) =>
    PITCH_CLASSES.map((pc) => ({ root: qualityRootSpelling(pc, quality), quality })),
  )

const ANY = [null] as const
const POSITIONS = [0, 1, 2] as const

export const CHORD_LEVELS = [
  'c-main',
  'c-all',
  'c-first',
  'c-second',
  'c-positions',
  'c-sevenths',
  'a-minor-main',
  'a-minor-all',
  'g-f-main',
  'g-f-all',
  'g-f-positions',
  'major-triads',
  'minor-triads',
  'triad-positions',
  'sevenths',
  'diminished-augmented',
] as const
export type ChordLevel = (typeof CHORD_LEVELS)[number]

/** Each level's chords. */
export function chordLevel(level: ChordLevel): ChordItem[] {
  switch (level) {
    case 'c-main':
      return inInversions(ofKey(C, 'major', MAIN, 3), ANY)
    case 'c-all':
      return inInversions(ofKey(C, 'major', ALL, 3), ANY)
    case 'c-first':
      return inInversions(ofKey(C, 'major', ALL, 3), [1])
    case 'c-second':
      return inInversions(ofKey(C, 'major', ALL, 3), [2])
    case 'c-positions':
      return inInversions(ofKey(C, 'major', ALL, 3), POSITIONS)
    case 'c-sevenths':
      return inInversions(ofKey(C, 'major', ALL, 4), ANY)
    case 'a-minor-main':
      // i, iv and the dominant 7th from harmonic minor.
      return inInversions([...ofKey(A, 'natural', [0, 3], 3), ...ofKey(A, 'harmonic', [4], 4)], ANY)
    case 'a-minor-all':
      return inInversions(ofKey(A, 'harmonic', ALL, 3), ANY)
    case 'g-f-main':
      return inInversions([...ofKey(G, 'major', MAIN, 3), ...ofKey(F, 'major', MAIN, 3)], ANY)
    case 'g-f-all':
      return inInversions([...ofKey(G, 'major', ALL, 3), ...ofKey(F, 'major', ALL, 3)], ANY)
    case 'g-f-positions':
      return inInversions([...ofKey(G, 'major', ALL, 3), ...ofKey(F, 'major', ALL, 3)], POSITIONS)
    case 'major-triads':
      return inInversions(onEveryRoot(['maj']), ANY)
    case 'minor-triads':
      return inInversions(onEveryRoot(['min']), ANY)
    case 'triad-positions':
      return inInversions(onEveryRoot(['maj', 'min']), POSITIONS)
    case 'sevenths':
      return inInversions(onEveryRoot(['maj7', 'm7', 'd7']), ANY)
    case 'diminished-augmented':
      return inInversions(onEveryRoot(['dim', 'aug']), ANY)
  }
}
