// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useHeldOrder } from './use-held-order'

const held = (initial: readonly string[]) =>
  renderHook(({ ids }) => useHeldOrder(ids), { initialProps: { ids: initial } })

describe('useHeldOrder', () => {
  it('draws the list’s order while nothing is held', () => {
    const { result } = held(['a', 'b', 'c'])
    expect(result.current.order).toEqual(['a', 'b', 'c'])
  })

  it('draws the order dropped while the list still says the old one', () => {
    const { result, rerender } = held(['a', 'b', 'c'])
    act(() => result.current.hold(['c', 'a', 'b']))
    expect(result.current.order).toEqual(['c', 'a', 'b'])
    // A list half caught up must not snap the rows back under the finger.
    rerender({ ids: ['a', 'c', 'b'] })
    expect(result.current.order).toEqual(['c', 'a', 'b'])
  })

  it('lets go once the list agrees, so a later change from elsewhere comes straight through', () => {
    const { result, rerender } = held(['a', 'b', 'c'])
    act(() => result.current.hold(['c', 'a', 'b']))
    rerender({ ids: ['c', 'a', 'b'] })
    // Another tab orders them again: nothing is held, so it is drawn at once.
    rerender({ ids: ['b', 'a', 'c'] })
    expect(result.current.order).toEqual(['b', 'a', 'c'])
  })

  it('leaves out a row the list no longer has, and takes up one it gained', () => {
    const { result, rerender } = held(['a', 'b', 'c'])
    act(() => result.current.hold(['c', 'b', 'a']))
    rerender({ ids: ['a', 'c', 'd'] })
    expect(result.current.order).toEqual(['c', 'a', 'd'])
  })
})
