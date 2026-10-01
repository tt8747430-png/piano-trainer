import type { ScaleKind } from '@/shared/lib/music'

// Build scale's ladder: the keys' scales first, then the modes, then pentatonic and blues.

export const SCALE_LEVELS = ['major', 'minors', 'modes', 'pentatonic-blues', 'all'] as const
export type ScaleLevel = (typeof SCALE_LEVELS)[number]

export const SCALE_LEVEL_KINDS: Readonly<Record<ScaleLevel, readonly ScaleKind[]>> = {
  major: ['major'],
  minors: ['natural', 'harmonic', 'melodic'],
  modes: ['dorian', 'phrygian', 'lydian', 'mixolydian', 'locrian'],
  'pentatonic-blues': ['pent', 'mpent', 'majorBlues', 'blues'],
  all: [
    'major',
    'natural',
    'harmonic',
    'melodic',
    'dorian',
    'phrygian',
    'lydian',
    'mixolydian',
    'locrian',
    'pent',
    'mpent',
    'majorBlues',
    'blues',
  ],
}
