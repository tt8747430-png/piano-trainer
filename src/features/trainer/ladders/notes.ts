import {
  noteName,
  parseNoteInOctave,
  PIANO,
  midi,
  MIDDLE_C,
  plainSpelling,
  pitchClass,
  type Midi,
} from '@/shared/lib/music'
import type { ReadNote } from '../draw'

// The notes ladder (roadmap §10.6): fifteen levels from three anchors to every key. A note at or above
// middle C is read on the treble staff, one below it on the bass, unless the level says otherwise.

const read = (text: string, clef?: ReadNote['clef']): ReadNote => {
  const parsed = parseNoteInOctave(text)
  if (!parsed) throw new RangeError(`${text} is not a note`)
  return {
    key: parsed.midi,
    spelled: parsed.note,
    clef: clef ?? (parsed.midi >= MIDDLE_C ? 'treble' : 'bass'),
  }
}
const notes = (texts: string, clef?: ReadNote['clef']) =>
  texts.split(' ').map((text) => read(text, clef))

const WHITE = new Set([0, 2, 4, 5, 7, 9, 11])

/**
 * Every key from `from` to `to`: the white keys, and with accidentals each black key both ways
 * (C♯ and D♭), on the staff its range reads it on.
 */
export function rangeNotes(from: Midi, to: Midi, accidentals: boolean): ReadNote[] {
  const all: ReadNote[] = []
  for (let key = from; key <= to; key++) {
    const pc = pitchClass(key)
    const spellings = WHITE.has(pc)
      ? [plainSpelling(pc, true)]
      : accidentals
        ? [plainSpelling(pc, true), plainSpelling(pc, false)]
        : []
    for (const spelled of spellings) {
      const octave = Math.floor((key - spelled.accidental) / 12) - 1
      all.push(read(`${noteName(spelled)}${octave}`))
    }
  }
  return all
}

export const NOTE_LEVELS = [
  'anchors',
  'anchors-everywhere',
  'treble-five',
  'treble-lines',
  'treble-spaces',
  'treble',
  'bass-five',
  'bass-lines',
  'bass-spaces',
  'bass',
  'both',
  'both-wider',
  'accidentals',
  'ledger-lines',
  'full-range',
] as const
export type NoteLevel = (typeof NOTE_LEVELS)[number]

const key = (text: string): Midi => read(text).key

/** Each level's notes. */
export function noteLevel(level: NoteLevel): ReadNote[] {
  switch (level) {
    case 'anchors':
      return notes('F3 C4 G4')
    case 'anchors-everywhere':
      return notes('C3 F3 G3 C4 F4 G4 C5 F5 G5')
    case 'treble-five':
      return rangeNotes(key('C4'), key('G4'), false)
    case 'treble-lines':
      return notes('E4 G4 B4 D5 F5')
    case 'treble-spaces':
      return notes('F4 A4 C5 E5')
    case 'treble':
      return rangeNotes(key('C4'), key('G5'), false)
    case 'bass-five':
      return rangeNotes(key('C3'), key('G3'), false)
    case 'bass-lines':
      return notes('G2 B2 D3 F3 A3')
    case 'bass-spaces':
      return notes('A2 C3 E3 G3')
    case 'bass':
      return rangeNotes(key('F2'), key('B3'), false)
    case 'both':
      return rangeNotes(key('F2'), key('G5'), false)
    case 'both-wider':
      return rangeNotes(key('C2'), key('C6'), false)
    case 'accidentals':
      return rangeNotes(key('C4'), key('B4'), true)
    case 'ledger-lines':
      return [
        ...notes('A5 B5 C6 D6 E6'),
        ...notes('A3 B3', 'treble'),
        ...notes('C4 D4 E4', 'bass'),
        ...notes('C2 D2 E2'),
      ]
    case 'full-range':
      return rangeNotes(PIANO.from, PIANO.to, false)
  }
}

/** Custom's range: middle C's octave unless the learner moves it. */
export const NOTE_RANGE = { from: midi(MIDDLE_C), to: midi(MIDDLE_C + 12) } as const
