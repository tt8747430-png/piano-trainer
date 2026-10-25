import { describe, expect, it } from 'vitest'
import { midi } from '@/shared/lib/music'
import { draftOf, shape } from '../testing/test-draft'
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

const keys = (...numbers: number[]) => numbers.map((n) => midi(n))

describe('writeNotes in the melody', () => {
  it('writes a note at the caret, spelled in the key, and says where the next goes', () => {
    const written = writeNotes(draftOf(), 'melody', 24, keys(66), 24)
    expect(shape(written.draft.melody)).toEqual(['F#4@24/24'])
    expect(written.end).toBe(48)
  })

  it('keeps the highest of keys struck together', () => {
    expect(shape(writeNotes(draftOf(), 'melody', 0, keys(60, 67, 64), 24).draft.melody)).toEqual([
      'G4@0/24',
    ])
  })

  it('cuts the note sounding into it and replaces those starting under it', () => {
    const draft = draftOf({ melody: 'B4/2 A4/1 G4/1' })
    expect(shape(writeNotes(draft, 'melody', 24, keys(74), 48).draft.melody)).toEqual([
      'B4@0/24',
      'D5@24/48',
      'G4@72/24',
    ])
  })

  it('lets a note cross a barline', () => {
    const written = writeNotes(draftOf(), 'melody', 72, keys(67), 48)
    expect(shape(written.draft.melody)).toEqual(['G4@72/48'])
  })

  it('adds a bar for a note past the end: the meter’s length, no chord (ADR 0094)', () => {
    const draft = draftOf()
    const written = writeNotes(draft, 'melody', totalTicks(draft), keys(67), 24)
    expect(totalTicks(written.draft)).toBe(288)
    const last = barsOf(written.draft).at(-1)
    expect(last?.line).toBe(0)
    expect(last?.bar.chords).toEqual([])
    expect(shape(written.draft.melody)).toEqual(['G4@192/24'])
  })

  it('stops a note at the piece’s end', () => {
    const written = writeNotes(draftOf(), 'melody', 168, keys(67), 96)
    expect(shape(written.draft.melody)).toEqual(['G4@168/24'])
    expect(written.end).toBe(192)
  })
})

describe('writeNotes in a hand', () => {
  it('writes the keys struck together', () => {
    const written = writeNotes(draftOf(), 'lh', 0, keys(43, 55), 96)
    expect(shape(written.draft.hands.lh)).toEqual(['G2@0/96', 'G3@0/96'])
  })

  it('keeps a held bass sounding under a chord written over it', () => {
    const held = writeNotes(draftOf(), 'lh', 0, keys(43), 96).draft
    const chord = writeNotes(held, 'lh', 24, keys(59, 62), 24)
    expect(shape(chord.draft.hands.lh)).toEqual(['G2@0/96', 'B3@24/24', 'D4@24/24'])
  })

  it('holds a note into the next bar, every bar being written (ADR 0091)', () => {
    const written = writeNotes(draftOf(), 'rh', 48, keys(67), 96)
    expect(shape(written.draft.hands.rh)).toEqual(['G4@48/96'])
    expect(written.end).toBe(144)
  })
})

