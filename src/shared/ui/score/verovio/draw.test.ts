// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest'
import { midi, note } from '@/shared/lib/music'
import { notate, type TimedNote } from '@/shared/lib/notation'
import { drawScore, type DrawOptions } from './draw'

/** Two bars of eighths in both hands under the staves' names: a line of some width. */
const eighths = (hand: TimedNote['hand'], keys: readonly number[]): TimedNote[] =>
  Array.from({ length: 16 }, (_, index) => ({
    midi: midi(keys[index % keys.length] ?? 60),
    spelled: note('C'),
    hand,
    startTick: index * 24,
    durationTicks: 24,
  }))

const score = notate({
  key: { tonic: note('G'), minor: false },
  meter: '4/4',
  bars: [
    { startTick: 0, beats: 4 },
    { startTick: 96, beats: 4 },
  ],
  notes: [...eighths('rh', [71, 74, 79, 74]), ...eighths('lh', [43, 50, 55, 50])],
  chords: [],
})

const options: DrawOptions = {
  scale: 0.62,
  fingers: false,
  names: false,
  staves: score.staves,
  labels: { piano: { text: 'Piano' } },
}

async function draw(fill: number | undefined) {
  const host = document.createElement('div')
  const layout = await drawScore(score, host, { ...options, fill }, new AbortController().signal)
  if (!layout) throw new Error('a layout')
  return { layout, systems: host.querySelectorAll('g.system').length }
}

describe('drawScore', () => {
  it('draws a line wider than its room smaller, never broken in two', async () => {
    const natural = await draw(undefined)
    for (const short of [2, 6, 12, 40]) {
      const fill = natural.layout.width - short
      const { layout, systems } = await draw(fill)
      expect(systems, `${short} px short`).toBe(1)
      expect(layout.width).toBeLessThanOrEqual(fill + 1)
    }
  }, 60_000)

  it('lays out a justified line with no warning from Verovio, its break encoded (ADR 0114)', async () => {
    const said: unknown[] = []
    const heard = (...args: unknown[]) => void said.push(args.join(' '))
    for (const method of ['log', 'warn', 'error', 'info'] as const)
      vi.spyOn(console, method).mockImplementation(heard)
    const natural = await draw(undefined)
    await draw(natural.layout.width + 40)
    expect(said.filter((line) => String(line).includes('Warning'))).toEqual([])
  }, 60_000)
})
