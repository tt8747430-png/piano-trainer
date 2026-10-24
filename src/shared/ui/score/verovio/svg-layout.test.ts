// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { midi, note } from '@/shared/lib/music'
import { notate, scoreToMei, type TimedNote } from '@/shared/lib/notation'
import { layoutOf } from './svg-layout'
import { engraveMei } from './toolkit'

const n = (
  key: number,
  hand: TimedNote['hand'],
  startTick: number,
  durationTicks: number,
): TimedNote => ({
  midi: midi(key),
  spelled: note('C'),
  hand,
  startTick,
  durationTicks,
})

const score = notate({
  key: { tonic: note('C'), minor: false },
  meter: '4/4',
  bars: [
    { startTick: 0, beats: 4 },
    { startTick: 96, beats: 4 },
  ],
  notes: [n(72, 'rh', 0, 48), n(72, 'rh', 48, 48), n(72, 'rh', 96, 96), n(48, 'lh', 0, 192)],
  chords: [],
})

async function engraved(width: number, scale = 1) {
  const [svg = ''] = await engraveMei(scoreToMei(score), { width, scale })
  const host = document.createElement('div')
  host.innerHTML = svg
  const element = host.querySelector('svg')
  if (!element) throw new Error('an SVG')
  return layoutOf(element, score.measures, score.staves)
}

describe('a line engraved by Verovio, read back', () => {
  it('runs the width it is given, its bars side by side, each onset in its bar', async () => {
    const layout = await engraved(600)
    expect(layout.width).toBeCloseTo(600, 0)
    const [first, second] = layout.measures
    if (!first || !second) throw new Error('two bars')
    expect(second.x).toBeCloseTo(first.x + first.width, 0)
    expect(second.x + second.width).toBeLessThanOrEqual(601)
    expect(layout.onsets.map((onset) => onset.tick)).toEqual([0, 48, 96])
    expect(first.notes).toBeGreaterThan(first.x)
    expect(layout.onsets[1]?.x).toBeGreaterThan(layout.onsets[0]?.x ?? 0)
  }, 20_000)

  it('places the staves top down, a staff space 10 px at full size', async () => {
    const layout = await engraved(600)
    const { treble, bass } = layout.staves
    if (!treble || !bass) throw new Error('the grand staff')
    expect(Math.abs(treble.bottom - treble.top - 40)).toBeLessThan(1)
    expect(bass.top).toBeGreaterThan(treble.bottom)
    const smaller = await engraved(600, 0.5)
    expect((smaller.staves.treble?.bottom ?? 0) - (smaller.staves.treble?.top ?? 0)).toBeCloseTo(
      20,
      0,
    )
  }, 20_000)
})

describe('each notehead read back (ADR 0088)', () => {
  const chordScore = notate({
    key: { tonic: note('C'), minor: false },
    meter: '4/4',
    bars: [{ startTick: 0, beats: 4 }],
    notes: [
      n(72, 'rh', 0, 72),
      { ...n(76, 'rh', 0, 72), spelled: note('E') },
      { ...n(79, 'rh', 0, 72), spelled: note('G') },
      { ...n(73, 'rh', 72, 24), spelled: note('C', 1) },
      n(48, 'lh', 0, 96),
    ],
    chords: [],
  })

  async function read() {
    const [svg = ''] = await engraveMei(scoreToMei(chordScore), { width: 600, scale: 1 })
    const host = document.createElement('div')
    host.innerHTML = svg
    const element = host.querySelector('svg')
    if (!element) throw new Error('an SVG')
    return layoutOf(element, chordScore.measures, chordScore.staves)
  }

  it('boxes each head of a chord apart, a staff space high, by its staff, tick and place', async () => {
    const layout = await read()
    const chord = (layout.heads ?? []).filter((head) => head.staff === 'treble' && head.tick === 0)
    expect(chord.map((head) => head.index)).toEqual([0, 1, 2])
    expect(chord.map((head) => head.id)).toEqual(['n-treble-0-0', 'n-treble-0-1', 'n-treble-0-2'])
    for (const head of chord) expect(head.bottom - head.top).toBeCloseTo(10, 0)
    // Up the staff as the chord goes up.
    const [c, e, g] = chord
    expect(g?.top).toBeLessThan(e?.top ?? 0)
    expect(e?.top).toBeLessThan(c?.top ?? 0)
    const bass = (layout.heads ?? []).find((head) => head.staff === 'bass')
    expect(bass?.top).toBeGreaterThan(layout.staves.bass?.top ?? Infinity)
  }, 20_000)

  it('takes in a head’s dot and its accidental, and stands each chord’s column over its stem', async () => {
    const layout = await read()
    const heads = layout.heads ?? []
    const dotted = heads.find((head) => head.tick === 0 && head.staff === 'treble')
    const sharp = heads.find((head) => head.tick === 72)
    const plain = heads.find((head) => head.staff === 'bass')
    if (!dotted || !sharp || !plain) throw new Error('the heads')
    // A whole note alone: its head, 1.69 spaces wide.
    expect(plain.right - plain.left).toBeCloseTo(16.9, 0)
    // The dot after the dotted chord's heads: wider than a black head (11.8 px) alone.
    expect(dotted.right - dotted.left).toBeGreaterThan(15)
    // The sharp before C♯'s head, and taller than the head.
    expect(sharp.bottom - sharp.top).toBeGreaterThan(20)
    expect(sharp.right - sharp.left).toBeGreaterThan(20)
    const column = (layout.columns ?? []).find((each) => each.tick === 0 && each.staff === 'treble')
    if (!column) throw new Error('the chord’s column')
    // The stem reaches past the heads.
    expect(column.bottom - column.top).toBeGreaterThan(40)
  }, 20_000)

  it('boxes each rest drawn, a quarter rest three spaces high', async () => {
    const rested = notate({
      key: { tonic: note('C'), minor: false },
      meter: '4/4',
      bars: [{ startTick: 0, beats: 4 }],
      notes: [n(72, 'rh', 0, 24), n(72, 'rh', 48, 48), n(48, 'lh', 0, 96)],
      chords: [],
    })
    const [svg = ''] = await engraveMei(scoreToMei(rested), { width: 600, scale: 1 })
    const host = document.createElement('div')
    host.innerHTML = svg
    const element = host.querySelector('svg')
    if (!element) throw new Error('an SVG')
    const layout = layoutOf(element, rested.measures, rested.staves)
    const [rest] = layout.rests ?? []
    expect(rest).toMatchObject({ staff: 'treble', tick: 24 })
    expect((rest?.bottom ?? 0) - (rest?.top ?? 0)).toBeCloseTo(30, 0)
  }, 20_000)
})

