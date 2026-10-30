import { describe, expect, it } from 'vitest'
import { rowPlace, withRowAt, withRowMoved, withRowRemoved, type RowOrder } from './row-order'

const ORDER: RowOrder = [
  { key: 'one', rows: ['a', 'b'] },
  { key: 'two', rows: ['c'] },
  { key: 'three', rows: [] },
]

const rows = (order: RowOrder | null) => order?.map((group) => group.rows)

describe('rows in groups, put in order', () => {
  it('finds a row', () => {
    expect(rowPlace(ORDER, 'c')).toEqual({ group: 1, at: 0 })
    expect(rowPlace(ORDER, 'x')).toBeNull()
  })

  it('puts a row anywhere, an empty group too', () => {
    expect(rows(withRowAt(ORDER, 'a', 1, 1))).toEqual([['b'], ['c', 'a'], []])
    expect(rows(withRowAt(ORDER, 'b', 2, 0))).toEqual([['a'], ['c'], ['b']])
    expect(rows(withRowAt(ORDER, 'b', 0, 0))).toEqual([['b', 'a'], ['c'], []])
  })

  it('moves a row past its neighbour, and from a group’s edge onto the next group', () => {
    expect(rows(withRowMoved(ORDER, 'b', -1))).toEqual([['b', 'a'], ['c'], []])
    expect(rows(withRowMoved(ORDER, 'b', 1))).toEqual([['a'], ['b', 'c'], []])
    expect(rows(withRowMoved(ORDER, 'c', -1))).toEqual([['a', 'b', 'c'], [], []])
    expect(rows(withRowMoved(ORDER, 'c', 1))).toEqual([['a', 'b'], [], ['c']])
    expect(withRowMoved(ORDER, 'a', -1)).toBeNull()
    expect(withRowMoved([{ key: 'one', rows: ['a'] }], 'a', 1)).toBeNull()
  })

  it('takes a row out', () => {
    expect(rows(withRowRemoved(ORDER, 'a'))).toEqual([['b'], ['c'], []])
  })
})
