import { describe, expect, it } from 'vitest'
import { readDraft, type EditorState } from '@/features/score-editor'
import { midi } from '@/shared/lib/music'
import { caretSaid } from './caret-said'

const music = {
  key: 'D',
  meter: '4/4',
  tempo: 90,
  pattern: 'r1',
  sections: [{ kind: 'verse', lines: ['D A7'] }],
  hands: { rh: 'r/4 | r/4', lh: 'r/4 | r/4' },
} as const
const draft = readDraft({ ...music, staves: [{ notes: 'F#4/1.5 r/2.5 | A4/4' }] })
const at = (caret: number, layer: EditorState['layer']) => caretSaid({ draft, caret, layer })

describe('caretSaid', () => {
  it('names the bar, the beat and what is there', () => {
    expect(at(0, 'staff0')).toEqual({
      kind: 'notes',
      bar: 1,
      beat: '1',
      what: 'F#4',
      value: { value: 4, dots: 1, triplet: false },
    })
    expect(at(36, 'staff0')).toEqual({ kind: 'rest', bar: 1, beat: '2.5', what: '' })
    expect(at(96, 'chords')).toEqual({ kind: 'at', bar: 2, beat: '1', what: 'A7' })
    expect(at(120, 'lh')).toEqual({ kind: 'rest', bar: 2, beat: '2', what: '' })
    expect(at(192, 'staff0')).toEqual({ kind: 'end' })
  })

  it('says the grace notes chosen in their notes’ place, by their names (Flat’s)', () => {
    const graced = readDraft({ ...music, staves: [{ notes: 'F#4/4[gr:G4] r/4 r/2 | A4/4' }] })
    expect(caretSaid({ draft: graced, caret: 0, layer: 'staff0', grace: true })).toEqual({
      kind: 'grace',
      bar: 1,
      beat: '1',
      what: 'G4',
    })
  })

  it('says a chord as the sheet prints it, ♯ and ♭ as signs', () => {
    const sharp = readDraft({ ...music, sections: [{ kind: 'verse', lines: ['F#m Bb7'] }] })
    expect(caretSaid({ draft: sharp, caret: 0, layer: 'chords' })).toMatchObject({ what: 'F♯m' })
    expect(caretSaid({ draft: sharp, caret: 96, layer: 'chords' })).toMatchObject({ what: 'B♭7' })
  })

  it('says a bar of no chord has none in the chord row (ADR 0114)', () => {
    const empty = readDraft({ ...music, sections: [{ kind: 'verse', lines: ['D _'] }] })
    expect(caretSaid({ draft: empty, caret: 96, layer: 'chords' })).toEqual({
      kind: 'noChord',
      bar: 2,
      beat: '1',
    })
  })

  it('names a length no one value writes by no value', () => {
    const tied = readDraft({ ...music, staves: [{ notes: 'F#4/2.5 r/1.5 | A4/4' }] })
    expect(caretSaid({ draft: tied, caret: 0, layer: 'staff0' })).toMatchObject({
      kind: 'notes',
      value: null,
    })
  })

  it('says a note is held where it sounds on from before the caret', () => {
    expect(at(24, 'staff0')).toEqual({ kind: 'held', bar: 1, beat: '2', what: 'F#4' })
    expect(at(120, 'staff0')).toEqual({ kind: 'held', bar: 2, beat: '2', what: 'A4' })
  })

  it('names the mode where it is not Replace, on a staff alone (ADR 0114)', () => {
    expect(caretSaid({ draft, caret: 36, layer: 'staff0', mode: 'insert' })).toEqual({
      kind: 'rest',
      bar: 1,
      beat: '2.5',
      what: '',
      mode: 'insert',
    })
    expect(caretSaid({ draft, caret: 192, layer: 'staff0', mode: 'chord' })).toEqual({
      kind: 'end',
      mode: 'chord',
    })
    expect(caretSaid({ draft, caret: 0, layer: 'staff0', mode: 'replace' })).not.toHaveProperty(
      'mode',
    )
    expect(caretSaid({ draft, caret: 96, layer: 'chords', mode: 'insert' })).not.toHaveProperty(
      'mode',
    )
  })

  it('names one note of a chord chosen alone (ADR 0096)', () => {
    const chord = readDraft({ ...music, hands: { ...music.hands, rh: 'D4+F#4+A4/4 | r/4' } })
    expect(caretSaid({ draft: chord, caret: 0, layer: 'rh', chordNote: midi(66) })).toMatchObject({
      kind: 'notes',
      what: 'F#4',
    })
    expect(caretSaid({ draft: chord, caret: 0, layer: 'rh' })).toMatchObject({
      what: 'D4 F#4 A4',
    })
  })
})
