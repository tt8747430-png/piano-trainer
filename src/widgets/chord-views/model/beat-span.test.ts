import { describe, expect, it } from 'vitest'
import { BUILT_IN_PATTERNS } from '@/entities/pattern'
import type { ChartPiece } from '@/entities/piece'
import { arrangePiece, beatCells, ownChoice, playedBeatCells } from '@/features/practice'
import { beatSpan, loopedBars } from './beat-span'
import { lineProgress, lyricLines } from './lyric-lines'

/** C F repeated, then G Am in 4/4, then a bar of 2/4: played C F C F G Am Dm. */
const piece: ChartPiece = {
  id: 'my-1',
  kind: 'song',
  title: 'Morning',
  key: 'C',
  meter: '4/4',
  tempo: 90,
  pattern: 'r1',
  sections: [{ kind: 'verse', lines: ['|: C F :|', 'G Am Dm@2'] }],
}
const performance = arrangePiece(piece, ownChoice(piece), BUILT_IN_PATTERNS, { unfold: true })
const played = playedBeatCells(performance)

describe('beatSpan', () => {
  it('is a beat’s ticks as played, and as its bar is written, its first pass', () => {
    expect(beatSpan(performance, played, { bar: 1, beat: 2, startTick: 144 })).toEqual({
      played: { from: 144, to: 168 },
      written: { from: 144, to: 168 },
    })
    // The repeat's second pass of F is written where F is first played.
    expect(beatSpan(performance, played, { bar: 3, beat: 1, startTick: 312 })).toEqual({
      played: { from: 312, to: 336 },
      written: { from: 120, to: 144 },
    })
  })
})

describe('loopedBars', () => {
  it('is the bars as written a loop of bars played goes round, a repeat’s once', () => {
    // Played C F C F G Am Dm: the second F, then G.
    expect([...loopedBars(performance, { first: 3, last: 4 })]).toEqual([1, 2])
    expect([...loopedBars(performance, { first: 0, last: 3 })]).toEqual([0, 1])
    expect([...loopedBars(performance, null)]).toEqual([])
  })
})

describe('lineProgress', () => {
  const [, second] = lyricLines(performance)
  const written = beatCells(performance)

  it('is how far through its line a beat is, its beats counted to the beat’s end', () => {
    if (!second) throw new Error('two lines')
    // G Am Dm: ten beats.
    expect(lineProgress(second, written, { written: 2, beat: 0 })).toBe(0.1)
    expect(lineProgress(second, written, { written: 3, beat: 1 })).toBe(0.6)
    expect(lineProgress(second, written, { written: 4, beat: 1 })).toBe(1)
  })

  it('is none outside the line', () => {
    if (!second) throw new Error('two lines')
    expect(lineProgress(second, written, { written: 0, beat: 0 })).toBe(0)
  })
})
