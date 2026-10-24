import { describe, expect, it } from 'vitest'
import { draftOf, form, lengths, shape } from '../testing/test-draft'
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
} from './bars'
import { deleteChord } from './chords'

const sung = draftOf({
  sections: [{ kind: 'verse', lines: ['G C', 'D G'] }],
  melody: 'B4/4 | C5/2 E5/2 | D5/6 | B4/2',
  hands: { lh: 'r/4 | C3/4 | D3/4 | r/4' },
})

describe('insertBar', () => {
  it('adds a bar after, with the chord before it again, and moves the notes after it on', () => {
    const inserted = insertBar(sung, 0)
    expect(form(inserted)).toEqual([
      [
        ['G@0', 'G@0', 'C@0'],
        ['D@0', 'G@0'],
      ],
    ])
    expect(shape(inserted.melody)).toEqual([
      'B4@0/96',
      'C5@192/48',
      'E5@240/48',
      'D5@288/144',
      'B4@432/48',
    ])
    expect(shape(inserted.hands.lh)).toEqual(['C3@192/96', 'D3@288/96'])
  })

  it('cuts a note held across where the bar goes in', () => {
    expect(shape(insertBar(sung, 2).melody)).toContain('D5@192/96')
  })
})

describe('insertBarBefore', () => {
  it('adds a bar before, starting its line, with the chord before it, the notes moved on', () => {
    const inserted = insertBarBefore(sung, 2)
    expect(form(inserted)).toEqual([
      [
        ['G@0', 'C@0'],
        ['C@0', 'D@0', 'G@0'],
      ],
    ])
    expect(shape(inserted.hands.lh)).toEqual(['C3@96/96', 'D3@288/96'])
  })

  it('adds a bar before the first, with its chord', () => {
    expect(form(insertBarBefore(sung, 0))).toEqual([
      [
        ['G@0', 'G@0', 'C@0'],
        ['D@0', 'G@0'],
      ],
    ])
  })
})

describe('deleteBars', () => {
  it('takes bars with their notes, cutting a note held into them, and moves the rest back', () => {
    const deleted = deleteBars(sung, { from: 3, to: 3 })
    expect(form(deleted)).toEqual([[['G@0', 'C@0'], ['D@0']]])
    expect(shape(deleted.melody)).toEqual(['B4@0/96', 'C5@96/48', 'E5@144/48', 'D5@192/96'])
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
    expect(shape(pasted.melody).slice(-3)).toEqual(['C5@384/48', 'E5@432/48', 'D5@480/96'])
    expect(shape(pasted.hands.lh)).toEqual(['C3@96/96', 'D3@192/96', 'C3@384/96', 'D3@480/96'])
  })
})

describe('setBarTicks, a pickup', () => {
  it('shortens and lengthens a pickup at its start, its chords kept from its end', () => {
    const pickup = draftOf({
      sections: [{ kind: 'verse', lines: ['G@2-D@1 C'] }],
      melody: 'C4/1 D4/1 E4/1 | F4/4',
    })
    const short = setBarTicks(pickup, 0, 24)
    expect(form(short)).toEqual([[['D@0', 'C@0']]])
    expect(shape(short.melody)[0]).toBe('E4@0/24')
    const long = setBarTicks(short, 0, 48)
    expect(form(long)).toEqual([[['D@0', 'C@0']]])
    expect(lengths(long)).toEqual([48, 96])
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
    const edited = deleteChord(pasted, 2, 48)
    expect(form(edited)).toEqual([[['G@0 C@48', 'D@0', 'G@0']]])
  })
})

describe('setBarTicks', () => {
  it('shortens a bar, taking its chords and notes past the new end, and moves the rest back', () => {
    const shorter = setBarTicks(
      draftOf({ sections: [{ kind: 'verse', lines: ['G-D C'] }], melody: 'B4/1 A4/3 | G4/4' }),
      0,
      24,
    )
    expect(form(shorter)).toEqual([[['G@0', 'C@0']]])
    expect(shape(shorter.melody)).toEqual(['B4@0/24', 'G4@24/96'])
    expect(lengths(shorter)).toEqual([24, 96])
  })

  it('lengthens a bar, moving the notes after it on', () => {
    const longer = setBarTicks(draftOf({ melody: 'B4/4 | G4/4' }), 0, 144)
    expect(lengths(longer)).toEqual([144, 96])
    expect(shape(longer.melody)).toEqual(['B4@0/96', 'G4@144/96'])
  })

  it('offers lengths from an eighth to the meter’s bar', () => {
    expect(barLengths('3/4')).toEqual([12, 24, 36, 48, 60, 72])
    expect(barLengths('6/8')).toEqual([8, 16, 24, 32, 40, 48])
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
