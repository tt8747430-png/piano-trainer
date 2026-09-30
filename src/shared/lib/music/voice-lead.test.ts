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

  it('keeps the right hand above the bass, never striking a key twice', () => {
    const qualities: ChordQuality[] = ['maj', 'min', 'd7', 'm7', 'maj7']
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
