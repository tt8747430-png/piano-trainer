import { describe, expect, it } from 'vitest'
import { pedalLine } from './pedal'

describe('pedalLine', () => {
  it('sorts the events by tick', () => {
    expect(
      pedalLine([
        { tick: 8, kind: 'up' },
        { tick: 0, kind: 'down' },
      ]),
    ).toEqual([
      { tick: 0, kind: 'down' },
      { tick: 8, kind: 'up' },
    ])
  })

  it('makes a change where an up and a down meet, in either order', () => {
    expect(
      pedalLine([
        { tick: 0, kind: 'down' },
        { tick: 4, kind: 'up' },
        { tick: 4, kind: 'down' },
        { tick: 9, kind: 'down' },
        { tick: 9, kind: 'up' },
      ]),
    ).toEqual([
      { tick: 0, kind: 'down' },
      { tick: 4, kind: 'change' },
      { tick: 9, kind: 'change' },
    ])
  })

  it('keeps one event of a kind at a tick, and a change over anything else there', () => {
    expect(
      pedalLine([
        { tick: 2, kind: 'down' },
        { tick: 2, kind: 'down' },
        { tick: 5, kind: 'change' },
        { tick: 5, kind: 'up' },
      ]),
    ).toEqual([
      { tick: 2, kind: 'down' },
      { tick: 5, kind: 'change' },
    ])
  })

  it('makes one change of a lift a hair before the next press, as an import writes it apart', () => {
    // A 32nd's lift then press (a quarter is 5040 ticks): one change at the press, one mark.
    expect(
      pedalLine([
        { tick: 0, kind: 'down' },
        { tick: 5040 - 300, kind: 'up' },
        { tick: 5040, kind: 'down' },
      ]),
    ).toEqual([
      { tick: 0, kind: 'down' },
      { tick: 5040, kind: 'change' },
    ])
    // A lift a beat before the next press is a lift of its own.
    expect(
      pedalLine([
        { tick: 0, kind: 'down' },
        { tick: 5040, kind: 'up' },
        { tick: 10080, kind: 'down' },
      ]),
    ).toHaveLength(3)
  })
})
