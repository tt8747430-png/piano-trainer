import { describe, expect, it } from 'vitest'
import type { PieceMusic } from '@/entities/piece'
import { createEditorStore, readDraft, type Layer } from '@/features/score-editor'
import { fieldClosedBy } from './fields'

const shown = { chordNames: true, lyrics: true, fingers: true }

/** The editor on a song, its caret on a row at its start. */
const caretOn = (layer: Layer, music: Partial<PieceMusic> = {}) => ({
  ...createEditorStore(
    readDraft({
      key: 'G',
      meter: '4/4',
      tempo: 90,
      pattern: 'r1',
      sections: [{ kind: 'verse', lines: ['G C'] }],
      melody: 'G4/4 | A4/4',
      hands: { rh: 'r/4 | r/4', lh: 'r/4 | r/4' },
      ...music,
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
    expect(fieldClosedBy('lyrics', caretOn('melody', { melody: 'r/4 | r/4' }), shown)).toBe(
      'noTune',
    )
  })

  it('opens the fingering field on a note of the piano’s staves, a chord’s too, where the View shows the fingers', () => {
    const chord = { hands: { rh: 'C4+E4+G4/4 | r/4', lh: 'r/4 | r/4' } }
    expect(fieldClosedBy('fingering', caretOn('rh', chord), shown)).toBeNull()
    expect(fieldClosedBy('fingering', caretOn('rh', chord), { ...shown, fingers: false })).toBe(
      'fingersHidden',
    )
    expect(fieldClosedBy('fingering', caretOn('melody', chord), shown)).toBe('hand')
    expect(fieldClosedBy('fingering', caretOn('lh', chord), shown)).toBe('chooseNote')
  })
})
