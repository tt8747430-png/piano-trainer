import { describe, expect, it } from 'vitest'
import { moveBlock } from './move-block'

const ids = ['a', 'b', 'c', 'd', 'e']

describe('moveBlock', () => {
  it('moves a row down, landing it after the row it is dropped on', () => {
    expect(moveBlock(ids, new Set(['a']), 'c')).toEqual(['b', 'c', 'a', 'd', 'e'])
  })

  it('moves a row up, landing it before the row it is dropped on', () => {
    expect(moveBlock(ids, new Set(['e']), 'c')).toEqual(['a', 'b', 'e', 'c', 'd'])
  })

  it('keeps rows carried together side by side, in their own order', () => {
    expect(moveBlock(ids, new Set(['a', 'c']), 'e')).toEqual(['b', 'd', 'e', 'a', 'c'])
    expect(moveBlock(ids, new Set(['d', 'e']), 'b')).toEqual(['a', 'd', 'e', 'b', 'c'])
  })

  it('moves rows carried together as from their top one', () => {
    expect(moveBlock(ids, new Set(['b', 'e']), 'd')).toEqual(['a', 'c', 'd', 'b', 'e'])
  })

  it('changes nothing dropped on a row it carries, on a row not there, or carrying none', () => {
    expect(moveBlock(ids, new Set(['a', 'b']), 'b')).toEqual(ids)
    expect(moveBlock(ids, new Set(['a']), 'zzz')).toEqual(ids)
    expect(moveBlock(ids, new Set(), 'c')).toEqual(ids)
  })

  it('hands back a new list, never the one it was given', () => {
    expect(moveBlock(ids, new Set(), 'c')).not.toBe(ids)
  })
})
