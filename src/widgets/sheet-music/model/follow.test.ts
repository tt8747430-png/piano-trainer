import { describe, expect, it } from 'vitest'
import { followScroll } from './follow'

describe('followScroll', () => {
  it('leaves the view while the cursor is in its middle half', () => {
    expect(followScroll(300, { left: 0, width: 800 })).toBeNull()
  })

  it('scrolls to put the cursor a quarter in once it leaves', () => {
    expect(followScroll(700, { left: 0, width: 800 })).toBe(500)
    expect(followScroll(100, { left: 400, width: 800 })).toBe(0)
  })
})
