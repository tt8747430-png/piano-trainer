import { describe, expect, it } from 'vitest'
import { midi, note, noteName } from '@/shared/lib/music'
import { draftOf, shape } from '../testing/test-draft'
import {
  addToChord,
  backToPattern,
  deleteNotes,
  notesAt,
  respellNotes,
  setFinger,
  shiftNotes,
  writeNotes,
  writeOut,
  writeRest,
} from './notes'
import { barsOf, totalTicks } from './timeline'

const keys = (...numbers: number[]) => numbers.map((n) => midi(n))

describe('writeNotes in the melody', () => {
  it('writes a note at the caret, spelled in the key, and says where the next goes', () => {
    const written = writeNotes(draftOf(), 'melody', 12, keys(66), 12)
    expect(shape(written.draft.melody)).toEqual(['F#4@12/12'])
    expect(written.end).toBe(24)
  })

  it('keeps the highest of keys struck together', () => {
    expect(shape(writeNotes(draftOf(), 'melody', 0, keys(60, 67, 64), 12).draft.melody)).toEqual([
      'G4@0/12',
    ])
  })

  it('cuts the note sounding into it and replaces those starting under it', () => {
    const draft = draftOf({ melody: 'B4/2 A4/1 G4/1' })
    expect(shape(writeNotes(draft, 'melody', 12, keys(74), 24).draft.melody)).toEqual([
      'B4@0/12',
      'D5@12/24',
      'G4@36/12',
    ])
  })

  it('lets a note cross a barline', () => {
    const written = writeNotes(draftOf(), 'melody', 36, keys(67), 24)
    expect(shape(written.draft.melody)).toEqual(['G4@36/24'])
  })

  it('adds a bar for a note past the end: the last chord again, the meter’s length', () => {
    const draft = draftOf()
    const written = writeNotes(draft, 'melody', totalTicks(draft), keys(67), 12)
    expect(totalTicks(written.draft)).toBe(144)
    const last = barsOf(written.draft).at(-1)
    expect(last?.line).toBe(0)
    expect(last?.bar.chords.map((chord) => noteName(chord.chord.root))).toEqual(['C'])
    expect(shape(written.draft.melody)).toEqual(['G4@96/12'])
  })

  it('stops a note at the piece’s end', () => {
    const written = writeNotes(draftOf(), 'melody', 84, keys(67), 48)
    expect(shape(written.draft.melody)).toEqual(['G4@84/12'])
    expect(written.end).toBe(96)
  })
})

describe('writeNotes in a hand', () => {
  it('writes out a bar the pattern played, then the notes struck together', () => {
    const written = writeNotes(draftOf(), 'lh', 0, keys(43, 55), 48)
    expect(shape(written.draft.hands.lh)).toEqual(['G2@0/48', 'G3@0/48'])
    expect(barsOf(written.draft).map(({ bar }) => bar.lh)).toEqual([true, false])
  })

  it('keeps a held bass sounding under a chord written over it', () => {
    const held = writeNotes(draftOf(), 'lh', 0, keys(43), 48).draft
    const chord = writeNotes(held, 'lh', 12, keys(59, 62), 12)
    expect(shape(chord.draft.hands.lh)).toEqual(['G2@0/48', 'B3@12/12', 'D4@12/12'])
  })

  it('stops a note at a bar the pattern plays', () => {
    const written = writeNotes(draftOf(), 'rh', 24, keys(67), 48)
    expect(shape(written.draft.hands.rh)).toEqual(['G4@24/24'])
    expect(written.end).toBe(48)
  })

  it('holds a note into the next bar when the hand writes it too', () => {
    const both = writeOut(draftOf(), 'rh', 1, [])
    expect(shape(writeNotes(both, 'rh', 24, keys(67), 48).draft.hands.rh)).toEqual(['G4@24/48'])
  })
})

