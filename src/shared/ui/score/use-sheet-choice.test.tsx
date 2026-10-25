import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { stubBox } from '@/shared/test/layout'
import { HOLD_MS, useSheetChoice, type SheetChoice } from './use-sheet-choice'

/** Three bars side by side, each 100 px wide from x 50, over a line 20 px under its labels. */
function Bars(choice: SheetChoice) {
  const props = useSheetChoice(choice)
  return (
    <>
      {[0, 1, 2].map((bar) => (
        <button key={bar} type="button" {...props(bar, { x: 50 + bar * 100, y: -20 })}>
          Bar {bar + 1}
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

const bars = () => {
  const at = vi.fn()
  const reach = vi.fn()
  render(<Bars at={at} reach={reach} />)
  const [first, second, third] = screen.getAllByRole('button')
  if (!first || !second || !third) throw new Error('three bars')
  return { at, reach, first, second, third }
}

// jsdom lays nothing out: a test stands in for the point a finger is over, and puts the document back.
const elementFromPoint = Object.getOwnPropertyDescriptor(document, 'elementFromPoint')
afterEach(() => {
  vi.useRealTimers()
  if (elementFromPoint) Object.defineProperty(document, 'elementFromPoint', elementFromPoint)
  else Reflect.deleteProperty(document, 'elementFromPoint')
})

describe('the one selection’s gestures (ADR 0088)', () => {
  it('says where a click lands on the engraving, Shift extending', () => {
    const { at, second } = bars()
    stubBox(second, { left: 300, top: 100, width: 100, height: 80 })
    fireEvent.click(second, { clientX: 330, clientY: 150, detail: 1 })
    expect(at).toHaveBeenLastCalledWith(1, { x: 180, y: 30 }, false)
    fireEvent.click(second, { clientX: 330, clientY: 150, detail: 1, shiftKey: true })
    expect(at).toHaveBeenLastCalledWith(1, { x: 180, y: 30 }, true)
  })

  it('reads a zoomed page’s click on its layout, as large as it is drawn', () => {
    const { at, first } = bars()
    vi.spyOn(first, 'offsetWidth', 'get').mockReturnValue(100)
    stubBox(first, { left: 0, top: 0, width: 200, height: 160 })
    fireEvent.click(first, { clientX: 40, clientY: 60, detail: 1 })
    expect(at).toHaveBeenLastCalledWith(0, { x: 70, y: 10 }, false)
  })

  it('gives the bar itself to a press from the keys', () => {
    const { at, third } = bars()
    fireEvent.click(third, { detail: 0 })
    expect(at).toHaveBeenLastCalledWith(2, null, false)
  })

  it('chooses what a finger holds, then reaches each bar it is dragged across', () => {
    vi.useFakeTimers()
    const { at, reach, first, third } = bars()
    stubBox(first, { left: 0, top: 0, width: 100, height: 80 })
    fireEvent.pointerDown(first, touch(10))
    expect(at).not.toHaveBeenCalled()
    act(() => vi.advanceTimersByTime(HOLD_MS))
    expect(at).toHaveBeenCalledWith(0, { x: 60, y: -10 }, false)
    document.elementFromPoint = () => third
    fireEvent.pointerMove(first, touch(200))
    expect(reach).toHaveBeenLastCalledWith(2)
    fireEvent.pointerMove(first, touch(210))
    expect(reach).toHaveBeenCalledTimes(1)
    fireEvent.pointerUp(first, touch(200))
  })

  it('leaves a press that moves before the hold to the sheet’s scroll', () => {
    vi.useFakeTimers()
    const { at, first } = bars()
    fireEvent.pointerDown(first, touch(10))
    fireEvent.pointerMove(first, touch(10, 40))
    act(() => vi.advanceTimersByTime(HOLD_MS))
    expect(at).not.toHaveBeenCalled()
  })

  it('leaves a mouse to its click and Shift', () => {
    vi.useFakeTimers()
    const { at, first } = bars()
    fireEvent.pointerDown(first, { ...touch(10), pointerType: 'mouse' })
    act(() => vi.advanceTimersByTime(HOLD_MS))
    expect(at).not.toHaveBeenCalled()
  })
})
