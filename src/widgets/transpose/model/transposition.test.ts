import { describe, expect, it } from 'vitest'
import {
  chordSymbol,
  keyParam,
  keySymbol,
  noteParam,
  numeralText,
  parseKey,
  parseNoteName,
  readChordLine,
} from '@/shared/lib/music'
import { transposition } from './transposition'

const ROMASHKI = 'Dm7 Gm9 Asus4 Dm7'
const of = (chords: string, view: { key?: string; to?: string } = {}) => {
  const key = view.key ? parseKey(view.key) : null
  const to = view.to ? parseNoteName(view.to) : null
  return transposition(readChordLine(chords).chords, {
    ...(key ? { key: keyParam(key) } : {}),
    ...(to ? { to: noteParam(to) } : {}),
  })
}
const symbols = (shown: ReturnType<typeof of>) =>
  shown?.chords.map(({ chord }) => chordSymbol(chord))
const captions = (shown: ReturnType<typeof of>) =>
  shown?.chords.map(({ numeral }) => (numeral ? numeralText(numeral) : null))

describe('transposition', () => {
  it('reads the chords in the key found first, and plays them there', () => {
    const shown = of(ROMASHKI)
    expect(shown && keySymbol(shown.read.key)).toBe('Dm')
    expect(shown && keySymbol(shown.to)).toBe('Dm')
    expect(symbols(shown)).toEqual(['Dm7', 'Gm9', 'Asus4', 'Dm7'])
    expect(captions(shown)).toEqual(['i7', 'iv9', 'Vsus4', 'i7'])
  })

  it('offers the three keys found first', () => {
    expect(of(ROMASHKI)?.keys.map(({ key }) => keySymbol(key))).toEqual(['Dm', 'F', 'Gm'])
  })

  it('reads them in the key chosen, offered among the others where it is not', () => {
    const shown = of(ROMASHKI, { key: 'Am' })
    expect(shown && keySymbol(shown.read.key)).toBe('Am')
    expect(shown?.keys.map(({ key }) => keySymbol(key))).toEqual(['Dm', 'F', 'Gm', 'Am'])
    expect(captions(shown)).toEqual(['iv7', 'vii9', 'Isus4', 'iv7'])
  })

  it('reads them in the key found first where the key chosen holds none of them', () => {
    const shown = of('C F G C', { key: 'F#m' })
    expect(shown && keySymbol(shown.read.key)).toBe('C')
  })

  it('plays them on the tonic chosen, in the read key’s mode, letters and basses moved with it', () => {
    const shown = of('Dm Gm D/F# Gm A7 Dm', { to: 'G' })
    expect(shown && keySymbol(shown.to)).toBe('Gm')
    expect(symbols(shown)).toEqual(['Gm', 'Cm', 'G/B', 'Cm', 'D7', 'Gm'])
    expect(captions(shown)).toEqual(['i', 'iv', 'V/iv', 'iv', 'V7', 'i'])
  })

  it('says which chords are out of the key', () => {
    expect(of('Dm D Gm', { key: 'Dm' })?.chords.map(({ inKey }) => inKey)).toEqual([
      true,
      false,
      true,
    ])
  })

  it('shows nothing for no chords, or none any key holds', () => {
    expect(of('')).toBeNull()
  })
})
