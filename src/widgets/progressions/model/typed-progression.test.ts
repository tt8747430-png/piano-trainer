import { describe, expect, it } from 'vitest'
import { note, numeralText } from '@/shared/lib/music'
import { readProgression } from './typed-progression'

const C = { tonic: note('C'), minor: false }
const read = (text: string) => readProgression(text, C)?.map(numeralText) ?? null

describe('readProgression', () => {
  it('reads numerals as written', () => {
    expect(read('I–V–vi–IV')).toEqual(['I', 'V', 'vi', 'IV'])
  })

  it('reads chords as their numerals in the key', () => {
    expect(read('Am F C G')).toEqual(['vi', 'IV', 'I', 'V'])
    expect(read('Dm7, G7, CMaj7')).toEqual(['ii7', 'V7', 'IMaj7'])
  })

  it('reads nothing it cannot write as numerals', () => {
    expect(read('Csus4 G')).toBeNull()
    expect(read('Qx')).toBeNull()
    expect(read('')).toBeNull()
  })
})
