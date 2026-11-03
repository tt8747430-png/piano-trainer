import { describe, expect, it } from 'vitest'
import { BUILT_IN_PATTERNS } from '@/entities/pattern'
import type { ChartPiece } from '@/entities/piece'
import { arrangePiece, ownChoice, playedBeatCells } from '@/features/practice'
import { firstBeats } from './strip-place'

const piece: ChartPiece = {
  id: 'my-1',
  kind: 'song',
  title: 'Morning',
  key: 'C',
  meter: '4/4',
  tempo: 90,
  pattern: 'r1',
  sections: [{ kind: 'verse', lines: ['|: C G :| Am'] }],
}
const performance = arrangePiece(piece, ownChoice(piece), BUILT_IN_PATTERNS, { unfold: true })
const bars = playedBeatCells(performance)

describe('firstBeats', () => {
  it('counts each bar’s first beat along the strip, the repeat played', () => {
    expect(firstBeats(bars)).toEqual([0, 4, 8, 12, 16])
  })
})
