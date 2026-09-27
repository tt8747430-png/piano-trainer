import { describe, expect, it } from 'vitest'
import { WALK } from '@/features/practice'
import { note, noteParam } from '@/shared/lib/music'
import { walkChoice, walkPatch } from './walk-search'

const search = { root: noteParam(note('D')), kind: 'dorian' } as const

describe('walkChoice', () => {
  it('takes the walk’s own pattern and chord size where the URL chooses none', () => {
    expect(walkChoice(search)).toEqual({
      root: note('D'),
      kind: 'dorian',
      pattern: WALK.pattern,
      rh: null,
      lh: null,
      chordSize: WALK.chordSize,
    })
  })

  it('reads From the chart as the walk’s own pattern: its chart names no methods', () => {
    expect(walkChoice({ ...search, pattern: 'chart' }).pattern).toBe(WALK.pattern)
  })
})

describe('walkPatch', () => {
  it('writes a choice equal to the walk’s own as absent', () => {
    expect(walkPatch({ pattern: WALK.pattern })).toEqual({ pattern: undefined })
    expect(walkPatch({ chordSize: 'ninths', rh: 't1' })).toEqual({ chordSize: 'ninths', rh: 't1' })
  })
})
