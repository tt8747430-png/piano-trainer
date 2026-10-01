import { BUILT_IN_PATTERNS } from '@/entities/pattern'
import type { PatternId } from '@/entities/pattern'
import type { Piece } from '@/entities/piece'

import { arrangePiece, ownChoice } from '@/features/practice'
import { audibleHands, schedule, type Sound } from '@/shared/lib/schedule'
import { type ShownKeys, unmarked } from '@/shared/ui'

/** What a pattern block plays, and the keys it shows while it does. */
export interface PatternOpening {
  readonly sounds: readonly Sound[]
  readonly shown: ShownKeys
}

/**
 * A pattern heard over a piece: the piece's first line with it, both hands, in the piece's key and at
 * its tempo, as the Player would play it there, from its first sound (a pickup the pattern rests
 * through is left out).
 */
export function patternOpening(piece: Piece, pattern: PatternId): PatternOpening {
  const performance = arrangePiece(piece, { ...ownChoice(piece), pattern }, BUILT_IN_PATTERNS)
  const secondLine = performance.bars.find((bar) => bar.section > 0 || bar.line > 0)
  const { sounds } = schedule(performance, {
    tempo: piece.tempo,
    hands: audibleHands('both'),
    fromTick: performance.beatGroups[0]?.tick ?? 0,
    toTick: secondLine?.startTick ?? performance.totalTicks,
  })
  const keys = [
    ...new Set(sounds.flatMap((sound) => (sound.kind === 'note' ? [sound.midi] : []))),
  ].sort((a, b) => a - b)
  return { sounds, shown: unmarked(keys) }
}
