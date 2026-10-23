import { describe, expect, it } from 'vitest'
import { readChordSymbol } from '@/shared/lib/music'
import { CHORD_KEYPAD, typedOn } from './chord-keypad'

const typing = (...keys: string[]) =>
  keys.reduce((text, shown) => {
    const key = CHORD_KEYPAD.flat().find((each) => each.shown === shown)
    if (!key) throw new Error(`no key ${shown}`)
    return typedOn(text, key.typed)
  }, '')

describe('the chord keypad', () => {
  it('types any chord a lead sheet writes, its sharps and flats as the app reads them', () => {
    expect(readChordSymbol('F#m7')).not.toBeNull()
    expect(readChordSymbol(typing('F', '♯', 'm', '7'))).toEqual(readChordSymbol('F#m7'))
    expect(readChordSymbol(typing('B', '♭', 'maj', '7'))).not.toBeNull()
    expect(readChordSymbol(typing('C', 'sus', '4'))).not.toBeNull()
    expect(readChordSymbol(typing('G', '7', '/', 'B'))).toMatchObject({ bass: { letter: 'B' } })
    expect(readChordSymbol(typing('E', '♭', 'dim', '7'))).not.toBeNull()
    expect(readChordSymbol(typing('A', 'm', 'add', '9'))).not.toBeNull()
  })

  it('takes the last character back', () => {
    expect(typedOn('Cmaj7', 'back')).toBe('Cmaj')
    expect(typedOn('', 'back')).toBe('')
  })
})
