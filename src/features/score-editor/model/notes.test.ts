import { describe, expect, it } from 'vitest'
import { midi, note, noteName } from '@/shared/lib/music'
import { draftOf, shape } from '../testing/test-draft'
import {
  addToChord,
  backToPattern,
  deleteNotes,
  notesAt,
  respellNotes,
  setAccidental,
  setDuration,
  setFinger,
  shiftNotes,
  tieNotes,
  writeNotes,
  writeOut,
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

  it('adds a bar for a note past the end: the last chord again, the meter’s length', () => {
    const draft = draftOf()
    const written = writeNotes(draft, 'melody', totalTicks(draft), keys(67), 24)
    expect(totalTicks(written.draft)).toBe(288)
    const last = barsOf(written.draft).at(-1)
    expect(last?.line).toBe(0)
    expect(last?.bar.chords.map((chord) => noteName(chord.chord.root))).toEqual(['C'])
    expect(shape(written.draft.melody)).toEqual(['G4@192/24'])
  })

  it('stops a note at the piece’s end', () => {
    const written = writeNotes(draftOf(), 'melody', 168, keys(67), 96)
    expect(shape(written.draft.melody)).toEqual(['G4@168/24'])
    expect(written.end).toBe(192)
  })
})

describe('writeNotes in a hand', () => {
  it('writes out a bar the pattern played, then the notes struck together', () => {
    const written = writeNotes(draftOf(), 'lh', 0, keys(43, 55), 96)
    expect(shape(written.draft.hands.lh)).toEqual(['G2@0/96', 'G3@0/96'])
    expect(barsOf(written.draft).map(({ bar }) => bar.lh)).toEqual([true, false])
  })

  it('keeps a held bass sounding under a chord written over it', () => {
    const held = writeNotes(draftOf(), 'lh', 0, keys(43), 96).draft
    const chord = writeNotes(held, 'lh', 24, keys(59, 62), 24)
    expect(shape(chord.draft.hands.lh)).toEqual(['G2@0/96', 'B3@24/24', 'D4@24/24'])
  })

  it('stops a note at a bar the pattern plays', () => {
    const written = writeNotes(draftOf(), 'rh', 48, keys(67), 96)
    expect(shape(written.draft.hands.rh)).toEqual(['G4@48/48'])
    expect(written.end).toBe(96)
  })

  it('holds a note into the next bar when the hand writes it too', () => {
    const both = writeOut(draftOf(), 'rh', 1, [])
    expect(shape(writeNotes(both, 'rh', 48, keys(67), 96).draft.hands.rh)).toEqual(['G4@48/96'])
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
    const rested = writeRest(draft, 'melody', 24, 48)
    expect(shape(rested.draft.melody)).toEqual(['B4@0/24', 'G4@72/24'])
    expect(rested.end).toBe(72)
  })

  it('write out a bar the pattern played as silence', () => {
    const rested = writeRest(draftOf(), 'lh', 96, 96)
    expect(barsOf(rested.draft).map(({ bar }) => bar.lh)).toEqual([false, true])
    expect(rested.draft.hands.lh).toEqual([])
  })
})

describe('writing a bar out, and back to the pattern', () => {
  const played = [
    { midi: midi(43), spelled: note('G'), startTick: 0, durationTicks: 96 },
    { midi: midi(55), spelled: note('G'), startTick: 0, durationTicks: 120 },
  ]

  it('writes out what the pattern plays there, inside the bar', () => {
    const out = writeOut(draftOf(), 'lh', 0, played)
    expect(shape(out.hands.lh)).toEqual(['G2@0/96', 'G3@0/96'])
    expect(barsOf(out).map(({ bar }) => bar.lh)).toEqual([true, false])
  })

  it('gives the bar back to the pattern, cutting a note held into it', () => {
    const held = writeNotes(writeOut(draftOf(), 'rh', 1, []), 'rh', 48, keys(67), 96).draft
    const back = backToPattern(held, 'rh', 1)
    expect(shape(back.hands.rh)).toEqual(['G4@48/48'])
    expect(barsOf(back).map(({ bar }) => bar.rh)).toEqual([true, false])
  })
})

describe('tieNotes', () => {
  it('joins the notes at the caret to the same keys after them', () => {
    const draft = draftOf({ hands: { rh: 'C4+E4/2 C4+G4/2 | -' } })
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

describe('setAccidental', () => {
  const draft = writeNotes(draftOf(), 'rh', 0, keys(64, 66), 24).draft

  it('writes the note’s letter sharp, flat or natural, its key following', () => {
    expect(shape(setAccidental(draft, 'rh', { at: 0, key: midi(64) }, -1).hands.rh)).toEqual([
      'E♭4@0/24',
      'F#4@0/24',
    ])
    expect(shape(setAccidental(draft, 'rh', 0, 0).hands.rh)).toEqual(['E4@0/24', 'F4@0/24'])
    expect(shape(setAccidental(draft, 'rh', 0, 1).hands.rh)).toEqual(['E#4@0/24', 'F#4@0/24'])
  })
})
