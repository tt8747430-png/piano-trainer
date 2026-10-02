import { describe, expect, it } from 'vitest'
import {
  midiOf,
  note,
  noteFromParam,
  noteName,
  noteParam,
  otherSpelling,
  parseNoteInOctave,
  parseNoteName,
  pitchClassOf,
  plainRoot,
  plainSpelling,
  rootSpelling,
  sameNote,
  writtenName,
  writtenOctave,
  type SpelledNote,
} from './note'
import { midi, pitchClass } from './pitch'

describe('pitchClassOf', () => {
  it.each([
    [note('C'), 0],
    [note('B', 1), 0],
    [note('C', -1), 11],
    [note('F', 2), 7],
    [note('B', -2), 9],
    [note('E', 1), 5],
  ])('%j → %i', (spelled, pc) => {
    expect(pitchClassOf(spelled)).toBe(pc)
  })
})

describe('noteName', () => {
  it.each([
    [note('E', -1), 'E♭'],
    [note('F', 1), 'F#'],
    [note('F', 2), 'F𝄪'],
    [note('B', -2), 'B𝄫'],
    [note('C'), 'C'],
  ])('%j → %s', (spelled, name) => {
    expect(noteName(spelled)).toBe(name)
  })
})

describe('parseNoteName', () => {
  it.each([
    ['Eb', note('E', -1)],
    ['E♭', note('E', -1)],
    ['F#', note('F', 1)],
    ['F♯', note('F', 1)],
    ['F##', note('F', 2)],
    ['F𝄪', note('F', 2)],
    ['Bbb', note('B', -2)],
    ['B𝄫', note('B', -2)],
    ['C', note('C')],
  ])('reads %s', (text, spelled) => {
    expect(parseNoteName(text)).toEqual(spelled)
  })

  it.each(['H', 'E#b', 'e', '', 'Cconstructor', 'C#m'])('refuses %j', (text) => {
    expect(parseNoteName(text)).toBeNull()
  })
})

describe('plainSpelling', () => {
  it('leans to sharps or flats, with at most one accidental', () => {
    expect(plainSpelling(pitchClass(1), true)).toEqual(note('C', 1))
    expect(plainSpelling(pitchClass(1), false)).toEqual(note('D', -1))
    expect(plainSpelling(pitchClass(0), true)).toEqual(note('C'))
    expect(plainSpelling(pitchClass(0), false)).toEqual(note('C'))
  })
})

describe('rootSpelling', () => {
  // Only C♯/D♭ and G♯/A♭ follow the preference; E♭, F♯ and B♭ are fixed.
  const ROOTS = [
    ['C', 'C'],
    ['C#', 'D♭'],
    ['D', 'D'],
    ['E♭', 'E♭'],
    ['E', 'E'],
    ['F', 'F'],
    ['F#', 'F#'],
    ['G', 'G'],
    ['G#', 'A♭'],
    ['A', 'A'],
    ['B♭', 'B♭'],
    ['B', 'B'],
  ] as const

  it.each(ROOTS.map(([sharp, flat], pc) => ({ pc, sharp, flat })))(
    'pc $pc → $sharp leaning sharp, $flat leaning flat',
    ({ pc, sharp, flat }) => {
      expect(noteName(rootSpelling(pitchClass(pc), true))).toBe(sharp)
      expect(noteName(rootSpelling(pitchClass(pc), false))).toBe(flat)
    },
  )
})

describe('sameNote', () => {
  it('compares letter and accidental, not pitch', () => {
    expect(sameNote(note('E', -1), note('E', -1))).toBe(true)
    expect(sameNote(note('E', -1), note('D', 1))).toBe(false)
  })
})

describe('midiOf', () => {
  it.each([
    [note('C'), 4, 60],
    [note('A'), 4, 69],
    [note('C', 1), 5, 73],
    [note('B', 1), 3, 60],
    [note('C', -1), 4, 59],
  ])('%j in octave %i is key %i', (spelled, octave, key) => {
    expect(midiOf(spelled, octave)).toBe(key)
  })

  it('refuses a key off the keyboard', () => {
    expect(midiOf(note('G'), 9)).toBe(127)
    expect(() => midiOf(note('G', 1), 9)).toThrow(RangeError)
  })
})

describe('noteParam and noteFromParam', () => {
  it('write a note for a URL with ASCII accidentals and read it back', () => {
    for (const spelled of [note('B', -1), note('F', 1), note('C'), note('E', -2)]) {
      expect(noteFromParam(noteParam(spelled))).toEqual(spelled)
    }
    expect(noteParam(note('B', -1))).toBe('Bb')
    expect(noteParam(note('F', 1))).toBe('F#')
  })

  it('read only a param noteParam wrote', () => {
    // @ts-expect-error Text from anywhere else is not a NoteParam: a URL's goes through readNote first.
    expect(noteFromParam('Bb')).toEqual(note('B', -1))
  })
})

describe('writtenOctave', () => {
  it('writes a key in the octave of its letter', () => {
    expect(writtenOctave(midi(60), note('C'))).toBe(4)
    expect(writtenOctave(midi(60), note('B', 1))).toBe(3)
    expect(writtenOctave(midi(71), note('C', -1))).toBe(5)
    expect(writtenOctave(midi(62), note('C', 2))).toBe(4)
  })
})

describe('writtenName', () => {
  it('names a key as spelled, in the octave of its letter', () => {
    expect(writtenName(midi(60), note('C'))).toBe('C4')
    expect(writtenName(midi(60), note('B', 1))).toBe('B#3')
    expect(writtenName(midi(70), note('B', -1))).toBe('B♭4')
  })
})

describe('parseNoteInOctave', () => {
  it('reads a note and its octave as scientific pitch writes them, middle C C4', () => {
    expect(parseNoteInOctave('C4')).toEqual({ note: note('C'), midi: 60 })
    expect(parseNoteInOctave('B♭3')).toEqual({ note: note('B', -1), midi: 58 })
    expect(parseNoteInOctave('F#5')).toEqual({ note: note('F', 1), midi: 78 })
    expect(parseNoteInOctave('Cb4')).toEqual({ note: note('C', -1), midi: 59 })
  })

  it('reads nothing without an octave or a note', () => {
    expect(parseNoteInOctave('E')).toBeNull()
    expect(parseNoteInOctave('H4')).toBeNull()
    expect(parseNoteInOctave('4')).toBeNull()
  })
})

describe('plainRoot', () => {
  it('names a root plainly where letters would give F♭, C♭, E♯, B♯ or a double', () => {
    expect(plainRoot(note('F', -1))).toEqual(note('E'))
    expect(plainRoot(note('B', 1))).toEqual(note('C'))
    expect(plainRoot(note('B', -2))).toEqual(note('A'))
    expect(plainRoot(note('E', -1))).toEqual(note('E', -1))
    expect(plainRoot(note('F', 1))).toEqual(note('F', 1))
  })
})

describe('otherSpelling', () => {
  it('writes a note the other way, with one accidental at most', () => {
    const names = (letters: SpelledNote[]) => letters.map((n) => noteName(otherSpelling(n)))
    expect(
      names([note('C', 1), note('D', -1), note('E'), note('F', -1), note('C'), note('B', 1)]),
    ).toEqual(['D♭', 'C#', 'F♭', 'E', 'B#', 'C'])
  })

  it('leaves a note with no other spelling as it is', () => {
    expect(otherSpelling(note('G', 1))).toEqual(note('A', -1))
    expect(otherSpelling(note('D'))).toEqual(note('D'))
  })
})
