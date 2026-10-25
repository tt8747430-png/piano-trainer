import { describe, expect, it } from 'vitest'
import { createEditorStore, readDraft, type Layer } from '@/features/score-editor'
import { fieldClosedBy } from './fields'

const shown = { chordNames: true, lyrics: true }

/** The editor on a song, its caret on a row. */
const caretOn = (layer: Layer, melody = 'G4/4 | A4/4') => ({
  ...createEditorStore(
    readDraft({
      key: 'G',
      meter: '4/4',
      tempo: 90,
      pattern: 'r1',
      sections: [{ kind: 'verse', lines: ['G C'] }],
      melody,
      hands: { rh: 'r/4 | r/4', lh: 'r/4 | r/4' },
    }),
    () => {},
  ).getState(),
  layer,
})

describe('the fields over the sheet (ADR 0096)', () => {
  it('opens the chord symbol’s where the View shows the chord symbols, saying so where it does not', () => {
    expect(fieldClosedBy('chord', caretOn('rh'), shown)).toBeNull()
    expect(fieldClosedBy('chord', caretOn('rh'), { ...shown, chordNames: false })).toBe(
      'chordsHidden',
    )
  })

  it('opens the Lyrics field on the staff the words go on, where the View shows them and the tune has a note', () => {
    expect(fieldClosedBy('lyrics', caretOn('melody'), shown)).toBeNull()
    expect(fieldClosedBy('lyrics', caretOn('lh'), shown)).toBe('lyricsOn.melody')
    expect(fieldClosedBy('lyrics', caretOn('melody'), { ...shown, lyrics: false })).toBe(
      'lyricsHidden',
    )
    expect(fieldClosedBy('lyrics', caretOn('melody', 'r/4 | r/4'), shown)).toBe('noTune')
  })
})
