import { describe, expect, it } from 'vitest'
import { GRIP_PULL, gripRelease } from './grip'

describe('the palette sheet’s grab handle', () => {
  it('toggles the sheet at a tap', () => {
    expect(gripRelease(0, true)).toBe(false)
    expect(gripRelease(3, false)).toBe(true)
  })

  it('expands the sheet dragged up, and makes it compact dragged down', () => {
    expect(gripRelease(-GRIP_PULL, true)).toBe(false)
    expect(gripRelease(GRIP_PULL, false)).toBe(true)
  })

  it('leaves the sheet as it is for a drag too short, or the way it already is', () => {
    expect(gripRelease(-GRIP_PULL / 2, true)).toBeNull()
    expect(gripRelease(-GRIP_PULL * 2, false)).toBeNull()
    expect(gripRelease(GRIP_PULL * 2, true)).toBeNull()
  })
})
