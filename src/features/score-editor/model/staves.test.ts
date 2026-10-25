import { describe, expect, it } from 'vitest'
import { draftOf, shape } from '../testing/test-draft'
import { addStaff, removeStaff, renameStaff, setStaffClef } from './staves'
import { verseCount } from './lyrics'

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
      ['Voice', 'treble', ['D5@0/96', 'B4@96/96']],
      [undefined, 'bass', ['G3@0/96', 'D3@96/96']],
    ])
    // Over the piano: under the last single staff.
    expect(addStaff(draft, 2).staves.map((staff) => staff.notes.length)).toEqual([2, 2, 0])
    expect(addStaff(draftOf(), 0).staves).toHaveLength(1)
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
