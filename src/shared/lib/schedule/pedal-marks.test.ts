import { describe, expect, it } from 'vitest'
import type { PedalEvent } from '@/shared/lib/music'
import { pedalHeld, pedalSpans, pedalSpanAt } from './pedal-marks'

const at = (tick: number, kind: PedalEvent['kind']): PedalEvent => ({ tick, kind })

describe('pedalHeld', () => {
  it('holds a note struck under the pedal until it is let up or changed', () => {
    const held = pedalHeld([at(0, 'down'), at(48, 'change'), at(96, 'up')])
    expect(held(0)).toBe(48)
    expect(held(24)).toBe(48)
    expect(held(48)).toBe(96)
    expect(held(96)).toBeNull()
  })

  it('holds what is struck under a pedal never let up to the end, and nothing struck with it up', () => {
    expect(pedalHeld([at(0, 'down')])(24)).toBe(Infinity)
    expect(pedalHeld([at(24, 'up')])(0)).toBeNull()
    expect(pedalHeld([])(0)).toBeNull()
  })

  it('lets up between notes, over a rest or after the last note, where the line says', () => {
    const held = pedalHeld([at(0, 'down'), at(30, 'up'), at(50, 'down'), at(130, 'up')])
    expect(held(10)).toBe(30)
    expect(held(40)).toBeNull()
    expect(held(120)).toBe(130)
  })
})

describe('pedalSpans', () => {
  it('reads the spans the pedal is down, a change ending one and starting the next', () => {
    expect(pedalSpans([at(96, 'up'), at(0, 'down'), at(48, 'change')])).toEqual([
      { from: 0, to: 48 },
      { from: 48, to: 96 },
    ])
  })

  it('reads a pedal never let up as down to the end, a change with it up as a press, and none where nothing is marked', () => {
    expect(pedalSpans([at(24, 'down')])).toEqual([{ from: 24, to: Infinity }])
    expect(pedalSpans([at(24, 'change'), at(48, 'up')])).toEqual([{ from: 24, to: 48 }])
    expect(pedalSpans([])).toEqual([])
  })
})

describe('pedalSpanAt (A27, Show it)', () => {
  it('finds the span the pedal is down in at a tick, none where it is up', () => {
    const line = [
      { tick: 0, kind: 'down' as const },
      { tick: 4, kind: 'change' as const },
      { tick: 8, kind: 'up' as const },
    ]
    expect(pedalSpanAt(line, 0)).toEqual({ from: 0, to: 4 })
    expect(pedalSpanAt(line, 5)).toEqual({ from: 4, to: 8 })
    expect(pedalSpanAt(line, 8)).toBeNull()
    expect(pedalSpanAt([], 2)).toBeNull()
  })
})
