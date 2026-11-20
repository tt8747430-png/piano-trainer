import { describe, expect, it } from 'vitest'
import { TICKS_PER_BEAT } from '@/shared/lib/music'
import { BUILT_IN_PATTERNS } from '@/entities/pattern'
import type { ChartPiece } from '@/entities/piece'
import { arrangePiece, ownChoice } from '@/features/practice'
import type { Performance } from '@/shared/lib/arrangement'
import { chordNear, chordsFrom, chordsInOrder, chordsInSong } from './chords-from'

const B = TICKS_PER_BEAT

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

/** The chords sounding and next by their symbols. */
const named = (performance: Performance, found: ReturnType<typeof chordsFrom>) => ({
  now: found.now === null ? null : performance.chords[found.now]?.symbol,
  next: found.next === null ? null : performance.chords[found.next]?.symbol,
})

/** A beat of a bar of 4/4, its ticks. */
const beat = (bar: number, beat: number) => ({
  from: bar * 4 * B + beat * B,
  to: bar * 4 * B + (beat + 1) * B,
})

describe('chordsFrom', () => {
  const four = song('C@2-F@2 G Am F')

  it('is the chord sounding in a beat and the next in played order', () => {
    expect(named(four, chordsFrom(four, beat(0, 0), null))).toEqual({ now: 'C', next: 'F' })
    expect(named(four, chordsFrom(four, beat(1, 2), null))).toEqual({ now: 'G', next: 'Am' })
  })

  it('takes the later of two chords starting in one beat', () => {
    const quick = song('C@0.5-G@3.5')
    expect(named(quick, chordsFrom(quick, beat(0, 0), null))).toEqual({ now: 'G', next: null })
  })

  it('skips a chord held again: the next is the next change', () => {
    const held = song('C C C G')
    expect(named(held, chordsFrom(held, beat(0, 1), null))).toEqual({ now: 'C', next: 'G' })
  })

  it('ends with the music, and goes round to the loop’s first where a loop does', () => {
    expect(named(four, chordsFrom(four, beat(3, 0), null))).toEqual({ now: 'F', next: null })
    // The loop over bars 2 and 3, Am F: after F, Am again.
    const loop = { from: 8 * B, to: 16 * B }
    expect(named(four, chordsFrom(four, beat(3, 0), loop))).toEqual({ now: 'F', next: 'Am' })
  })

  it('goes round to the chord sounding at the loop’s start, though it started before it', () => {
    // Bars 1 and 2 of C C G: the loop starts in C, held from bar 0.
    const held = song('C C G')
    expect(named(held, chordsFrom(held, beat(2, 0), { from: 4 * B, to: 12 * B }))).toEqual({
      now: 'G',
      next: 'C',
    })
  })

  it('has none sounding in a bar of no chord, the next still coming', () => {
    const empty = song('C _ G')
    expect(named(empty, chordsFrom(empty, beat(1, 0), null))).toEqual({ now: null, next: 'G' })
  })

  it('has none, and none next, in music of no chord', () => {
    const none = song('_ _')
    expect(chordsFrom(none, beat(0, 0), null)).toEqual({ now: null, next: null })
  })
})

describe('chordNear', () => {
  const twice = song('C G C Am')

  it('finds a chord where it next starts from a tick, else where it first does', () => {
    const at = (symbol: string, tick: number) => twice.chords[chordNear(twice, symbol, tick) ?? -1]
    expect(at('C', 0)?.startTick).toBe(0)
    expect(at('C', (5 * B) / 12)?.startTick).toBe(8 * B)
    expect(at('C', (25 * B) / 3)?.startTick).toBe(0)
    expect(chordNear(twice, 'D', 0)).toBeNull()
  })
})

describe('the summary’s two lists (R29 A37)', () => {
  it('In this song: each chord once in first-sound order, how often it changes to it, and its bars', () => {
    const performance = song('C C F C', 'G G C C')
    expect(chordsInSong(performance)).toEqual([
      { symbol: 'C', count: 3, bars: [1, 4, 7] },
      { symbol: 'F', count: 1, bars: [3] },
      { symbol: 'G', count: 1, bars: [5] },
    ])
  })

  it('In order: one card a change, as played, matching the strip’s changes one for one', () => {
    const performance = song('C C F C', 'G G C C')
    expect(chordsInOrder(performance).map(({ symbol, bar }) => `${symbol}@${bar}`)).toEqual([
      'C@1',
      'F@3',
      'C@4',
      'G@5',
      'C@7',
    ])
    // Each card points at the chord it starts with: a tap moves the cursor there.
    for (const card of chordsInOrder(performance)) {
      expect(performance.chords[card.chord]?.symbol).toBe(card.symbol)
    }
  })
})
