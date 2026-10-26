import { describe, expect, it } from 'vitest'
import { note } from '@/shared/lib/music'
import { draftOf, form, shape, staffNotes } from '../testing/test-draft'
import { setKey, setTempo, transpose } from './settings'

describe('the song’s settings', () => {
  const draft = draftOf({
    key: 'C',
    sections: [{ kind: 'verse', lines: ['C G7/B'] }],
    staves: [{ notes: 'E4/4 | D4/4' }],
    hands: { lh: 'C3/4 | r/4' },
  })

  it('moves the music to a new tonic by the interval between them, letters kept', () => {
    const moved = setKey(draft, { tonic: note('E', -1), minor: false })
    expect(moved.key).toEqual({ tonic: note('E', -1), minor: false })
    expect(form(moved)).toEqual([[['E♭@0', 'B♭7/D@0']]])
    expect(shape(staffNotes(moved))).toEqual(['G4@0/96', 'F4@96/96'])
    expect(shape(moved.hands.lh)).toEqual(['E♭3@0/96'])
  })

  it('moves a section’s own key with the music (ADR 0089)', () => {
    const changing = draftOf({
      key: 'C',
      sections: [
        { kind: 'verse', lines: ['C'] },
        { kind: 'chorus', key: 'Eb', lines: ['Eb'] },
      ],
    })
    const moved = setKey(changing, { tonic: note('D'), minor: false })
    expect(moved.sections.map((section) => section.heading.key)).toEqual([undefined, 'F'])
  })

  it('changes only the key for the other mode of the same tonic', () => {
    const minor = setKey(draft, { tonic: note('C'), minor: true })
    expect(minor.key.minor).toBe(true)
    expect(staffNotes(minor)).toEqual(staffNotes(draft))
    expect(form(minor)).toEqual(form(draft))
  })

  it('sets the tempo within 40 to 160', () => {
    expect(setTempo(draft, 200).tempo).toBe(160)
    expect(setTempo(draft, 72).tempo).toBe(72)
  })
})

describe('transpose (ADR 0110)', () => {
  const draft = draftOf({
    key: 'C',
    sections: [{ kind: 'verse', lines: ['C G7/B'] }],
    staves: [{ notes: 'E4/4 | D4/4' }],
    hands: { lh: 'C3/4 | r/4' },
  })

  it('moves the key, the chords and the notes by semitones, the key spelled by its simplest signature', () => {
    const moved = transpose(draft, 3, { key: true, chords: true })
    expect(moved).toEqual(setKey(draft, { tonic: note('E', -1), minor: false }))
    // Six sharps rather than six flats are F♯'s, as the walks spell them.
    expect(transpose(draft, 6, { key: true, chords: true }).key).toEqual({
      tonic: note('F', 1),
      minor: false,
    })
  })

  it('leaves the chord symbols as they are, the notes moved, without Apply to chords', () => {
    const moved = transpose(draft, 3, { key: true, chords: false })
    expect(form(moved)).toEqual(form(draft))
    expect(shape(staffNotes(moved))).toEqual(['G4@0/96', 'F4@96/96'])
  })

  it('keeps the key signature, the notes and chords moved, without Apply to key', () => {
    const moved = transpose(draft, 2, { key: false, chords: true })
    expect(moved.key).toEqual(draft.key)
    expect(form(moved)).toEqual([[['D@0', 'A7/C#@0']]])
    expect(shape(staffNotes(moved))).toEqual(['F#4@0/96', 'E4@96/96'])
  })

  it('moves the notes alone with neither applied, and nothing by no semitone', () => {
    const moved = transpose(draft, 2, { key: false, chords: false })
    expect(moved.key).toEqual(draft.key)
    expect(form(moved)).toEqual(form(draft))
    expect(shape(moved.hands.lh)).toEqual(['D3@0/96'])
    expect(transpose(draft, 0, { key: true, chords: true })).toBe(draft)
  })
})
