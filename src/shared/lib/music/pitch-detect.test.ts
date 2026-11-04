import { describe, expect, it } from 'vitest'
import { centsOff, detectPitch, nearestNote } from './pitch-detect'

const RATE = 44_100

/** A tone at `frequency` with two quieter overtones, as a string sounds. */
function tone(frequency: number, size = 4096): Float32Array {
  const samples = new Float32Array(size)
  for (let i = 0; i < size; i++) {
    const t = i / RATE
    samples[i] =
      Math.sin(2 * Math.PI * frequency * t) +
      0.4 * Math.sin(4 * Math.PI * frequency * t) +
      0.2 * Math.sin(6 * Math.PI * frequency * t)
  }
  return samples
}

const cents = (found: number, wanted: number) => Math.abs(1200 * Math.log2(found / wanted))

describe('detectPitch (YIN)', () => {
  it('finds A4 and C2 within 2 cents on generated tones', () => {
    const a4 = detectPitch(tone(440), RATE)
    const c2 = detectPitch(tone(65.406, 8192), RATE)
    expect(a4).not.toBeNull()
    expect(c2).not.toBeNull()
    expect(cents(a4 ?? 0, 440)).toBeLessThan(2)
    expect(cents(c2 ?? 0, 65.406)).toBeLessThan(2)
  })

  it('hears nothing in silence', () => {
    expect(detectPitch(new Float32Array(4096), RATE)).toBeNull()
  })
})

describe('nearestNote and centsOff', () => {
  it('names the key nearest a frequency, A4 tuned as chosen', () => {
    expect(nearestNote(440)).toBe(69)
    expect(nearestNote(261.63)).toBe(60)
    expect(nearestNote(432, 432)).toBe(69)
  })

  it('says how far off it is, in cents', () => {
    expect(centsOff(440, 69)).toBeCloseTo(0)
    expect(centsOff(445, 69)).toBeCloseTo(19.56, 1)
    expect(centsOff(415.3, 69)).toBeCloseTo(-100, 0)
  })
})
