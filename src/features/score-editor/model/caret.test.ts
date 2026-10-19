import { describe, expect, it } from 'vitest'
import { draftOf } from '../testing/test-draft'
import { caretPlaces, nextCaret, snapToChord } from './caret'

const tune = draftOf({
  melody: 'B4/1.5 A4/.5 G4/2 | C5/4',
  sections: [{ kind: 'verse', lines: ['G C-D'] }],
})

describe('the caret in a voice', () => {
  it('moves to the next note’s start or end, step of the value or barline, whichever is first', () => {
    expect(nextCaret(tune, 'melody', 0, 24, 1)).toBe(24)
    expect(nextCaret(tune, 'melody', 24, 24, 1)).toBe(36)
    expect(nextCaret(tune, 'melody', 36, 48, 1)).toBe(48)
    expect(nextCaret(tune, 'melody', 48, 96, 1)).toBe(96)
    expect(nextCaret(tune, 'melody', 96, 24, -1)).toBe(72)
  })

  it('stops at the piece’s start and end', () => {
    expect(nextCaret(tune, 'melody', 0, 24, -1)).toBe(0)
    expect(nextCaret(tune, 'melody', 192, 24, 1)).toBe(192)
  })
})

describe('the caret in the chords', () => {
  it('stands on each beat and each chord’s start', () => {
    expect(caretPlaces(tune, 'chords', 24)).toEqual([0, 24, 48, 72, 96, 120, 144, 168])
    const halves = draftOf({ sections: [{ kind: 'verse', lines: ['G@1.5-D@2.5'] }] })
    expect(caretPlaces(halves, 'chords', 24)).toEqual([0, 24, 36, 48, 72])
  })

  it('moves among them, and snaps down onto one', () => {
    expect(nextCaret(tune, 'chords', 72, 24, 1)).toBe(96)
    expect(nextCaret(tune, 'chords', 168, 24, 1)).toBe(168)
    expect(snapToChord(tune, 80)).toBe(72)
    expect(snapToChord(tune, 192)).toBe(168)
  })
})
