import { describe, expect, it } from 'vitest'
import { BUILT_IN_PATTERNS, PATTERN_IDS, patternNeed } from '@/entities/pattern'
import { PIECES, pieceFit, pieceKey } from '@/entities/piece'
import type { Performance } from '@/shared/lib/arrangement'
import { noteName, PITCH_CLASSES, tonicSpelling } from '@/shared/lib/music'
import { arrangePiece, ownChoice } from './arrange-piece'

/** Each left-hand note that sounds above a right-hand note sounding with it. */
function crossings(performance: Performance): string[] {
  const right = performance.notes.filter((n) => n.hand === 'rh')
  return performance.notes
    .filter((n) => n.hand === 'lh')
    .filter((left) =>
      right.some(
        (r) =>
          r.midi < left.midi &&
          r.startTick < left.startTick + left.durationTicks &&
          left.startTick < r.startTick + r.durationTicks,
      ),
    )
    .map((left) => `${left.midi} at ${left.startTick}`)
}

describe('the hands', () => {
  it.each(PIECES.map((piece) => [piece.id, piece] as const))(
    'keep the left hand under the right in %s, in every playable pattern and key',
    (_id, piece) => {
      const fit = pieceFit(piece)
      const { minor } = pieceKey(piece)
      const crossed: string[] = []
      for (const id of PATTERN_IDS) {
        if (patternNeed(BUILT_IN_PATTERNS.require(id), fit) !== null) continue
        for (const pc of PITCH_CLASSES) {
          const tonic = tonicSpelling(pc, minor)
          const played = arrangePiece(
            piece,
            { ...ownChoice(piece), tonic, pattern: id },
            BUILT_IN_PATTERNS,
          )
          const found = crossings(played)
          if (found.length > 0) crossed.push(`${id} in ${noteName(tonic)}: ${found[0]}`)
        }
      }
      expect(crossed).toEqual([])
    },
    // A long piece is hundreds of arrangements: seconds, many more under coverage's instrumenting.
    60_000,
  )
})
