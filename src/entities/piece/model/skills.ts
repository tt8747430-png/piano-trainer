import {
  CHORD_QUALITIES,
  chordSkill,
  noteName,
  type ChordQuality,
  type SkillId,
  type SpelledNote,
} from '@/shared/lib/music'
import { chartOf, chordsOf } from './chart'
import type { Piece } from './types'

/** The chord qualities a piece's chart uses, as skills in table order: what its check asks. */
export function skillsOfPiece(piece: Piece): SkillId[] {
  const used = new Set(chordsOf(chartOf(piece)).map((chord) => chord.quality))
  return CHORD_QUALITIES.filter((quality) => used.has(quality)).map(chordSkill)
}

/** Each chord of a piece's chart once, as it is written (its root's spelling and quality), in order. */
export function chordsOfPiece(piece: Piece): { root: SpelledNote; quality: ChordQuality }[] {
  const seen = new Map<string, { root: SpelledNote; quality: ChordQuality }>()
  for (const { root, quality } of chordsOf(chartOf(piece))) {
    const name = `${noteName(root)} ${quality}`
    if (!seen.has(name)) seen.set(name, { root, quality })
  }
  return [...seen.values()]
}
