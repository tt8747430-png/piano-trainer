import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { TICKS_PER_BEAT } from '@/shared/lib/music'
import { BUILT_IN_PATTERNS } from '@/entities/pattern'
import type { ChartPiece } from '@/entities/piece'
import { arrangePiece, ownChoice, playedBeatCells, type PlayedBeat } from '@/features/practice'
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

describe('the beat strip, every beat in one row (ADR 0108, the Diagrams board)', () => {
  it('draws every beat as played in one row, the beat sounding filled', () => {
    const { strip, cells } = renderStrip(at(1, 2))
    expect(cells()).toEqual([...Array(32).keys()])
    expect(strip().querySelector('[data-sounding]')).toHaveAttribute('data-cell', '6')
  })

  it('moves the box a beat at a time, the row the same', () => {
    const { strip, cells, rerender } = renderStrip(at(0, 0))
    rerender(at(0, 1))
    expect(strip().querySelector('[data-sounding]')).toHaveAttribute('data-cell', '1')
    rerender(at(4, 0))
    expect(strip().querySelector('[data-sounding]')).toHaveAttribute('data-cell', '16')
    expect(cells()).toEqual([...Array(32).keys()])
  })

  it('is a picture of where the music is, hidden from a screen reader, its beats out of the tab order', () => {
    const { strip } = renderStrip(at(0, 0))
    expect(strip()).toHaveAttribute('aria-hidden', 'true')
    expect(strip().querySelector('[data-cell="0"]')).toHaveAttribute('tabindex', '-1')
  })

  it('takes the cursor to a beat tapped', () => {
    const { strip, onBeat } = renderStrip(at(0, 0))
    fireEvent.click(strip().querySelector('[data-cell="5"]')!)
    expect(onBeat).toHaveBeenCalledWith(5 * B)
  })
})
