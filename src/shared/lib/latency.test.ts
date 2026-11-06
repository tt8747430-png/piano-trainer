import { describe, expect, it } from 'vitest'
import { calibratedLatency, isLatency } from './latency'

const BEAT = 60 / 80
const CLICKS = Array.from({ length: 16 }, (_, beat) => 1 + beat * BEAT)

describe('calibratedLatency', () => {
  it('is the median of how late each tap came, to 5 ms', () => {
    const lateness = [0.04, 0.043, 0.038, 0.041, 0.2, 0.039, 0.042, 0.04, 0.044, 0.037]
    const taps = lateness.map((late, beat) => 1 + beat * BEAT + late)
    expect(calibratedLatency(CLICKS, taps)).toBe(40)
  })

  it('leaves out a tap no click is near', () => {
    const taps = [...CLICKS.slice(0, 8).map((click) => click + 0.06), 30]
    expect(calibratedLatency(CLICKS, taps)).toBe(60)
  })

  it('measures nothing from too few taps', () => {
    expect(calibratedLatency(CLICKS, CLICKS.slice(0, 7))).toBeNull()
  })

  it('keeps an early tapper at none and a slow piano within the range', () => {
    expect(
      calibratedLatency(
        CLICKS,
        CLICKS.map((click) => click - 0.03),
      ),
    ).toBe(0)
    expect(
      calibratedLatency(
        CLICKS,
        CLICKS.map((click) => click + 0.36),
      ),
    ).toBe(300)
  })
})

describe('isLatency', () => {
  it('stands for whole steps within the range only', () => {
    expect([0, 45, 300].every(isLatency)).toBe(true)
    expect([-5, 42, 305, '40', null].some(isLatency)).toBe(false)
  })
})