describe('the notes at the caret', () => {
  const draft = writeNotes(draftOf(), 'rh', 0, keys(60, 64), 48).draft

  it('adds a key to the chord there, with its length', () => {
    expect(shape(addToChord(draft, 'rh', 0, midi(67), 24).hands.rh)).toEqual([
      'C4@0/48',
      'E4@0/48',
      'G4@0/48',
    ])
  })

  it('writes a note where there is none', () => {
    expect(shape(addToChord(draft, 'rh', 48, midi(67), 24).hands.rh)).toEqual([
      'C4@0/48',
      'E4@0/48',
      'G4@48/24',
    ])
  })

  it('keeps the melody one line: a higher key takes the note’s place, a lower one leaves it', () => {
    const tune = writeNotes(draftOf(), 'melody', 0, keys(64), 24).draft
    expect(shape(addToChord(tune, 'melody', 0, midi(67), 24).melody)).toEqual(['G4@0/24'])
    expect(shape(addToChord(tune, 'melody', 0, midi(60), 24).melody)).toEqual(['E4@0/24'])
  })

  it('finds and deletes them', () => {
    expect(shape(notesAt(draft, 'rh', 0))).toEqual(['C4@0/48', 'E4@0/48'])
    expect(deleteNotes(draft, 'rh', 0).hands.rh).toEqual([])
  })

  it('moves them by semitones and octaves, spelled in the key', () => {
    expect(shape(shiftNotes(draft, 'rh', 0, 1).hands.rh)).toEqual(['C#4@0/48', 'F4@0/48'])
    expect(shape(shiftNotes(draft, 'rh', 0, -12).hands.rh)).toEqual(['C3@0/48', 'E3@0/48'])
  })

  it('moves nothing past the piano’s ends', () => {
    const low = writeNotes(draftOf(), 'lh', 0, keys(22), 24).draft
    expect(shiftNotes(low, 'lh', 0, -12)).toBe(low)
  })

  it('respells them the other way', () => {
    const sharp = shiftNotes(draft, 'rh', 0, 1)
    expect(shape(respellNotes(sharp, 'rh', 0).hands.rh)).toEqual(['D♭4@0/48', 'E#4@0/48'])
    expect(respellNotes(sharp, 'rh', 0).hands.rh[0]?.midi).toBe(61)
  })

  it('fingers the notes at a place bottom up, or the chord’s one note chosen (ADR 0096)', () => {
    const fingers = (d: typeof draft) => d.hands.rh.map((n) => n.finger)
    expect(shape(fingeredNotes(draft, 'rh', 0))).toEqual(['C4@0/48', 'E4@0/48'])
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
    expect(startNear(notes, 0, 1)).toBe(72)
    expect(startNear(notes, 72, -1)).toBe(0)
    expect(startNear(notes, 72, 1)).toBeNull()
    expect(startNear(notes, 0, -1)).toBeNull()
  })
})

describe('rests', () => {
  it('cut the melody’s note sounding into them and take the notes under them', () => {
    const draft = draftOf({ melody: 'B4/2 A4/1 G4/1' })
    const rested = writeRest(draft, 'melody', 24, 48)
    expect(shape(rested.draft.melody)).toEqual(['B4@0/24', 'G4@72/24'])
    expect(rested.end).toBe(72)
  })

  it('takes a hand’s notes under a rest of a whole bar', () => {
    const rested = writeRest(draftOf({ hands: { lh: 'G2/4 | G2/4' } }), 'lh', 96, 96)
    expect(shape(rested.draft.hands.lh)).toEqual(['G2@0/96'])
    expect(rested.end).toBe(192)
  })
})

describe('closeGap (Insert mode’s Delete, ADR 0092)', () => {
  it('pulls the later notes left by the gap', () => {
    const draft = draftOf({ melody: 'B4/1 A4/1 G4/1 F#4/1' })
    expect(shape(closeGap(draft, 'melody', { from: 24, to: 48 }).melody)).toEqual([
      'B4@0/24',
      'G4@24/24',
      'F#4@48/24',
    ])
  })

  it('cuts the melody’s note held into the gap, so the notes pulled left never sound under it', () => {
    // A half note tied over the barline, a quarter after it: the tie's second half taken.
    const draft = draftOf({
      melody: 'r/3 C5/2 | D5/1 r/2',
      sections: [{ kind: 'verse', lines: ['G C'] }],
    })
    const closed = closeGap(draft, 'melody', { from: 96, to: 120 })
    expect(shape(closed.melody)).toEqual(['C5@72/24', 'D5@96/24'])
    expect(musicToSave(closed)).not.toBeNull()
    // A hand's held note keeps sounding under what is pulled over it, as writing leaves it.
    const hand = draftOf({ hands: { rh: 'C4/4 | r/1 E4/1 r/2' } })
    expect(shape(closeGap(hand, 'rh', { from: 96, to: 120 }).hands.rh)).toEqual([
      'C4@0/96',
      'E4@96/24',
    ])
  })
})

describe('tieNotes', () => {
  it('joins the notes at the caret to the same keys after them', () => {
    const draft = draftOf({ hands: { rh: 'C4+E4/2 C4+G4/2 | r/4' } })
    expect(shape(tieNotes(draft, 'rh', 0).hands.rh)).toEqual(['C4@0/96', 'E4@0/48', 'G4@48/48'])
  })

  it('changes nothing where no same key follows', () => {
    const draft = draftOf({ melody: 'B4/2 A4/2' })
    expect(tieNotes(draft, 'melody', 0)).toBe(draft)
  })
})

