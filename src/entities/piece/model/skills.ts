import {
  CHORD_QUALITIES,
  chordSkill,
  type ChordQuality,
  type SkillId,
  type SpelledNote,
} from '@/shared/lib/music'
import { factsOf } from './facts'
import type { Piece } from './types'

/** The chord qualities a piece's chart uses, as skills in table order: what its check asks. */
export function skillsOfPiece(piece: Piece): SkillId[] {
  const used = new Set(factsOf(piece).chords.map((chord) => chord.quality))
  return CHORD_QUALITIES.filter((quality) => used.has(quality)).map(chordSkill)
}

/** Each chord of a piece's chart once, as it is written (its root's spelling and quality), in order. */
export const chordsOfPiece = (piece: Piece): { root: SpelledNote; quality: ChordQuality }[] => [
  ...factsOf(piece).chords,
]
