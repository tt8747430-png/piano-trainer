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

  it('shows it on the key a hand chose it on', () => {
    const shown = melodyAlone(note('F', 1), midi(42))
    expect(shown.keys).toEqual([midi(42)])
    expect(shown.marks.get(midi(42))).toEqual({ tone: 'scale', label: 'F#' })
  })
})

describe('underMelody', () => {
  it('voices a chord close under the melody, the melody on top by its degree: C under E is G C E', () => {
    const holding = Object.values(chordsHolding(note('E'), C_MAJOR))
      .flat()
      .find((each) => noteName(each.chord.root) === 'C' && each.chord.suffix === '')
    if (!holding) throw new Error('C holds E in C major')
    const shown = underMelody(holding, note('E'))
    expect(shown.keys).toEqual([midi(67), midi(72), midi(76)])
    expect(shown.marks.get(midi(76))).toEqual({ tone: '3rd', label: holding.degree })
  })
})
