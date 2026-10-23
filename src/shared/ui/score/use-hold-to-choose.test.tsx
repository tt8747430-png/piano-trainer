import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { HOLD_MS, useHoldToChoose } from './use-hold-to-choose'

function Bars({ choose }: { choose: (tick: number, extend: boolean) => void }) {
  const hold = useHoldToChoose(choose)
  return (
    <>
      {[0, 96, 192].map((start) => (
        <button key={start} type="button" {...hold(start)}>
          Bar at {start}
        </button>
      ))}
    </>
  )
}

const touch = (clientX: number, clientY = 10) => ({
  pointerId: 1,
  pointerType: 'touch',
  clientX,
  clientY,
})

afterEach(() => vi.useRealTimers())

describe('choosing bars by touch', () => {
  it('chooses the bar held, then each bar the finger is dragged across', () => {
    vi.useFakeTimers()
    const choose = vi.fn()
    render(<Bars choose={choose} />)
    const [first, , third] = screen.getAllByRole('button')
    if (!first || !third) throw new Error('three bars')
    fireEvent.pointerDown(first, touch(10))
    expect(choose).not.toHaveBeenCalled()
    act(() => vi.advanceTimersByTime(HOLD_MS))
    expect(choose.mock.calls).toEqual([
      [0, false],
      [0, true],
    ])
    document.elementFromPoint = () => third
    fireEvent.pointerMove(first, touch(200))
    expect(choose).toHaveBeenLastCalledWith(192, true)
    fireEvent.pointerUp(first, touch(200))
  })

  it('leaves a press that moves before the hold to the sheet’s scroll', () => {
    vi.useFakeTimers()
    const choose = vi.fn()
    render(<Bars choose={choose} />)
    const [first] = screen.getAllByRole('button')
    if (!first) throw new Error('a bar')
    fireEvent.pointerDown(first, touch(10))
    fireEvent.pointerMove(first, touch(10, 40))
    act(() => vi.advanceTimersByTime(HOLD_MS))
    expect(choose).not.toHaveBeenCalled()
  })

  it('leaves a mouse to Shift', () => {
    vi.useFakeTimers()
    const choose = vi.fn()
    render(<Bars choose={choose} />)
    const [first] = screen.getAllByRole('button')
    if (!first) throw new Error('a bar')
    fireEvent.pointerDown(first, { ...touch(10), pointerType: 'mouse' })
    act(() => vi.advanceTimersByTime(HOLD_MS))
    expect(choose).not.toHaveBeenCalled()
  })
})
