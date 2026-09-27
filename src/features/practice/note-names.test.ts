import { describe, expect, it } from 'vitest'
import { pieceById } from '@/entities/piece'
import { arrange, parseFigure } from '@/shared/lib/arrangement'
import { note, noteName, parseChordSymbol, pitchClass } from '@/shared/lib/music'
import { arrangePiece, ownChoice } from './arrange-piece'
import { playedNoteName, spellPitchClass } from './note-names'

const bz5 = pieceById('bz5')
if (!bz5) throw new Error('bz5')
const performance = arrangePiece(bz5, ownChoice(bz5))

describe('playedNoteName', () => {
  it('names a played note as it is written, in the octave of its letter', () => {
    const sharpKey = arrange(
      {
        key: { tonic: note('C', 1), minor: false },
        meter: '4/4',
        sections: [
          { lines: [[{ chords: [{ ...parseChordSymbol('C#maj7'), beats: 4 }], beats: 4 }]] },
        ],
      },
      {
        tonic: note('C', 1),
        pattern: {
          id: 'block',
          rh: { kind: 'events', events: parseFigure('0/16 C') },
          lh: { kind: 'events', events: parseFigure('0/16 L1') },
        },
      },
    )
    const bSharp = sharpKey.notes.find((n) => n.hand === 'rh' && pitchClass(n.midi) === 0)
    if (!bSharp) throw new Error('C#maj7 has its B#')
    expect(playedNoteName(bSharp)).toEqual({
      name: noteName(note('B', 1)),
      octave: Math.floor(bSharp.midi / 12) - 2,
    })
  })
})

describe('spellPitchClass', () => {
  it('names a pitch class from the chord it belongs to, else from the key', () => {
    const g = performance.chords.findIndex((chord) => chord.symbol === 'G')
    expect(spellPitchClass(performance, g, pitchClass(11))).toBe('B')
    expect(spellPitchClass(performance, g, pitchClass(1))).toBe('C#')
  })
})
