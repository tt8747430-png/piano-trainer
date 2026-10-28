import { describe, expect, it } from 'vitest'
import { TICKS_PER_BEAT } from '@/shared/lib/music'
import { draftOf, form, lengths, shape, staffNotes } from '../testing/test-draft'
import {
  barLengths,
  copyBars,
  deleteBars,
  insertBar,
  insertBarBefore,
  joinLine,
  newLine,
  pasteBars,
  setBarTicks,
  setPickup,
} from './bars'
import { deleteChord } from './chords'

const B = TICKS_PER_BEAT

const sung = draftOf({
  sections: [{ kind: 'verse', lines: ['G C', 'D G'] }],
  staves: [{ notes: 'B4/4 | C5/2 E5/2 | D5/6 | B4/2' }],
  hands: { lh: 'r/4 | C3/4 | D3/4 | r/4' },
})

describe('insertBar', () => {
  it('adds a bar of no chord after, as notation software does, and moves the notes after it on', () => {
    const inserted = insertBar(sung, 0)
    expect(form(inserted)).toEqual([
      [
        ['G@0', '', 'C@0'],
        ['D@0', 'G@0'],
      ],
    ])
    expect(shape(staffNotes(inserted))).toEqual([
      'B4@0/4',
      'C5@8/2',
      'E5@10/2',
      'D5@12/6',
      'B4@18/2',
    ])
    expect(shape(inserted.hands.lh)).toEqual(['C3@8/4', 'D3@12/4'])
  })

  it('cuts a note held across where the bar goes in', () => {
    expect(shape(staffNotes(insertBar(sung, 2)))).toContain('D5@8/4')
  })

  it('adds a bar after a bar of no chord too', () => {
    const empty = draftOf({ sections: [{ kind: 'verse', lines: ['_'] }] })
    expect(form(insertBar(empty, 0))).toEqual([[['', '']]])
  })
})

describe('insertBarBefore', () => {
  it('adds a bar of no chord before, starting its line, the notes moved on', () => {
    const inserted = insertBarBefore(sung, 2)
    expect(form(inserted)).toEqual([
      [
        ['G@0', 'C@0'],
        ['', 'D@0', 'G@0'],
      ],
    ])
    expect(shape(inserted.hands.lh)).toEqual(['C3@4/4', 'D3@12/4'])
  })

  it('adds a bar before the first', () => {
    expect(form(insertBarBefore(sung, 0))).toEqual([
      [
        ['', 'G@0', 'C@0'],
        ['D@0', 'G@0'],
      ],
    ])
  })
})

describe('deleteBars', () => {
  it('takes bars with their notes, cutting a note held into them, and moves the rest back', () => {
    const deleted = deleteBars(sung, { from: 3, to: 3 })
    expect(form(deleted)).toEqual([[['G@0', 'C@0'], ['D@0']]])
    expect(shape(staffNotes(deleted))).toEqual(['B4@0/4', 'C5@4/2', 'E5@6/2', 'D5@8/4'])
  })

  it('takes a line or a section left empty', () => {
    const twoSections = draftOf({
      sections: [
        { kind: 'verse', lines: ['G C'] },
        { kind: 'chorus', lines: ['D'] },
      ],
    })
    expect(form(deleteBars(twoSections, { from: 2, to: 2 }))).toEqual([[['G@0', 'C@0']]])
  })

  it('keeps the piece’s last bar', () => {
    const one = draftOf({ sections: [{ kind: 'verse', lines: ['G'] }] })
    expect(deleteBars(one, { from: 0, to: 0 })).toBe(one)
  })
})

describe('copy and paste', () => {
  it('pastes bars with their notes after a bar', () => {
    const clip = copyBars(sung, { from: 1, to: 2 })
    expect(clip.kind).toBe('bars')
    const pasted = pasteBars(sung, 3, clip)
    expect(form(pasted)).toEqual([
      [
        ['G@0', 'C@0'],
        ['D@0', 'G@0', 'C@0', 'D@0'],
      ],
    ])
    expect(shape(staffNotes(pasted)).slice(-3)).toEqual(['C5@16/2', 'E5@18/2', 'D5@20/4'])
    expect(shape(pasted.hands.lh)).toEqual(['C3@4/4', 'D3@8/4', 'C3@16/4', 'D3@20/4'])
  })
})

