// @vitest-environment jsdom
import { describe, expect, it, onTestFinished, vi } from 'vitest'
import { midi, note, TICKS_PER_BEAT, type Finger, type Key } from '@/shared/lib/music'
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
  ...extra,
})

/** Two bars: a chord with fingers, a triplet beat, a tie across the barline, a held bass under moving notes. */
const score = notate({
  key: { tonic: note('G'), minor: false },
  meter: '4/4',
  bars: [
    { startTick: 0, beats: 4 },
    { startTick: 96, beats: 4 },
  ],
  notes: [
    n(60, 'C', 0, 24, { finger: 1 }),
    n(64, 'E', 0, 24, { finger: 3 }),
    n(67, 'G', 24, 16),
    n(66, 'F', 40, 8),
    n(67, 'G', 72, 48),
    { ...n(43, 'G', 0, 192), hand: 'lh' },
    { ...n(48, 'C', 0, 24), hand: 'lh' },
  ],
  chords: [
    { startTick: 0, symbol: 'C' },
    { startTick: 96, symbol: 'G' },
  ],
})

describe('engrave', () => {
  it('engraves the tune’s staff over the grand staff, or only the staves asked for', () => {
    const tune = notate({
      key: { tonic: note('C'), minor: false },
      meter: '4/4',
      bars: [{ startTick: 0, beats: 4 }],
      notes: [
        { ...n(72, 'C', 0, 96), hand: 'melody' },
        n(60, 'C', 0, 96),
        { ...n(48, 'C', 0, 96), hand: 'lh' },
      ],
      chords: [],
      melodyStaff: true,
    })
    const host = document.body.appendChild(document.createElement('div'))
    onTestFinished(() => host.remove())
    const all = engrave(tune, host, { scale: 1, fingers: false, names: false })
    expect(Object.keys(all.staves)).toEqual(['melody', 'treble', 'bass'])
    expect(all.staves.melody?.top).toBeLessThan(all.staves.treble?.top ?? 0)
    expect(all.height).toBe(staffHeight(undefined, 3))
    expect(host.querySelectorAll('[data-staff="melody"]')).toHaveLength(1)
    const piano = engrave(tune, host, {
      scale: 1,
      fingers: false,
      names: false,
      staves: ['treble', 'bass'],
    })
    expect(Object.keys(piano.staves)).toEqual(['treble', 'bass'])
    expect(piano.height).toBe(staffHeight(undefined, 2))
  })

  it('engraves a grand staff into the host and lays it out left to right', () => {
    const host = document.createElement('div')
    const layout = engrave(score, host, { scale: 1, fingers: true, names: false })
    expect(host.querySelector('svg')).not.toBeNull()
    expect(layout.measures.map((m) => m.startTick)).toEqual([0, 96])
    expect(layout.measures[1]?.x).toBe(
      (layout.measures[0]?.x ?? 0) + (layout.measures[0]?.width ?? 0),
    )
    const ticks = layout.onsets.map((onset) => onset.tick)
    expect(ticks).toEqual([...ticks].sort((a, b) => a - b))
    expect(ticks).toEqual(expect.arrayContaining([0, 24, 40, 48, 72, 96]))
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

  it('draws a slur, a hairpin and an 8va line across the notes they span', () => {
    const beat = TICKS_PER_BEAT
    const line = (marked: boolean) =>
      notate({
        key: { tonic: note('C'), minor: false },
        meter: '4/4',
        bars: [{ startTick: 0, beats: 4 }],
        notes: [0, 1, 2, 3].map((k) =>
          n(72, 'C', k * beat, beat, {
            ...(marked
              ? {
                  marks: {
                    octave: '8va' as const,
                    ...(k === 0 ? { slurStart: true as const, hairpin: 'cresc' as const } : {}),
                    ...(k === 3 ? { slurEnd: true as const, dynamic: 'f' as const } : {}),
                  },
                }
              : {}),
          }),
        ),
        chords: [],
      })
    const options = { scale: 1, fingers: false, names: false }
    const plainHost = document.createElement('div')
    const markedHost = document.createElement('div')
    engrave(line(false), plainHost, options)
    engrave(line(true), markedHost, options)
    expect(markedHost.textContent).toContain('va')
    expect(markedHost.textContent).toContain('f')
    expect(markedHost.querySelectorAll('path').length).toBeGreaterThan(
      plainHost.querySelectorAll('path').length + 1,
    )
  })

  it('prints a new key signature, cancelling the old, where a bar changes key', () => {
    const bar = 4 * TICKS_PER_BEAT
    const twoBars = (key?: Key) =>
      notate({
        key: { tonic: note('C'), minor: false },
        meter: '4/4',
        bars: [
          { startTick: 0, beats: 4 },
          { startTick: bar, beats: 4, ...(key ? { key } : {}) },
        ],
        notes: [n(60, 'C', 0, bar), n(60, 'C', bar, bar)],
        chords: [],
      })
    const options = { scale: 1, fingers: false, names: false }
    const plain = engrave(twoBars(), document.createElement('div'), options)
    const changing = engrave(
      twoBars({ tonic: note('D', -1), minor: false }),
      document.createElement('div'),
      options,
    )
    // The signature takes room: the second bar's notes begin further into it.
    const into = (layout: typeof plain) =>
      (layout.measures[1]?.notes ?? 0) - (layout.measures[1]?.x ?? 0)
    expect(into(changing)).toBeGreaterThan(into(plain))
  })

  it('gives a bar with nothing written its own width, its chord symbol over where its notes begin', () => {
    const blank = notate({
      key: { tonic: note('C'), minor: false },
      meter: '4/4',
      bars: [
        { startTick: 0, beats: 4, blank: ['treble', 'bass'] },
        { startTick: 96, beats: 4, blank: ['treble', 'bass'] },
      ],
      notes: [],
      chords: [
        { startTick: 0, symbol: 'C' },
        { startTick: 96, symbol: 'G7' },
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
    expect(xAtTick(layout, 96)).toBeLessThan((second?.x ?? 0) + (second?.width ?? 0) / 2)
    expect(xAtTick(layout, 96)).toBeGreaterThanOrEqual(second?.x ?? 0)
  })

  it('draws one staff alone when asked, as tall as one staff', () => {
    const line = notate({
      key: { tonic: note('C'), minor: false },
      meter: '4/4',
      bars: [{ startTick: 0, beats: 4 }],
      notes: [n(60, 'C', 0, 48), n(64, 'E', 48, 48)],
      chords: [],
    })
    const host = document.createElement('div')
    const layout = engrave(line, host, { scale: 1, fingers: false, names: false, staff: 'treble' })
    expect(host.querySelector('.vf-staff-treble')).not.toBeNull()
    expect(host.querySelector('.vf-staff-bass')).toBeNull()
    expect(layout.height).toBe(staffHeight('treble'))
    expect(layout.staffBottom - layout.staffTop).toBe(40)
    expect(layout.onsets.map((onset) => onset.tick)).toEqual([0, 48])
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
          { startTick: 96, beats: 4 },
        ],
        notes: [n(60, 'C', 0, 96)],
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
      { startTick: 24, symbol: 'C7' },
      { startTick: 48, symbol: 'Fm/A♭' },
      { startTick: 72, symbol: 'B♭m7♭5' },
      { startTick: 96, symbol: 'G7sus4' },
      { startTick: 168, symbol: 'Cmaj7/G' },
    ]
    const crowded = notate({
      key: { tonic: note('C'), minor: false },
      meter: '4/4',
      bars: [
        { startTick: 0, beats: 4 },
        { startTick: 96, beats: 4 },
      ],
      notes: [0, 24, 48, 72, 96, 120, 144, 168].map((tick) => n(60, 'C', tick, 24)),
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
        const barEnd = end[chord.startTick < 96 ? 0 : 1] ?? 0
        const until =
          next && next.startTick < (chord.startTick < 96 ? 96 : 192)
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
          n(key, letter, 0, 96, { hand, ...(finger ? { finger } : {}) }),
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

  it('spreads a line to its share of the width it may fill, its measures widened', () => {
    const host = () => document.createElement('div')
    const natural = engrave(score, host(), { scale: 1, fingers: false, names: false })
    const spread = engrave(score, host(), {
      scale: 1,
      fingers: false,
      names: false,
      fill: natural.width * 1.5,
    })
    expect(spread.width).toBeCloseTo(natural.width * 1.5)
    for (const [i, measure] of spread.measures.entries())
      expect(measure.width).toBeGreaterThan(natural.measures[i]?.width ?? 0)
    // A line wider than the sheet is pressed toward its tightest (ADR 0074), not drawn smaller.
    const pressed = engrave(score, host(), {
      scale: 1,
      fingers: false,
      names: false,
      fill: natural.width * 0.9,
    })
    expect(pressed.width).toBeCloseTo(natural.width * 0.9, 0)
    for (const [i, measure] of pressed.measures.entries())
      expect(measure.width).toBeLessThan(natural.measures[i]?.width ?? 0)
  })

  it('draws an ending’s bracket numbered where it begins, and the repeats’ dots', () => {
    const host = document.createElement('div')
    const repeated = notate({
      key: { tonic: note('C'), minor: false },
      meter: '4/4',
      bars: [
        { startTick: 0, beats: 4, repeatStart: true },
        { startTick: 96, beats: 4, ending: 1, barline: 'repeat' },
        { startTick: 192, beats: 4, ending: 2, barline: 'final' },
      ],
      notes: [],
      chords: [],
    })
    engrave(repeated, host, { scale: 1, fingers: false, names: false })
    const texts = [...host.querySelectorAll('text')].map((text) => text.textContent)
    expect(texts).toContain('1.')
    expect(texts).toContain('2.')
  })

  it('draws a small clef where a hand’s staff changes clef', () => {
    const drawn = (clefs: boolean) => {
      const host = document.createElement('div')
      const music = notate({
        key: { tonic: note('C'), minor: false },
        meter: '4/4',
        bars: [
          { startTick: 0, beats: 4 },
          { startTick: 96, beats: 4, ...(clefs ? { clefs: { lh: 'treble' as const } } : {}) },
        ],
        notes: [{ ...n(64, 'E', 96, 96), hand: 'lh' as const }],
        chords: [],
      })
      engrave(music, host, { scale: 1, fingers: false, names: false })
      return host.querySelectorAll('.vf-clef').length
    }
    expect(drawn(false)).toBe(2)
    expect(drawn(true)).toBe(3)
  })

  it('writes the sign, the coda’s sign, Fine, To Coda and the jump over their bars', () => {
    const host = document.createElement('div')
    const signed = notate({
      key: { tonic: note('C'), minor: false },
      meter: '4/4',
      bars: [
        { startTick: 0, beats: 4, segno: true },
        { startTick: 96, beats: 4, toCoda: true, fine: true },
        { startTick: 192, beats: 4, jump: 'ds-coda' },
        { startTick: 288, beats: 4, coda: true },
      ],
      notes: [],
      chords: [],
    })
    engrave(signed, host, { scale: 1, fingers: false, names: false })
    const texts = [...host.querySelectorAll('text')].map((text) => text.textContent)
    expect(texts).toEqual(expect.arrayContaining(['Fine', 'D.S. al \ue048']))
    expect(texts.some((text) => text?.startsWith('To'))).toBe(true)
  })

  it('writes an expression over its note in italics, and the pedal under the staff', () => {
    const drawn = (pedal: boolean) => {
      const host = document.createElement('div')
      const marked = notate({
        key: { tonic: note('C'), minor: false },
        meter: '4/4',
        bars: [{ startTick: 0, beats: 4 }],
        notes: [
          {
            ...n(60, 'C', 0, 48),
            marks: { expression: 'rit', ...(pedal ? { pedal: 'down' } : {}) },
          },
          { ...n(64, 'E', 48, 48), ...(pedal ? { marks: { pedal: 'up' } } : {}) },
        ],
        chords: [],
      })
      engrave(marked, host, { scale: 1, fingers: false, names: false })
      return [...host.querySelectorAll('text')].map((text) => text.textContent)
    }
    expect(drawn(false)).toContain('rit.')
    // Ped. and its release, two glyphs more.
    expect(drawn(true).length).toBe(drawn(false).length + 2)
  })

  it('draws a line wider than the width it may fill smaller, to fit it', () => {
    const host = () => document.createElement('div')
    const natural = engrave(score, host(), { scale: 1, fingers: false, names: false })
    const fitted = engrave(score, host(), {
      scale: 1,
      fingers: false,
      names: false,
      fill: natural.width * 0.6,
    })
    expect(fitted.width).toBeLessThanOrEqual(natural.width * 0.6 + 0.5)
    expect(fitted.width).toBeGreaterThan(natural.width * 0.5)
    expect(fitted.height).toBeLessThan(natural.height)
  })
})

describe('engraveInSteps', async () => {
  // The test setup engraves at once; these are the steps themselves.
  const { engraveInSteps } = await vi.importActual<typeof import('./engrave')>('./engrave')
  const long = notate({
    key: { tonic: note('C'), minor: false },
    meter: '4/4',
    bars: Array.from({ length: 20 }, (_, i) => ({ startTick: i * 96, beats: 4 })),
    notes: Array.from({ length: 20 }, (_, i) => n(60, 'C', i * 96, 96)),
    chords: [],
  })
  const options = { scale: 1, fingers: false, names: false }
  const hostWith = (old: string) => {
    const host = document.createElement('div')
    const drawing = document.createElement('p')
    drawing.textContent = old
    host.append(drawing)
    document.body.append(host)
    onTestFinished(() => host.remove())
    return host
  }

  it('engraves what engrave does, keeping the old drawing until the new one is whole', async () => {
    const host = hostWith('old')
    const engraving = engraveInSteps(long, host, options, {
      signal: new AbortController().signal,
      budget: 0,
    })
    expect(host).toHaveTextContent('old')
    const layout = await engraving
    expect(host).not.toHaveTextContent('old')
    expect(host.children).toHaveLength(1)
    expect(host.firstElementChild?.tagName.toLowerCase()).toBe('svg')
    expect(layout).toEqual(engrave(long, document.createElement('div'), options))
  })

  it('stops when told, leaving the old drawing as it was', async () => {
    const host = hostWith('old')
    const stopped = new AbortController()
    const engraving = engraveInSteps(long, host, options, { signal: stopped.signal, budget: 0 })
    stopped.abort()
    expect(await engraving).toBeNull()
    expect(host.children).toHaveLength(1)
    expect(host).toHaveTextContent('old')
  })
})
