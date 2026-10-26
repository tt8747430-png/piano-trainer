import { describe, expect, it } from 'vitest'
import { nextName } from './next-name'

describe('nextName', () => {
  it('offers the base name while it is free, else the first free number after it', () => {
    expect(nextName('New folder', ['Hymns'])).toBe('New folder')
    expect(nextName('New folder', [' new folder ', 'New folder 2'])).toBe('New folder 3')
    expect(nextName('New folder', ['New folder 2'])).toBe('New folder')
  })
})
