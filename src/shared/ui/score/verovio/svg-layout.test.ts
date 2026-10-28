// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { midi, note, TICKS_PER_BEAT } from '@/shared/lib/music'
import { notate, scoreToMei, type TimedNote } from '@/shared/lib/notation'
import { layoutOf } from './svg-layout'
import { engraveMei } from './toolkit'

const B = TICKS_PER_BEAT

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
    { startTick: 4 * B, beats: 4 },
  ],
  notes: [
    n(72, 'rh', 0, 2 * B),
    n(72, 'rh', 2 * B, 2 * B),
    n(72, 'rh', 4 * B, 4 * B),
    n(48, 'lh', 0, 8 * B),
  ],
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

describe('a line’s grace notes, read back', () => {
  it('boxes each grace note’s head apart from its note’s, small, before it', async () => {
    const graced = notate({
      key: { tonic: note('C'), minor: false },
      meter: '4/4',
      bars: [{ startTick: 0, beats: 4 }],
      notes: [
        {
          ...n(72, 'rh', 0, 96),
          marks: { grace: [{ midi: midi(74), spelled: note('D') }] },
        },
      ],
      chords: [],
    })
    const [svg = ''] = await engraveMei(scoreToMei(graced), { width: 600, scale: 1 })
    const host = document.createElement('div')
    host.innerHTML = svg
    const element = host.querySelector('svg')
    if (!element) throw new Error('an SVG')
    const layout = layoutOf(element, graced.measures, graced.staves)
    const [grace] = layout.graces ?? []
    const [head] = (layout.heads ?? []).filter((each) => each.staff === 'treble')
    if (!grace || !head) throw new Error('a grace note and its note')
    expect(grace).toMatchObject({ id: 'g-treble-0-0', staff: 'treble', tick: 0, index: 0 })
    // A grace note's head is drawn smaller, before its note's.
    expect(grace.bottom - grace.top).toBeLessThan(head.bottom - head.top)
    expect(grace.right).toBeLessThanOrEqual(head.left + 1)
    // Its note's heads are its own: the grace note is none of them.
    expect((layout.heads ?? []).map((each) => each.id)).not.toContain('g-treble-0-0')
  }, 20_000)
})

