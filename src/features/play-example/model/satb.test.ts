import { describe, expect, it } from 'vitest'
import { midi, parseChordSymbol } from '@/shared/lib/music'
import { satbShown, VOICES } from './satb'

const keys = (...numbers: number[]) => numbers.map(midi)

describe('satbShown', () => {
  it('names four voices from the bass up, each key in its chord tone’s colour', () => {
    const shown = satbShown(parseChordSymbol('C'), keys(48, 55, 64, 72))
    expect(VOICES).toEqual(['B', 'T', 'A', 'S'])
    expect([...shown.marks.entries()]).toEqual([
      [48, { tone: 'root', label: 'B', note: 'C' }],
      [55, { tone: '5th', label: 'T', note: 'G' }],
      [64, { tone: '3rd', label: 'A', note: 'E' }],
      [72, { tone: 'root', label: 'S', note: 'C' }],
    ])
    expect(shown.keys).toEqual(keys(48, 55, 64, 72))
  })

  it('leaves a faint letter on each key a voice moved from', () => {
    // C to G: the bass falls a 4th, the tenor holds G, the alto steps down to D, the soprano to B.
    const shown = satbShown(parseChordSymbol('G'), keys(43, 55, 62, 71), keys(48, 55, 64, 72))
    expect(shown.marks.get(midi(48))).toEqual({ tone: 'root', label: 'B', ghost: true })
    expect(shown.marks.get(midi(64))).toEqual({ tone: '5th', label: 'A', ghost: true })
    expect(shown.marks.get(midi(72))).toEqual({ tone: '3rd', label: 'S', ghost: true })
    // A voice that held its key leaves nothing behind.
    expect(shown.marks.get(midi(55))).toEqual({ tone: 'root', label: 'T', note: 'G' })
  })

  it('names no voices where a chord has not four keys', () => {
    expect(satbShown(parseChordSymbol('C'), keys(48, 64, 67)).marks.size).toBe(0)
  })
})
