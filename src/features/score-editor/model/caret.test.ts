import { describe, expect, it } from 'vitest'
import { draftOf } from '../testing/test-draft'
import { chordPlaces, nextCaret, snapToChord } from './caret'

const tune = draftOf({
  melody: 'B4/1.5 A4/.5 G4/2 | C5/4',
  sections: [{ kind: 'verse', lines: ['G C-D'] }],
})

describe('the caret in a voice', () => {
  it('moves to the next note’s start or end, step of the value or barline, whichever is first', () => {
    expect(nextCaret(tune, 'melody', 0, 12, 1)).toBe(12)
    expect(nextCaret(tune, 'melody', 12, 12, 1)).toBe(18)
    expect(nextCaret(tune, 'melody', 18, 24, 1)).toBe(24)
    expect(nextCaret(tune, 'melody', 24, 48, 1)).toBe(48)
    expect(nextCaret(tune, 'melody', 48, 12, -1)).toBe(36)
  })

  it('stops at the piece’s start and end', () => {
    expect(nextCaret(tune, 'melody', 0, 12, -1)).toBe(0)
    expect(nextCaret(tune, 'melody', 96, 12, 1)).toBe(96)
  })
})

describe('the caret in the chords', () => {
  it('stands on each beat and each chord’s start', () => {
    expect(chordPlaces(tune)).toEqual([0, 12, 24, 36, 48, 60, 72, 84])
    const halves = draftOf({ sections: [{ kind: 'verse', lines: ['G@1.5-D@2.5'] }] })
    expect(chordPlaces(halves)).toEqual([0, 12, 18, 24, 36])
  })

  it('moves among them, and snaps down onto one', () => {
    expect(nextCaret(tune, 'chords', 36, 12, 1)).toBe(48)
    expect(nextCaret(tune, 'chords', 84, 12, 1)).toBe(84)
    expect(snapToChord(tune, 40)).toBe(36)
    expect(snapToChord(tune, 96)).toBe(84)
  })
})
