import { afterEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { useLongPress } from './use-long-press'

function Probe({ onLongPress, onTap }: { onLongPress: () => void; onTap: () => void }) {
  const handlers = useLongPress({ onLongPress, onTap })
  return (
    <button type="button" {...handlers}>
      press
    </button>
  )
}

afterEach(() => {
  vi.useRealTimers()
})

describe('useLongPress', () => {
  it('fires after the hold and suppresses the trailing tap', () => {
    vi.useFakeTimers()
    const onLongPress = vi.fn()
    const onTap = vi.fn()
    render(<Probe onLongPress={onLongPress} onTap={onTap} />)
    const button = screen.getByRole('button')

    fireEvent.pointerDown(button, { clientX: 0, clientY: 0 })
    vi.advanceTimersByTime(460)
    expect(onLongPress).toHaveBeenCalledTimes(1)

    fireEvent.click(button)
    expect(onTap).not.toHaveBeenCalled()
  })

  it('treats a quick press as a tap', () => {
    vi.useFakeTimers()
    const onLongPress = vi.fn()
    const onTap = vi.fn()
    render(<Probe onLongPress={onLongPress} onTap={onTap} />)
    const button = screen.getByRole('button')

    fireEvent.pointerDown(button, { clientX: 0, clientY: 0 })
    fireEvent.pointerUp(button)
    vi.advanceTimersByTime(460)
    fireEvent.click(button)

    expect(onLongPress).not.toHaveBeenCalled()
    expect(onTap).toHaveBeenCalledTimes(1)
  })

  it('cancels when the pointer moves past the tolerance', () => {
    vi.useFakeTimers()
    const onLongPress = vi.fn()
    const onTap = vi.fn()
    render(<Probe onLongPress={onLongPress} onTap={onTap} />)
    const button = screen.getByRole('button')

    fireEvent.pointerDown(button, { clientX: 0, clientY: 0 })
    fireEvent.pointerMove(button, { clientX: 40, clientY: 0 })
    vi.advanceTimersByTime(460)

    expect(onLongPress).not.toHaveBeenCalled()
  })
})
