import { describe, expect, it } from 'vitest'
import { chordRootSpelling, qualityIntervals, type ChordQuality } from './chord'
import { parseChordSymbol } from './chord-symbol'
import { pitchClass } from './pitch'
import { voiceLead } from './voice-lead'

describe('voiceLead', () => {
  it('puts each chord over its root and moves the right hand as little as it can', () => {
    const [first, second] = voiceLead([parseChordSymbol('C'), parseChordSymbol('G7')])
    expect(first).toEqual([48, 60, 64, 67])
    expect(second).toEqual([55, 59, 62, 65, 67])
  })

  const voiced = (...symbols: string[]) => voiceLead(symbols.map(parseChordSymbol))

  it('leaves a 9th chord’s root to the bass: the hand plays its 3rd, 5th, 7th and 9th', () => {
    expect(voiced('Dm9', 'G9', 'CMaj9')).toEqual([
      [50, 65, 69, 72, 76],
      [55, 65, 69, 71, 74],
      [48, 64, 67, 71, 74],
    ])
  })

  it('takes the nearest inversion though it starts on the root, the bass an octave under it', () => {
    expect(voiced('Cm7', 'F7', 'BbMaj7')).toEqual([
      [48, 60, 63, 67, 70],
      [53, 60, 63, 65, 69],
      [46, 58, 62, 65, 69],
    ])
  })

  it('voices a row of one chord, of none, and a 13th', () => {
    expect(voiced('C')).toEqual([[48, 60, 64, 67]])
    expect(voiced()).toEqual([])
    const [[bass = 0, ...hand] = []] = voiced('G13')
    expect(hand).toHaveLength(5)
    expect(hand.map((key) => key % 12)).not.toContain(7)
    expect(Math.min(...hand)).toBeGreaterThan(bass)
  })

  it('keeps the right hand above the bass, never striking a key twice', () => {
    const qualities: ChordQuality[] = ['maj', 'min', 'd7', 'm7', 'maj7', 'm9', 'n9', 'maj9', 'n13']
    const chords = qualities.flatMap((quality) =>
      Array.from({ length: 12 }, (_, pc) => ({
        root: chordRootSpelling(pitchClass(pc), qualityIntervals(quality)),
        quality,
      })),
    )
    for (const from of chords) {
      for (const to of chords) {
        const [, [bass = 0, ...hand] = []] = voiceLead([from, to])
        expect(Math.min(...hand), `${from.quality} → ${to.quality}`).toBeGreaterThan(bass)
      }
    }
  })
})
