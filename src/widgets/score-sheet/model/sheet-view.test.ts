import { describe, expect, it } from 'vitest'
import { paginate } from './sheet-view'

describe('paginate', () => {
  it('deals items onto pages, a new page where the next does not fit', () => {
    expect(paginate([40, 40, 40, 10], (h) => h, 100)).toEqual([
      [40, 40],
      [40, 10],
    ])
  })

  it('gives an item taller than a page a page of its own', () => {
    expect(paginate([30, 150, 30], (h) => h, 100)).toEqual([[30], [150], [30]])
  })

  it('carries a heading over with what follows it', () => {
    const items = [{ h: 60 }, { h: 20, heading: true }, { h: 40 }]
    expect(
      paginate(
        items,
        (item) => item.h,
        100,
        (item) => item.heading === true,
      ).map((page) => page.length),
    ).toEqual([1, 2])
  })
})
