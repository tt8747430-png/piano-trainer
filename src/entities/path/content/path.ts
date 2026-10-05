import type { PieceId } from '@/entities/piece'
import type { ChordFamily, ScaleKind } from '@/shared/lib/music'
import type { Level, PathStep } from '../model/types'

const chords = (family: ChordFamily): PathStep => ({ kind: 'chords', family })
const scale = (kind: ScaleKind): PathStep => ({ kind: 'scale', scale: kind })
const pieces = (...ids: PieceId[]): PathStep[] => ids.map((pieceId) => ({ kind: 'piece', pieceId }))

/**
 * The one source of levels. This first path puts everything at level 1; the Path as a course
 * (roadmap sub-project 6) orders and levels it (ADR 0005). Adding a piece: one step here, in the
 * place it should be learned.
 */
export const PATH: Readonly<Record<Level, readonly PathStep[]>> = {
  1: [
    chords('tri'),
    chords('six'),
    chords('sev'),
    chords('nin'),
    chords('alt'),
    scale('major'),
    scale('natural'),
    scale('harmonic'),
    scale('melodic'),
    scale('dorian'),
    scale('phrygian'),
    scale('lydian'),
    scale('mixolydian'),
    scale('locrian'),
    scale('pent'),
    scale('mpent'),
    scale('majorBlues'),
    scale('blues'),
    ...pieces('ex3', 'exm1', 'exm2', 'exm3', 'ex5', 'ex6', 'ex7', 'ex8', 'ex9'),
    ...pieces(
      'hgta',
      'nojs',
      'friend',
      'glory',
      'fellow',
      'came',
      'mercy',
      'heaven',
      'face',
      'lift',
      'soon',
      'house',
      'together',
      'wonder',
      'wander',
    ),
    ...pieces(
      'bz1',
      'bz2',
      'bz3',
      'bz5',
      'bz6',
      'bz8',
      'bz10',
      'bz12',
      'bz13',
      'bz15',
      'bz16',
      'bz17',
      'bz18',
    ),
    ...pieces('otche', 'ode', 'silent', 'amazing'),
    ...pieces('romashki'),
  ],
  2: [],
  3: [],
  4: [],
}
