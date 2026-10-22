import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { PageCanvas } from './PageCanvas'

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

  it('lets a click reach what it holds', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    canvas(onClick)
    await user.click(screen.getByRole('button', { name: 'Bar 1' }))
    expect(onClick).toHaveBeenCalledOnce()
  })
})
