import { describe, expect, it } from 'vitest'
import { draftOf } from '../testing/test-draft'
import { caretPlaces, itemAt, nextCaret, snapToChord, tapPlaces } from './caret'

describe('where a click lands', () => {
  const tune = draftOf({
    melody: 'B4/1 C5/1 D5/1 r/1 | A4/2 G4/2',
    sections: [{ kind: 'verse', lines: ['G C D'] }],
  })

  it('on a note’s start, or the place after a bar’s last note where it ends early, never an empty step', () => {
    // Bar 1: three quarters, then room for one: the place after them.
    expect(tapPlaces(tune, 'melody').filter((tick) => tick < 96)).toEqual([0, 24, 48, 72])
    // Bar 2: two halves, nothing between.
    expect(tapPlaces(tune, 'melody').filter((tick) => tick >= 96 && tick < 192)).toEqual([96, 144])
  })

  it('on a bar’s start where its row writes nothing: an empty bar', () => {
    expect(tapPlaces(tune, 'rh')).toEqual([0, 96, 192])
    expect(tapPlaces(tune, 'melody').filter((tick) => tick >= 192)).toEqual([192])
  })

  it('on a chord in the chords, or a bar’s start where it has none', () => {
    const chords = draftOf({ sections: [{ kind: 'verse', lines: ['G C-D'] }] })
    expect(tapPlaces(chords, 'chords')).toEqual([0, 96, 144])
  })
})

const tune = draftOf({
  melody: 'B4/1.5 A4/.5 G4/2 | C5/4',
  sections: [{ kind: 'verse', lines: ['G C-D'] }],
})

describe('the caret in a voice', () => {
  it('moves note to note, never inside one, where it would mark empty staff (ADR 0088)', () => {
    expect(nextCaret(tune, 'melody', 0, 24, 1)).toBe(36)
    expect(nextCaret(tune, 'melody', 36, 48, 1)).toBe(48)
    expect(nextCaret(tune, 'melody', 48, 24, 1)).toBe(96)
    expect(nextCaret(tune, 'melody', 96, 24, -1)).toBe(48)
  })

  it('moves a step of the value where nothing sounds: an empty bar, the room after the last note', () => {
    expect(nextCaret(tune, 'rh', 0, 24, 1)).toBe(24)
    expect(nextCaret(tune, 'rh', 24, 48, 1)).toBe(48)
    const short = draftOf({
      melody: 'B4/1 r/3 | r/4',
      sections: [{ kind: 'verse', lines: ['G C'] }],
    })
    expect(nextCaret(short, 'melody', 24, 24, 1)).toBe(48)
  })

  it('stops at the piece’s start and end', () => {
    expect(nextCaret(tune, 'melody', 0, 24, -1)).toBe(0)
    expect(nextCaret(tune, 'melody', 192, 24, 1)).toBe(192)
  })
})

describe('what stands at a place', () => {
  it('is the notes starting there, to the longest’s end', () => {
    expect(itemAt(tune, 'melody', 0)).toEqual({ from: 0, to: 36 })
    expect(itemAt(tune, 'melody', 96)).toEqual({ from: 96, to: 192 })
  })

  it('is an empty place to the next note or the barline', () => {
    expect(itemAt(tune, 'rh', 24)).toEqual({ from: 24, to: 96 })
    const room = draftOf({
      melody: 'B4/1 r/3 | r/4',
      sections: [{ kind: 'verse', lines: ['G C'] }],
    })
    expect(itemAt(room, 'melody', 24)).toEqual({ from: 24, to: 96 })
  })

  it('is a chord to the next chord or the barline, an empty beat to the next beat', () => {
    expect(itemAt(tune, 'chords', 0)).toEqual({ from: 0, to: 96 })
    expect(itemAt(tune, 'chords', 96)).toEqual({ from: 96, to: 144 })
    expect(itemAt(tune, 'chords', 24)).toEqual({ from: 24, to: 48 })
  })

  it('is a chord to the next chord of its bar after a pickup too, the bar not starting at 0', () => {
    const pickup = draftOf({ sections: [{ kind: 'verse', lines: ['G@1 C-D'] }] })
    expect(itemAt(pickup, 'chords', 24)).toEqual({ from: 24, to: 72 })
    expect(itemAt(pickup, 'chords', 72)).toEqual({ from: 72, to: 120 })
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
