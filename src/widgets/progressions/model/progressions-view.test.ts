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
  inversion: 0,
  nearest: true,
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

  it('shows a pop loop’s minor line, the same loop from its relative minor', () => {
    expect(changedView(view(major('C'), 'I-V-vi-IV', 'triads'), { key: minor('C') }).p).toBe(
      'i-VI-III-VII',
    )
  })

  it('keeps a line the library holds in one mode only, and a line a learner typed', () => {
    expect(
      changedView(view(major('C'), 'I-V-vi-iii-IV-I-IV-V', 'triads'), { key: minor('C') }).p,
    ).toBe('I-V-vi-iii-IV-I-IV-V')
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
  it('takes a progression in the key’s mode, at its own chord size', () => {
    expect(chosenView(view(minor('A'), 'i-iv-V-i', 'triads'), library('jazz-cadence'))).toEqual(
      view(minor('A'), 'ii°-V-i', 'sevenths'),
    )
    expect(chosenView(view(major('A'), 'I-IV-V-I', 'triads'), library('jazz-cadence'))).toEqual(
      view(major('A'), 'ii-V-I', 'sevenths'),
    )
  })

  it('takes a progression of one mode in the key of the same tonic and that mode', () => {
    expect(chosenView(view(major('A'), 'I-V-vi-IV', 'triads'), library('andalusian'))).toEqual(
      view(minor('A'), 'i-VII-VI-V', 'triads'),
    )
  })

  it('keeps the chord size shown where the progression has none of its own', () => {
    expect(chosenView(view(minor('A'), 'i-iv-V-i', 'sevenths'), library('axis'))).toEqual(
      view(minor('A'), 'i-VI-III-VII', 'sevenths'),
    )
  })

  it('keeps the tonic as it is written, respelled only where no signature writes the key', () => {
    expect(chosenView(view(major('C', 1), 'I-V-vi-IV', 'triads'), library('wild-thing')).key).toBe(
      major('C', 1),
    )
    expect(chosenView(view(major('D', -1), 'I-V-vi-IV', 'triads'), library('andalusian')).key).toBe(
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
      inversion: 0,
      nearest: true,
    })
  })

  it('leaves out the Player’s own chord size, and a pattern a typed line has none of', () => {
    expect(playerSearch(view(major('G'), 'I-I-IV', 'triads'))).toEqual({
      p: 'I-I-IV',
      key: major('G'),
      inversion: 0,
      nearest: true,
    })
  })
})

describe('the hand’s position', () => {
  it('keeps it as a progression is chosen', () => {
    const shown = {
      ...view(major('C'), 'I-V-vi-IV', 'triads'),
      inversion: 2 as const,
      nearest: false,
    }
    expect(chosenView(shown, library('axis'))).toMatchObject({ inversion: 2, nearest: false })
  })

  it('takes it into the Player, named even where it is the Player’s own', () => {
    const shown = view(major('C'), 'I-V-vi-IV', 'triads')
    expect(playerSearch(shown)).toMatchObject({ inversion: 0, nearest: true })
    expect(playerSearch({ ...shown, inversion: 1, nearest: false })).toMatchObject({
      inversion: 1,
      nearest: false,
    })
  })
})
