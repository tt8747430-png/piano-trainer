import { describe, expect, it } from 'vitest'
import { verdictHeads } from './verdict-heads'

describe('verdictHeads', () => {
  it('gives each engraved head of a judged place its verdict', () => {
    const ids = new Map([
      ['0:60', ['n-rh-0-0']],
      ['480:64', ['n-rh-480-0', 'n-lh-480-1']],
      ['960:67', ['n-rh-960-0']],
    ])
    const verdicts = new Map([
      ['0:60', 'early' as const],
      ['480:64', 'wrong' as const],
    ])
    expect([...verdictHeads(ids, verdicts)]).toEqual([
      ['n-rh-0-0', 'early'],
      ['n-rh-480-0', 'wrong'],
      ['n-lh-480-1', 'wrong'],
    ])
  })

  it('draws nothing for a place the engraving does not print', () => {
    expect(verdictHeads(new Map(), new Map([['0:60', 'missed' as const]])).size).toBe(0)
  })
})
