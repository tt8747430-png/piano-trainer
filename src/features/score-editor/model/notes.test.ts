import { describe, expect, it } from 'vitest'
import { midi, TICKS_PER_BEAT } from '@/shared/lib/music'
import { draftOf, oneStaff, shape, staffNotes } from '../testing/test-draft'
import { musicToSave } from './draft'
import {
  addToChord,
  carriesAccidental,
  closeGap,
  deleteNotes,
  fingeredNotes,
  notesAt,
  respellNotes,
  setDuration,
  setFingers,
  shiftNotes,
  startNear,
  tieNotes,
  toggleAccidental,
  writeNotes,
  writeRest,
} from './notes'
import { barsOf, totalTicks } from './timeline'

const B = TICKS_PER_BEAT

const keys = (...numbers: number[]) => numbers.map((n) => midi(n))

describe('writeNotes on a single staff', () => {
  it('writes a note at the caret, spelled in the key, and says where the next goes', () => {
    const written = writeNotes(oneStaff(), 'staff0', B, keys(66), B)
    expect(shape(staffNotes(written.draft))).toEqual(['F#4@1/1'])
    expect(written.end).toBe(2 * B)
  })

  it('keeps the highest of keys struck together', () => {
    expect(
      shape(staffNotes(writeNotes(oneStaff(), 'staff0', 0, keys(60, 67, 64), B).draft)),
    ).toEqual(['G4@0/1'])
  })

  it('cuts the note sounding into it and replaces those starting under it', () => {
    const draft = draftOf({ staves: [{ notes: 'B4/2 A4/1 G4/1' }] })
    expect(shape(staffNotes(writeNotes(draft, 'staff0', B, keys(74), 2 * B).draft))).toEqual([
      'B4@0/1',
      'D5@1/2',
      'G4@3/1',
    ])
  })

  it('lets a note cross a barline', () => {
    const written = writeNotes(oneStaff(), 'staff0', 3 * B, keys(67), 2 * B)
    expect(shape(staffNotes(written.draft))).toEqual(['G4@3/2'])
  })

  it('adds a bar for a note past the end: the meter’s length, no chord (ADR 0114)', () => {
    const draft = oneStaff()
    const written = writeNotes(draft, 'staff0', totalTicks(draft), keys(67), B)
    expect(totalTicks(written.draft)).toBe(12 * B)
    const last = barsOf(written.draft).at(-1)
    expect(last?.line).toBe(0)
    expect(last?.bar.chords).toEqual([])
    expect(shape(staffNotes(written.draft))).toEqual(['G4@8/1'])
  })

  it('stops a note at the piece’s end', () => {
    const written = writeNotes(oneStaff(), 'staff0', 7 * B, keys(67), 4 * B)
    expect(shape(staffNotes(written.draft))).toEqual(['G4@7/1'])
    expect(written.end).toBe(8 * B)
  })
})

describe('writeNotes in a hand', () => {
  it('writes the keys struck together', () => {
    const written = writeNotes(draftOf(), 'lh', 0, keys(43, 55), 4 * B)
    expect(shape(written.draft.hands.lh)).toEqual(['G2@0/4', 'G3@0/4'])
  })

  it('keeps a held bass sounding under a chord written over it', () => {
    const held = writeNotes(draftOf(), 'lh', 0, keys(43), 4 * B).draft
    const chord = writeNotes(held, 'lh', B, keys(59, 62), B)
    expect(shape(chord.draft.hands.lh)).toEqual(['G2@0/4', 'B3@1/1', 'D4@1/1'])
  })

  it('holds a note into the next bar, every bar being written (ADR 0114)', () => {
    const written = writeNotes(draftOf(), 'rh', 2 * B, keys(67), 4 * B)
    expect(shape(written.draft.hands.rh)).toEqual(['G4@2/4'])
    expect(written.end).toBe(6 * B)
  })
})

