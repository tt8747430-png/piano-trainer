import { describe, expect, it } from 'vitest'
import { isOneOf } from './is-one-of'
import { note } from './music'
import { readNote, valueOr, wholeIn } from './search-params'

const isMode = isOneOf(['listen', 'step', 'wait'] as const)

describe('valueOr', () => {
  it('keeps a value the guard accepts and replaces anything else', () => {
    expect(valueOr(isMode, 'step', 'listen')).toBe('step')
    expect(valueOr(isMode, 'dance', 'listen')).toBe('listen')
    expect(valueOr(isMode, 3, 'listen')).toBe('listen')
  })
})

describe('wholeIn', () => {
  it('reads a whole number in range, written as a number or as text', () => {
    expect(wholeIn(72, 40, 160, 80)).toBe(72)
    expect(wholeIn('96', 40, 160, 80)).toBe(96)
  })

  it('falls back for anything out of range, fractional or not a number', () => {
    for (const raw of [999, 39, 72.5, 'fast', '', null, undefined, [72]]) {
      expect(wholeIn(raw, 40, 160, 80)).toBe(80)
    }
  })

  it('falls back to nothing when the default is not known here', () => {
    expect(wholeIn('fast', 40, 160, undefined)).toBeUndefined()
  })
})

describe('readNote', () => {
  it('reads a note with at most one sharp or flat', () => {
    expect(readNote('Bb')).toEqual(note('B', -1))
    expect(readNote('B♭')).toEqual(note('B', -1))
    expect(readNote('F#')).toEqual(note('F', 1))
  })

  it('reads nothing from a double accidental, H, lower case or not a note', () => {
    for (const raw of ['Ebb', 'H', 'c', '', 7]) expect(readNote(raw)).toBeNull()
  })
})
