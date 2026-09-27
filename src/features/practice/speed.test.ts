import { describe, expect, it } from 'vitest'
import { speedUp } from './speed'

describe('speedUp', () => {
  it('adds 5% of the piece’s tempo each pass, up to it', () => {
    expect(speedUp(36, 72)).toEqual({ step: 4, until: 72 })
    expect(speedUp(10, 12)).toEqual({ step: 1, until: 12 })
  })

  it('has nothing to do at or above the piece’s tempo', () => {
    expect(speedUp(72, 72)).toBeUndefined()
    expect(speedUp(90, 72)).toBeUndefined()
  })
})
