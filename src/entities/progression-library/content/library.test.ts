import { describe, expect, it } from 'vitest'
import { parseNumerals } from '@/shared/lib/music'
import { PROGRESSION_LIBRARY, PROGRESSION_STYLES } from '../index'

describe('the progressions library', () => {
  it('has unique ids, every name in English and Russian', () => {
    const ids = PROGRESSION_LIBRARY.map((each) => each.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const each of PROGRESSION_LIBRARY) {
      expect(each.name.en.trim(), each.id).not.toBe('')
      expect(each.name.ru.trim(), each.id).not.toBe('')
    }
  })

  it('writes every progression in numerals the kernel reads', () => {
    for (const each of PROGRESSION_LIBRARY)
      expect(parseNumerals(each.numerals), each.id).not.toBeNull()
  })

  it('has a progression in every style, the minor ones in their own', () => {
    for (const style of PROGRESSION_STYLES) {
      expect(
        PROGRESSION_LIBRARY.some((each) => each.style === style),
        style,
      ).toBe(true)
    }
    for (const each of PROGRESSION_LIBRARY) expect(each.minor, each.id).toBe(each.style === 'minor')
  })
})
