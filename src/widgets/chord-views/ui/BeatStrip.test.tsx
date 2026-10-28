import { fireEvent, render, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { TICKS_PER_BEAT } from '@/shared/lib/music'
import { BUILT_IN_PATTERNS } from '@/entities/pattern'
import type { ChartPiece } from '@/entities/piece'
import { arrangePiece, ownChoice, playedBeatCells } from '@/features/practice'
import { BeatStrip } from './BeatStrip'

const B = TICKS_PER_BEAT

/** C, G, Am and F, a bar each of 4/4: sixteen beats along the strip. */
const piece: ChartPiece = {
  id: 'my-1',
  kind: 'song',
  title: 'Morning',
  key: 'C',
  meter: '4/4',
  tempo: 90,
  pattern: 'r1',
  sections: [{ kind: 'verse', lines: ['C G Am F'] }],
}
const performance = arrangePiece(piece, ownChoice(piece), BUILT_IN_PATTERNS, { unfold: true })
const bars = playedBeatCells(performance)

/**
 * Under reduced motion the strip settles at once, so a test reads where it came to rest. jsdom lays
 * nothing out: each beat is 50px wide, side by side, in a frame of 300px, its mark at 100px.
 */
beforeEach(() => {
  vi.stubGlobal('matchMedia', (media: string) => ({
    matches: media.includes('prefers-reduced-motion'),
    media,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    onchange: null,
    dispatchEvent: () => false,
  }))
  vi.spyOn(HTMLElement.prototype, 'offsetLeft', 'get').mockImplementation(function (
    this: HTMLElement,
  ) {
    return Number(this.dataset.cell ?? 0) * 50
  })
  vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(50)
  vi.spyOn(Element.prototype, 'clientWidth', 'get').mockReturnValue(300)
})

function renderStrip() {
  const onBeat = vi.fn()
  const { container } = render(
    <BeatStrip
      performance={performance}
      bars={bars}
      beat={{ bar: 0, beat: 0, startTick: 0 }}
      loop={null}
      clock={null}
      onBeat={onBeat}
    />,
  )
  const strip = container.querySelector<HTMLElement>('[data-slot="beat-strip"]')!
  const cell = (at: number) => strip.querySelector<HTMLElement>(`[data-cell="${at}"]`)!
  return { onBeat, strip, cell, row: strip.firstElementChild as HTMLElement }
}

const finger = { pointerId: 1, pointerType: 'touch', isPrimary: true }

/** A finger down on a beat, along by `by` px (and down by `down`), then up. */
function drag(on: HTMLElement, by: number, { down = 0, lift = true } = {}) {
  fireEvent.pointerDown(on, { ...finger, buttons: 1, clientX: 200, clientY: 20 })
  fireEvent.pointerMove(on, {
    ...finger,
    buttons: 1,
    clientX: 200 + by / 2,
    clientY: 20 + down / 2,
  })
  fireEvent.pointerMove(on, { ...finger, buttons: 1, clientX: 200 + by, clientY: 20 + down })
  if (lift)
    fireEvent.pointerUp(on, { ...finger, buttons: 0, clientX: 200 + by, clientY: 20 + down })
}

describe('the beat strip dragged (ADR 0108)', () => {
  it('stands the beat sounding a third of the way in', () => {
    const { row } = renderStrip()
    expect(row.style.transform).toBe('translateX(75px)')
  })

  it('moves under the finger as it is dragged', () => {
    const { cell, row } = renderStrip()
    drag(cell(1), -100, { lift: false })
    // 100px less the 3px a touch moves before it is a drag.
    expect(row.style.transform).toBe('translateX(-22px)')
  })

  it('takes the cursor to the beat at its mark where it is let go', () => {
    const { onBeat, cell, row } = renderStrip()
    drag(cell(1), -100)
    // Beat 3 of the first bar, its middle at the mark.
    expect(onBeat).toHaveBeenCalledOnce()
    expect(onBeat).toHaveBeenCalledWith(2 * B)
    expect(row.style.transform).toBe('translateX(-25px)')
  })

  it('gives like a rubber band past its first beat, and settles back on it', () => {
    const { onBeat, cell, row } = renderStrip()
    drag(cell(0), 120, { lift: false })
    const drawn = Number(/-?[\d.]+/.exec(row.style.transform)?.[0])
    expect(drawn).toBeGreaterThan(75)
    expect(drawn).toBeLessThan(75 + 120)
    fireEvent.pointerUp(cell(0), { ...finger, buttons: 0, clientX: 320, clientY: 20 })
    expect(onBeat).toHaveBeenCalledWith(0)
  })

  it('is no tap at a drag’s end, but a tap still goes to the beat tapped', () => {
    const { onBeat, cell } = renderStrip()
    drag(cell(1), -100)
    fireEvent.click(cell(1))
    expect(onBeat).toHaveBeenCalledOnce()
    fireEvent.pointerDown(cell(5), { ...finger, buttons: 1, clientX: 200, clientY: 20 })
    fireEvent.pointerUp(cell(5), { ...finger, buttons: 0, clientX: 200, clientY: 20 })
    fireEvent.click(cell(5))
    expect(onBeat).toHaveBeenLastCalledWith(4 * B + B)
  })

  it('leaves a drag up or down to the page', () => {
    const { onBeat, cell, row } = renderStrip()
    drag(cell(1), 4, { down: 120 })
    expect(onBeat).not.toHaveBeenCalled()
    expect(row.style.transform).toBe('translateX(75px)')
  })

  it('moves only sideways for the page: a pan up and down is the browser’s', () => {
    const { strip } = renderStrip()
    expect(strip).toHaveClass('touch-pan-y')
  })

  it('scrubs with a trackpad’s sideways scroll, the page kept still', async () => {
    const { onBeat, strip, row } = renderStrip()
    const scrolled = fireEvent.wheel(strip, { deltaX: 100, deltaY: 0 })
    expect(scrolled).toBe(false)
    expect(row.style.transform).toBe('translateX(-25px)')
    await waitFor(() => expect(onBeat).toHaveBeenCalledWith(2 * B))
  })

  it('leaves a scroll up or down to the page', () => {
    const { onBeat, strip } = renderStrip()
    expect(fireEvent.wheel(strip, { deltaX: 0, deltaY: 100 })).toBe(true)
    expect(onBeat).not.toHaveBeenCalled()
  })
})
