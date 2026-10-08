import { describe, expect, it } from 'vitest'
import { progressionById, type LibraryProgression } from '@/entities/progression-library'
import { keyParam, note, type ChordSize } from '@/shared/lib/music'
import { changedView, chosenView, playerSearch, type ProgressionsView } from './progressions-view'

const major = (...tonic: Parameters<typeof note>) =>
  keyParam({ tonic: note(...tonic), minor: false })
const minor = (...tonic: Parameters<typeof note>) =>
  keyParam({ tonic: note(...tonic), minor: true })
const view = (key: ProgressionsView['key'], p: string, size: ChordSize): ProgressionsView => ({
  key,
  p,
  size,
})
const library = (id: string): LibraryProgression => {
  const progression = progressionById(id)
  if (!progression) throw new RangeError(`No progression ${id}`)
  return progression
}

describe('changedView', () => {
  it('takes the jazz cadence to its minor version when the key turns minor, at the size shown', () => {
    expect(changedView(view(major('C'), 'ii-V-I', 'sevenths'), { key: minor('C') })).toEqual(
      view(minor('C'), 'ii°-V-i', 'sevenths'),
    )
  })

  it('takes the minor version back when the key turns major', () => {
    expect(changedView(view(minor('C'), 'ii°-V-i', 'ninths'), { key: major('C') })).toEqual(
      view(major('C'), 'ii-V-I', 'ninths'),
    )
  })

  it('keeps a line the library holds in one mode only, and a line a learner typed', () => {
    expect(changedView(view(major('C'), 'I-V-vi-IV', 'triads'), { key: minor('C') }).p).toBe(
      'I-V-vi-IV',
    )
    expect(changedView(view(major('C'), 'I-I-IV', 'triads'), { key: minor('C') }).p).toBe('I-I-IV')
  })

  it('keeps the progression in another key of the same mode', () => {
    expect(changedView(view(major('C'), 'ii-V-I', 'sevenths'), { key: major('G') })).toEqual(
      view(major('G'), 'ii-V-I', 'sevenths'),
    )
  })

  it('takes the line and the size as they are changed', () => {
    const shown = view(minor('A'), 'i-iv-V-i', 'triads')
    expect(changedView(shown, { size: 'ninths' })).toEqual({ ...shown, size: 'ninths' })
    expect(changedView(shown, { p: 'I-I-IV' })).toEqual({ ...shown, p: 'I-I-IV' })
  })
})

describe('chosenView', () => {
  it('takes a progression in the key of the same tonic and its mode, at its own chord size', () => {
    expect(chosenView(view(major('A'), 'I-V-vi-IV', 'triads'), library('minor-two-five'))).toEqual(
      view(minor('A'), 'ii°-V-i', 'ninths'),
    )
  })

  it('keeps the chord size shown where the progression has none of its own', () => {
    expect(chosenView(view(minor('A'), 'i-iv-V-i', 'sevenths'), library('axis'))).toEqual(
      view(major('A'), 'I-V-vi-IV', 'sevenths'),
    )
  })

  it('keeps the tonic as it is written, respelled only where no signature writes the key', () => {
    expect(chosenView(view(major('C', 1), 'I-V-vi-IV', 'triads'), library('basic-rock')).key).toBe(
      major('C', 1),
    )
    expect(chosenView(view(major('D', -1), 'I-V-vi-IV', 'triads'), library('minor-pop')).key).toBe(
      minor('C', 1),
    )
  })
})

describe('playerSearch', () => {
  it('opens the Player on what is shown, with the pattern the library’s progression is practised in', () => {
    expect(playerSearch(view(major('C'), 'ii-V-I', 'sevenths'))).toEqual({
      p: 'ii-V-I',
      key: major('C'),
      chordSize: 'sevenths',
      pattern: 'jazz',
    })
  })

  it('leaves out the Player’s own chord size, and a pattern a typed line has none of', () => {
    expect(playerSearch(view(major('G'), 'I-I-IV', 'triads'))).toEqual({
      p: 'I-I-IV',
      key: major('G'),
    })
  })
})