describe('the notes at the caret', () => {
  const draft = writeNotes(draftOf(), 'rh', 0, keys(60, 64), 2 * B).draft

  it('adds a key to the chord there, with its length', () => {
    expect(shape(addToChord(draft, 'rh', 0, midi(67), B).hands.rh)).toEqual([
      'C4@0/2',
      'E4@0/2',
      'G4@0/2',
    ])
  })

  it('writes a note where there is none', () => {
    expect(shape(addToChord(draft, 'rh', 2 * B, midi(67), B).hands.rh)).toEqual([
      'C4@0/2',
      'E4@0/2',
      'G4@2/1',
    ])
  })

  it('keeps a single staff one line: a higher key takes the note’s place, a lower one leaves it', () => {
    const tune = writeNotes(oneStaff(), 'staff0', 0, keys(64), B).draft
    expect(shape(staffNotes(addToChord(tune, 'staff0', 0, midi(67), B)))).toEqual(['G4@0/1'])
    expect(shape(staffNotes(addToChord(tune, 'staff0', 0, midi(60), B)))).toEqual(['E4@0/1'])
  })

  it('finds and deletes them', () => {
    expect(shape(notesAt(draft, 'rh', 0))).toEqual(['C4@0/2', 'E4@0/2'])
    expect(deleteNotes(draft, 'rh', 0).hands.rh).toEqual([])
  })

  it('moves them by semitones and octaves, spelled in the key', () => {
    expect(shape(shiftNotes(draft, 'rh', 0, 1).hands.rh)).toEqual(['C#4@0/2', 'F4@0/2'])
    expect(shape(shiftNotes(draft, 'rh', 0, -12).hands.rh)).toEqual(['C3@0/2', 'E3@0/2'])
  })

  it('moves nothing past the piano’s ends', () => {
    const low = writeNotes(draftOf(), 'lh', 0, keys(22), B).draft
    expect(shiftNotes(low, 'lh', 0, -12)).toBe(low)
  })

  it('respells them the other way', () => {
    const sharp = shiftNotes(draft, 'rh', 0, 1)
    expect(shape(respellNotes(sharp, 'rh', 0).hands.rh)).toEqual(['D♭4@0/2', 'E#4@0/2'])
    expect(respellNotes(sharp, 'rh', 0).hands.rh[0]?.midi).toBe(61)
  })

  it('fingers the notes at a place bottom up, or the chord’s one note chosen (ADR 0096)', () => {
    const fingers = (d: typeof draft) => d.hands.rh.map((n) => n.finger)
    expect(shape(fingeredNotes(draft, 'rh', 0))).toEqual(['C4@0/2', 'E4@0/2'])
    const both = setFingers(draft, 'rh', 0, [1, 3])
    expect(fingers(both)).toEqual([1, 3])
    // Fewer fingers than notes: those over them take none; none takes them all off.
    expect(fingers(setFingers(both, 'rh', 0, [2]))).toEqual([2, undefined])
    expect(fingers(setFingers(both, 'rh', 0, []))).toEqual([undefined, undefined])
    expect(fingers(setFingers(both, 'rh', { at: 0, key: midi(64) }, [4]))).toEqual([1, 4])
    expect(setFingers(both, 'rh', 0, [1, 3])).toBe(both)
  })

  it('finds the next notes’ start on a staff and the last before, where the fingering field goes', () => {
    const line = draftOf({ hands: { rh: 'C4+E4/2 r/1 G4/1 | r/4', lh: 'r/4 | r/4' } })
    const notes = line.hands.rh
    expect(startNear(notes, 0, 1)).toBe(3 * B)
    expect(startNear(notes, 3 * B, -1)).toBe(0)
    expect(startNear(notes, 3 * B, 1)).toBeNull()
    expect(startNear(notes, 0, -1)).toBeNull()
  })
})

describe('rests', () => {
  it('cut a single staff’s note sounding into them and take the notes under them', () => {
    const draft = draftOf({ staves: [{ notes: 'B4/2 A4/1 G4/1' }] })
    const rested = writeRest(draft, 'staff0', B, 2 * B)
    expect(shape(staffNotes(rested.draft))).toEqual(['B4@0/1', 'G4@3/1'])
    expect(rested.end).toBe(3 * B)
  })

  it('takes a hand’s notes under a rest of a whole bar', () => {
    const rested = writeRest(draftOf({ hands: { lh: 'G2/4 | G2/4' } }), 'lh', 4 * B, 4 * B)
    expect(shape(rested.draft.hands.lh)).toEqual(['G2@0/4'])
    expect(rested.end).toBe(8 * B)
  })
})

describe('closeGap (Insert mode’s Delete, ADR 0114)', () => {
  it('pulls the later notes left by the gap', () => {
    const draft = draftOf({ staves: [{ notes: 'B4/1 A4/1 G4/1 F#4/1' }] })
    expect(shape(staffNotes(closeGap(draft, 'staff0', { from: B, to: 2 * B })))).toEqual([
      'B4@0/1',
      'G4@1/1',
      'F#4@2/1',
    ])
  })

  it('cuts a single staff’s note held into the gap, so the notes pulled left never sound under it', () => {
    // A half note tied over the barline, a quarter after it: the tie's second half taken.
    const draft = draftOf({
      staves: [{ notes: 'r/3 C5/2 | D5/1 r/2' }],
      sections: [{ kind: 'verse', lines: ['G C'] }],
    })
    const closed = closeGap(draft, 'staff0', { from: 4 * B, to: 5 * B })
    expect(shape(staffNotes(closed))).toEqual(['C5@3/1', 'D5@4/1'])
    expect(musicToSave(closed)).not.toBeNull()
    // A hand's held note keeps sounding under what is pulled over it, as writing leaves it.
    const hand = draftOf({ hands: { rh: 'C4/4 | r/1 E4/1 r/2' } })
    expect(shape(closeGap(hand, 'rh', { from: 4 * B, to: 5 * B }).hands.rh)).toEqual([
      'C4@0/4',
      'E4@4/1',
    ])
  })
})

