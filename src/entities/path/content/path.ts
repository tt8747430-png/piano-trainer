import type { PieceId } from '@/entities/piece'
import type { ChordFamily, ScaleKind } from '@/shared/lib/music'
import type { Level, PathStep } from '../model/types'

const chords = (family: ChordFamily): PathStep => ({ kind: 'chords', family })
const scale = (kind: ScaleKind): PathStep => ({ kind: 'scale', scale: kind })
const pieces = (...ids: PieceId[]): PathStep[] => ids.map((pieceId) => ({ kind: 'piece', pieceId }))

/**
 * The one source of levels (ADR 0005): a step's level is the list it sits in, each list taught in
 * order (Continue suggests the first step not learned). Level 1 is triads, the major and minor
 * scales and the pentatonics, and songs on three to five triads; level 2 adds 6th and 7th chords,
 * the other minors and the blues scales, and songs in minor keys or with a dominant 7th; level 3
 * the 9ths, the modes and songs with slash chords and inversions; level 4 the altered chords,
 * Locrian, and songs with diminished passing chords and 9ths. Adding a piece: one step here, in
 * the place it should be learned.
 */
export const PATH: Readonly<Record<Level, readonly PathStep[]>> = {
  1: [
    chords('tri'),
    scale('major'),
    scale('natural'),
    scale('pent'),
    scale('mpent'),
    ...pieces('ex3', 'exm1', 'exm2', 'exm3', 'ex5', 'ex6'),
    ...pieces('ode', 'amazing', 'silent'),
    ...pieces('hgta', 'nojs', 'came', 'fellow', 'friend'),
  ],
  2: [
    chords('six'),
    chords('sev'),
    scale('harmonic'),
    scale('melodic'),
    scale('majorBlues'),
    scale('blues'),
    ...pieces('ex7', 'ex8', 'ex9'),
    ...pieces('glory', 'face', 'together', 'mercy', 'wander', 'wonder', 'soon', 'house', 'lift'),
    ...pieces('heaven', 'otche', 'bz1', 'bz2', 'bz3', 'bz5'),
  ],
  3: [
    chords('nin'),
    scale('dorian'),
    scale('mixolydian'),
    scale('lydian'),
    scale('phrygian'),
    ...pieces('bz6', 'bz8', 'bz10', 'bz12', 'bz15'),
  ],
  4: [
    chords('alt'),
    scale('locrian'),
    ...pieces('bz13', 'bz16', 'bz17', 'bz18', 'romashki', 'olen', 'wafriend', 'metel'),
  ],
}
