import { describe, expect, it } from 'vitest'
import type { NamedKeys } from '@/shared/lib'
import { midi, type Midi } from '@/shared/lib/music'
import { keyLook, type KeyMark, type KeyText } from './key-look'

const C4 = midi(60)
const CS4 = midi(61)
const root = new Map<Midi, KeyMark>([[C4, { tone: 'root', label: '1' }]])
const UNNAMED: KeyText = { namedKeys: 'none' }

describe('keyLook', () => {
  it('leaves a key with nothing on it white or black', () => {
    expect(keyLook(C4, {}, UNNAMED)).toEqual({
      fill: 'white',
      down: false,
      outlined: false,
      quiet: false,
    })
    expect(keyLook(CS4, {}, UNNAMED).fill).toBe('black')
  })

  it('colours a marked key and carries its label', () => {
    expect(keyLook(C4, { marks: root }, UNNAMED)).toMatchObject({
      fill: 'root',
      label: { kind: 'mark', text: '1' },
    })
  })

  it('colours a scale’s keys whole: the tonic deep, the other notes light, black keys too', () => {
    const scale = new Map<Midi, KeyMark>([
      [C4, { tone: 'tonic', label: '1' }],
      [CS4, { tone: 'scale', label: '♭2' }],
    ])
    expect(keyLook(C4, { marks: scale }, UNNAMED)).toMatchObject({
      fill: 'tonic',
      label: { kind: 'mark', text: '1' },
    })
    expect(keyLook(CS4, { marks: scale }, UNNAMED)).toMatchObject({
      fill: 'scale',
      label: { kind: 'mark', text: '♭2' },
    })
  })

  it('names every C, every key, or none, and a mark’s label wins', () => {
    const name = (key: Midi, namedKeys: NamedKeys) => keyLook(key, {}, { namedKeys }).label
    expect(name(C4, 'c')).toEqual({ kind: 'name', text: 'C4' })
    expect(name(midi(62), 'c')).toBeUndefined()
    expect([name(C4, 'all'), name(CS4, 'all')]).toEqual([
      { kind: 'name', text: 'C4' },
      { kind: 'name', text: 'C#' },
    ])
    expect(name(C4, 'none')).toBeUndefined()
    expect(keyLook(C4, { marks: root }, { namedKeys: 'all' }).label).toEqual({
      kind: 'mark',
      text: '1',
    })
  })

  it('carries a typing key’s letter', () => {
    expect(keyLook(C4, {}, { namedKeys: 'none', letters: new Map([[C4, 'A']]) }).letter).toBe('A')
  })

  it('holds back only a marked key', () => {
    const quiet = new Set([C4, midi(62)])
    expect(keyLook(C4, { marks: root, quiet }, UNNAMED).quiet).toBe(true)
    expect(keyLook(midi(62), { marks: root, quiet }, UNNAMED).quiet).toBe(false)
  })

  it('puts a key down over whatever it shows', () => {
    const down = new Set([C4])
    expect(keyLook(C4, { down }, UNNAMED)).toMatchObject({ fill: 'white', down: true })
    expect(keyLook(C4, { marks: root, down }, UNNAMED)).toMatchObject({ fill: 'root', down: true })
  })

  it('shows a wrong key over a lit one, a lit one over a mark, a mark over a selection', () => {
    const all = new Set([C4])
    const fill = (states: Parameters<typeof keyLook>[1]) => keyLook(C4, states, UNNAMED).fill
    expect(fill({ marks: root, lit: all, selected: all, wrong: all })).toBe('wrong')
    expect(fill({ marks: root, lit: all, selected: all })).toBe('lit')
    expect(fill({ marks: root, selected: all })).toBe('root')
    expect(fill({ selected: all })).toBe('selected')
  })

  it('outlines a key whatever its fill', () => {
    expect(keyLook(C4, { outlined: new Set([C4]) }, UNNAMED)).toMatchObject({
      fill: 'white',
      outlined: true,
    })
  })
})
