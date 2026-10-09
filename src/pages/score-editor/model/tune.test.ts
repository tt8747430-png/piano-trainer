import { describe, expect, it } from 'vitest'
import { readDraft } from '@/features/score-editor'
import { arrangeDraft } from './arrange-draft'
import { tuneOf } from './tune'

/** At 120 a beat is half a second. */
const draft = readDraft({
  key: 'C',
  meter: '4/4',
  tempo: 120,
  pattern: 'block',
  sections: [{ kind: 'verse', lines: ['C G'] }],
  melody: 'E4/2 F4/2 | D4/1 E4/1 C4/2',
})
/** The tune's keys as the Player plays them. */
const tune = arrangeDraft(draft)
  .notes.filter((note) => note.hand === 'melody')
  .map((note) => note.midi)

describe('tuneOf', () => {
  it('plays the tune alone, no hand’s notes', () => {
    expect(tune).toHaveLength(5)
    expect(tuneOf(draft, 0).map(({ midi }) => midi)).toEqual(tune)
  })

  it('plays it from a bar at the song’s tempo, that bar’s first note at 0 s', () => {
    expect(tuneOf(draft, 1).map(({ midi, at }) => [midi, at])).toEqual([
      [tune[2], 0],
      [tune[3], 0.5],
      [tune[4], 1],
    ])
  })
})
