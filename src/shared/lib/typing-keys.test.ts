import { describe, expect, it } from 'vitest'
import { midi } from './music'
import { moveTypingOctave, TYPING_START, typedKey, typingLetters } from './typing-keys'

describe('the typing keys', () => {
  it('plays the keys A to ’ from the typing C, black keys on the row above', () => {
    const c4 = midi(60)
    expect(['KeyA', 'KeyW', 'KeyJ', 'KeyK', 'Quote'].map((code) => typedKey(code, c4))).toEqual([
      60, 61, 71, 72, 77,
    ])
    expect(typedKey('KeyQ', c4)).toBeNull()
  })

  it('plays nothing past the piano’s top', () => {
    expect(typedKey('KeyA', midi(108))).toBe(108)
    expect(typedKey('KeyW', midi(108))).toBeNull()
  })

  it('moves the typing octave between C1 and C8', () => {
    expect(moveTypingOctave(midi(60), 1)).toBe(72)
    expect(moveTypingOctave(midi(24), -1)).toBe(24)
    expect(moveTypingOctave(midi(108), 1)).toBe(108)
  })

  it('letters each key it plays', () => {
    const letters = typingLetters(TYPING_START)
    expect(letters.size).toBe(18)
    expect([letters.get(midi(60)), letters.get(midi(61)), letters.get(midi(77))]).toEqual([
      'A',
      'W',
      "'",
    ])
  })
})
