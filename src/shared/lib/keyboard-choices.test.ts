import { describe, expect, it } from 'vitest'
import { KEY_SIZES, PEDALS_SHOWN } from './keyboard-choices'

describe('the key sizes', () => {
  it('run from all the keys to large keys, all the keys first (R34)', () => {
    expect(KEY_SIZES).toEqual(['piano', 'fit', 'large'])
  })
})

describe('the pedals shown', () => {
  it('are the sustain pedal alone, or the piano’s three (R31-P)', () => {
    expect(PEDALS_SHOWN).toEqual(['sustain', 'all'])
  })
})
