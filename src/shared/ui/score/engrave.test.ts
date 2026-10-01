import { describe, expect, it } from 'vitest'
import { midi, note, type Finger } from '@/shared/lib/music'
import { notate, type TimedNote } from '@/shared/lib/notation'
import { chordSymbolWidth } from './chord-symbols'
import { engrave } from './engrave'
import { xAtTick } from './layout'
import { staffHeight } from './size'

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
    const layout = engrave(score, host, { scale: 1, fingers: true, names: false })
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
    expect(layout.staves.treble?.top).toBe(layout.staffTop)
    expect(layout.staves.bass?.bottom).toBe(layout.staffBottom)
    expect(layout.staves.treble?.bottom).toBeLessThan(layout.staves.bass?.top ?? 0)
  })

  it('prints no time signature at a line that continues in the time before it', () => {
    const opening = engrave(score, document.createElement('div'), {
      scale: 1,
      fingers: false,
      names: false,
    })
    const continuing = engrave(score, document.createElement('div'), {
      scale: 1,
      fingers: false,
      names: false,
      timeBefore: { count: 4, unit: 4 },
    })
    expect(continuing.onsets[0]?.x).toBeLessThan(opening.onsets[0]?.x ?? 0)
    const changed = engrave(score, document.createElement('div'), {
      scale: 1,
      fingers: false,
      names: false,
      timeBefore: { count: 3, unit: 4 },
    })
    expect(changed.onsets[0]?.x).toBe(opening.onsets[0]?.x)
  })

  it('gives a bar with nothing written its own width, its chord symbol over where its notes begin', () => {
    const blank = notate({
      key: { tonic: note('C'), minor: false },
      meter: '4/4',
      bars: [
        { startTick: 0, beats: 4, blank: ['treble', 'bass'] },
        { startTick: 48, beats: 4, blank: ['treble', 'bass'] },
      ],
      notes: [],
      chords: [
        { startTick: 0, symbol: 'C' },
        { startTick: 48, symbol: 'G7' },
      ],
    })
    const layout = engrave(blank, document.createElement('div'), {
      scale: 1,
      fingers: false,
      names: false,
    })
    const [first, second] = layout.measures
    expect(first?.width).toBeLessThan(400)
    expect(second?.width).toBeLessThan(400)
    expect(xAtTick(layout, 48)).toBeLessThan((second?.x ?? 0) + (second?.width ?? 0) / 2)
    expect(xAtTick(layout, 48)).toBeGreaterThanOrEqual(second?.x ?? 0)
  })

  it('draws one staff alone when asked, as tall as one staff', () => {
    const line = notate({
      key: { tonic: note('C'), minor: false },
      meter: '4/4',
      bars: [{ startTick: 0, beats: 4 }],
      notes: [n(60, 'C', 0, 24), n(64, 'E', 24, 24)],
      chords: [],
    })
    const host = document.createElement('div')
    const layout = engrave(line, host, { scale: 1, fingers: false, names: false, staff: 'treble' })
    expect(host.querySelector('.vf-staff-treble')).not.toBeNull()
    expect(host.querySelector('.vf-staff-bass')).toBeNull()
    expect(layout.height).toBe(staffHeight('treble'))
    expect(layout.staffBottom - layout.staffTop).toBe(40)
    expect(layout.onsets.map((onset) => onset.tick)).toEqual([0, 24])
  })

  it('draws the grand staff as tall as the space a lazy staff keeps for it', () => {
    const host = document.createElement('div')
    const layout = engrave(score, host, { scale: 1, fingers: false, names: false })
    expect(layout.height).toBe(staffHeight(undefined))
  })

  it('draws the staves in groups a stylesheet can mute', () => {
    const host = document.createElement('div')
    engrave(score, host, { scale: 1, fingers: false, names: false })
    expect(host.querySelector('.vf-staff-treble')).not.toBeNull()
    expect(host.querySelector('.vf-staff-bass')).not.toBeNull()
    expect(host.querySelector('svg')?.getAttribute('fill')).toBe('currentColor')
  })

  it('scales the layout', () => {
    const one = engrave(score, document.createElement('div'), {
      scale: 1,
      fingers: false,
      names: false,
    })
    const small = engrave(score, document.createElement('div'), {
      scale: 0.5,
      fingers: false,
      names: false,
    })
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
      { scale: 1, fingers: false, names: false },
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
      const layout = engrave(crowded, document.createElement('div'), {
        scale,
        fingers: false,
        names: false,
      })
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

  describe('fingers', () => {
    /** One bar of 4/4 whole notes: each note's midi, letter, finger (or none) and hand. */
    const bar = (notes: readonly [number, 'C' | 'E' | 'G', Finger | null, TimedNote['hand']][]) =>
      notate({
        key: { tonic: note('C'), minor: false },
        meter: '4/4',
        bars: [{ startTick: 0, beats: 4 }],
        notes: notes.map(([key, letter, finger, hand]) =>
          n(key, letter, 0, 48, { hand, ...(finger ? { finger } : {}) }),
        ),
        chords: [],
      })
    /** Each finger number drawn, with where its text stands. */
    const fingersIn = (host: HTMLElement) =>
      [...host.querySelectorAll('text')]
        .filter((text) => /^[1-5]$/.test(text.textContent ?? ''))
        .map((text) => ({
          finger: Number(text.textContent),
          x: Number(text.getAttribute('x')),
          y: Number(text.getAttribute('y')),
        }))
    const column = (drawn: ReturnType<typeof fingersIn>) =>
      Object.fromEntries(drawn.map(({ finger, y }) => [finger, y]))

    it('stack a chord’s fingers in one column over it, the top note’s on top', () => {
      const host = document.createElement('div')
      engrave(
        bar([
          [60, 'C', 1, 'rh'],
          [64, 'E', 3, 'rh'],
          [67, 'G', 5, 'rh'],
        ]),
        host,
        { scale: 1, fingers: true, names: false },
      )
      const drawn = fingersIn(host)
      expect(new Set(drawn.map(({ x }) => x)).size).toBe(1)
      // G4's head is at 70: its finger stands 7 above it, each lower note's a staff space higher.
      expect(column(drawn)).toEqual({ 1: 63, 3: 53, 5: 43 })
    })

    it('stack a left hand’s fingers under its lowest note, and give them room below the staff', () => {
      const host = document.createElement('div')
      const layout = engrave(
        bar([
          [36, 'C', 5, 'lh'],
          [48, 'C', 1, 'lh'],
        ]),
        host,
        { scale: 1, fingers: true, names: false },
      )
      const drawn = fingersIn(host)
      expect(new Set(drawn.map(({ x }) => x)).size).toBe(1)
      // C2's head is at 190: the top note's finger 15 below it, the next a staff space lower.
      expect(column(drawn)).toEqual({ 1: 205, 5: 215 })
      expect(layout.height).toBeGreaterThanOrEqual(217)
    })

    it('move the staves down so a high chord’s fingers stay on the page', () => {
      const host = document.createElement('div')
      const layout = engrave(
        bar([
          [84, 'C', 1, 'rh'],
          [88, 'E', 3, 'rh'],
          [91, 'G', 5, 'rh'],
        ]),
        host,
        { scale: 1, fingers: true, names: false },
      )
      const drawn = fingersIn(host)
      expect(Math.min(...drawn.map(({ y }) => y))).toBeGreaterThanOrEqual(9)
      expect(layout.staffTop).toBeGreaterThan(40)
      expect(Math.max(...drawn.map(({ y }) => y))).toBeLessThan(layout.staffTop)
    })

    it('put a lower voice’s fingers under it, clear of the tune above', () => {
      const host = document.createElement('div')
      engrave(
        bar([
          [72, 'C', null, 'melody'],
          [60, 'C', 1, 'rh'],
          [64, 'E', 3, 'rh'],
          [67, 'G', 5, 'rh'],
        ]),
        host,
        { scale: 1, fingers: true, names: false },
      )
      // C4's head is at 90: the chord's top finger 15 below it, the rest a staff space lower each.
      expect(column(fingersIn(host))).toEqual({ 5: 105, 3: 115, 1: 125 })
    })
  })
})
