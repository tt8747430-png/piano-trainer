import { describe, expect, it } from 'vitest'
import { TICKS_PER_BEAT } from '@/shared/lib/music'
import { draftOf } from '../testing/test-draft'
import { caretPlaces, itemAt, nextCaret, snapToChord, tapPlaces } from './caret'

const B = TICKS_PER_BEAT

describe('where a click lands', () => {
  const tune = draftOf({
    staves: [{ notes: 'B4/1 C5/1 D5/1 r/1 | A4/2 G4/2' }],
    sections: [{ kind: 'verse', lines: ['G C D'] }],
  })

  it('on a note’s start, or the place after a bar’s last note where it ends early, never an empty step', () => {
    // Bar 1: three quarters, then room for one: the place after them.
    expect(tapPlaces(tune, 'staff0').filter((tick) => tick < 4 * B)).toEqual([0, B, 2 * B, 3 * B])
    // Bar 2: two halves, nothing between.
    expect(tapPlaces(tune, 'staff0').filter((tick) => tick >= 4 * B && tick < 8 * B)).toEqual([
      4 * B,
      6 * B,
    ])
  })

  it('on a bar’s start where its row writes nothing: an empty bar', () => {
    expect(tapPlaces(tune, 'rh')).toEqual([0, 4 * B, 8 * B])
    expect(tapPlaces(tune, 'staff0').filter((tick) => tick >= 8 * B)).toEqual([8 * B])
  })

  it('on a chord in the chords, or a bar’s start where it has none', () => {
    const chords = draftOf({ sections: [{ kind: 'verse', lines: ['G C-D'] }] })
    expect(tapPlaces(chords, 'chords')).toEqual([0, 4 * B, 6 * B])
  })
})

const tune = draftOf({
  staves: [{ notes: 'B4/1.5 A4/.5 G4/2 | C5/4' }],
  sections: [{ kind: 'verse', lines: ['G C-D'] }],
})

describe('the caret in a voice', () => {
  it('moves note to note, never inside one, where it would mark empty staff (ADR 0096)', () => {
    expect(nextCaret(tune, 'staff0', 0, B, 1)).toBe(1.5 * B)
    expect(nextCaret(tune, 'staff0', 1.5 * B, 2 * B, 1)).toBe(2 * B)
    expect(nextCaret(tune, 'staff0', 2 * B, B, 1)).toBe(4 * B)
    expect(nextCaret(tune, 'staff0', 4 * B, B, -1)).toBe(2 * B)
  })

  it('moves a step of the value where nothing sounds: an empty bar, the room after the last note', () => {
    expect(nextCaret(tune, 'rh', 0, B, 1)).toBe(B)
    expect(nextCaret(tune, 'rh', B, 2 * B, 1)).toBe(2 * B)
    const short = draftOf({
      staves: [{ notes: 'B4/1 r/3 | r/4' }],
      sections: [{ kind: 'verse', lines: ['G C'] }],
    })
    expect(nextCaret(short, 'staff0', B, B, 1)).toBe(2 * B)
  })

  it('stops at the piece’s start and end', () => {
    expect(nextCaret(tune, 'staff0', 0, B, -1)).toBe(0)
    expect(nextCaret(tune, 'staff0', 8 * B, B, 1)).toBe(8 * B)
  })
})

describe('what stands at a place', () => {
  it('is the notes starting there, to the longest’s end', () => {
    expect(itemAt(tune, 'staff0', 0)).toEqual({ from: 0, to: 1.5 * B })
    expect(itemAt(tune, 'staff0', 4 * B)).toEqual({ from: 4 * B, to: 8 * B })
  })

  it('is an empty place to the next note or the barline', () => {
    expect(itemAt(tune, 'rh', B)).toEqual({ from: B, to: 4 * B })
    const room = draftOf({
      staves: [{ notes: 'B4/1 r/3 | r/4' }],
      sections: [{ kind: 'verse', lines: ['G C'] }],
    })
    expect(itemAt(room, 'staff0', B)).toEqual({ from: B, to: 4 * B })
  })

  it('is a chord to the next chord or the barline, an empty beat to the next beat', () => {
    expect(itemAt(tune, 'chords', 0)).toEqual({ from: 0, to: 4 * B })
    expect(itemAt(tune, 'chords', 4 * B)).toEqual({ from: 4 * B, to: 6 * B })
    expect(itemAt(tune, 'chords', B)).toEqual({ from: B, to: 2 * B })
  })

  it('is a chord to the next chord of its bar after a pickup too, the bar not starting at 0', () => {
    const pickup = draftOf({ sections: [{ kind: 'verse', lines: ['G@1 C-D'] }] })
    expect(itemAt(pickup, 'chords', B)).toEqual({ from: B, to: 3 * B })
    expect(itemAt(pickup, 'chords', 3 * B)).toEqual({ from: 3 * B, to: 5 * B })
  })
})

describe('the caret in the chords', () => {
  it('stands on each beat and each chord’s start', () => {
    expect(caretPlaces(tune, 'chords', B)).toEqual([0, B, 2 * B, 3 * B, 4 * B, 5 * B, 6 * B, 7 * B])
    const halves = draftOf({ sections: [{ kind: 'verse', lines: ['G@1.5-D@2.5'] }] })
    expect(caretPlaces(halves, 'chords', B)).toEqual([0, B, 1.5 * B, 2 * B, 3 * B])
  })

  it('stands at a bar of no chord’s start alone, where its chord would go (ADR 0114)', () => {
    const empty = draftOf({ sections: [{ kind: 'verse', lines: ['G _ D'] }] })
    expect(caretPlaces(empty, 'chords', B)).toEqual([
      0,
      B,
      2 * B,
      3 * B,
      4 * B,
      8 * B,
      9 * B,
      10 * B,
      11 * B,
    ])
    expect(snapToChord(empty, 6.25 * B)).toBe(4 * B)
    expect(tapPlaces(empty, 'chords')).toEqual([0, 4 * B, 8 * B])
    expect(itemAt(empty, 'chords', 4 * B)).toEqual({ from: 4 * B, to: 8 * B })
  })

  it('moves among them, and snaps down onto one', () => {
    expect(nextCaret(tune, 'chords', 3 * B, B, 1)).toBe(4 * B)
    expect(nextCaret(tune, 'chords', 7 * B, B, 1)).toBe(7 * B)
    expect(snapToChord(tune, (10 * B) / 3)).toBe(3 * B)
    expect(snapToChord(tune, 8 * B)).toBe(7 * B)
  })
})
