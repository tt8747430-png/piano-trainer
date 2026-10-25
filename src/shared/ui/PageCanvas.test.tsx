import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useEffect, useRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { stubBox } from '@/shared/test/layout'
import { stubResizeObserver } from '@/shared/test/resize'
import { useCanvasReveal } from './canvas-reveal'
import { PageCanvas } from './PageCanvas'

/** The pages' place on the canvas as its transform says: moved by x and y, drawn at zoom. */
function placed(region: HTMLElement) {
  const pages = region.firstElementChild as HTMLElement
  const [, x = '0', y = '0', zoom = '1'] =
    /translate\((-?[\d.]+)px, (-?[\d.]+)px\) scale\(([\d.]+)\)/.exec(pages.style.transform) ?? []
  return { x: Number(x), y: Number(y), zoom: Number(zoom) }
}

/** A line of the pages that brings itself into sight once, as it comes, as the caret's line does. */
function RevealedLine() {
  const reveal = useCanvasReveal()
  const line = useRef<HTMLDivElement>(null)
  const brought = useRef(false)
  useEffect(() => {
    if (!line.current || !reveal || brought.current) return
    brought.current = true
    reveal(line.current)
  }, [reveal])
  return <div ref={line} data-slot="sheet-line" data-testid="line" />
}

const canvas = (onClick = vi.fn()) => {
  render(
    <PageCanvas column={794}>
      <button type="button" onClick={onClick}>
        Bar 1
      </button>
    </PageCanvas>,
  )
  return screen.getByRole('region', { name: /^Pages/ })
}

describe('PageCanvas', () => {
  it('shows its zoom’s buttons as the pages are touched, and hides them once left alone or tapped', () => {
    vi.useFakeTimers()
    const region = canvas()
    const controls = () => region.querySelector('[data-slot="canvas-controls"]')
    expect(controls()).not.toHaveAttribute('data-shown')
    fireEvent.wheel(region, { deltaY: 40 })
    expect(controls()).toHaveAttribute('data-shown')
    act(() => vi.advanceTimersByTime(3000))
    expect(controls()).not.toHaveAttribute('data-shown')
    fireEvent.pointerDown(region, { button: 0, pointerId: 1, clientX: 10, clientY: 10 })
    expect(controls()).toHaveAttribute('data-shown')
    fireEvent.pointerUp(region, { pointerId: 1, clientX: 10, clientY: 10 })
    expect(controls()).not.toHaveAttribute('data-shown')
    vi.useRealTimers()
  })

  it('zooms in and out by its buttons, saying how far', async () => {
    const user = userEvent.setup()
    canvas()
    expect(screen.getByText('100 %')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Zoom in' }))
    expect(screen.getByText('125 %')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Zoom out' }))
    expect(screen.getByText('100 %')).toBeInTheDocument()
  })

  it('zooms with Ctrl and the wheel, and moves with the wheel alone', () => {
    const region = canvas()
    fireEvent.wheel(region, { deltaY: -600, ctrlKey: true })
    expect(screen.getByText('200 %')).toBeInTheDocument()
    fireEvent.wheel(region, { deltaY: 100 })
    expect(screen.getByText('200 %')).toBeInTheDocument()
  })

  it('moves when dragged by a touch, though the touch is captured by what it lands on', () => {
    const region = canvas()
    const bar = screen.getByRole('button', { name: 'Bar 1' })
    // A touch holds the pointer for the element under it, as iOS and Chrome do.
    bar.hasPointerCapture = () => true
    region.setPointerCapture = vi.fn()
    const pages = region.firstElementChild as HTMLElement
    fireEvent.pointerDown(bar, { pointerId: 1, clientX: 100, clientY: 100, button: 0 })
    fireEvent.pointerMove(bar, { pointerId: 1, clientX: 140, clientY: 160 })
    // jsdom lays nothing out, so the move is held to the canvas's edge: but it moved.
    expect(pages.style.transform).toMatch(/^translate\(/)
  })

  it('leaves a grip’s drag to the grip', () => {
    render(
      <PageCanvas column={794}>
        <div data-grip>grip</div>
      </PageCanvas>,
    )
    const region = screen.getByRole('region', { name: /^Pages/ })
    const pages = region.firstElementChild as HTMLElement
    const grip = screen.getByText('grip')
    fireEvent.pointerDown(grip, { pointerId: 1, clientX: 100, clientY: 100, button: 0 })
    fireEvent.pointerMove(grip, { pointerId: 1, clientX: 140, clientY: 160 })
    expect(pages.style.transform).toBe('')
  })

  it('fits the pages in the room what floats over its right edge leaves (a palette beside them)', async () => {
    // A phone on its side: 804 by 305, a palette 320 wide at the right.
    stubResizeObserver({ width: 804, height: 305 })
    render(
      <PageCanvas column={794} covered={{ right: 320 }}>
        <p>Page 1</p>
      </PageCanvas>,
    )
    const region = screen.getByRole('region', { name: /^Pages/ })
    await act(async () => {})
    expect(placed(region).zoom).toBeCloseTo((484 - 32) / 794, 3)
  })

  it('fits the pages no larger than shows a whole line in the screen’s height', async () => {
    // A phone on its side, the keys out: 179 high; each line 200 high at full size.
    stubResizeObserver({ width: 804, height: 179 })
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(200)
    render(
      <PageCanvas column={794}>
        <div data-slot="sheet-line" />
      </PageCanvas>,
    )
    const region = screen.getByRole('region', { name: /^Pages/ })
    await act(async () => {})
    expect(placed(region).zoom).toBeCloseTo((179 - 32) / 200, 3)
  })

  it('keeps the line brought into sight in sight as the pages are fitted', async () => {
    stubResizeObserver({ width: 804, height: 305 })
    render(
      <PageCanvas column={794}>
        <RevealedLine />
      </PageCanvas>,
    )
    const region = screen.getByRole('region', { name: /^Pages/ })
    // The line far down the first page, brought into sight before the canvas knew its size.
    stubBox(screen.getByTestId('line'), { top: 700, width: 700, height: 200 })
    stubBox(region.firstElementChild as HTMLElement, { top: 0, width: 842, height: 1200 })
    await act(async () => {})
    // Fitted, the pages' top would be in sight; the line is instead.
    expect(placed(region).y).toBeLessThan(0)
  })

  it('lets a click reach what it holds', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    canvas(onClick)
    await user.click(screen.getByRole('button', { name: 'Bar 1' }))
    expect(onClick).toHaveBeenCalledOnce()
  })
})
