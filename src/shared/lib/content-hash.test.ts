import { describe, expect, it } from 'vitest'
import { contentHash } from './content-hash'

describe('contentHash', () => {
  it('names a text by sixteen hex digits, the same text the same name', () => {
    expect(contentHash('a song')).toMatch(/^[0-9a-f]{16}$/)
    expect(contentHash('a song')).toBe(contentHash('a song'))
    expect(contentHash('a song')).not.toBe(contentHash('a song!'))
  })
})