describe('a line engraved by Verovio, read back', () => {
  it('runs the width it is given, its bars side by side, each onset in its bar', async () => {
    const layout = await engraved(600)
    expect(layout.width).toBeCloseTo(600, 0)
    const [first, second] = layout.measures
    if (!first || !second) throw new Error('two bars')
    expect(second.x).toBeCloseTo(first.x + first.width, 0)
    expect(second.x + second.width).toBeLessThanOrEqual(601)
    expect(layout.onsets.map((onset) => onset.tick)).toEqual([0, 2 * B, 4 * B])
    expect(first.notes).toBeGreaterThan(first.x)
    expect(layout.onsets[1]?.x).toBeGreaterThan(layout.onsets[0]?.x ?? 0)
  }, 20_000)

  it('shares a multi-bar rest’s width among the bars it draws as one, each its part in turn', async () => {
    const rested = notate({
      key: { tonic: note('C'), minor: false },
      meter: '4/4',
      bars: [0, 1, 2, 3].map((i) => ({
        startTick: i * 4 * B,
        beats: 4,
        ...(i === 1 ? { multiRest: 2 } : {}),
      })),
      notes: [n(72, 'rh', 0, 4 * B), n(72, 'rh', 12 * B, 4 * B)],
      chords: [],
    })
    const [svg = ''] = await engraveMei(scoreToMei(rested), { width: 600, scale: 1 })
    const host = document.createElement('div')
    host.innerHTML = svg
    const element = host.querySelector('svg')
    if (!element) throw new Error('an SVG')
    const [, one, two, last] = layoutOf(element, rested.measures, rested.staves).measures
    if (!one || !two || !last) throw new Error('four bars')
    expect(one.width).toBeGreaterThan(0)
    expect(two.width).toBeCloseTo(one.width, 3)
    expect(two.x).toBeCloseTo(one.x + one.width, 3)
    expect(last.x).toBeCloseTo(two.x + two.width, 0)
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

describe('each notehead read back (ADR 0096)', () => {
  const chordScore = notate({
    key: { tonic: note('C'), minor: false },
    meter: '4/4',
    bars: [{ startTick: 0, beats: 4 }],
    notes: [
      n(72, 'rh', 0, 3 * B),
      { ...n(76, 'rh', 0, 3 * B), spelled: note('E') },
      { ...n(79, 'rh', 0, 3 * B), spelled: note('G') },
      { ...n(73, 'rh', 3 * B, B), spelled: note('C', 1) },
      n(48, 'lh', 0, 4 * B),
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
    const sharp = heads.find((head) => head.tick === 3 * B)
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
      notes: [n(72, 'rh', 0, B), n(72, 'rh', 2 * B, 2 * B), n(48, 'lh', 0, 4 * B)],
      chords: [],
    })
    const [svg = ''] = await engraveMei(scoreToMei(rested), { width: 600, scale: 1 })
    const host = document.createElement('div')
    host.innerHTML = svg
    const element = host.querySelector('svg')
    if (!element) throw new Error('an SVG')
    const layout = layoutOf(element, rested.measures, rested.staves)
    const [rest] = layout.rests ?? []
    expect(rest).toMatchObject({ staff: 'treble', tick: B })
    expect((rest?.bottom ?? 0) - (rest?.top ?? 0)).toBeCloseTo(30, 0)
  }, 20_000)
})

describe('a line with words (ADR 0097)', () => {
  const sung = (text: string) => ({ text, hyphen: false, held: 0 })
  const worded = notate({
    key: { tonic: note('C'), minor: false },
    meter: '4/4',
    bars: [{ startTick: 0, beats: 4 }],
    notes: [
      { ...n(72, 'rh', 0, 2 * B), lyrics: [sung('Si'), sung('Stil')] },
      { ...n(74, 'rh', 2 * B, 2 * B), lyrics: [sung('lent'), sung('le')] },
      n(48, 'lh', 0, 4 * B),
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
    expect(layout.onsets.map((onset) => onset.tick)).toEqual([0, 2 * B])
    expect((layout.heads ?? []).filter((head) => head.staff === 'treble')).toHaveLength(2)
    const { treble, bass } = layout.staves
    if (!treble || !bass) throw new Error('the grand staff')
    // Verovio's units are 18 to our 1 at this scale: the staff lines stand at 1260 and 2340.
    const [first = 0, second = 0] = baselines(element)
    expect(first / 18).toBeGreaterThan(treble.bottom)
    expect(second).toBeGreaterThan(first)
    expect(second / 18).toBeLessThan(bass.top)
  }, 20_000)

  it('reads each syllable printed: its staff, its note’s tick, its verse and its box (ADR 0096)', async () => {
    const { layout } = await read(worded)
    const syllables = layout.syllables ?? []
    expect(syllables.map(({ staff, tick, verse }) => [staff, tick, verse])).toEqual([
      ['treble', 0, 0],
      ['treble', 0, 1],
      ['treble', 2 * B, 0],
      ['treble', 2 * B, 1],
    ])
    const { treble, bass } = layout.staves
    const [si, stil, lent] = syllables
    const head = (layout.heads ?? []).find((each) => each.tick === 2 * B && each.staff === 'treble')
    if (!treble || !bass || !si || !stil || !lent || !head) throw new Error('the words')
    // Under the upper staff, the second verse under the first, over the lower staff.
    expect(si.top).toBeGreaterThan(treble.bottom)
    expect(stil.top).toBeGreaterThanOrEqual(si.bottom - 1)
    expect(stil.bottom).toBeLessThan(bass.top)
    // Under its note, as wide as its letters.
    expect(lent.left).toBeLessThan(head.right)
    expect(lent.right).toBeGreaterThan(head.left)
    expect(lent.right - lent.left).toBeGreaterThan(si.right - si.left)
  }, 20_000)

  it('moves the lower staff down to hold the verses where two staves’ room does not', async () => {
    const many = notate({
      key: { tonic: note('C'), minor: false },
      meter: '4/4',
      bars: [{ startTick: 0, beats: 4 }],
      notes: [
        {
          ...n(72, 'rh', 0, 4 * B),
          lyrics: [sung('one'), sung('two'), sung('three'), sung('four')],
        },
        n(48, 'lh', 0, 4 * B),
      ],
      chords: [],
    })
    const { layout: wide } = await read(many)
    const { layout: plain } = await read(
      notate({
        key: { tonic: note('C'), minor: false },
        meter: '4/4',
        bars: [{ startTick: 0, beats: 4 }],
        notes: [n(72, 'rh', 0, 4 * B), n(48, 'lh', 0, 4 * B)],
        chords: [],
      }),
    )
    const gap = (staves: typeof wide.staves) =>
      (staves.bass?.top ?? 0) - (staves.treble?.bottom ?? 0)
    expect(gap(wide.staves)).toBeGreaterThan(gap(plain.staves))
    expect(wide.height).toBeGreaterThan(plain.height)
  }, 20_000)
})

describe('the staves’ names at a first line’s head (ADR 0114, 0097)', () => {
  const tuned = notate({
    key: { tonic: note('C'), minor: false },
    meter: '4/4',
    bars: [{ startTick: 0, beats: 4 }],
    notes: [
      { ...n(76, 'staff', 0, 4 * B), staff: 0 },
      { ...n(43, 'staff', 0, 4 * B), staff: 1 },
      n(72, 'rh', 0, 4 * B),
      n(48, 'lh', 0, 4 * B),
    ],
    chords: [],
    staves: [{ clef: 'treble' }, { clef: 'bass' }],
  })

  async function read(labels: Parameters<typeof scoreToMei>[1]) {
    const [svg = ''] = await engraveMei(scoreToMei(tuned, labels), { width: 600, scale: 1 })
    const host = document.createElement('div')
    host.innerHTML = svg
    const element = host.querySelector('svg')
    if (!element) throw new Error('an SVG')
    return layoutOf(element, tuned.measures, tuned.staves)
  }

  it('reads each name with the staves it names, left of them, and the line indented to hold it', async () => {
    const plain = await read({})
    const named = await read({
      labels: {
        staff0: { text: 'Voice' },
        staff1: { text: 'Staff 2', placeholder: true },
        piano: { text: 'Piano' },
      },
    })
    expect(plain.labels).toEqual([])
    const [first] = named.measures
    const { staff0, staff1, treble, bass } = named.staves
    if (!first || !staff0 || !staff1 || !treble || !bass) throw new Error('the line')
    expect(first.x).toBeGreaterThan((plain.measures[0]?.x ?? 0) + 50)
    const labels = [...(named.labels ?? [])].sort((a, b) => a.top - b.top)
    expect(labels.map((label) => label.staves)).toEqual(['staff0', 'staff1', 'piano'])
    const [voice, second, piano] = labels
    if (!voice || !second || !piano) throw new Error('three names')
    for (const label of labels) {
      expect(label.right).toBeLessThan(first.x)
      expect(label.left).toBeGreaterThanOrEqual(0)
      expect(label.right - label.left).toBeGreaterThan(30)
    }
    // Beside its staff; the piano's between its two.
    expect(voice.bottom).toBeGreaterThan(staff0.top)
    expect(voice.top).toBeLessThan(staff0.bottom)
    expect(second.bottom).toBeGreaterThan(staff1.top)
    expect(second.top).toBeLessThan(staff1.bottom)
    expect(piano.top).toBeGreaterThan(treble.top)
    expect(piano.bottom).toBeLessThan(bass.bottom)
  }, 20_000)
})

describe('the signs printed on a line (ADR 0114)', () => {
  const signed = notate({
    key: { tonic: note('D'), minor: false },
    meter: '4/4',
    bars: [
      { startTick: 0, beats: 4 },
      // A key change, then the left hand's staff in the treble clef.
      { startTick: 4 * B, beats: 4, key: { tonic: note('E', -1), minor: false } },
      {
        startTick: 8 * B,
        beats: 4,
        key: { tonic: note('E', -1), minor: false },
        clefs: { lh: 'treble' },
      },
    ],
    notes: [
      n(74, 'rh', 0, 4 * B),
      n(75, 'rh', 4 * B, 4 * B),
      n(75, 'rh', 8 * B, 4 * B),
      n(50, 'lh', 0, 12 * B),
    ],
    chords: [],
  })

  async function read() {
    // What the next line starts in, printed as a courtesy at this one's end: not one of its signs.
    const next = { key: { tonic: note('G'), minor: false }, time: { count: 4, unit: 4 } } as const
    const [svg = ''] = await engraveMei(scoreToMei(signed, { next }), { width: 800, scale: 1 })
    const host = document.createElement('div')
    host.innerHTML = svg
    const element = host.querySelector('svg')
    if (!element) throw new Error('an SVG')
    return layoutOf(element, signed.measures, signed.staves)
  }

  it('reads each clef, key and time signature with its staff and measure, at a line’s head and where it changes', async () => {
    const layout = await read()
    const signs = (layout.signs ?? []).map(
      ({ kind, staff, measure }) => `${kind} ${staff} ${measure}`,
    )
    expect(signs).toEqual([
      'clef treble 0',
      'key treble 0',
      'time treble 0',
      'clef bass 0',
      'key bass 0',
      'time bass 0',
      'key treble 1',
      'key bass 1',
      'clef bass 2',
    ])
  }, 20_000)

  it('boxes each sign where it is drawn: over its staff, before its measure’s notes, left to right', async () => {
    const layout = await read()
    const at = (kind: string, staff: string, measure: number) => {
      const sign = (layout.signs ?? []).find(
        (each) => each.kind === kind && each.staff === staff && each.measure === measure,
      )
      if (!sign) throw new Error(`no ${kind} on the ${staff} staff in measure ${measure}`)
      return sign
    }
    const [first, second] = layout.measures
    const treble = layout.staves.treble
    if (!first || !second || !treble) throw new Error('the line')
    const clef = at('clef', 'treble', 0)
    const key = at('key', 'treble', 0)
    const time = at('time', 'treble', 0)
    // Side by side, in the order printed, before the first note.
    expect(clef.right).toBeLessThanOrEqual(key.left + 1)
    expect(key.right).toBeLessThanOrEqual(time.left + 1)
    expect(time.right).toBeLessThan(first.notes)
    // A treble clef reaches over and under its staff; two sharps are two accidentals wide.
    expect(clef.top).toBeLessThan(treble.top)
    expect(clef.bottom).toBeGreaterThan(treble.bottom)
    expect(key.right - key.left).toBeGreaterThan(15)
    // The key change in the second measure, before its notes.
    const change = at('key', 'treble', 1)
    expect(change.left).toBeGreaterThanOrEqual(second.x)
    expect(change.right).toBeLessThan(second.notes)
  }, 20_000)
})
