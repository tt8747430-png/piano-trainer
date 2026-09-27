import { describe, expect, it } from 'vitest'
import { midi, note } from '@/shared/lib/music'
import { notate, type TimedNote } from '@/shared/lib/notation'
import { chordSymbolWidth } from './chord-symbols'
import { engrave } from './engrave'
import { xAtTick } from './layout'

const n = (
  key: number,
  letter: 'C' | 'E' | 'G' | 'F',
  start: number,
  length: number,
  extra: Partial<TimedNote> = {},
): TimedNote => ({
  midi: midi(key),
  spelled: note(letter, letter === 'F' ? 1 : 0),
  hand: 'rh',
  startTick: start,
  durationTicks: length,
  roll: 0,
  ...extra,
})

/** Two bars: a rolled chord with fingers, a triplet beat, a tie across the barline, a held bass under moving notes. */
const score = notate({
  key: { tonic: note('G'), minor: false },
  meter: '4/4',
  bars: [
    { startTick: 0, beats: 4 },
    { startTick: 48, beats: 4 },
  ],
  notes: [
    n(60, 'C', 0, 12, { finger: 1 }),
    n(64, 'E', 0, 12, { finger: 3, roll: 1 }),
    n(67, 'G', 12, 8),
    n(66, 'F', 20, 4),
    n(67, 'G', 36, 24),
    { ...n(43, 'G', 0, 96), hand: 'lh' },
    { ...n(48, 'C', 0, 12), hand: 'lh' },
  ],
  chords: [
    { startTick: 0, symbol: 'C' },
    { startTick: 48, symbol: 'G' },
  ],
})

describe('engrave', () => {
  it('engraves a grand staff into the host and lays it out left to right', () => {
    const host = document.createElement('div')
    const layout = engrave(score, host, { scale: 1, fingers: true })
    expect(host.querySelector('svg')).not.toBeNull()
    expect(layout.measures.map((m) => m.startTick)).toEqual([0, 48])
    expect(layout.measures[1]?.x).toBe(
      (layout.measures[0]?.x ?? 0) + (layout.measures[0]?.width ?? 0),
    )
    const ticks = layout.onsets.map((onset) => onset.tick)
    expect(ticks).toEqual([...ticks].sort((a, b) => a - b))
    expect(ticks).toEqual(expect.arrayContaining([0, 12, 20, 24, 36, 48]))
    const xs = layout.onsets.map((onset) => onset.x)
    expect(xs).toEqual([...xs].sort((a, b) => a - b))
    expect(layout.staffTop).toBeLessThan(layout.staffBottom)
  })

  it('draws the staves in groups a stylesheet can mute', () => {
    const host = document.createElement('div')
    engrave(score, host, { scale: 1, fingers: false })
    expect(host.querySelector('.vf-staff-treble')).not.toBeNull()
    expect(host.querySelector('.vf-staff-bass')).not.toBeNull()
    expect(host.querySelector('svg')?.getAttribute('fill')).toBe('currentColor')
  })

  it('scales the layout', () => {
    const one = engrave(score, document.createElement('div'), { scale: 1, fingers: false })
    const small = engrave(score, document.createElement('div'), { scale: 0.5, fingers: false })
    expect(small.width).toBeCloseTo(one.width / 2)
    expect(small.onsets[1]?.x).toBeCloseTo((one.onsets[1]?.x ?? 0) / 2)
  })

  it('marks no onset in a bar of rests, whose rest sits in its middle', () => {
    const layout = engrave(
      notate({
        key: { tonic: note('C'), minor: false },
        meter: '4/4',
        bars: [
          { startTick: 0, beats: 4 },
          { startTick: 48, beats: 4 },
        ],
        notes: [n(60, 'C', 0, 48)],
        chords: [],
      }),
      document.createElement('div'),
      { scale: 1, fingers: false },
    )
    expect(layout.onsets.map((onset) => onset.tick)).toEqual([0])
  })

  it('gives each chord symbol room before the next one and before its bar ends, at any scale', () => {
    const chords = [
      { startTick: 0, symbol: 'Csus4' },
      { startTick: 12, symbol: 'C7' },
      { startTick: 24, symbol: 'Fm/A♭' },
      { startTick: 36, symbol: 'B♭m7♭5' },
      { startTick: 48, symbol: 'G7sus4' },
      { startTick: 84, symbol: 'Cmaj7/G' },
    ]
    const crowded = notate({
      key: { tonic: note('C'), minor: false },
      meter: '4/4',
      bars: [
        { startTick: 0, beats: 4 },
        { startTick: 48, beats: 4 },
      ],
      notes: [0, 12, 24, 36, 48, 60, 72, 84].map((tick) => n(60, 'C', tick, 12)),
      chords,
    })
    for (const scale of [1, 0.7]) {
      const layout = engrave(crowded, document.createElement('div'), { scale, fingers: false })
      const end = layout.measures.map((measure) => measure.x + measure.width)
      const rooms = chords.map((chord, i) => {
        const next = chords[i + 1]
        const barEnd = end[chord.startTick < 48 ? 0 : 1] ?? 0
        const until =
          next && next.startTick < (chord.startTick < 48 ? 48 : 96)
            ? xAtTick(layout, next.startTick)
            : barEnd
        return until - xAtTick(layout, chord.startTick)
      })
      expect(rooms.map((room, i) => room >= chordSymbolWidth(chords[i]?.symbol ?? ''))).toEqual(
        chords.map(() => true),
      )
    }
  })
})
