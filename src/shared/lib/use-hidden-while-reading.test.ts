// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { READ_DISTANCE, useHiddenWhileReading } from './use-hidden-while-reading'

const target = () => document.createElement('div')
const pointer = (x: number, y: number, extra: object = {}) =>
  ({
    clientX: x,
    clientY: y,
    pointerType: 'mouse',
    buttons: 1,
    target: target(),
    ...extra,
  }) as never
const touches = (...at: [number, number][]) =>
  ({ touches: at.map(([clientX, clientY]) => ({ clientX, clientY })), target: target() }) as never

describe('useHiddenWhileReading', () => {
  it('starts shown, and hides once the music is dragged further than a nudge', () => {
    const { result } = renderHook(() => useHiddenWhileReading())
    expect(result.current.shown).toBe(true)
    act(() => {
      result.current.reading.onPointerDown(pointer(0, 0))
      result.current.reading.onPointerMove(pointer(0, READ_DISTANCE - 1))
    })
    expect(result.current.shown).toBe(true)
    act(() => result.current.reading.onPointerMove(pointer(0, READ_DISTANCE + 1)))
    expect(result.current.shown).toBe(false)
  })

  it('hides as a finger scrolls the music, or two pinch it', () => {
    const { result } = renderHook(() => useHiddenWhileReading())
    act(() => {
      result.current.reading.onTouchStart(touches([10, 10]))
      result.current.reading.onTouchMove(touches([10, 10 + READ_DISTANCE + 1]))
    })
    expect(result.current.shown).toBe(false)
    act(() => result.current.show())
    act(() => result.current.reading.onTouchStart(touches([0, 0], [50, 50])))
    expect(result.current.shown).toBe(false)
  })

  it('hides as the wheel moves the music, a little at a time adding up', () => {
    const { result } = renderHook(() => useHiddenWhileReading())
    act(() => result.current.reading.onWheel({ deltaX: 0, deltaY: READ_DISTANCE / 2 } as never))
    expect(result.current.shown).toBe(true)
    act(() => result.current.reading.onWheel({ deltaX: 0, deltaY: READ_DISTANCE } as never))
    expect(result.current.shown).toBe(false)
  })

  it('leaves it shown for a touch’s own pointer, a grip dragged, and a move the music claimed', () => {
    const { result } = renderHook(() => useHiddenWhileReading())
    const grip = document.createElement('div')
    grip.dataset.grip = ''
    act(() => {
      result.current.reading.onPointerDown(pointer(0, 0, { pointerType: 'touch' }))
      result.current.reading.onPointerMove(pointer(0, 100, { pointerType: 'touch' }))
      result.current.reading.onPointerDown(pointer(0, 0, { target: grip }))
      result.current.reading.onPointerMove(pointer(0, 100, { target: grip }))
      result.current.reading.onPointerDown(pointer(0, 0))
      result.current.reading.onPointerMove(pointer(0, 100, { defaultPrevented: true }))
    })
    expect(result.current.shown).toBe(true)
  })
})
