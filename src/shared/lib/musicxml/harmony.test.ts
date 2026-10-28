import { describe, expect, it } from 'vitest'
import { CHORD_QUALITIES, note, parseChordSymbol } from '@/shared/lib/music'
import { harmonyXml, readHarmony } from './harmony'
import { parseXml } from './xml'

describe('harmony', () => {
  it('writes every chord we know as a kind and its degrees, and reads it back', () => {
    for (const quality of CHORD_QUALITIES) {
      const chord = { root: note('E', -1), quality }
      expect(readHarmony(parseXml(harmonyXml(chord))), quality).toEqual(chord)
    }
    const slash = parseChordSymbol('D/F#')
    expect(readHarmony(parseXml(harmonyXml(slash)))).toEqual(slash)
  })

  it('writes a plain kind where one names the chord', () => {
    expect(harmonyXml(parseChordSymbol('Am7'))).toBe(
      '<harmony><root><root-step>A</root-step></root><kind text="m7">minor-seventh</kind></harmony>',
    )
  })

  it('reads another app’s chord: a kind with its degrees, or the text it prints', () => {
    const flatNine = parseXml(
      `<harmony><root><root-step>G</root-step></root><kind>dominant</kind>
       <degree><degree-value>9</degree-value><degree-alter>-1</degree-alter><degree-type>add</degree-type></degree></harmony>`,
    )
    expect(readHarmony(flatNine)).toEqual(parseChordSymbol('G7b9'))
    const text = parseXml(
      '<harmony><root><root-step>C</root-step></root><kind text="m7b5">other</kind></harmony>',
    )
    expect(readHarmony(text)).toEqual(parseChordSymbol('Cm7b5'))
    const none = parseXml(
      '<harmony><root><root-step>C</root-step></root><kind>none</kind></harmony>',
    )
    expect(readHarmony(none)).toBeUndefined()
    const numeral = parseXml(
      '<harmony><numeral><numeral-root>5</numeral-root></numeral><kind>major</kind></harmony>',
    )
    expect(readHarmony(numeral)).toBeUndefined()
  })
})
