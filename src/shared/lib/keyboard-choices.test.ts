import { describe, expect, it } from 'vitest'
import { KEY_SIZES } from './keyboard-choices'

describe('the key sizes', () => {
  it('run from all the keys to large keys, all the keys first (R34)', () => {
    expect(KEY_SIZES).toEqual(['piano', 'fit', 'large'])
  })
})
