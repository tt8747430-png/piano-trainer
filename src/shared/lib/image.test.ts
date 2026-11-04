import { describe, expect, it } from 'vitest'
import { centreSquare } from './image'

describe('centreSquare', () => {
  it('keeps the middle square of a wide picture, and of a tall one', () => {
    expect(centreSquare(400, 300)).toEqual({ x: 50, y: 0, side: 300 })
    expect(centreSquare(300, 501)).toEqual({ x: 0, y: 100, side: 300 })
    expect(centreSquare(256, 256)).toEqual({ x: 0, y: 0, side: 256 })
  })
})
