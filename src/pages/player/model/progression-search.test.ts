import { BUILT_IN_PATTERNS } from '@/entities/pattern'
import { describe, expect, it } from 'vitest'
import { PROGRESSION } from '@/features/practice'
import { keyParam, note, numeralText } from '@/shared/lib/music'
import { progressionChoice, progressionPatch } from './progression-search'

const search = { p: 'ii-V-I', key: keyParam({ tonic: note('B', -1), minor: false }) }

describe('progressionChoice', () => {
  it('reads its numerals and key, with the Player’s own pattern and chord size where none is chosen', () => {
    const choice = progressionChoice(search, BUILT_IN_PATTERNS)
    expect(choice.numerals.map(numeralText)).toEqual(['ii', 'V', 'I'])
    expect(choice.key).toEqual({ tonic: note('B', -1), minor: false })
    expect(choice).toMatchObject({
      pattern: PROGRESSION.pattern,
      rh: null,
      lh: null,
      chordSize: PROGRESSION.chordSize,
    })
  })

  it('reads From the chart as its own pattern: its chart names no methods', () => {
    expect(progressionChoice({ ...search, pattern: 'chart' }, BUILT_IN_PATTERNS).pattern).toBe(
      PROGRESSION.pattern,
    )
  })

  it('reads a pattern or figure that plays the tune as its own: a progression has no tune', () => {
    expect(
      progressionChoice({ ...search, pattern: 'r6', rh: 'mel' }, BUILT_IN_PATTERNS),
    ).toMatchObject({
      pattern: PROGRESSION.pattern,
      rh: null,
    })
  })
})

describe('progressionPatch', () => {
  it('writes a choice equal to its own as absent', () => {
    expect(progressionPatch({ pattern: PROGRESSION.pattern })).toEqual({ pattern: undefined })
    expect(progressionPatch({ chordSize: 'sevenths' })).toEqual({ chordSize: 'sevenths' })
  })

  it('writes the key chosen', () => {
    const key = keyParam({ tonic: note('E'), minor: true })
    expect(progressionPatch({ key })).toEqual({ key })
  })
})
