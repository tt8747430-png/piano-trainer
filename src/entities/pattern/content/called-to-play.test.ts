import { describe, expect, it } from 'vitest'
import { arrange, type Chart, type Performance } from '@/shared/lib/arrangement'
import { note, parseChordSymbol, TICKS_PER_BEAT, type Hand } from '@/shared/lib/music'
import { PATTERNS, type PatternId } from '../index'

const SIXTEENTH = TICKS_PER_BEAT / 4
const NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

/** A bar of each chord, 4/4, in C. */
const chart = (symbols: readonly string[]): Chart => ({
  key: { tonic: note('C'), minor: false },
  meter: '4/4',
  sections: [
    {
      lines: [
        symbols.map((symbol) => ({
          chords: [{ ...parseChordSymbol(symbol), beats: 4 }],
          beats: 4,
        })),
      ],
    },
  ],
})

const play = (id: PatternId, ...symbols: string[]) =>
  arrange(chart(symbols), { tonic: note('C'), pattern: PATTERNS[id].pattern })

/** A hand's events in the figure notation's terms: `start/length` in 16ths, then its keys (`C4` is middle C). */
function written(performance: Performance, hand: Hand): string[] {
  const events = new Map<string, string[]>()
  for (const n of performance.notes.filter((each) => each.hand === hand)) {
    const at = `${n.startTick / SIXTEENTH}/${n.durationTicks / SIXTEENTH}`
    const name = `${NAMES[n.midi % 12]}${Math.floor(n.midi / 12) - 1}`
    events.set(at, [...(events.get(at) ?? []), name])
  }
  return [...events].map(([at, keys]) => `${at} ${keys.join('+')}`)
}

// Each pattern over the chord its page shows (Called to Play, level 1, lessons 3–9): the right hand as
// written there, the left in the app's bass register (its root from G1 to F♯2).
describe('Called to Play’s ways and techniques, as the book writes them', () => {
  it('breaks the chord as the hand holds it: its upper notes, then its lowest (lesson 4’s G)', () => {
    expect(written(play('M2', 'C', 'G'), 'rh').slice(0, 2)).toEqual(['0/2 E4+G4', '2/2 C4'])
    expect(written(play('M2', 'C', 'G'), 'rh').slice(8, 10)).toEqual(['16/2 D4+G4', '18/2 B3'])
  })

  it('3 · the left hand’s 1–5–8, then the 3rd and the 5th with the octave (Am)', () => {
    const am = play('M3', 'Am')
    expect(written(am, 'rh')).toEqual(['6/2 C4', '8/8 E4+A4'])
    expect(written(am, 'lh').map((event) => event.split(' ')[1])).toEqual(['A1', 'E2', 'A2'])
  })

  it('4 · the arpeggio up through both hands and back down (Am)', () => {
    expect(written(play('M4', 'Am'), 'rh')).toEqual([
      '6/2 C4',
      '8/2 E4',
      '10/2 A4',
      '12/2 E4',
      '14/2 C4',
    ])
  })

  it('♪♩ · the chord, then its root an octave and two octaves up and back (C)', () => {
    expect(written(play('t1', 'C'), 'rh')).toEqual(['0/6 C4+E4+G4', '6/2 C5', '8/4 C6', '12/4 C5'])
  })

  it('♪♪♪♪ · 1–3–5–8 up two octaves (C)', () => {
    expect(written(play('t2', 'C'), 'rh')).toEqual([
      '0/2 C4',
      '2/2 E4',
      '4/2 G4',
      '6/2 C5',
      '8/2 C5',
      '10/2 E5',
      '12/2 G5',
      '14/2 C6',
    ])
  })

  it('3 · the 2nd and 5th, then down 3–2–1, twice an octave apart (C)', () => {
    expect(written(play('t3', 'C'), 'rh')).toEqual([
      '0/2 D5+G5',
      '2/2 E5',
      '4/2 D5',
      '6/2 C5',
      '8/2 D4+G4',
      '10/2 E4',
      '12/2 D4',
      '14/2 C4',
    ])
  })

  it('4 · 1–2–3–5 up two octaves (Dm)', () => {
    expect(written(play('t4', 'Dm'), 'rh')).toEqual([
      '0/2 D4',
      '2/2 E4',
      '4/2 F4',
      '6/2 A4',
      '8/2 D5',
      '10/2 E5',
      '12/2 F5',
      '14/2 A5',
    ])
  })

  it('5 · the chord dotted, then an octave up, over the wide arpeggio (C)', () => {
    const c = play('t5', 'C')
    expect(written(c, 'rh')).toEqual(['0/6 C4+E4+G4', '6/2 C5+E5+G5', '8/8 C5+E5+G5'])
    expect(written(c, 'lh')).toEqual(['0/2 C2', '2/2 G2', '4/2 C3', '6/2 E3', '8/4 G3', '12/4 E3'])
  })

  it('3 chords · the chord in three octaves (C)', () => {
    expect(written(play('c3', 'C'), 'rh')).toEqual(['0/4 C4+E4+G4', '4/4 C5+E5+G5', '8/8 C6+E6+G6'])
  })

  it('Invers. · root position held, then the 1st and 2nd inversion; the bass climbs to its 12th (C)', () => {
    const c = play('inv', 'C')
    expect(written(c, 'rh')).toEqual(['0/8 C4+E4+G4', '8/4 E4+G4+C5', '12/4 G4+C5+E5'])
    expect(written(c, 'lh')).toEqual(['0/2 C2', '2/2 G2', '4/2 C3', '6/2 E3', '8/8 G3'])
  })

  it('5.1 · the chord, then with its ♭7 under the root (Dm)', () => {
    expect(written(play('p51', 'Dm'), 'rh')).toEqual([
      '0/4 D4+F4+A4',
      '4/4 D4+F4+A4',
      '8/4 C4+D4+F4+A4',
      '12/4 C4+D4+F4+A4',
    ])
  })

  it('5.2 · the root falls by half steps; a major chord plays only the first three (Dm, D)', () => {
    expect(written(play('p52', 'Dm'), 'rh')).toEqual([
      '0/4 D4+F4+A4',
      '4/4 C#4+F4+A4',
      '8/4 C4+F4+A4',
      '12/4 B3+F4+A4',
    ])
    expect(written(play('p52', 'D'), 'rh')).toEqual([
      '0/4 D4+F#4+A4',
      '4/4 C#4+F#4+A4',
      '8/8 C4+F#4+A4',
    ])
  })

  it('5.3 · the 3rd turns 3–2–4–3 (Dm)', () => {
    expect(written(play('p53', 'Dm'), 'rh')).toEqual([
      '0/4 D4+F4+A4',
      '4/4 D4+E4+A4',
      '8/4 D4+G4+A4',
      '12/4 D4+F4+A4',
    ])
  })

  it('6th↑ · sixths climb to the 5th and 3rd; 6th↓ fall to the 3rd and root (Am)', () => {
    expect(written(play('s6u', 'Am'), 'rh')).toEqual([
      '0/2 C4+A4',
      '2/2 D4+B4',
      '4/2 D4+B4',
      '6/2 E4+C5',
      '8/8 E4+C5',
    ])
    expect(written(play('s6d', 'Am'), 'rh')).toEqual([
      '0/2 E4+C5',
      '2/2 D4+B4',
      '4/2 D4+B4',
      '6/2 C4+A4',
      '8/8 C4+A4',
    ])
    expect(written(play('s6u', 'Am'), 'lh')).toEqual(['0/4 A1', '4/4 E2', '8/4 A2', '12/4 E2'])
  })
})
