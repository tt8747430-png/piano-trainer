import { describe, expect, it } from 'vitest'
import { rowPlace, withRowAt, withGroupAt, withRowRemoved, type RowOrder } from './row-order'

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

  it('moves a group, its rows with it, to another place among the groups', () => {
    const keys = (order: RowOrder) => order.map((group) => group.key)
    const groups = keys(ORDER)
    expect(keys(withGroupAt(ORDER, groups[0]!, 2))).toEqual([groups[1], groups[2], groups[0]])
    expect(keys(withGroupAt(ORDER, groups[2]!, 0))).toEqual([groups[2], groups[0], groups[1]])
    expect(withGroupAt(ORDER, groups[0]!, 2)[2]?.rows).toEqual(ORDER[0]?.rows)
    expect(withGroupAt(ORDER, 'none', 0)).toBe(ORDER)
  })

  it('takes a row out', () => {
    expect(rows(withRowRemoved(ORDER, 'a'))).toEqual([['b'], ['c'], []])
  })
})
