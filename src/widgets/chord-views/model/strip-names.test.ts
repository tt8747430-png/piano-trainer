import { describe, expect, it } from 'vitest'
import { BUILT_IN_PATTERNS } from '@/entities/pattern'
import type { ChartPiece } from '@/entities/piece'
import { arrangePiece, ownChoice, playedBeatCells } from '@/features/practice'
import type { Performance } from '@/shared/lib/arrangement'
import { stripNames } from './strip-names'

/** A song of 4/4 bars in C, played as the Player plays it, the repeats taken. */
function song(...lines: string[]): Performance {
  const piece: ChartPiece = {
    id: 'my-1',
    kind: 'song',
    title: 'Morning',
    key: 'C',
    meter: '4/4',
    tempo: 90,
    pattern: 'r1',
    sections: [{ kind: 'verse', lines }],
  }
  return arrangePiece(piece, ownChoice(piece), BUILT_IN_PATTERNS, { unfold: true })
}

/** Each bar's beats as the strip names them: a chord's symbols, `𝄽` a rest, `·` nothing. */
const named = (performance: Performance) =>
  stripNames(performance, playedBeatCells(performance)).map((cells) =>
    cells.map(({ symbols, rest }) => (rest ? '𝄽' : symbols.join(' ') || '·')).join(' '),
  )

describe('stripNames', () => {
  it('names a chord once where it changes, not again in the bars that go on with it', () => {
    expect(named(song('C C G G'))).toEqual(['C · · ·', '· · · ·', 'G · · ·', '· · · ·'])
  })

  it('names a chord again after a repeat goes round to it, where another sounded before', () => {
    // Played C G C G.
    expect(named(song('|: C G :|'))).toEqual(['C · · ·', 'G · · ·', 'C · · ·', 'G · · ·'])
  })

  it('names each change inside a bar, in the beat it starts in', () => {
    expect(named(song('C@2-F@2 F'))).toEqual(['C · F ·', '· · · ·'])
  })

  it('puts a rest where the music turns to no chord, and names the chord after it again', () => {
    expect(named(song('C _ _ C'))).toEqual(['C · · ·', '𝄽 · · ·', '· · · ·', 'C · · ·'])
  })

  it('puts a rest at the start of music that starts with no chord', () => {
    expect(named(song('_ G'))).toEqual(['𝄽 · · ·', 'G · · ·'])
  })
})
