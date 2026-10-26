import { describe, expect, it } from 'vitest'
import { BUILT_IN_PATTERNS } from '@/entities/pattern'
import type { ChartPiece } from '@/entities/piece'
import { arrangePiece, ownChoice } from '@/features/practice'
import type { Performance } from '@/shared/lib/arrangement'
import { lyricLines, soundingChip } from './lyric-lines'
import { foldRepeats } from './repeated-lines'

/** A song of 4/4 bars in C, its sections' lines, a staff over the piano, and its verses. */
function song(
  sections: readonly (readonly string[])[],
  { notes, lyrics }: { notes?: string; lyrics?: readonly string[] } = {},
): Performance {
  const piece: ChartPiece = {
    id: 'my-1',
    kind: 'song',
    title: 'Morning',
    key: 'C',
    meter: '4/4',
    tempo: 90,
    pattern: 'r1',
    sections: sections.map((lines) => ({ kind: 'verse', lines })),
    ...(notes ? { staves: [{ notes }] } : {}),
    ...(lyrics ? { lyrics } : {}),
  }
  return arrangePiece(piece, ownChoice(piece), BUILT_IN_PATTERNS, { unfold: true })
}

/** Each line shown as its chords, its bars and how many times it is played. */
const folded = (performance: Performance) =>
  foldRepeats(performance, lyricLines(performance)).map(({ segments, bars, times }) => ({
    chords: segments.map(({ chord }) =>
      chord === null ? null : (performance.chords[chord]?.symbol ?? '?'),
    ),
    bars,
    times,
  }))

describe('foldRepeats', () => {
  it('shows a line of chords alone played again in its repeat once, ×2', () => {
    expect(folded(song([['|: C G :| Am']]))).toEqual([
      { chords: ['C', 'G', 'Am'], bars: [0, 1, 2], times: 1 },
    ])
    expect(folded(song([['|: C G :|', 'Am F']]))).toEqual([
      { chords: ['C', 'G'], bars: [0, 1], times: 2 },
      { chords: ['Am', 'F'], bars: [2, 3], times: 1 },
    ])
  })

  it('folds a line of chords written again straight after itself into one, its bars both', () => {
    const performance = song([['C G', 'C G', 'C G', 'Am F']])
    expect(folded(performance)).toEqual([
      { chords: ['C', 'G'], bars: [0, 1, 2, 3, 4, 5], times: 3 },
      { chords: ['Am', 'F'], bars: [6, 7], times: 1 },
    ])
    const [first] = foldRepeats(performance, lyricLines(performance))
    expect(first?.copies).toEqual([0, 192, 384])
  })

  it('counts a repeat and a copy written after it together', () => {
    expect(folded(song([['|: C G :|', 'C G']]))).toEqual([
      { chords: ['C', 'G'], bars: [0, 1, 2, 3], times: 3 },
    ])
  })

  it('keeps apart lines whose chords differ, or fall on other beats, or start another section', () => {
    expect(folded(song([['C G', 'C F']])).map(({ times }) => times)).toEqual([1, 1])
    expect(folded(song([['C G', 'C@2-G@2 G']])).map(({ times }) => times)).toEqual([1, 1])
    expect(folded(song([['C G'], ['C G']])).map(({ times }) => times)).toEqual([1, 1])
  })

  it('never folds a line with words: each verse is shown', () => {
    const performance = song([['C G', 'C G']], {
      notes: 'C4/4 | D4/4 | E4/4 | F4/4',
      lyrics: ['one two three four'],
    })
    expect(folded(performance).map(({ times }) => times)).toEqual([1, 1])
  })

  it('marks the chord sounding in any copy of a folded line', () => {
    const performance = song([['C G', 'C G']])
    const lines = foldRepeats(performance, lyricLines(performance))
    expect(soundingChip(lines, { from: 0, to: 24 })).toEqual({ line: 0, segment: 0 })
    expect(soundingChip(lines, { from: 288, to: 312 })).toEqual({ line: 0, segment: 1 })
  })
})
