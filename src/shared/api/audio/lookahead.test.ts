import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { midi } from '@/shared/lib/music'
import type { Sound } from '@/shared/lib/schedule'
import { createLookahead } from './lookahead'

const note = (at: number): Sound => ({
  kind: 'note',
  midi: midi(60),
  at,
  duration: 0.5,
  velocity: 0.1,
})

describe('createLookahead', () => {
  let clock = 0
  let rendered: number[] = []
  const setUp = () =>
    createLookahead({
      now: () => clock,
      render: (_sound, at) => rendered.push(at),
      horizon: 0.25,
      interval: 25,
    })

  beforeEach(() => {
    vi.useFakeTimers()
    clock = 0
    rendered = []
  })
  afterEach(() => vi.useRealTimers())

  it('renders what falls inside the horizon at once', () => {
    const lookahead = setUp()
    lookahead.add([note(0), note(0.125), note(1)], 0.0625)
    expect(rendered).toEqual([0.0625, 0.1875])
    expect(lookahead.pending).toBe(1)
  })

  it('renders the rest in time order as the clock moves', () => {
    const lookahead = setUp()
    lookahead.add([note(2), note(1), note(1.5)], 0)
    expect(rendered).toEqual([])
    clock = 0.8
    vi.advanceTimersByTime(25)
    expect(rendered).toEqual([1])
    clock = 1.9
    vi.advanceTimersByTime(25)
    expect(rendered).toEqual([1, 1.5, 2])
    expect(lookahead.pending).toBe(0)
  })

  it('merges a later batch into the queue in time order', () => {
    const lookahead = setUp()
    lookahead.add([note(1)], 0)
    lookahead.add([note(0.5)], 0.25)
    clock = 1
    vi.advanceTimersByTime(25)
    expect(rendered).toEqual([0.75, 1])
  })

  it('drops the queue and stops on clear', () => {
    const lookahead = setUp()
    lookahead.add([note(1), note(2)], 0)
    lookahead.clear()
    expect(lookahead.pending).toBe(0)
    clock = 5
    vi.advanceTimersByTime(100)
    expect(rendered).toEqual([])
    expect(vi.getTimerCount()).toBe(0)
  })

  it('stops its timer once the queue is empty', () => {
    const lookahead = setUp()
    lookahead.add([note(1)], 0)
    expect(vi.getTimerCount()).toBe(1)
    clock = 1
    vi.advanceTimersByTime(25)
    expect(vi.getTimerCount()).toBe(0)
    expect(lookahead.pending).toBe(0)
  })
})
