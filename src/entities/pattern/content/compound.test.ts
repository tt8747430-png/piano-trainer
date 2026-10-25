import { describe, expect, it } from 'vitest'
import { arrange, type Chart, type Performance } from '@/shared/lib/arrangement'
import { note, type Meter, type SpelledNote } from '@/shared/lib/music'
import { BUILT_IN_PATTERNS } from '../model/book'
import { patternNeed } from '../model/fit'
import { METHOD_CODES, type PatternId } from '../model/types'
import { METHODS } from './methods'

// Called to Play's level 2 plays level 1's methods in 6/8 and 12/8 (spec 2026-10-14): each figure
// below is the book's, a dotted-quarter beat 24 ticks, an 8th 8, a 16th 4.

const NAMES = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B']
const keyName = (midi: number) => `${NAMES[midi % 12]}${Math.floor(midi / 12) - 1}`

/** One bar of a minor chord, or a major one, in a compound meter. */
const bar = (root: SpelledNote, meter: Meter, quality: 'min' | 'maj' = 'min'): Chart => {
  const beats = meter === '12/8' ? 4 : 2
  return {
    key: { tonic: root, minor: quality === 'min' },
    meter,
    sections: [{ lines: [[{ chords: [{ root, quality, beats }], beats }]] }],
  }
}
const play = (pattern: PatternId, chart: Chart): Performance =>
  arrange(chart, {
    tonic: chart.key.tonic,
    pattern: BUILT_IN_PATTERNS.require(pattern).pattern,
  })
/** A hand's notes as the book writes them: each onset, its keys lowest first, its length. */
const hand = (performance: Performance, which: 'rh' | 'lh') => {
  const notes = performance.notes.filter((n) => n.hand === which)
  return [...new Set(notes.map((n) => n.startTick))]
    .toSorted((a, b) => a - b)
    .map((tick) => {
      const struck = notes.filter((n) => n.startTick === tick).toSorted((a, b) => a.midi - b.midi)
      return `${tick}:${struck.map((n) => keyName(n.midi)).join('+')}/${struck[0]?.durationTicks}`
    })
}
const A = note('A')
const D = note('D')
const E = note('E')

describe('the five ways in 6/8 (lesson 3)', () => {
  it('1 · the chord on each beat over a held octave', () => {
    const played = play('M1', bar(A, '6/8'))
    expect(hand(played, 'rh').map((event) => event.split(':')[0])).toEqual(['0', '24'])
    expect(hand(played, 'lh')).toEqual(['0:A1+A2/48'])
  })

  it('2 · the upper notes a quarter, the lowest an 8th, on each beat', () => {
    const rh = hand(play('M2', bar(A, '6/8')), 'rh')
    expect(rh.map((event) => [event.split(':')[0], event.split('/')[1]])).toEqual([
      ['0', '16'],
      ['16', '8'],
      ['24', '16'],
      ['40', '8'],
    ])
    expect(rh[0]).toContain('+')
    expect(rh[1]).not.toContain('+')
  })

  it('3 · 1–5–8 in 8ths in the left hand, then the chord on beat 2', () => {
    const played = play('M3', bar(A, '6/8'))
    expect(hand(played, 'lh')).toEqual(['0:A1/8', '8:E2/8', '16:A2/8'])
    expect(hand(played, 'rh')).toEqual(['24:C4+E4+A4/24'])
  })

  it('4 · 1–5–8 in the left hand, 3–5–8 in the right, all 8ths', () => {
    const played = play('M4', bar(A, '6/8'))
    expect(hand(played, 'lh')).toEqual(['0:A1/8', '8:E2/8', '16:A2/8'])
    expect(hand(played, 'rh')).toEqual(['24:C4/8', '32:E4/8', '40:A4/8'])
  })

  it('5 · the chord on each beat over octaves long, then short', () => {
    const played = play('M5', bar(A, '6/8'))
    expect(hand(played, 'lh')).toEqual(['0:A1+A2/40', '40:A1+A2/8'])
    expect(hand(played, 'rh').map((event) => event.split(':')[0])).toEqual(['0', '24'])
  })

  it('plays a 12/8 bar as two bars of 6/8', () => {
    const played = play('M4', bar(A, '12/8'))
    expect(hand(played, 'lh').map((event) => event.split(':')[0])).toEqual([
      '0',
      '8',
      '16',
      '48',
      '56',
      '64',
    ])
    expect(hand(played, 'rh').map((event) => event.split(':')[0])).toEqual([
      '24',
      '32',
      '40',
      '72',
      '80',
      '88',
    ])
  })
})

