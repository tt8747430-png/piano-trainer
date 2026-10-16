import { describe, expect, it } from 'vitest'
import { keyParam, note, numeralText, type Key } from '@/shared/lib/music'
import { readProgression } from './typed-progression'

const C = { tonic: note('C'), minor: false }
const read = (text: string, key: Key = C) => {
  const typed = readProgression(text, key)
  return typed && { numerals: typed.numerals.map(numeralText), key: keyParam(typed.key) }
}

describe('readProgression', () => {
  it('reads numerals as written, in the key shown', () => {
    expect(read('I–V–vi–IV')).toEqual({ numerals: ['I', 'V', 'vi', 'IV'], key: 'C' })
    expect(read('IIm7 – V7 – Imaj7')).toEqual({ numerals: ['ii7', 'V7', 'IMaj7'], key: 'C' })
  })

  it('reads chords as their numerals in the key shown, where it holds them all', () => {
    expect(read('Am F C G')).toEqual({ numerals: ['vi', 'IV', 'I', 'V'], key: 'C' })
    expect(read('Dm7, G7, CMaj7')).toEqual({ numerals: ['ii7', 'V7', 'IMaj7'], key: 'C' })
    expect(read('Dm7 G7 C6')).toEqual({ numerals: ['ii7', 'V7', 'I6'], key: 'C' })
  })

  it('reads a song’s chords in the key they are most likely in, as Transpose did', () => {
    expect(read('Dm7 Gm9 Asus4 Dm7')).toEqual({
      numerals: ['i7', 'iv9', 'Vsus4', 'i7'],
      key: 'Dm',
    })
    expect(read('G C D G')).toEqual({ numerals: ['I', 'IV', 'V', 'I'], key: 'G' })
  })

  it('reads an applied dominant by the chord it leads to', () => {
    expect(read('C A7 Dm G7 C')).toEqual({
      numerals: ['I', 'V7/ii', 'ii', 'V7', 'I'],
      key: 'C',
    })
  })

  it('holds the key still while the first chords are typed', () => {
    expect(read('A')).toEqual({ numerals: ['VI'], key: 'C' })
    expect(read('Dm7 Gm9')).toEqual({ numerals: ['ii7', 'v9'], key: 'C' })
  })

  it('reads nothing it cannot write as numerals', () => {
    expect(read('Am Qx')).toBeNull()
    expect(read('Qx')).toBeNull()
    expect(read('')).toBeNull()
  })
})
