import { describe, expect, it } from 'vitest'
import { pedalHeld, pedalSpans } from './pedal-marks'

const at = (startTick: number, pedal?: 'down' | 'up' | 'change') => ({
  startTick,
  ...(pedal ? { marks: { pedal } } : {}),
})

describe('pedalHeld', () => {
  it('holds a note struck under the pedal until it is let up or changed', () => {
    const held = pedalHeld([at(0, 'down'), at(24), at(48, 'change'), at(72), at(96, 'up')])
    expect(held(0)).toBe(48)
    expect(held(24)).toBe(48)
    expect(held(48)).toBe(96)
    expect(held(96)).toBeNull()
  })

  it('holds what is struck under a pedal never let up to the end', () => {
    const held = pedalHeld([at(0, 'down'), at(24)])
    expect(held(24)).toBe(Infinity)
    expect(pedalHeld([at(0), at(24, 'up')])(0)).toBeNull()
  })
})

describe('pedalSpans', () => {
  it('reads the spans the pedal is down, a change ending one and starting the next', () => {
    expect(pedalSpans([at(96, 'up'), at(0, 'down'), at(48, 'change'), at(24)])).toEqual([
      { from: 0, to: 48 },
      { from: 48, to: 96 },
    ])
  })

  it('reads a pedal never let up as down to the end, and none where nothing is marked', () => {
    expect(pedalSpans([at(24, 'down')])).toEqual([{ from: 24, to: Infinity }])
    expect(pedalSpans([at(0), at(24)])).toEqual([])
  })
})
