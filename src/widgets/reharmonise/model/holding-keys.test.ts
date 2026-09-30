import { describe, expect, it } from 'vitest'
import { chordsHolding, midi, note, noteName } from '@/shared/lib/music'
import { melodyAlone, underMelody } from './holding-keys'

const C_MAJOR = { tonic: note('C'), minor: false }

describe('melodyAlone', () => {
  it('shows the melody note by itself, named, on its key from middle C', () => {
    const shown = melodyAlone(note('E'))
    expect(shown.keys).toEqual([midi(64)])
    expect(shown.marks.get(midi(64))).toEqual({ tone: 'scale', label: 'E' })
  })
})

describe('underMelody', () => {
  it('places a chord that holds the melody from middle C, the melody on top by its degree', () => {
    const holding = Object.values(chordsHolding(note('E'), C_MAJOR))
      .flat()
      .find((each) => noteName(each.chord.root) === 'C' && each.chord.suffix === '')
    if (!holding) throw new Error('C holds E in C major')
    const shown = underMelody(holding, note('E'))
    expect(shown.keys.at(-1)).toBe(midi(76))
    expect(shown.keys.slice(0, 3)).toEqual([midi(60), midi(64), midi(67)])
    expect(shown.marks.get(midi(76))).toEqual({ tone: '3rd', label: holding.degree })
  })
})
