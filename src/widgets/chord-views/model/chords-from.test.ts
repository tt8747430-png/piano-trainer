import { describe, expect, it } from 'vitest'
import { BUILT_IN_PATTERNS } from '@/entities/pattern'
import type { ChartPiece } from '@/entities/piece'
import { arrangePiece, ownChoice } from '@/features/practice'
import type { Performance } from '@/shared/lib/arrangement'
import { chordNear, chordsFrom, pairSlide } from './chords-from'

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
  from: bar * 96 + beat * 24,
  to: bar * 96 + (beat + 1) * 24,
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
    const loop = { from: 192, to: 384 }
    expect(named(four, chordsFrom(four, beat(3, 0), loop))).toEqual({ now: 'F', next: 'Am' })
  })

  it('goes round to the chord sounding at the loop’s start, though it started before it', () => {
    // Bars 1 and 2 of C C G: the loop starts in C, held from bar 0.
    const held = song('C C G')
    expect(named(held, chordsFrom(held, beat(2, 0), { from: 96, to: 288 }))).toEqual({
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

describe('pairSlide', () => {
  const four = song('C G Am F')
  const pair = { now: 0, next: 1 }

  it('holds the pair still until the half beat before the change, then slides it there', () => {
    expect(pairSlide(four, pair, null, 0)).toBe(0)
    expect(pairSlide(four, pair, null, 84)).toBe(0)
    expect(pairSlide(four, pair, null, 90)).toBe(0.5)
    expect(pairSlide(four, pair, null, 96)).toBe(1)
  })

  it('slides to a loop’s start as the loop goes round, and not at all with no next', () => {
    const loop = { from: 0, to: 192 }
    expect(pairSlide(four, { now: 1, next: 0 }, loop, 186)).toBe(0.5)
    expect(pairSlide(four, { now: 1, next: null }, null, 186)).toBe(0)
    expect(pairSlide(four, { now: null, next: 1 }, null, 90)).toBe(0)
  })
})

describe('chordNear', () => {
  const twice = song('C G C Am')

  it('finds a chord where it next starts from a tick, else where it first does', () => {
    const at = (symbol: string, tick: number) => twice.chords[chordNear(twice, symbol, tick) ?? -1]
    expect(at('C', 0)?.startTick).toBe(0)
    expect(at('C', 10)?.startTick).toBe(192)
    expect(at('C', 200)?.startTick).toBe(0)
    expect(chordNear(twice, 'D', 0)).toBeNull()
  })
})
