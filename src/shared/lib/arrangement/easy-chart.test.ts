import { describe, expect, it } from 'vitest'
import { beatsToTicks, midi, note, parseChordSymbol } from '@/shared/lib/music'
import { easyChart } from './easy-chart'
import type { Chart, ChartBar, ChartChord, HandNote } from './types'

const chord = (symbol: string, beats: number): ChartChord => ({
  ...parseChordSymbol(symbol),
  beats,
})
const hand = (
  key: number,
  name: Parameters<typeof note>[0],
  at: number,
  beats: number,
): HandNote => ({
  midi: midi(key),
  spelled: note(name),
  startTick: beatsToTicks(at),
  durationTicks: beatsToTicks(beats),
})
const chart = (...bars: ChartBar[]): Chart => ({
  key: { tonic: note('C'), minor: false },
  meter: '4/4',
  sections: [{ lines: [bars] }],
})
const barOf = (written: Chart, index: number) => written.sections[0]?.lines[0]?.[index]

describe('easyChart', () => {
  it('keeps the tune and each chord’s root', () => {
    const written = chart(
      {
        chords: [chord('Cmaj7', 2), chord('G7/B', 2)],
        beats: 4,
        hands: {
          // A tune over a chord in the right hand: its top line is kept.
          rh: [hand(76, 'E', 0, 2), hand(60, 'C', 0, 2), hand(74, 'D', 2, 2)],
          lh: [hand(36, 'C', 0, 4)],
        },
      },
      { chords: [chord('Am', 4)], beats: 4 },
    )
    const easy = easyChart(written)
    const first = barOf(easy, 0)
    expect(first?.hands?.rh?.map((each) => each.midi)).toEqual([76, 74])
    // Each chord's root under it, as long as the chord, its plain triad named.
    expect(first?.hands?.lh).toEqual([
      { midi: 48, spelled: note('C'), startTick: 0, durationTicks: beatsToTicks(2) },
      { midi: 55, spelled: note('G'), startTick: beatsToTicks(2), durationTicks: beatsToTicks(2) },
    ])
    expect(first?.chords.map((each) => each.quality)).toEqual(['maj', 'maj'])
    // A bar with no tune written: the right hand rests, the single staves carry the tune.
    const second = barOf(easy, 1)
    expect(second?.hands?.rh).toEqual([])
    expect(second?.hands?.lh?.map((each) => each.midi)).toEqual([57])
  })

  it('leaves a bar of no chord with its hands silent', () => {
    const easy = easyChart(chart({ chords: [], beats: 4 }))
    expect(barOf(easy, 0)?.hands).toEqual({ rh: [], lh: [] })
  })
})