describe('a line with words (ADR 0093)', () => {
  const sung = (text: string) => ({ text, hyphen: false, melisma: false })
  const worded = notate({
    key: { tonic: note('C'), minor: false },
    meter: '4/4',
    bars: [{ startTick: 0, beats: 4 }],
    notes: [
      { ...n(72, 'rh', 0, 48), lyrics: [sung('Si'), sung('Stil')] },
      { ...n(74, 'rh', 48, 48), lyrics: [sung('lent'), sung('le')] },
      n(48, 'lh', 0, 96),
    ],
    chords: [],
  })
  const read = async (score: typeof worded) => {
    const [svg = ''] = await engraveMei(scoreToMei(score), { width: 600, scale: 1 })
    const host = document.createElement('div')
    host.innerHTML = svg
    const element = host.querySelector('svg')
    if (!element) throw new Error('an SVG')
    return { element, layout: layoutOf(element, score.measures, score.staves) }
  }

  /** Each syllable's baseline in Verovio's units, verse by verse at the first note. */
  const baselines = (element: SVGSVGElement) =>
    [...element.querySelectorAll('.verse text')].map((text) => Number(text.getAttribute('y')))

  it('prints the verses between the staves, under the upper one, and reads the heads as before', async () => {
    const { element, layout } = await read(worded)
    const syllables = [...element.querySelectorAll('.syl')].map((syl) => syl.textContent?.trim())
    expect(syllables).toEqual(['Si', 'Stil', 'lent', 'le'])
    expect(layout.onsets.map((onset) => onset.tick)).toEqual([0, 48])
    expect((layout.heads ?? []).filter((head) => head.staff === 'treble')).toHaveLength(2)
    const { treble, bass } = layout.staves
    if (!treble || !bass) throw new Error('the grand staff')
    // Verovio's units are 18 to our 1 at this scale: the staff lines stand at 1260 and 2340.
    const [first = 0, second = 0] = baselines(element)
    expect(first / 18).toBeGreaterThan(treble.bottom)
    expect(second).toBeGreaterThan(first)
    expect(second / 18).toBeLessThan(bass.top)
  }, 20_000)

  it('moves the lower staff down to hold the verses where two staves’ room does not', async () => {
    const many = notate({
      key: { tonic: note('C'), minor: false },
      meter: '4/4',
      bars: [{ startTick: 0, beats: 4 }],
      notes: [
        { ...n(72, 'rh', 0, 96), lyrics: [sung('one'), sung('two'), sung('three'), sung('four')] },
        n(48, 'lh', 0, 96),
      ],
      chords: [],
    })
    const { layout: wide } = await read(many)
    const { layout: plain } = await read(
      notate({
        key: { tonic: note('C'), minor: false },
        meter: '4/4',
        bars: [{ startTick: 0, beats: 4 }],
        notes: [n(72, 'rh', 0, 96), n(48, 'lh', 0, 96)],
        chords: [],
      }),
    )
    const gap = (staves: typeof wide.staves) =>
      (staves.bass?.top ?? 0) - (staves.treble?.bottom ?? 0)
    expect(gap(wide.staves)).toBeGreaterThan(gap(plain.staves))
    expect(wide.height).toBeGreaterThan(plain.height)
  }, 20_000)
})
