import { describe, expect, it } from 'vitest'
import { keySymbol, parseKey, type Key } from './key'
import { degreeNames, enharmonicKey, neighbourKeys, parallelKey } from './key-relations'

const key = (text: string): Key => {
  const read = parseKey(text)
  if (!read) throw new Error(text)
  return read
}
const named = (each: Key | undefined) => (each ? keySymbol(each) : undefined)

describe('a key’s relations on the circle of fifths', () => {
  it('has a parallel key on its tonic, in the other mode, as a signature writes it', () => {
    expect(named(parallelKey(key('C')))).toBe('Cm')
    expect(named(parallelKey(key('Am')))).toBe('A')
    // No signature writes D♭ minor: its parallel is C♯ minor.
    expect(named(parallelKey(key('Db')))).toBe('C#m')
    expect(named(parallelKey(key('G#m')))).toBe('A♭')
  })

  it('is also written the other way where the circle’s two ends meet', () => {
    expect(named(enharmonicKey(key('B')))).toBe('C♭')
    expect(named(enharmonicKey(key('F#')))).toBe('G♭')
    expect(named(enharmonicKey(key('Db')))).toBe('C#')
    expect(named(enharmonicKey(key('Ebm')))).toBe('D#m')
    expect(named(enharmonicKey(key('Abm')))).toBe('G#m')
    expect(enharmonicKey(key('C'))).toBeUndefined()
    expect(enharmonicKey(key('Am'))).toBeUndefined()
  })

  it('stands between its dominant key, a sharp more, and its subdominant key, a flat more', () => {
    expect(neighbourKeys(key('C')).map(named)).toEqual(['F', 'G'])
    expect(neighbourKeys(key('Am')).map(named)).toEqual(['Dm', 'Em'])
    // Past seven sharps the circle goes on in flats.
    expect(neighbourKeys(key('C#')).map(named)).toEqual(['F#', 'A♭'])
    expect(neighbourKeys(key('Cb')).map(named)).toEqual(['E', 'G♭'])
  })

  it('names its scale’s degrees, a minor key’s seventh the subtonic', () => {
    expect(degreeNames(false)).toEqual([
      'tonic',
      'supertonic',
      'mediant',
      'subdominant',
      'dominant',
      'submediant',
      'leadingTone',
    ])
    expect(degreeNames(true).at(-1)).toBe('subtonic')
  })
})
