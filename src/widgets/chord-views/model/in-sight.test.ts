import { describe, expect, it } from 'vitest'
import { lineScroll } from './in-sight'

/** A phone held upright's room: a 72px strip held at the top, 466px under it to the transport. */
const UPRIGHT = { held: 72, room: 466 }
/** A phone on its side's: a 50px strip, and 62px under it before the transport. */
const ON_ITS_SIDE = { held: 50, room: 62 }

describe('lineScroll', () => {
  it('leaves a line in the top third of the room under the strip where it is', () => {
    expect(lineScroll({ ...UPRIGHT, top: 72, height: 55 })).toBeNull()
    expect(lineScroll({ ...UPRIGHT, top: 72 + 150, height: 55 })).toBeNull()
  })

  it('brings a line further down, or under the strip, a quarter of the way down the room', () => {
    // A quarter of 466 under the strip is 188.5 from the scroller's top.
    expect(lineScroll({ ...UPRIGHT, top: 400, height: 55 })).toBe(400 - 188.5)
    expect(lineScroll({ ...UPRIGHT, top: 10, height: 55 })).toBe(10 - 188.5)
  })

  it('keeps a line clear of the transport where the room is short: higher, else under the strip', () => {
    // A quarter of 62 is 15.5, which would leave the line's foot 8.5px under the transport: it
    // stands 7px down instead, its foot at the room's.
    expect(lineScroll({ ...ON_ITS_SIDE, top: 120, height: 55 })).toBe(120 - (50 + 7))
    // In the top third, but its foot under the transport: brought up.
    expect(lineScroll({ ...ON_ITS_SIDE, top: 60, height: 55 })).toBe(60 - (50 + 7))
    // Taller than the room: its top under the strip.
    expect(lineScroll({ ...ON_ITS_SIDE, top: 120, height: 90 })).toBe(120 - 50)
  })
})
