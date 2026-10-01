import type { PatternFit } from '@/entities/pattern'
import type { Piece } from '@/entities/piece'
import type { KeyWalk } from '@/shared/lib/music'

/** A walk through the keys is a way to play a progression: a song or a study keeps its key. */
export const walksKeys = (piece: Piece): boolean => piece.kind === 'progression'

/** What music has for its patterns while it walks the keys: no one key, so no key's triads. */
export const walkingFit = (fit: PatternFit, walk: KeyWalk | null): PatternFit =>
  walk ? { ...fit, key: false } : fit
