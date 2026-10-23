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
