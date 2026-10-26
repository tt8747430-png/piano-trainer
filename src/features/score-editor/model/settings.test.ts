import { describe, expect, it } from 'vitest'
import { note } from '@/shared/lib/music'
import { draftOf, form, shape, staffNotes } from '../testing/test-draft'
import { setKey, setTempo } from './settings'

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
