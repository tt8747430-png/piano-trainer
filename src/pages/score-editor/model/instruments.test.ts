import { describe, expect, it } from 'vitest'
import type { PieceMusic } from '@/entities/piece'
import { readDraft } from '@/features/score-editor'
import { instrumentCount, voiceOf } from './instruments'

const draftOf = (music: Partial<PieceMusic> = {}) =>
  readDraft({
    key: 'C',
    meter: '4/4',
    tempo: 90,
    pattern: 'r1',
    sections: [{ kind: 'verse', lines: ['C'] }],
    ...music,
  })

describe('the score’s instruments (round 28)', () => {
  it('knows a voice by its printed name in either language', () => {
    expect(voiceOf({ en: 'Tenor', ru: 'Тенор' })).toBe('tenor')
    expect(voiceOf('Сопрано')).toBe('soprano')
    expect(voiceOf('Flute')).toBeUndefined()
    expect(voiceOf(undefined)).toBeUndefined()
  })

  it('counts the piano and hides it only where a staff stays in sight', () => {
    expect(instrumentCount(draftOf(), 'piano')).toEqual({ count: 1, fewer: null, more: null })
    const voiced = draftOf({ staves: [{ name: 'Voice', notes: 'C5/4' }] })
    expect(instrumentCount(voiced, 'piano').fewer).toEqual({ type: 'piano', hidden: true })
    const lead = draftOf({ staves: [{ name: 'Voice', notes: 'C5/4' }], leadSheet: true })
    expect(instrumentCount(lead, 'piano')).toEqual({
      count: 0,
      fewer: null,
      more: { type: 'piano', hidden: false },
    })
    // A lead sheet's only staff stays.
    expect(instrumentCount(lead, 'voice').fewer).toBeNull()
  })

  it('adds a voice with its own, in its clef, a choir stacked top down, and takes the last away', () => {
    const choir = draftOf({
      staves: [
        { name: 'Soprano', notes: 'C5/4' },
        { name: 'Bass', notes: 'C3/4', clef: 'bass' },
        { name: 'Horn', notes: 'C4/4' },
      ],
    })
    expect(instrumentCount(choir, 'soprano')).toEqual({
      count: 1,
      fewer: { type: 'removeStaff', place: 0 },
      more: { type: 'addStaff', place: 1, name: { en: 'Soprano', ru: 'Сопрано' }, clef: 'treble' },
    })
    expect(instrumentCount(choir, 'tenor').more).toEqual({
      type: 'addStaff',
      place: 1,
      name: { en: 'Tenor', ru: 'Тенор' },
      clef: 'treble-8vb',
    })
    expect(instrumentCount(choir, 'staff')).toEqual({
      count: 1,
      fewer: { type: 'removeStaff', place: 2 },
      more: { type: 'addStaff', place: 3 },
    })
  })
})