describe('the notes at the caret', () => {
  const draft = writeNotes(draftOf(), 'rh', 0, keys(60, 64), 24).draft

  it('adds a key to the chord there, with its length', () => {
    expect(shape(addToChord(draft, 'rh', 0, midi(67), 12).hands.rh)).toEqual([
      'C4@0/24',
      'E4@0/24',
      'G4@0/24',
    ])
  })

  it('writes a note where there is none', () => {
    expect(shape(addToChord(draft, 'rh', 24, midi(67), 12).hands.rh)).toEqual([
      'C4@0/24',
      'E4@0/24',
      'G4@24/12',
    ])
  })

  it('keeps the melody one line: a higher key takes the note’s place, a lower one leaves it', () => {
    const tune = writeNotes(draftOf(), 'melody', 0, keys(64), 12).draft
    expect(shape(addToChord(tune, 'melody', 0, midi(67), 12).melody)).toEqual(['G4@0/12'])
    expect(shape(addToChord(tune, 'melody', 0, midi(60), 12).melody)).toEqual(['E4@0/12'])
  })

  it('finds and deletes them', () => {
    expect(shape(notesAt(draft, 'rh', 0))).toEqual(['C4@0/24', 'E4@0/24'])
    expect(deleteNotes(draft, 'rh', 0).hands.rh).toEqual([])
  })

  it('moves them by semitones and octaves, spelled in the key', () => {
    expect(shape(shiftNotes(draft, 'rh', 0, 1).hands.rh)).toEqual(['C#4@0/24', 'F4@0/24'])
    expect(shape(shiftNotes(draft, 'rh', 0, -12).hands.rh)).toEqual(['C3@0/24', 'E3@0/24'])
  })

  it('moves nothing past the piano’s ends', () => {
    const low = writeNotes(draftOf(), 'lh', 0, keys(22), 12).draft
    expect(shiftNotes(low, 'lh', 0, -12)).toBe(low)
  })

  it('respells them the other way', () => {
    const sharp = shiftNotes(draft, 'rh', 0, 1)
    expect(shape(respellNotes(sharp, 'rh', 0).hands.rh)).toEqual(['D♭4@0/24', 'E#4@0/24'])
    expect(respellNotes(sharp, 'rh', 0).hands.rh[0]?.midi).toBe(61)
  })

  it('sets and clears a finger in a hand', () => {
    const fingered = setFinger(draft, 'rh', 0, midi(64), 3)
    expect(fingered.hands.rh.map((n) => n.finger)).toEqual([undefined, 3])
    expect(setFinger(fingered, 'rh', 0, midi(64), null).hands.rh.map((n) => n.finger)).toEqual([
      undefined,
      undefined,
    ])
  })
})

describe('rests', () => {
  it('cut the melody’s note sounding into them and take the notes under them', () => {
    const draft = draftOf({ melody: 'B4/2 A4/1 G4/1' })
    const rested = writeRest(draft, 'melody', 12, 24)
    expect(shape(rested.draft.melody)).toEqual(['B4@0/12', 'G4@36/12'])
    expect(rested.end).toBe(36)
  })

  it('write out a bar the pattern played as silence', () => {
    const rested = writeRest(draftOf(), 'lh', 48, 48)
    expect(barsOf(rested.draft).map(({ bar }) => bar.lh)).toEqual([false, true])
    expect(rested.draft.hands.lh).toEqual([])
  })
})

describe('writing a bar out, and back to the pattern', () => {
  const played = [
    { midi: midi(43), spelled: note('G'), startTick: 0, durationTicks: 48 },
    { midi: midi(55), spelled: note('G'), startTick: 0, durationTicks: 60 },
  ]

  it('writes out what the pattern plays there, inside the bar', () => {
    const out = writeOut(draftOf(), 'lh', 0, played)
    expect(shape(out.hands.lh)).toEqual(['G2@0/48', 'G3@0/48'])
    expect(barsOf(out).map(({ bar }) => bar.lh)).toEqual([true, false])
  })

  it('gives the bar back to the pattern, cutting a note held into it', () => {
    const held = writeNotes(writeOut(draftOf(), 'rh', 1, []), 'rh', 24, keys(67), 48).draft
    const back = backToPattern(held, 'rh', 1)
    expect(shape(back.hands.rh)).toEqual(['G4@24/24'])
    expect(barsOf(back).map(({ bar }) => bar.rh)).toEqual([true, false])
  })
})
