import { describe, expect, it } from 'vitest'
import { readDraft, type EditorState } from '@/features/score-editor'
import { caretSaid } from './caret-said'

const music = {
  key: 'D',
  meter: '4/4',
  tempo: 90,
  pattern: 'r1',
  sections: [{ kind: 'verse', lines: ['D A7'] }],
} as const
const draft = readDraft({ ...music, melody: 'F#4/1.5 r/2.5 | A4/4' })
const at = (caret: number, layer: EditorState['layer']) => caretSaid({ draft, caret, layer })

describe('caretSaid', () => {
  it('names the bar, the beat and what is there', () => {
    expect(at(0, 'melody')).toEqual({
      kind: 'notes',
      bar: 1,
      beat: '1',
      what: 'F#4',
      value: { value: 4, dots: 1, triplet: false },
    })
    expect(at(18, 'melody')).toEqual({ kind: 'rest', bar: 1, beat: '2.5', what: '' })
    expect(at(48, 'chords')).toEqual({ kind: 'at', bar: 2, beat: '1', what: 'A7' })
    expect(at(60, 'lh')).toEqual({ kind: 'pattern', bar: 2, beat: '2', what: '' })
    expect(at(96, 'melody')).toEqual({ kind: 'end' })
  })

  it('names a length no one value writes by no value', () => {
    const tied = readDraft({ ...music, melody: 'F#4/2.5 r/1.5 | A4/4' })
    expect(caretSaid({ draft: tied, caret: 0, layer: 'melody' })).toMatchObject({
      kind: 'notes',
      value: null,
    })
  })

  it('says a note is held where it sounds on from before the caret', () => {
    expect(at(12, 'melody')).toEqual({ kind: 'held', bar: 1, beat: '2', what: 'F#4' })
    expect(at(60, 'melody')).toEqual({ kind: 'held', bar: 2, beat: '2', what: 'A4' })
  })
})
