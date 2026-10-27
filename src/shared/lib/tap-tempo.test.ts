import { describe, expect, it } from 'vitest'
import { tapTempo } from './tap-tempo'

/** Taps the times given (milliseconds), one after another; the tempo each tap reads. */
function tapped(times: readonly number[]) {
  let taps: readonly number[] = []
  return times.map((time) => {
    const read = tapTempo(taps, time)
    taps = read.taps
    return read.bpm
  })
}

describe('tapTempo', () => {
  it('reads no tempo from one tap', () => {
    expect(tapped([0])).toEqual([null])
  })

  it('reads the tempo from the average of the gaps between the taps', () => {
    // Half a second apart: 120 a minute; then a gap of 0.7 s brings the average to 0.567 s.
    expect(tapped([0, 500, 1000, 1700])).toEqual([null, 120, 120, 106])
  })

  it('averages the last few taps alone', () => {
    // Five taps a second apart, then four half a second apart: only the last are counted.
    expect(tapped([0, 1000, 2000, 3000, 4000, 4500, 5000, 5500, 6000]).at(-1)).toBe(120)
  })

  it('starts again after a pause', () => {
    expect(tapped([0, 500, 5000, 5250])).toEqual([null, 120, null, 240])
  })
})
