import { describe, expect, it } from 'vitest'
import { midi } from '@/shared/lib/music'
import { NO_KEYS, unmarked } from './shown'

describe('the keys an example shows', () => {
  it('are none before an example plays', () => {
    expect(NO_KEYS.keys).toEqual([])
    expect(NO_KEYS.marks.size).toBe(0)
  })

  it('are shown as they are, none marked', () => {
    const shown = unmarked([midi(60), midi(64), midi(67)])
    expect(shown.keys).toEqual([60, 64, 67])
    expect(shown.marks.size).toBe(0)
  })
})
