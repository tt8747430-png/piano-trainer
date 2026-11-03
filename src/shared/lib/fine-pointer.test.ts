// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { stubMatchMedia } from '@/shared/test/match-media'
import { hasFinePointer } from './fine-pointer'

describe('hasFinePointer', () => {
  it('is true where a mouse or trackpad hovers', () => {
    stubMatchMedia({ dark: false, pointer: 'fine' })
    expect(hasFinePointer()).toBe(true)
  })

  it('is false on a phone', () => {
    stubMatchMedia({ dark: false, pointer: 'coarse' })
    expect(hasFinePointer()).toBe(false)
  })
})
