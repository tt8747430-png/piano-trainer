import { describe, expect, it } from 'vitest'
import { draftOf, shape } from '../testing/test-draft'
import {
  addStaff,
  moveStaff,
  orderStaves,
  placeAfterMove,
  removeStaff,
  renameStaff,
  setStaffClef,
  setStaffInstrument,
} from './staves'
import { verseCount } from './lyrics'

describe('moveStaff (A40)', () => {
  const THREE = {
    staves: [
      { name: 'A', notes: 'C5/4' },
      { name: 'B', notes: 'D5/4' },
      { name: 'C', notes: 'E5/4' },
    ],
    lyrics: ['la'],
    lyricsOn: 1,
  }
  it('moves a staff with its notes, the others closing up, the words kept on their staff', () => {
    const draft = draftOf(THREE)
    const down = moveStaff(draft, 0, 2)
    expect(down.staves.map((staff) => staff.name)).toEqual(['B', 'C', 'A'])
    expect(shape(down.staves[2]?.notes ?? [])).toEqual(['C5@0/4'])
    expect(down.lyricsOn).toBe(0)
    const up = moveStaff(draft, 2, 0)
    expect(up.staves.map((staff) => staff.name)).toEqual(['C', 'A', 'B'])
    expect(up.lyricsOn).toBe(2)
    expect(moveStaff(draft, 1, 1)).toBe(draft)
    expect(moveStaff(draft, 5, 0)).toBe(draft)
  })

  it('puts the staves in an order, the words kept on their staff', () => {
    const draft = draftOf(THREE)
    const ordered = orderStaves(draft, [2, 0, 1])
    expect(ordered.staves.map((staff) => staff.name)).toEqual(['C', 'A', 'B'])
    expect(ordered.lyricsOn).toBe(2)
    expect(orderStaves(draft, [0, 1, 2])).toBe(draft)
    expect(orderStaves(draft, [0, 0, 1])).toBe(draft)
  })

  it('says where each staff stands after a move', () => {
    expect([0, 1, 2, 3].map((at) => placeAfterMove(at, 0, 2))).toEqual([2, 0, 1, 3])
    expect([0, 1, 2, 3].map((at) => placeAfterMove(at, 3, 1))).toEqual([0, 2, 3, 1])
  })
})

describe('setStaffInstrument (A40)', () => {
  const TWO_STAVES = {
    staves: [
      { name: 'Voice', notes: 'D5/4' },
      { notes: 'G3/4', clef: 'bass' as const },
    ],
  }
  it('names the staff and writes it in the instrument’s clef, its notes kept', () => {
    const draft = draftOf(TWO_STAVES)
    const bass = setStaffInstrument(draft, 0, { name: { en: 'Bass', ru: 'Бас' }, clef: 'bass' })
    expect(bass.staves[0]).toMatchObject({ name: { en: 'Bass', ru: 'Бас' }, clef: 'bass' })
    expect(bass.staves[0]?.notes).toBe(draft.staves[0]?.notes)
    expect(setStaffInstrument(draft, 0, { clef: 'treble' }).staves[0]).not.toHaveProperty('name')
    expect(setStaffInstrument(draft, 1, { clef: 'bass' })).toBe(draft)
  })
})

const TWO = {
  staves: [
    { name: 'Voice', notes: 'D5/4 | B4/4' },
    { notes: 'G3/4 | D3/4', clef: 'bass' as const },
  ],
}

describe('addStaff (ADR 0097)', () => {
  it('adds a treble staff with nothing on it at its place, top down, the others kept', () => {
    const draft = draftOf(TWO)
    const over = addStaff(draft, 0)
    expect(over.staves.map((staff) => [staff.name, staff.clef, shape(staff.notes)])).toEqual([
      [undefined, 'treble', []],
      ['Voice', 'treble', ['D5@0/4', 'B4@4/4']],
      [undefined, 'bass', ['G3@0/4', 'D3@4/4']],
    ])
    // Over the piano: under the last single staff.
    expect(addStaff(draft, 2).staves.map((staff) => staff.notes.length)).toEqual([2, 2, 0])
    expect(addStaff(draftOf(), 0).staves).toHaveLength(1)
  })

  it('adds an instrument’s staff under its name and in its clef (round 28)', () => {
    const tenor = addStaff(draftOf(TWO), 2, {
      name: { en: 'Tenor', ru: 'Тенор' },
      clef: 'treble-8vb',
    }).staves[2]
    expect(tenor).toEqual({ name: { en: 'Tenor', ru: 'Тенор' }, clef: 'treble-8vb', notes: [] })
  })

  it('keeps the words on their staff, and gives a song with none yet its top staff for them', () => {
    const sung = draftOf({ ...TWO, lyrics: ['one two'], lyricsOn: 1 })
    expect(addStaff(sung, 0).lyricsOn).toBe(2)
    expect(addStaff(sung, 2).lyricsOn).toBe(1)
    const upper = draftOf({ hands: { rh: 'G4/4 | C5/4' }, lyrics: ['one two'] })
    expect(upper.lyricsOn).toBe('rh')
    expect(addStaff(upper, 0).lyricsOn).toBe('rh')
    expect(addStaff(draftOf(), 0).lyricsOn).toBe(0)
  })
})

describe('removeStaff (ADR 0097)', () => {
  it('takes a staff away with its notes, the others moving up into its place', () => {
    const draft = draftOf(TWO)
    expect(removeStaff(draft, 0).staves.map((staff) => staff.clef)).toEqual(['bass'])
    expect(removeStaff(draft, 5)).toBe(draft)
  })

  it('never takes a lead sheet’s last staff, the only one in sight', () => {
    const lead = draftOf({ staves: [{ notes: 'D5/4 | B4/4' }], leadSheet: true })
    expect(removeStaff(lead, 0)).toBe(lead)
    expect(removeStaff(draftOf({ staves: [{ notes: 'D5/4' }] }), 0).staves).toEqual([])
  })

  it('takes the words with the notes they are on, another staff’s keeping theirs', () => {
    const sung = draftOf({ ...TWO, lyrics: ['one two'], lyricsOn: 1 })
    const gone = removeStaff(sung, 1)
    expect(verseCount(gone)).toBe(0)
    expect(gone.lyricsOn).toBe(0)
    const kept = removeStaff(sung, 0)
    expect(kept.lyricsOn).toBe(0)
    expect(verseCount(kept)).toBe(1)
    expect(removeStaff(draftOf({ staves: [{ notes: 'D5/4' }] }), 0).lyricsOn).toBe('rh')
  })
})

describe('renameStaff (ADR 0097)', () => {
  it('names a staff as typed, trimmed; an empty name takes it away', () => {
    const draft = draftOf(TWO)
    expect(renameStaff(draft, 1, '  Cello ').staves[1]?.name).toBe('Cello')
    expect(renameStaff(draft, 0, '   ').staves[0]).not.toHaveProperty('name')
    expect(renameStaff(draft, 0, 'Voice')).toBe(draft)
    expect(renameStaff(draft, 4, 'Flute')).toBe(draft)
  })
})

describe('setStaffClef (ADR 0097)', () => {
  it('writes a single staff in another clef, its notes kept', () => {
    const draft = draftOf(TWO)
    const low = setStaffClef(draft, 0, 'bass')
    expect(low.staves[0]?.clef).toBe('bass')
    expect(low.staves[0]?.notes).toBe(draft.staves[0]?.notes)
    expect(setStaffClef(draft, 1, 'bass')).toBe(draft)
  })
})
