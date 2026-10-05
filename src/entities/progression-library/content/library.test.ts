import { describe, expect, it } from 'vitest'
import { parseNumerals } from '@/shared/lib/music'
import {
  COMMON_PROGRESSIONS,
  libraryParam,
  libraryProgression,
  PROGRESSION_LIBRARY,
  PROGRESSION_STYLES,
} from '../index'

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

  it('writes each line of numerals once in its mode, so a line names its progression', () => {
    const lines = PROGRESSION_LIBRARY.map((each) => `${each.minor} ${libraryParam(each)}`)
    expect(new Set(lines).size).toBe(lines.length)
    for (const each of PROGRESSION_LIBRARY)
      expect(libraryProgression(libraryParam(each), each.minor), each.id).toBe(each)
    expect(libraryProgression('I-I-I', false)).toBeUndefined()
    expect(libraryProgression('I-V-vi-IV', true)).toBeUndefined()
  })

  it('says a note in both languages', () => {
    for (const each of PROGRESSION_LIBRARY) {
      if (!each.note) continue
      expect(each.note.en.trim(), each.id).not.toBe('')
      expect(each.note.ru.trim(), each.id).not.toBe('')
    }
  })

  it('keeps the ♭9 the resolutions teach', () => {
    const numerals = (id: string) => PROGRESSION_LIBRARY.find((each) => each.id === id)?.numerals
    expect(numerals('flat-nine-resolution')).toBe('V7♭9 I')
    expect(numerals('minor-flat-nine-resolution')).toBe('V7♭9 i')
    expect(numerals('minor-two-five')).toBe('iiø7 V7♭9 i')
  })

  it('offers a key its common progressions, a major key’s and a minor key’s in their own mode', () => {
    expect(COMMON_PROGRESSIONS.major.map((each) => each.id)).toEqual([
      'authentic',
      'doo-wop',
      'jazz-cadence',
      'axis',
    ])
    expect(COMMON_PROGRESSIONS.major.every((each) => !each.minor)).toBe(true)
    expect(COMMON_PROGRESSIONS.minor.every((each) => each.minor)).toBe(true)
  })
})
