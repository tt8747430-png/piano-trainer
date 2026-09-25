import {
  CHORD_QUALITIES,
  chordSkill,
  pitchClassOf,
  type PitchClass,
  type SkillId,
} from '@/shared/lib/music'
import { chartOf, chordsOf } from './chart'
import type { Piece } from './types'

/** The chord qualities a piece's chart uses, as skills in table order: what its check asks. */
export function skillsOfPiece(piece: Piece): SkillId[] {
  const used = new Set(chordsOf(chartOf(piece)).map((chord) => chord.quality))
  return CHORD_QUALITIES.filter((quality) => used.has(quality)).map(chordSkill)
}

/** Each chord root once, in the piece's own key, lowest pitch class first: its check's roots. */
export function chordRootsOfPiece(piece: Piece): PitchClass[] {
  const roots = new Set(chordsOf(chartOf(piece)).map((chord) => pitchClassOf(chord.root)))
  return [...roots].sort((a, b) => a - b)
}
