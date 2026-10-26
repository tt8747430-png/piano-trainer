import { describe, expect, it } from 'vitest'
import { percentOf, speedTempo, stepTempo } from './speeds'

describe('speeds', () => {
  it('takes a share of the piece’s tempo, rounded, within the range', () => {
    expect(speedTempo(72, 0.5)).toBe(36)
    expect(speedTempo(76, 0.75)).toBe(57)
    expect(speedTempo(30, 0.5)).toBe(20)
  })

  it('plays twice the fastest piece’s tempo (Chordify’s 200%)', () => {
    expect(speedTempo(160, 2)).toBe(320)
    expect(speedTempo(72, 2)).toBe(144)
  })

  it('says a tempo as a share of the piece’s', () => {
    expect(percentOf(54, 72)).toBe(75)
    expect(percentOf(60, 72)).toBe(83)
    expect(percentOf(144, 72)).toBe(200)
  })

  it('says a tempo on a 5% step as that step, though it rounds to another share', () => {
    // 55% of 72 is 39.6, played at 40, which is 56% of it.
    expect(percentOf(40, 72)).toBe(55)
    expect(percentOf(61, 72)).toBe(85)
    expect(percentOf(79, 72)).toBe(110)
  })

  it('steps a tempo to the next 5% of the piece’s, up or down', () => {
    expect(stepTempo(72, 72, -1)).toBe(68)
    // 68 of 72 reads as 95%, its step: the step down from there is 90%.
    expect(stepTempo(68, 72, -1)).toBe(65)
    expect(stepTempo(65, 72, 1)).toBe(68)
    expect(stepTempo(72, 72, 1)).toBe(76)
    expect(stepTempo(160, 160, 1)).toBe(168)
  })

  it('steps from half the piece’s tempo up to twice it, never past either', () => {
    expect(stepTempo(36, 72, -1)).toBe(36)
    expect(stepTempo(144, 72, 1)).toBe(144)
    expect(stepTempo(320, 160, 1)).toBe(320)
    expect(stepTempo(40, 80, -1)).toBe(40)
  })

  it('brings a tempo from outside the range into it, never the wrong way', () => {
    // Below half the piece's tempo (a link's): faster lands on 50%, slower stays.
    expect(stepTempo(20, 72, 1)).toBe(36)
    expect(stepTempo(20, 72, -1)).toBe(20)
    // Past twice it: slower lands on 200%, faster stays.
    expect(stepTempo(300, 72, -1)).toBe(144)
    expect(stepTempo(300, 72, 1)).toBe(300)
  })

  it('keeps stepping until the tempo changes, every 5% from 50% to 200% on the way', () => {
    const steps = (from: number, own: number, by: -1 | 1): number[] => {
      const tempos = [from]
      for (let i = 0; i < 40; i += 1) tempos.push(stepTempo(tempos.at(-1) ?? from, own, by))
      return tempos
    }
    for (const own of [40, 54, 56, 72, 76, 160]) {
      const up = steps(speedTempo(own, 0.5), own, 1)
      const top = up.indexOf(speedTempo(own, 2))
      expect(top, `${own}`).toBeGreaterThan(0)
      up.slice(1, top + 1).forEach((tempo, i) => expect(tempo).toBeGreaterThan(up[i] ?? 0))
      // Every step's percent a multiple of 5, as the tempo button says it.
      for (const tempo of up.slice(0, top + 1)) expect(percentOf(tempo, own) % 5, `${own}`).toBe(0)
      const down = steps(speedTempo(own, 2), own, -1)
      const foot = down.indexOf(speedTempo(own, 0.5))
      expect(foot, `${own}`).toBeGreaterThan(0)
      down.slice(1, foot + 1).forEach((tempo, i) => expect(tempo).toBeLessThan(down[i] ?? 0))
    }
    // A slow piece's every step is a tempo of its own: 30 steps from 50% to 200%.
    const up = steps(speedTempo(72, 0.5), 72, 1)
    expect(up.indexOf(144)).toBe(30)
  })
})
