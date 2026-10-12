import { describe, expect, it } from 'vitest'
import { CHORD_QUALITIES, chordRootSpelling, qualityIntervals, type ChordQuality } from './chord'
import { note } from './note'
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

  it('leaves a 9th chord’s root to the bass, the hands alternating the two rootless shapes', () => {
    // Dm9 7-9-3-5 (C E F A), G9 3-5-7-9 (B D F A), CMaj9 7-9-3-5 (B D E G), around middle C.
    expect(voiced('Dm9', 'G9', 'CMaj9')).toEqual([
      [50, 60, 64, 65, 69],
      [55, 59, 62, 65, 69],
      [48, 59, 62, 64, 67],
    ])
  })

  it('holds the tones two chords share and moves the others to the nearest: C F G C', () => {
    expect(voiced('C', 'F', 'G', 'C').map(([, ...hand]) => hand)).toEqual([
      [60, 64, 67],
      [60, 65, 69],
      [59, 62, 67],
      [60, 64, 67],
    ])
  })

  it('leads a ii–V–I’s 7ths down a step to the next 3rd', () => {
    const [ii = [], v = [], one = []] = voiced('Dm7', 'G7', 'CMaj7')
    // Dm7's 7th C falls to G7's 3rd B; G7's 7th F falls to C's 3rd E.
    expect(ii).toContain(72)
    expect(v).toContain(71)
    expect(v).toContain(65)
    expect(one).toContain(64)
  })

  it('starts a row in root position near middle C, and keeps the hand between G3 and G5', () => {
    const rows = [
      ['G', 'C', 'D', 'G'],
      ['A', 'D', 'E7', 'A'],
      ['B', 'E', 'F#7', 'B'],
      ['Ab', 'Db', 'Eb7', 'Ab'],
    ]
    for (const row of rows) {
      const voicedRow = voiced(...row)
      for (const [, ...hand] of voicedRow) {
        expect(Math.min(...hand), row.join(' ')).toBeGreaterThanOrEqual(55)
        expect(Math.max(...hand), row.join(' ')).toBeLessThanOrEqual(79)
      }
    }
  })

  it('takes the nearest inversion though it starts on the root, the bass an octave under it', () => {
    expect(voiced('Cm7', 'F7', 'BbMaj7')).toEqual([
      [48, 60, 63, 67, 70],
      [53, 60, 63, 65, 69],
      [46, 58, 62, 65, 69],
    ])
  })

  it('puts a slash chord over the bass it writes: F, F♯°7, C/G climbs F, F♯, G', () => {
    const row = voiced('F', 'F#°7', 'C/G')
    expect(row.map(([bass]) => bass)).toEqual([53, 54, 55])
    expect(row[2]?.slice(1).map((key) => key % 12)).toEqual(expect.arrayContaining([0, 4, 7]))
  })

  it('keeps a 9th chord’s root in the hand when its bass is another note', () => {
    const [[bass = 0, ...hand] = []] = voiced('CMaj9/E')
    expect(bass % 12).toBe(4)
    expect(hand.map((key) => key % 12)).toContain(0)
    expect(Math.min(...hand)).toBeGreaterThan(bass)
  })

  it('voices a row of one chord, of none, and a 13th', () => {
    expect(voiced('C')).toEqual([[48, 60, 64, 67]])
    expect(voiced()).toEqual([])
    const [[bass = 0, ...hand] = []] = voiced('G13')
    expect(hand).toHaveLength(5)
    expect(hand.map((key) => key % 12)).not.toContain(7)
    expect(Math.min(...hand)).toBeGreaterThan(bass)
  })

  it('holds a big chord’s hand close, inside an octave: G13 is B D E F A, not a stack an 11th wide', () => {
    const [[, ...hand] = []] = voiced('G13')
    expect(hand).toEqual([59, 62, 64, 65, 69])
    // Every chord of the table that one hand cannot stack.
    for (const quality of CHORD_QUALITIES.filter((each) => qualityIntervals(each).length >= 5)) {
      const [[bass = 0, ...keys] = []] = voiceLead([{ root: note('C'), quality }])
      expect(Math.max(...keys) - Math.min(...keys), quality).toBeLessThanOrEqual(11)
      expect(Math.min(...keys), quality).toBeGreaterThan(bass)
    }
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