describe('setBarTicks, a pickup', () => {
  it('shortens and lengthens a pickup at its start, its chords kept from its end', () => {
    const pickup = draftOf({
      sections: [{ kind: 'verse', lines: ['G@2-D@1 C'] }],
      staves: [{ notes: 'C4/1 D4/1 E4/1 | F4/4' }],
    })
    const short = setBarTicks(pickup, 0, B)
    expect(form(short)).toEqual([[['D@0', 'C@0']]])
    expect(shape(staffNotes(short))[0]).toBe('E4@0/1')
    const long = setBarTicks(short, 0, 2 * B)
    expect(form(long)).toEqual([[['D@0', 'C@0']]])
    expect(lengths(long)).toEqual([2, 4])
  })

  it('reads a first bar against its section’s own meter: a whole bar of it is none (ADR 0097)', () => {
    const waltz = draftOf({
      sections: [{ kind: 'verse', meter: '3/4', lines: ['G C'] }],
      staves: [{ notes: 'C4/1 D4/1 E4/1 | F4/3' }],
    })
    // A whole 3/4 bar made shorter is cut at its end, as any bar is: its first beats stay.
    expect(shape(staffNotes(setBarTicks(waltz, 0, 2 * B))).slice(0, 2)).toEqual([
      'C4@0/1',
      'D4@1/1',
    ])
  })
})

describe('setPickup (ADR 0114)', () => {
  const song = draftOf({
    sections: [{ kind: 'verse', lines: ['G C'] }],
    staves: [{ notes: 'C4/1 D4/1 E4/1 F4/1 | G4/4' }],
  })

  it('makes a whole first bar a pickup from its start: its last beats lead into the downbeat', () => {
    const pickup = setPickup(song, B)
    expect(lengths(pickup)).toEqual([1, 4])
    expect(shape(staffNotes(pickup)).slice(0, 2)).toEqual(['F4@0/1', 'G4@1/4'])
  })

  it('makes a pickup a whole bar again, room before it, and leaves a bar of its length as it is', () => {
    const whole = setPickup(setPickup(song, B), 4 * B)
    expect(lengths(whole)).toEqual([4, 4])
    expect(shape(staffNotes(whole))[0]).toBe('F4@3/1')
    expect(setPickup(song, 4 * B)).toBe(song)
    expect(setPickup(song, 0)).toBe(song)
    expect(setPickup(song, 5 * B)).toBe(song)
  })
})

describe('deleteBars, verses', () => {
  it('counts the verses left in order when a whole verse goes', () => {
    const three = draftOf({
      sections: [
        { kind: 'verse', n: 1, lines: ['G C'] },
        { kind: 'verse', n: 2, lines: ['D G'] },
        { kind: 'verse', n: 3, lines: ['C G'] },
      ],
    })
    const first = deleteBars(three, { from: 0, to: 1 })
    expect(first.sections.map((section) => section.heading.n)).toEqual([1, 2])
    const middle = deleteBars(three, { from: 2, to: 3 })
    expect(middle.sections.map((section) => section.heading.n)).toEqual([1, 2])
  })
})

describe('pasted bars', () => {
  it('are bars of their own: an edit of one leaves the bar it was copied from as it was', () => {
    const two = draftOf({ sections: [{ kind: 'verse', lines: ['G-C D'] }] })
    const pasted = pasteBars(two, 1, copyBars(two, { from: 0, to: 0 }))
    const edited = deleteChord(pasted, 2, 2 * B)
    expect(form(edited)).toEqual([[['G@0 C@2', 'D@0', 'G@0']]])
  })
})

describe('setBarTicks', () => {
  it('shortens a bar, taking its chords and notes past the new end, and moves the rest back', () => {
    const shorter = setBarTicks(
      draftOf({
        sections: [{ kind: 'verse', lines: ['G-D C'] }],
        staves: [{ notes: 'B4/1 A4/3 | G4/4' }],
      }),
      0,
      B,
    )
    expect(form(shorter)).toEqual([[['G@0', 'C@0']]])
    expect(shape(staffNotes(shorter))).toEqual(['B4@0/1', 'G4@1/4'])
    expect(lengths(shorter)).toEqual([1, 4])
  })

  it('lengthens a bar, moving the notes after it on', () => {
    const longer = setBarTicks(draftOf({ staves: [{ notes: 'B4/4 | G4/4' }] }), 0, 6 * B)
    expect(lengths(longer)).toEqual([6, 4])
    expect(shape(staffNotes(longer))).toEqual(['B4@0/4', 'G4@6/4'])
  })

  it('offers lengths from an eighth to the meter’s bar', () => {
    expect(barLengths('3/4')).toEqual([0.5, 1, 1.5, 2, 2.5, 3].map((beats) => beats * B))
    expect(barLengths('6/8')).toEqual([1, 2, 3, 4, 5, 6].map((eighths) => (eighths * B) / 3))
  })
})

describe('lines', () => {
  it('starts a new line at a bar, and joins it to the next', () => {
    const split = newLine(sung, 1)
    expect(form(split)).toEqual([[['G@0'], ['C@0'], ['D@0', 'G@0']]])
    expect(form(joinLine(split, 0))).toEqual([
      [
        ['G@0', 'C@0'],
        ['D@0', 'G@0'],
      ],
    ])
    expect(newLine(sung, 0)).toBe(sung)
  })
})
