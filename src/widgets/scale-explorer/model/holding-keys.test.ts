import { describe, expect, it } from 'vitest'
import { chordsHolding, midi, note, noteName } from '@/shared/lib/music'
import { underMelody } from './holding-keys'

const C_MAJOR = { tonic: note('C'), minor: false }

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
