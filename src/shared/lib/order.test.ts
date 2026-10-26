import { describe, expect, it } from 'vitest'
import { mergeVisibleOrder, reconcileHeldOrder } from './order'

describe('mergeVisibleOrder', () => {
  it('takes the order dropped where every row was on screen', () => {
    expect(mergeVisibleOrder(['a', 'b', 'c'], ['c', 'a', 'b'])).toEqual(['c', 'a', 'b'])
  })

  it('keeps a row a search hid in its place, the rows on screen taking theirs in the order dropped', () => {
    // b and d were hidden: a, c and e swapped among the slots they held.
    expect(mergeVisibleOrder(['a', 'b', 'c', 'd', 'e'], ['e', 'a', 'c'])).toEqual([
      'e',
      'b',
      'a',
      'd',
      'c',
    ])
  })

  it('writes no row the list does not hold', () => {
    expect(mergeVisibleOrder(['a', 'b'], ['x', 'b', 'a'])).toEqual(['b', 'a'])
  })
})

describe('reconcileHeldOrder', () => {
  const dropped = ['d', 'c', 'b', 'a']

  it('holds the order dropped through a list that has not caught up with it', () => {
    expect(reconcileHeldOrder(dropped, ['d', 'a', 'b', 'c'])).toEqual({
      order: dropped,
      settled: false,
    })
  })

  it('lets go once the list says the same', () => {
    expect(reconcileHeldOrder(dropped, ['d', 'c', 'b', 'a'])).toEqual({
      order: dropped,
      settled: true,
    })
  })

  it('leaves out a row the list no longer has, and puts one it gained after the order held', () => {
    expect(reconcileHeldOrder(dropped, ['a', 'c', 'd', 'e'])).toEqual({
      order: ['d', 'c', 'a', 'e'],
      settled: false,
    })
  })
})