describe('the right hand’s ways in 6/8 (lessons 4 and 5)', () => {
  it('1 (♪♩) · the chord, its octave, then the octave above that', () => {
    expect(hand(play('t1', bar(D, '6/8')), 'rh')).toEqual(['0:D4+F4+A4/16', '16:D5/8', '24:D6/24'])
  })

  it('2 · the arpeggio up two octaves in 8ths', () => {
    expect(hand(play('t2', bar(D, '6/8')), 'rh')).toEqual([
      '0:D4/8',
      '8:F4/8',
      '16:A4/8',
      '24:D5/8',
      '32:F5/8',
      '40:A5/8',
    ])
  })

  it('3 · the 2nd and 5th, then down 3–1, an octave lower on beat 2', () => {
    expect(hand(play('t3', bar(D, '6/8')), 'rh')).toEqual([
      '0:E5+A5/8',
      '8:F5/8',
      '16:D5/8',
      '24:E4+A4/8',
      '32:F4/8',
      '40:D4/8',
    ])
  })

  it('4 · 1–2–3–5 through three octaves in 16ths', () => {
    expect(hand(play('t4', bar(D, '6/8')), 'rh')).toEqual([
      '0:D4/4',
      '4:E4/4',
      '8:F4/4',
      '12:A4/4',
      '16:D5/4',
      '20:E5/4',
      '24:F5/4',
      '28:A5/4',
      '32:D6/4',
      '36:E6/4',
      '40:F6/4',
      '44:A6/4',
    ])
  })

  it('5 · the chord with its octave, then an octave up, short and held', () => {
    const played = play('t5', bar(D, '6/8'))
    expect(hand(played, 'rh')).toEqual([
      '0:D4+F4+A4+D5/16',
      '16:D5+F5+A5+D6/8',
      '24:D5+F5+A5+D6/24',
    ])
    expect(hand(played, 'lh')).toEqual([
      '0:D2/8',
      '8:A2/8',
      '16:D3/8',
      '24:F3/8',
      '32:A3/8',
      '40:F3/8',
    ])
  })

  it('6 (Invers.) · root position, then the first inversion, over the left hand’s climb', () => {
    const played = play('inv', bar(D, '6/8'))
    expect(hand(played, 'rh')).toEqual(['0:D4+F4+A4/24', '24:F4+A4+D5/24'])
    expect(hand(played, 'lh')).toEqual([
      '0:D2/8',
      '8:A2/8',
      '16:D3/8',
      '24:F3/8',
      '32:A3/8',
      '40:D4/8',
    ])
  })
})

describe('the right hand’s ways in 12/8 (lesson 6)', () => {
  const OCTAVES = ['0:E2+E3/40', '40:E2+E3/8', '48:E2+E3/40', '88:E2+E3/8']

  it('7 (5.1) · the chord twice, then twice with the ♭7 under it', () => {
    const played = play('p51', bar(E, '12/8'))
    expect(hand(played, 'rh')).toEqual([
      '0:E4+G4+B4/24',
      '24:E4+G4+B4/24',
      '48:D4+E4+G4+B4/24',
      '72:D4+E4+G4+B4/24',
    ])
    expect(hand(played, 'lh')).toEqual(OCTAVES)
  })

  it('8 (5.2) · the root falls 1–7–♭7–6; over a major chord only the first three', () => {
    expect(hand(play('p52', bar(E, '12/8')), 'rh')).toEqual([
      '0:E4+G4+B4/24',
      '24:Eb4+G4+B4/24',
      '48:D4+G4+B4/24',
      '72:C#4+G4+B4/24',
    ])
    expect(hand(play('p52', bar(E, '12/8', 'maj')), 'rh')).toHaveLength(3)
  })

  it('9 (5.3) · the 3rd moves 3–2–4–3', () => {
    const played = play('p53', bar(E, '12/8'))
    expect(hand(played, 'rh')).toEqual([
      '0:E4+G4+B4/24',
      '24:E4+F#4+B4/24',
      '48:E4+A4+B4/24',
      '72:E4+G4+B4/24',
    ])
    expect(hand(played, 'lh')).toEqual(OCTAVES)
  })

  it('10 (3 chords) · three chords an octave apart over the wide arpeggio', () => {
    const played = play('c3', bar(E, '12/8'))
    expect(hand(played, 'rh')).toEqual(['0:E4+G4+B4/24', '24:E5+G5+B5/24', '48:E6+G6+B6/48'])
    expect(hand(played, 'lh')).toEqual([
      '0:E2/8',
      '8:B2/8',
      '16:E3/8',
      '24:G3/8',
      '32:B3/8',
      '40:G3/8',
      '48:E2/8',
      '56:B2/8',
      '64:E3/8',
      '72:G3/24',
    ])
  })
})

