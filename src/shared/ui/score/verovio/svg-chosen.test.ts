// @vitest-environment jsdom
import { beforeAll, describe, expect, it } from 'vitest'
import { midi, note, type SpelledNote, TICKS_PER_BEAT } from '@/shared/lib/music'
import { notate, scoreToMei, type TimedNote } from '@/shared/lib/notation'
import { chosenParts } from './svg-chosen'
import { numbers } from './svg-glyphs'
import { engraveMei } from './toolkit'

const B = TICKS_PER_BEAT

const n = (
  key: number,
  hand: TimedNote['hand'],
  startTick: number,
  durationTicks: number,
  spelled: SpelledNote,
): TimedNote => ({ midi: midi(key), spelled, hand, startTick, durationTicks })

/**
 * Bar 1: a dotted chord of C5 and E5, a C♯6 16th and a D6 32nd (each on ledger lines, flagged),
 * then rests; an A3 under them. Bar 2: a C6 half note, an E2 quarter on a ledger line under the bass.
 */
const score = notate({
  key: { tonic: note('C'), minor: false },
  meter: '4/4',
  bars: [
    { startTick: 0, beats: 4 },
    { startTick: 4 * B, beats: 4 },
  ],
  notes: [
    n(72, 'rh', 0, 1.5 * B, note('C')),
    n(76, 'rh', 0, 1.5 * B, note('E')),
    n(85, 'rh', 1.5 * B, 0.5 * B, note('C', 1)),
    n(86, 'rh', 2 * B, 0.25 * B, note('D')),
    n(57, 'lh', 0, 4 * B, note('A')),
    n(84, 'rh', 4 * B, 2 * B, note('C')),
    n(40, 'lh', 4 * B, B, note('E')),
  ],
  chords: [],
})

let svg: SVGSVGElement

beforeAll(async () => {
  const [drawn = ''] = await engraveMei(scoreToMei(score), { width: 600, scale: 1 })
  const host = document.createElement('div')
  host.innerHTML = drawn
  const element = host.querySelector('svg')
  if (!element) throw new Error('an SVG')
  svg = element
}, 20_000)

const ids = (parts: readonly Element[]) => parts.map((part) => part.id).filter(Boolean)
/** The ledger lines among the parts, by their height on the page. */
const ledgers = (parts: readonly Element[]) =>
  parts
    .filter((part) => part.parentElement?.classList.contains('ledgerLines'))
    .map((part) => numbers(part.getAttribute('d'))[1])
    .sort((a = 0, b = 0) => a - b)

describe('the parts of an engraving that draw what is chosen (ADR 0096)', () => {
  it('colours a note whole, its stem, flag and sharp inside it, and its ledger lines out to it', () => {
    const parts = chosenParts(svg, { staves: ['treble'], from: 1.5 * B, to: 1.5 * B + 1 }, null)
    expect(ids(parts)).toEqual(['n-treble-7560-0'])
    const note = svg.querySelector('#n-treble-7560-0')
    expect(note?.querySelector('g.stem g.flag')).not.toBeNull()
    expect(note?.querySelector('g.accid')).not.toBeNull()
    // C♯6: the A5 and C6 lines over the staff, not the D6's beside them.
    expect(ledgers(parts)).toHaveLength(2)
  })

  it('colours a chord whole with its stem and dots; one key of it alone, its head and its dot', () => {
    expect(ids(chosenParts(svg, { staves: ['treble'], from: 0, to: 1 }, null))).toEqual([
      'n-treble-0-0',
      'n-treble-0-1',
      'c-treble-0',
    ])
    const one = chosenParts(svg, { staves: ['treble'], from: 0, to: 1 }, new Set(['n-treble-0-1']))
    expect(ids(one)).toEqual(['n-treble-0-1'])
    const dots = one.filter((part) => part.tagName === 'ellipse')
    expect(dots).toHaveLength(1)
    // E5's dot, the higher of the two: nearer the top of the page.
    const [high, low] = [...(svg.querySelectorAll('#c-treble-0 > g.dots ellipse') ?? [])]
      .map((dot) => Number(dot.getAttribute('cy')))
      .sort((a, b) => a - b)
    expect(Number(dots[0]?.getAttribute('cy'))).toBe(high)
    expect(low).toBeGreaterThan(high ?? 0)
  })

  it('colours the rests chosen, never with one key of a chord', () => {
    expect(ids(chosenParts(svg, { staves: ['treble'], from: 2.25 * B, to: 4 * B }, null))).toEqual([
      'r-treble-11340',
      'r-treble-15120',
    ])
    expect(
      ids(chosenParts(svg, { staves: ['treble'], from: 2.25 * B, to: 4 * B }, new Set())),
    ).toEqual([])
  })

  it('colours every staff’s notes where no staff is said, a ledger line under the bass too', () => {
    const parts = chosenParts(svg, { from: 4 * B, to: 4 * B + 1 }, null)
    expect(ids(parts)).toEqual(['n-treble-20160-0', 'n-bass-20160-0'])
    // C6's two over the treble, E2's one under the bass.
    expect(ledgers(parts)).toHaveLength(3)
  })
})