describe('tieNotes', () => {
  it('joins the notes at the caret to the same keys after them', () => {
    const draft = draftOf({ hands: { rh: 'C4+E4/2 C4+G4/2 | r/4' } })
    expect(shape(tieNotes(draft, 'rh', 0).hands.rh)).toEqual(['C4@0/4', 'E4@0/2', 'G4@2/2'])
  })

  it('changes nothing where no same key follows', () => {
    const draft = draftOf({ staves: [{ notes: 'B4/2 A4/2' }] })
    expect(tieNotes(draft, 'staff0', 0)).toBe(draft)
  })
})

describe('setDuration', () => {
  it('makes a quarter an eighth, the time it leaves a rest', () => {
    const draft = draftOf({ staves: [{ notes: 'B4/1 A4/1' }] })
    expect(shape(staffNotes(setDuration(draft, 'staff0', 0, 0.5 * B)))).toEqual([
      'B4@0/.5',
      'A4@1/1',
    ])
  })

  it('makes a note longer over the notes after it, as a note written there would', () => {
    const draft = draftOf({ staves: [{ notes: 'B4/1 A4/1 G4/1' }] })
    expect(shape(staffNotes(setDuration(draft, 'staff0', 0, 2 * B)))).toEqual(['B4@0/2', 'G4@2/1'])
  })

  it('changes each note chosen, the first ones first', () => {
    const draft = draftOf({ staves: [{ notes: 'B4/1 A4/1 G4/1 F#4/1' }] })
    expect(
      shape(staffNotes(setDuration(draft, 'staff0', { from: 0, to: 3 * B }, 0.5 * B))),
    ).toEqual(['B4@0/.5', 'A4@1/.5', 'G4@2/.5', 'F#4@3/1'])
    expect(shape(staffNotes(setDuration(draft, 'staff0', { from: 0, to: 4 * B }, 2 * B)))).toEqual([
      'B4@0/2',
      'G4@2/2',
    ])
  })

  it('changes a chord’s notes together, the chord’s one note chosen taking the chord', () => {
    const draft = writeNotes(draftOf(), 'rh', 0, keys(60, 64), B).draft
    expect(shape(setDuration(draft, 'rh', { at: 0, key: midi(64) }, 2 * B).hands.rh)).toEqual([
      'C4@0/2',
      'E4@0/2',
    ])
  })

  it('stops a note at the piece’s end, and changes nothing where no note is', () => {
    const draft = draftOf({ staves: [{ notes: 'B4/4 A4/3 G4/1' }] })
    expect(shape(staffNotes(setDuration(draft, 'staff0', 7 * B, 2 * B)))).toContain('G4@7/1')
    expect(setDuration(draft, 'lh', 0, 2 * B)).toBe(draft)
  })
})

describe('toggleAccidental', () => {
  // E and F♯ in G major.
  const draft = writeNotes(draftOf(), 'rh', 0, keys(64, 66), B).draft

  it('writes the note’s letter sharp, flat or natural, its key following', () => {
    expect(shape(toggleAccidental(draft, 'rh', { at: 0, key: midi(64) }, -1).hands.rh)).toEqual([
      'E♭4@0/1',
      'F#4@0/1',
    ])
    expect(shape(toggleAccidental(draft, 'rh', 0, 0).hands.rh)).toEqual(['E4@0/1', 'F4@0/1'])
    expect(shape(toggleAccidental(draft, 'rh', 0, 1).hands.rh)).toEqual(['E#4@0/1', 'F#4@0/1'])
  })

  it('takes the sign off notes that all carry it, each letter spelled as the key spells it (Flat’s)', () => {
    const flat = toggleAccidental(draft, 'rh', { at: 0, key: midi(64) }, -1)
    expect(carriesAccidental(notesAt(flat, 'rh', 0), -1)).toBe(false)
    expect(carriesAccidental(notesAt(flat, 'rh', 0).slice(0, 1), -1)).toBe(true)
    expect(shape(toggleAccidental(flat, 'rh', { at: 0, key: midi(63) }, -1).hands.rh)).toEqual([
      'E4@0/1',
      'F#4@0/1',
    ])
    // ♮ on the key's F♯ writes F; ♮ again returns it to the key: F♯, as the key spells F.
    const natural = toggleAccidental(draft, 'rh', { at: 0, key: midi(66) }, 0)
    expect(shape(natural.hands.rh)).toEqual(['E4@0/1', 'F4@0/1'])
    expect(shape(toggleAccidental(natural, 'rh', { at: 0, key: midi(65) }, 0).hands.rh)).toEqual([
      'E4@0/1',
      'F#4@0/1',
    ])
    // A sharp the key writes already stays where ♯ is tapped on it.
    expect(toggleAccidental(draft, 'rh', { at: 0, key: midi(66) }, 1)).toBe(draft)
    // A chord of which only one note carries the sign takes it on every note.
    expect(shape(toggleAccidental(draft, 'rh', 0, 1).hands.rh)).toEqual(['E#4@0/1', 'F#4@0/1'])
  })

  it('carries a sign only where notes are chosen', () => {
    expect(carriesAccidental([], 0)).toBe(false)
  })
})
