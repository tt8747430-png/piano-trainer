import { describe, expect, it } from 'vitest'
import type { Performance } from '@/shared/lib/arrangement'
import { note, noteName, TICKS_PER_BEAT } from '@/shared/lib/music'
import { innerVoice, modes, rapidSwitch, twoFiveOneScale } from './jonny'

const C = note('C')
const BAR = 4 * TICKS_PER_BEAT
const notesOf = (performance: Performance, side: 'rh' | 'lh') =>
  performance.notes.filter((n) => n.hand === side)
const line = (performance: Performance, side: 'rh' | 'lh' = 'rh') =>
  notesOf(performance, side)
    .map((n) => noteName(n.spelled))
    .join(' ')
const inBar = (performance: Performance, side: 'rh' | 'lh', bar: number) =>
  notesOf(performance, side)
    .filter((n) => Math.floor(n.startTick / BAR) === bar)
    .map((n) => noteName(n.spelled))
    .join(' ')

describe('twoFiveOneScale', () => {
  it('runs the scale up over Dm7 and down over G7, home on C over its shell', () => {
    const exercise = twoFiveOneScale({ root: C })
    expect(line(exercise)).toBe('C D E F G A B C D C B A G F E D C')
    expect(exercise.chords.map((chord) => chord.symbol)).toEqual(['Dm7', 'G7', 'CMaj7'])
    expect([0, 1, 2].map((bar) => inBar(exercise, 'lh', bar))).toEqual(['D C', 'G F', 'C B'])
  })
})

describe('innerVoice', () => {
  it('holds the 3rd on top while the 7th steps down to the 6th', () => {
    const exercise = innerVoice({ root: C })
    expect(inBar(exercise, 'rh', 0)).toBe('B E A')
    expect(inBar(exercise, 'rh', 1)).toBe('C F B')
    expect(inBar(exercise, 'lh', 1)).toBe('D')
    expect(
      notesOf(exercise, 'rh')
        .slice(0, 3)
        .map((n) => n.finger),
    ).toEqual([2, 5, 1])
    expect(exercise.chords.map((chord) => chord.symbol).slice(0, 2)).toEqual(['CMaj7', 'Dm7'])
  })
})

describe('modes', () => {
  it('runs the scale from each degree, two bars a mode, fingered as C major', () => {
    const exercise = modes({ root: C })
    expect(exercise.bars).toHaveLength(14)
    expect(inBar(exercise, 'rh', 2)).toBe('D E F G A B C D')
    expect(
      notesOf(exercise, 'rh')
        .filter((n) => n.startTick >= 4 * BAR && n.startTick < 5 * BAR)
        .map((n) => n.finger)
        .join(''),
    ).toBe('31234123')
  })
})

describe('rapidSwitch', () => {
  it('climbs one key and comes down the next, round the circle, never a break', () => {
    const exercise = rapidSwitch({ root: C })
    expect(inBar(exercise, 'rh', 0)).toBe('C D E F G A B C')
    expect(inBar(exercise, 'rh', 1)).toBe('B♭ A G F E D C B♭')
    expect(inBar(exercise, 'rh', 2)).toBe('C D E♭ F G A B♭ C')
    expect(exercise.chords.map((chord) => chord.symbol).slice(0, 3)).toEqual(['C', 'F', 'B♭'])
    expect(exercise.bars).toHaveLength(13)
    const rh = notesOf(exercise, 'rh')
    rh.slice(1).forEach((n, i) =>
      expect(Math.abs(n.midi - (rh[i]?.midi ?? 0))).toBeLessThanOrEqual(3),
    )
  })
})
