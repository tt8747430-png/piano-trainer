import { describe, expect, it } from 'vitest'
import { note, parseNumerals } from '@/shared/lib/music'
import { walkPreview } from './walk-preview'

const C_MAJOR = { tonic: note('C'), minor: false }
const TWO_FIVE_ONE = parseNumerals('ii V I') ?? []

describe('walkPreview', () => {
  it('writes the sheet’s Шаг 2 for the ii–V–I down by whole tones: each I turns into the next ii', () => {
    expect(walkPreview(TWO_FIVE_ONE, C_MAJOR, 'tones-down', 'sevenths')).toBe(
      'Dm7 G7 CMaj7 · Cm7 F7 B♭Maj7 …',
    )
  })

  it('tells it from the keys round the circle of fifths', () => {
    expect(walkPreview(TWO_FIVE_ONE, C_MAJOR, 'fifths', 'sevenths')).toBe(
      'Dm7 G7 CMaj7 · Gm7 C7 FMaj7 …',
    )
    expect(walkPreview(TWO_FIVE_ONE, C_MAJOR, 'semitones-up', 'triads')).toBe(
      'Dm G C · E♭m A♭ D♭ …',
    )
  })
})
