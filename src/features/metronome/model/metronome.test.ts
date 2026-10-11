import { describe, expect, it } from 'vitest'
import { metronomeBar, tappedTempo, withTap } from './metronome'

describe('metronomeBar', () => {
  it('clicks each beat of a bar at the tempo, the first accented', () => {
    expect(metronomeBar(3, 120)).toEqual([
      { kind: 'click', at: 0, accent: true },
      { kind: 'click', at: 0.5, accent: false },
      { kind: 'click', at: 1, accent: false },
    ])
  })
})

describe('tap tempo', () => {
  it('keeps the tempo the taps keep, from two of them', () => {
    expect(tappedTempo(withTap([], 0))).toBeNull()
    expect(tappedTempo([0, 500, 1000, 1500])).toBe(120)
  })

  it('starts again after a long pause, and keeps the latest few', () => {
    expect(withTap([0, 500], 5000)).toEqual([5000])
    expect(withTap([0, 1, 2, 3, 4], 5)).toEqual([1, 2, 3, 4, 5])
  })

  it('keeps a tempo within the app’s range', () => {
    expect(tappedTempo([0, 100])).toBe(160)
    expect(tappedTempo([0, 1900])).toBe(32)
  })
})
