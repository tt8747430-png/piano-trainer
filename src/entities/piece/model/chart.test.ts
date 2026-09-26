import { describe, expect, it } from 'vitest'
import { chordSymbol } from '@/shared/lib/music'
import { testProgression, testSong } from '../testing/test-pieces'
import { chartOf, hasMethodCodes, melodyOf } from './chart'

const firstSymbol = (...args: Parameters<typeof chartOf>) => {
  const chord = chartOf(...args).sections[0]?.lines[0]?.[0]?.chords[0]
  return chord && chordSymbol(chord)
}

describe('chartOf', () => {
  it('parses a song’s chart', () => {
    expect(firstSymbol(testSong(['Am7 D']))).toBe('Am7')
  })

  it('voices a progression by its default unless another is chosen', () => {
    const twoFive = testProgression('ii:min:4 V:dom:4 I:maj:8')
    expect(firstSymbol(twoFive)).toBe('Dm7')
    expect(firstSymbol(twoFive, 'ninths')).toBe('Dm9')
  })

  it('keeps a fixed chord size whatever is asked', () => {
    const fixed = testProgression('ii:min:4', {
      chordSize: { default: 'triads', choosable: false },
    })
    expect(firstSymbol(fixed, 'ninths')).toBe('Dm')
  })
})

describe('melodyOf', () => {
  it('reads a song’s tune; a progression has none', () => {
    expect(melodyOf(testSong(['C'], { melody: 'C4/4' }))).toHaveLength(1)
    expect(melodyOf(testSong(['C']))).toBeUndefined()
    expect(melodyOf(testProgression('I:maj:4'))).toBeUndefined()
  })
})

describe('hasMethodCodes', () => {
  it('is true only for a chart that names a method', () => {
    expect(hasMethodCodes(testSong(['C:t1 F']))).toBe(true)
    expect(hasMethodCodes(testSong(['C F']))).toBe(false)
    expect(hasMethodCodes(testProgression('I:maj:4'))).toBe(false)
  })
})
