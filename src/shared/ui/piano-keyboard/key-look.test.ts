import { describe, expect, it } from 'vitest'
import { midi, type Midi } from '@/shared/lib/music'
import { keyLook } from './key-look'
import type { KeyMark } from './key-look'

const C4 = midi(60)
const CS4 = midi(61)
const root = new Map<Midi, KeyMark>([[C4, { tone: 'root', label: '1' }]])

describe('keyLook', () => {
  it('leaves a key with nothing on it white or black', () => {
    expect(keyLook(C4, {})).toEqual({ fill: 'white', down: false, outlined: false, band: false })
    expect(keyLook(CS4, {}).fill).toBe('black')
  })

  it('colours a marked key and carries its label', () => {
    expect(keyLook(C4, { marks: root })).toMatchObject({ fill: 'root', label: '1', band: false })
  })

  it('keeps a scale’s key white or black under a band with its label', () => {
    const scale = new Map<Midi, KeyMark>([[CS4, { tone: 'scale', label: '♭2' }]])
    expect(keyLook(CS4, { marks: scale })).toMatchObject({ fill: 'black', band: true, label: '♭2' })
  })

  it('puts a key down over whatever it shows', () => {
    const down = new Set([C4])
    expect(keyLook(C4, { down })).toMatchObject({ fill: 'white', down: true })
    expect(keyLook(C4, { marks: root, down })).toMatchObject({ fill: 'root', down: true })
  })

  it('shows a wrong key over a lit one, a lit one over a mark, a mark over a selection', () => {
    const all = new Set([C4])
    expect(keyLook(C4, { marks: root, lit: all, selected: all, wrong: all }).fill).toBe('wrong')
    expect(keyLook(C4, { marks: root, lit: all, selected: all }).fill).toBe('lit')
    expect(keyLook(C4, { marks: root, selected: all }).fill).toBe('root')
    expect(keyLook(C4, { selected: all }).fill).toBe('selected')
  })

  it('outlines a key whatever its fill', () => {
    expect(keyLook(C4, { outlined: new Set([C4]) })).toMatchObject({
      fill: 'white',
      outlined: true,
    })
  })
})
