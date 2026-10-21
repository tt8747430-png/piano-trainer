import { describe, expect, it } from 'vitest'
import { fitZoom } from './use-fit-zoom'

describe('fitZoom', () => {
  it('shrinks a drawing wider than its room to fit it', () => {
    expect(fitZoom(300, 600)).toBe(0.5)
  })

  it('never grows a drawing narrower than its room', () => {
    expect(fitZoom(600, 300)).toBe(1)
  })

  it('leaves the drawing as it is until its room is laid out', () => {
    expect(fitZoom(0, 600)).toBe(1)
  })
})
