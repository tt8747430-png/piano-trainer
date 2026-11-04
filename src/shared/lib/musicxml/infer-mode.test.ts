import { describe, expect, it } from 'vitest'
import { inferMinor } from './infer-mode'

const at = (midi: number, startTick: number) => ({ midi, startTick })

describe('inferMinor (R29 A28): a key read with no mode', () => {
  it('reads four sharps as C♯ minor when the bass starts and ends on C♯ and B♯ appears', () => {
    const notes = [at(49, 0), at(68, 0), at(72, 10), at(61, 400), at(49, 900)]
    // B♯ is midi 72 (C5 written B♯4): the raised 7th of C♯ minor.
    expect(inferMinor(4, notes, { firstBarEnd: 100, lastBarStart: 800 })).toBe(true)
  })

  it('keeps four sharps E major when the bass starts and ends on E', () => {
    const notes = [at(40, 0), at(64, 0), at(68, 50), at(40, 900)]
    expect(inferMinor(4, notes, { firstBarEnd: 100, lastBarStart: 800 })).toBe(false)
  })

  it('lets the title say so: "in C♯ minor", "moll", "минор"', () => {
    const notes = [at(52, 0), at(52, 900)]
    expect(
      inferMinor(4, notes, { firstBarEnd: 100, lastBarStart: 800, title: 'Nocturne in C# Minor' }),
    ).toBe(true)
    expect(
      inferMinor(0, notes, { firstBarEnd: 100, lastBarStart: 800, title: 'Etüde a-moll' }),
    ).toBe(true)
    expect(
      inferMinor(0, notes, { firstBarEnd: 100, lastBarStart: 800, title: 'Этюд ля минор' }),
    ).toBe(true)
    expect(
      inferMinor(0, notes, { firstBarEnd: 100, lastBarStart: 800, title: 'Sonata in C major' }),
    ).toBe(false)
  })
})
