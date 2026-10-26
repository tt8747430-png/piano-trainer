// @vitest-environment jsdom
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { stubMatchMedia } from '@/shared/test/match-media'
import { useSortableList } from './use-sortable-list'

/** What dnd-kit hands its handlers, of which the engine reads the ids alone. */
const started = (id: string) => ({ active: { id } }) as unknown as DragStartEvent
const dropped = (id: string, over: string | null) =>
  ({ active: { id }, over: over === null ? null : { id: over } }) as unknown as DragEndEvent

const sortable = (onDrop: (next: string[]) => boolean | void) =>
  renderHook(({ ids }) => useSortableList({ ids, onDrop }), {
    initialProps: { ids: ['a', 'b', 'c'] as readonly string[] },
  })

describe('useSortableList', () => {
  it('knows the row in hand while it is dragged', () => {
    const { result } = sortable(() => {})
    act(() => result.current.dnd.onDragStart?.(started('b')))
    expect(result.current.activeId).toBe('b')
    act(() => result.current.dnd.onDragCancel?.(dropped('b', null)))
    expect(result.current.activeId).toBeNull()
  })

  it('hands on the order a drop makes, and draws it while the list catches up', () => {
    const onDrop = vi.fn()
    const { result, rerender } = sortable(onDrop)
    act(() => result.current.dnd.onDragEnd?.(dropped('a', 'c')))
    expect(onDrop).toHaveBeenCalledWith(['b', 'c', 'a'])
    expect(result.current.items).toEqual(['b', 'c', 'a'])
    expect(result.current.activeId).toBeNull()
    rerender({ ids: ['b', 'c', 'a'] })
    expect(result.current.items).toEqual(['b', 'c', 'a'])
  })

  it('moves nothing dropped on itself or on no row', () => {
    const onDrop = vi.fn()
    const { result } = sortable(onDrop)
    act(() => result.current.dnd.onDragEnd?.(dropped('a', 'a')))
    act(() => result.current.dnd.onDragEnd?.(dropped('a', null)))
    expect(onDrop).not.toHaveBeenCalled()
    expect(result.current.items).toEqual(['a', 'b', 'c'])
  })

  it('snaps back a drop refused', () => {
    const { result } = sortable(() => false)
    act(() => result.current.dnd.onDragEnd?.(dropped('c', 'a')))
    expect(result.current.items).toEqual(['a', 'b', 'c'])
  })

  it('settles a drop at once under reduced motion', () => {
    expect(sortable(() => {}).result.current.overlay.dropAnimation).not.toBeNull()
    stubMatchMedia({ dark: true })
    expect(sortable(() => {}).result.current.overlay.dropAnimation).toBeNull()
  })
})
