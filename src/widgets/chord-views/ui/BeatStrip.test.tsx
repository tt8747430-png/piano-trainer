import { fireEvent, render, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { TICKS_PER_BEAT } from '@/shared/lib/music'
import { BUILT_IN_PATTERNS } from '@/entities/pattern'
import type { ChartPiece } from '@/entities/piece'
import { arrangePiece, ownChoice, playedBeatCells, type PlayedBeat } from '@/features/practice'
import { stubResizeObserver } from '@/shared/test/resize'
import { BeatStrip } from './BeatStrip'

const B = TICKS_PER_BEAT

/** Two lines of the chart, four bars of 4/4 each: thirty-two beats in all. */
const piece: ChartPiece = {
  id: 'my-1',
  kind: 'song',
  title: 'Morning',
  key: 'C',
  meter: '4/4',
  tempo: 90,
  pattern: 'r1',
  sections: [{ kind: 'verse', lines: ['C G Am F', 'Dm G C C'] }],
}
const performance = arrangePiece(piece, ownChoice(piece), BUILT_IN_PATTERNS, { unfold: true })
const bars = playedBeatCells(performance)

const at = (bar: number, beat: number): PlayedBeat => ({
  bar,
  beat,
  startTick: (bar * 4 + beat) * B,
})

function renderStrip(beat: PlayedBeat) {
  const onBeat = vi.fn()
  const view = render(
    <BeatStrip performance={performance} bars={bars} beat={beat} loop={null} onBeat={onBeat} />,
  )
  const strip = () => view.container.querySelector<HTMLElement>('[data-slot="beat-strip"]')!
  const cells = () =>
    [...strip().querySelectorAll<HTMLElement>('[data-cell]')].map((cell) =>
      Number(cell.dataset.cell),
    )
  const rerender = (next: PlayedBeat) =>
    view.rerender(
      <BeatStrip performance={performance} bars={bars} beat={next} loop={null} onBeat={onBeat} />,
    )
  return { onBeat, strip, cells, rerender }
}

describe('the beat strip, a page at a time (R29, Chordify’s)', () => {
  it('shows the line the beat is in, the beat sounding its black box', () => {
    const { strip, cells } = renderStrip(at(1, 2))
    expect(cells()).toEqual([...Array(16).keys()])
    expect(strip().querySelector('[data-sounding]')).toHaveAttribute('data-cell', '6')
  })

  it('moves the box a beat at a time, the strip still', () => {
    const { strip, cells, rerender } = renderStrip(at(0, 0))
    rerender(at(0, 1))
    expect(strip().querySelector('[data-sounding]')).toHaveAttribute('data-cell', '1')
    expect(cells()[0]).toBe(0)
  })

  it('turns to the next line once the box reaches it', () => {
    const { strip, cells, rerender } = renderStrip(at(3, 3))
    expect(strip()).toHaveAttribute('data-page', '0')
    rerender(at(4, 0))
    expect(strip()).toHaveAttribute('data-page', '1')
    expect(cells()).toEqual([...Array(16).keys()].map((beat) => beat + 16))
  })

  it('never turns for a loop inside a page', () => {
    const { strip, rerender } = renderStrip(at(2, 3))
    rerender(at(1, 0))
    expect(strip()).toHaveAttribute('data-page', '0')
  })

  it('splits a line into pages of whole bars where the room is short', async () => {
    // Room for ten beats of 40px: two bars a page.
    stubResizeObserver({ width: 400 })
    vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(40)
    const { cells } = renderStrip(at(2, 0))
    await waitFor(() => expect(cells()).toEqual([8, 9, 10, 11, 12, 13, 14, 15]))
  })

  it('takes the cursor to a beat tapped', () => {
    const { strip, onBeat } = renderStrip(at(0, 0))
    fireEvent.click(strip().querySelector('[data-cell="5"]')!)
    expect(onBeat).toHaveBeenCalledWith(5 * B)
  })
})
