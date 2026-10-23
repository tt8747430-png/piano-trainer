import { describe, expect, it } from 'vitest'
import { GRIP_PULL, gripRelease } from './grip'

describe('the palette’s grab handle', () => {
  it('toggles the palette at a tap', () => {
    expect(gripRelease(0, true, 'up')).toBe(false)
    expect(gripRelease(3, false, 'up')).toBe(true)
  })

  it('opens the palette dragged away from its edge, and folds it dragged back', () => {
    // At the sheet's foot it opens upward.
    expect(gripRelease(-GRIP_PULL, true, 'up')).toBe(false)
    expect(gripRelease(GRIP_PULL, false, 'up')).toBe(true)
    // Beside the sheet, hanging from its top, it opens downward.
    expect(gripRelease(GRIP_PULL, true, 'down')).toBe(false)
    expect(gripRelease(-GRIP_PULL, false, 'down')).toBe(true)
  })

  it('leaves the palette as it is for a drag too short, or the way it already is', () => {
    expect(gripRelease(-GRIP_PULL / 2, true, 'up')).toBeNull()
    expect(gripRelease(-GRIP_PULL * 2, false, 'up')).toBeNull()
    expect(gripRelease(GRIP_PULL * 2, true, 'up')).toBeNull()
  })
})
