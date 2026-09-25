import type { PieceId } from '@/entities/piece'
import { CHORD_FAMILIES, SCALE_KINDS, type ChordFamily, type ScaleKind } from '@/shared/lib/music'

/** 1 Beginner · 2 Elementary · 3 Intermediate · 4 Advanced. */
export const LEVELS = [1, 2, 3, 4] as const
export type Level = (typeof LEVELS)[number]

/** One entry on the Path. Steps refer to content and never copy it. */
export type PathStep =
  | { readonly kind: 'piece'; readonly pieceId: PieceId }
  | { readonly kind: 'chords'; readonly family: ChordFamily }
  | { readonly kind: 'scale'; readonly scale: ScaleKind }

export type StepId = `piece:${PieceId}` | `chords:${ChordFamily}` | `scale:${ScaleKind}`

export function stepIdOf(step: PathStep): StepId {
  switch (step.kind) {
    case 'piece':
      return `piece:${step.pieceId}`
    case 'chords':
      return `chords:${step.family}`
    case 'scale':
      return `scale:${step.scale}`
  }
}

const includes = (list: readonly string[], value: string) => list.includes(value)

/** Whether a value is written as a step id. A piece id is only checked for being there: a saved
 *  one may name a piece a later version removed. */
export function isStepId(value: unknown): value is StepId {
  if (typeof value !== 'string') return false
  const colon = value.indexOf(':')
  const kind = value.slice(0, colon)
  const name = value.slice(colon + 1)
  switch (kind) {
    case 'piece':
      return name !== ''
    case 'chords':
      return includes(CHORD_FAMILIES, name)
    case 'scale':
      return includes(SCALE_KINDS, name)
    default:
      return false
  }
}
