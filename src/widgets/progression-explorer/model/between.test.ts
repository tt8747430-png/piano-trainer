import { describe, expect, it } from 'vitest'
import { parseChordSymbol } from '@/shared/lib/music'
import { changesOf } from './between'

const row = (...symbols: string[]) => symbols.map(parseChordSymbol)

describe('changesOf', () => {
  it('finds each chord that moves to another', () => {
    expect(changesOf(row('C', 'G', 'Am', 'F'))).toEqual([0, 1, 2])
  })

  it('passes over a chord held into the next bar, and the row’s last', () => {
    expect(changesOf(row('C7', 'C7', 'F7', 'F7', 'C7'))).toEqual([1, 3])
    expect(changesOf(row('C'))).toEqual([])
  })
})
