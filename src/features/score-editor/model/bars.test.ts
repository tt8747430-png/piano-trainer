import { describe, expect, it } from 'vitest'
import { draftOf, form, lengths, shape } from '../testing/test-draft'
import {
  barLengths,
  copyBars,
  deleteBars,
  insertBar,
  joinLine,
  newLine,
  pasteBars,
  setBarTicks,
} from './bars'

const sung = draftOf({
  sections: [{ kind: 'verse', lines: ['G C', 'D G'] }],
  melody: 'B4/4 | C5/2 E5/2 | D5/6 | B4/2',
  hands: { lh: '- | C3/4 | D3/4 | -' },
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
      'B4@0/48',
      'C5@96/24',
      'E5@120/24',
      'D5@144/72',
      'B4@216/24',
    ])
    expect(shape(inserted.hands.lh)).toEqual(['C3@96/48', 'D3@144/48'])
  })

  it('cuts a note held across where the bar goes in', () => {
    expect(shape(insertBar(sung, 2).melody)).toContain('D5@96/48')
  })
})

describe('deleteBars', () => {
  it('takes bars with their notes, cutting a note held into them, and moves the rest back', () => {
    const deleted = deleteBars(sung, { from: 3, to: 3 })
    expect(form(deleted)).toEqual([[['G@0', 'C@0'], ['D@0']]])
    expect(shape(deleted.melody)).toEqual(['B4@0/48', 'C5@48/24', 'E5@72/24', 'D5@96/48'])
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
    const pasted = pasteBars(sung, 3, clip)
    expect(form(pasted)).toEqual([
      [
        ['G@0', 'C@0'],
        ['D@0', 'G@0', 'C@0', 'D@0'],
      ],
    ])
    expect(shape(pasted.melody).slice(-3)).toEqual(['C5@192/24', 'E5@216/24', 'D5@240/48'])
    expect(shape(pasted.hands.lh)).toEqual(['C3@48/48', 'D3@96/48', 'C3@192/48', 'D3@240/48'])
  })
})

describe('setBarTicks', () => {
  it('shortens a bar, taking its chords and notes past the new end, and moves the rest back', () => {
    const shorter = setBarTicks(
      draftOf({ sections: [{ kind: 'verse', lines: ['G-D C'] }], melody: 'B4/1 A4/3 | G4/4' }),
      0,
      12,
    )
    expect(form(shorter)).toEqual([[['G@0', 'C@0']]])
    expect(shape(shorter.melody)).toEqual(['B4@0/12', 'G4@12/48'])
    expect(lengths(shorter)).toEqual([12, 48])
  })

  it('lengthens a bar, moving the notes after it on', () => {
    const longer = setBarTicks(draftOf({ melody: 'B4/4 | G4/4' }), 0, 72)
    expect(lengths(longer)).toEqual([72, 48])
    expect(shape(longer.melody)).toEqual(['B4@0/48', 'G4@72/48'])
  })

  it('offers lengths from an eighth to the meter’s bar', () => {
    expect(barLengths('3/4')).toEqual([6, 12, 18, 24, 30, 36])
    expect(barLengths('6/8')).toEqual([4, 8, 12, 16, 20, 24])
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
