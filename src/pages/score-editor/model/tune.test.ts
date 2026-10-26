import { describe, expect, it } from 'vitest'
import { readDraft } from '@/features/score-editor'
import { arrangeDraft } from './arrange-draft'
import { hasTune, tuneOf } from './tune'

/** At 120 a beat is half a second. */
const draft = readDraft({
  key: 'C',
  meter: '4/4',
  tempo: 120,
  pattern: 'block',
  sections: [{ kind: 'verse', lines: ['C G'] }],
  staves: [{ notes: 'E4/2 F4/2 | D4/1 E4/1 C4/2' }, { notes: 'C4/4 | G3/4' }],
})
/** The single staves' keys as the Player plays them. */
const tune = arrangeDraft(draft)
  .notes.filter((note) => note.hand === 'staff')
  .map((note) => note.midi)

describe('tuneOf', () => {
  it('plays the single staves alone, no hand’s notes (ADR 0097)', () => {
    expect(tune).toHaveLength(7)
    expect(tuneOf(draft, 0).map(({ midi }) => midi)).toEqual(tune)
  })

  it('plays them from a bar at the song’s tempo, that bar’s first note at 0 s', () => {
    expect(tuneOf(draft, 1).map(({ midi, at }) => [midi, at])).toEqual([
      [55, 0],
      [62, 0],
      [64, 0.5],
      [60, 1],
    ])
  })
})

describe('hasTune', () => {
  it('is a song with a note on a single staff', () => {
    expect(hasTune(draft)).toBe(true)
    expect(hasTune({ ...draft, staves: [{ clef: 'treble', notes: [] }] })).toBe(false)
    expect(hasTune({ ...draft, staves: [] })).toBe(false)
  })
})