describe('setDuration', () => {
  it('makes a quarter an eighth, the time it leaves a rest', () => {
    const draft = draftOf({ melody: 'B4/1 A4/1' })
    expect(shape(setDuration(draft, 'melody', 0, 12).melody)).toEqual(['B4@0/12', 'A4@24/24'])
  })

  it('makes a note longer over the notes after it, as a note written there would', () => {
    const draft = draftOf({ melody: 'B4/1 A4/1 G4/1' })
    expect(shape(setDuration(draft, 'melody', 0, 48).melody)).toEqual(['B4@0/48', 'G4@48/24'])
  })

  it('changes each note chosen, the first ones first', () => {
    const draft = draftOf({ melody: 'B4/1 A4/1 G4/1 F#4/1' })
    expect(shape(setDuration(draft, 'melody', { from: 0, to: 72 }, 12).melody)).toEqual([
      'B4@0/12',
      'A4@24/12',
      'G4@48/12',
      'F#4@72/24',
    ])
    expect(shape(setDuration(draft, 'melody', { from: 0, to: 96 }, 48).melody)).toEqual([
      'B4@0/48',
      'G4@48/48',
    ])
  })

  it('changes a chord’s notes together, the chord’s one note chosen taking the chord', () => {
    const draft = writeNotes(draftOf(), 'rh', 0, keys(60, 64), 24).draft
    expect(shape(setDuration(draft, 'rh', { at: 0, key: midi(64) }, 48).hands.rh)).toEqual([
      'C4@0/48',
      'E4@0/48',
    ])
  })

  it('stops a note at the piece’s end, and changes nothing where no note is', () => {
    const draft = draftOf({ melody: 'B4/4 A4/3 G4/1' })
    expect(shape(setDuration(draft, 'melody', 168, 48).melody)).toContain('G4@168/24')
    expect(setDuration(draft, 'lh', 0, 48)).toBe(draft)
  })
})

describe('toggleAccidental', () => {
  // E and F♯ in G major.
  const draft = writeNotes(draftOf(), 'rh', 0, keys(64, 66), 24).draft

  it('writes the note’s letter sharp, flat or natural, its key following', () => {
    expect(shape(toggleAccidental(draft, 'rh', { at: 0, key: midi(64) }, -1).hands.rh)).toEqual([
      'E♭4@0/24',
      'F#4@0/24',
    ])
    expect(shape(toggleAccidental(draft, 'rh', 0, 0).hands.rh)).toEqual(['E4@0/24', 'F4@0/24'])
    expect(shape(toggleAccidental(draft, 'rh', 0, 1).hands.rh)).toEqual(['E#4@0/24', 'F#4@0/24'])
  })

  it('takes the sign off notes that all carry it, each letter spelled as the key spells it (Flat’s)', () => {
    const flat = toggleAccidental(draft, 'rh', { at: 0, key: midi(64) }, -1)
    expect(carriesAccidental(notesAt(flat, 'rh', 0), -1)).toBe(false)
    expect(carriesAccidental(notesAt(flat, 'rh', 0).slice(0, 1), -1)).toBe(true)
    expect(shape(toggleAccidental(flat, 'rh', { at: 0, key: midi(63) }, -1).hands.rh)).toEqual([
      'E4@0/24',
      'F#4@0/24',
    ])
    // ♮ on the key's F♯ writes F; ♮ again returns it to the key: F♯, as the key spells F.
    const natural = toggleAccidental(draft, 'rh', { at: 0, key: midi(66) }, 0)
    expect(shape(natural.hands.rh)).toEqual(['E4@0/24', 'F4@0/24'])
    expect(shape(toggleAccidental(natural, 'rh', { at: 0, key: midi(65) }, 0).hands.rh)).toEqual([
      'E4@0/24',
      'F#4@0/24',
    ])
    // A sharp the key writes already stays where ♯ is tapped on it.
    expect(toggleAccidental(draft, 'rh', { at: 0, key: midi(66) }, 1)).toBe(draft)
    // A chord of which only one note carries the sign takes it on every note.
    expect(shape(toggleAccidental(draft, 'rh', 0, 1).hands.rh)).toEqual(['E#4@0/24', 'F#4@0/24'])
  })

  it('carries a sign only where notes are chosen', () => {
    expect(carriesAccidental([], 0)).toBe(false)
  })
})