describe('5.1 in 6/8, as the workbook’s 6/8 songs name it', () => {
  it('plays the chord, then the chord with the ♭7 under it, over long–short octaves', () => {
    const played = play('p51', bar(E, '6/8'))
    expect(hand(played, 'rh')).toEqual(['0:E4+G4+B4/24', '24:D4+E4+G4+B4/24'])
    expect(hand(played, 'lh')).toEqual(['0:E2+E3/40', '40:E2+E3/8'])
  })
})

describe('the sixths in 6/8 (lesson 7)', () => {
  it('rise a quarter, an 8th and a dotted quarter over 1–5–8–10–8–5', () => {
    const played = play('s6u', bar(A, '6/8'))
    expect(hand(played, 'rh')).toEqual(['0:C4+A4/16', '16:D4+B4/8', '24:E4+C5/24'])
    expect(hand(played, 'lh')).toEqual([
      '0:A1/8',
      '8:E2/8',
      '16:A2/8',
      '24:C3/8',
      '32:A2/8',
      '40:E2/8',
    ])
  })

  it('fall the same way', () => {
    expect(hand(play('s6d', bar(A, '6/8')), 'rh')).toEqual([
      '0:E4+C5/16',
      '16:D4+B4/8',
      '24:C4+A4/24',
    ])
  })
})

describe('the octaves and chords of lesson 2', () => {
  const C = note('C')
  const inFour = (pattern: PatternId) => {
    const chart: Chart = {
      key: { tonic: C, minor: false },
      meter: '4/4',
      sections: [{ lines: [[{ chords: [{ root: C, quality: 'maj', beats: 4 }], beats: 4 }]] }],
    }
    return play(pattern, chart)
  }

  it('Октавы · octaves by the chord, 1–2–3–5 through two octaves in 8ths', () => {
    expect(hand(inFour('oct'), 'rh')).toEqual([
      '0:C4+C5/12',
      '12:D4+D5/12',
      '24:E4+E5/12',
      '36:G4+G5/12',
      '48:C5+C6/12',
      '60:D5+D6/12',
      '72:E5+E6/12',
      '84:G5+G6/12',
    ])
  })

  it('Октавы (гамма) · octaves up the scale in 8ths', () => {
    expect(hand(inFour('octs'), 'rh')).toEqual([
      '0:C4+C5/12',
      '12:D4+D5/12',
      '24:E4+E5/12',
      '36:F4+F5/12',
      '48:G4+G5/12',
      '60:A4+A5/12',
      '72:B4+B5/12',
      '84:C5+C6/12',
    ])
  })

  it('Chords · the chord with its octave, its outer notes stepping up and back', () => {
    const played = inFour('chd')
    expect(hand(played, 'rh')).toEqual([
      '0:C4+E4+G4+C5/24',
      '24:D4+E4+G4+D5/24',
      '48:D4+E4+G4+D5/24',
      '72:C4+E4+G4+C5/24',
    ])
    expect(hand(played, 'lh')).toEqual(['0:C2/12', '12:G2/12', '24:C3/12', '36:E3/12', '48:G3/48'])
  })

  it('plays six octaves to a bar of 6/8', () => {
    expect(hand(play('oct', bar(D, '6/8')), 'rh')).toEqual([
      '0:D4+D5/8',
      '8:E4+E5/8',
      '16:F4+F5/8',
      '24:A4+A5/8',
      '32:D5+D6/8',
      '40:E5+E6/8',
    ])
  })
})

describe('the methods in compound time', () => {
  it('all play in 6/8 and 12/8', () => {
    const compound = { methodCodes: true, tune: false, key: true, simpleTime: false }
    for (const code of METHOD_CODES) {
      const entry = BUILT_IN_PATTERNS.require(METHODS[code].pattern)
      expect(patternNeed(entry, compound), code).toBeNull()
    }
  })
})
