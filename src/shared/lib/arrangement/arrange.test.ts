import { describe, expect, it } from 'vitest'
import {
  CHORD_QUALITIES,
  chordRootSpelling,
  chordSymbol,
  midi,
  note,
  parseChordSymbol,
  parseKey,
  pitchClass,
  type SpelledNote,
} from '@/shared/lib/music'
import { arrange } from './arrange'
import { parseFigure } from './figure'
import type {
  Chart,
  ChartBar,
  EventFigure,
  EventPattern,
  Melody,
  MelodyFigure,
  MelodyPattern,
  NoteHand,
  Performance,
} from './types'

const figure = (text: string, variants: Omit<Partial<EventFigure>, 'kind'> = {}): EventFigure => ({
  kind: 'events',
  events: parseFigure(text),
  ...variants,
})
const pattern = (id: string, rh: string, lh: string): EventPattern => ({
  id,
  rh: figure(rh),
  lh: figure(lh),
})
const BLOCK = pattern('block', '0/16 C', '0/16 L1')
const BEATS = pattern('beats', '0/4 C,4/4 C,8/4 C,12/4 C', '0/16 L1+L8')

/** A bar written `C`, `F@2-G@2` or `C:t1`; chords without @beats share what is left equally. */
function bar(text: string, beatsPerBar: number): ChartBar {
  const parts = text.split('-').map((part) => {
    const [head = '', method] = part.split(':')
    const [symbol = '', beats] = head.split('@')
    return { symbol, method, beats: beats ? Number(beats) : undefined }
  })
  const given = parts.reduce((sum, part) => sum + (part.beats ?? 0), 0)
  const shared = parts.filter((part) => part.beats === undefined).length
  const chords = parts.map((part) => ({
    ...parseChordSymbol(part.symbol),
    beats: part.beats ?? (beatsPerBar - given) / shared,
    ...(part.method ? { method: part.method } : {}),
  }))
  return { chords, beats: chords.reduce((sum, chord) => sum + chord.beats, 0) }
}

function chart(lines: string[][], { key = 'C', beatsPerBar = 4 } = {}): Chart {
  const parsedKey = parseKey(key)
  if (!parsedKey) throw new Error(`test key ${key}`)
  return {
    key: parsedKey,
    beatsPerBar,
    sections: [{ lines: lines.map((line) => line.map((text) => bar(text, beatsPerBar))) }],
  }
}

const C = note('C')
const notesOf = (performance: Performance, hand: NoteHand) =>
  performance.notes.filter((n) => n.hand === hand)
const onsets = (performance: Performance, hand: NoteHand) => [
  ...new Set(notesOf(performance, hand).map((n) => n.startTick)),
]
const midisAt = (performance: Performance, hand: NoteHand, tick: number) =>
  notesOf(performance, hand)
    .filter((n) => n.startTick === tick)
    .map((n) => n.midi)
const pitchClassesAt = (performance: Performance, hand: NoteHand, tick: number) =>
  new Set(midisAt(performance, hand, tick).map((m) => m % 12))

describe('arrange', () => {
  it('plays a whole-note C over its root', () => {
    const performance = arrange(chart([['C']]), { key: C, pattern: BLOCK })
    expect(performance.notes).toEqual([
      { midi: 36, hand: 'lh', startTick: 0, durationTicks: 48, velocity: 0.2, chord: 0 },
      {
        midi: 60,
        hand: 'rh',
        finger: 1,
        startTick: 0,
        durationTicks: 48,
        velocity: 0.12,
        chord: 0,
      },
      {
        midi: 64,
        hand: 'rh',
        finger: 3,
        startTick: 0,
        durationTicks: 48,
        velocity: 0.12,
        chord: 0,
      },
      {
        midi: 67,
        hand: 'rh',
        finger: 5,
        startTick: 0,
        durationTicks: 48,
        velocity: 0.12,
        chord: 0,
      },
    ])
    expect(performance.beatGroups).toEqual([{ tick: 0, bar: 0, chord: 0, notes: [0, 1, 2, 3] }])
    expect(performance.bars).toEqual([{ startTick: 0, beats: 4, section: 0, line: 0, chords: [0] }])
    expect(performance.totalTicks).toBe(48)
    expect(performance.key).toEqual({ tonic: C, mode: 'major' })
  })

  it('puts bars and chords end to end', () => {
    const performance = arrange(chart([['C', 'F@2-G@2', 'Am@2-G@1-F@1']]), {
      key: C,
      pattern: BLOCK,
    })
    expect(performance.chords.map((chord) => chord.startTick)).toEqual([0, 48, 72, 96, 120, 132])
    expect(performance.chords.map((chord) => chord.bar)).toEqual([0, 1, 1, 2, 2, 2])
    expect(performance.bars.map((b) => b.chords)).toEqual([[0], [1, 2], [3, 4, 5]])
    expect(performance.totalTicks).toBe(144)
  })

  it('starts a short chord where it sits in the bar', () => {
    const performance = arrange(chart([['C@2-F@1-G@1']]), { key: C, pattern: BEATS })
    expect(onsets(performance, 'rh')).toEqual([0, 12, 24, 36])
    expect(pitchClassesAt(performance, 'rh', 24)).toEqual(new Set([5, 9, 0]))
    expect(pitchClassesAt(performance, 'rh', 36)).toEqual(new Set([7, 11, 2]))
  })

  it('repeats the pattern through a chord longer than the meter', () => {
    const performance = arrange(chart([['C@8']]), { key: C, pattern: BEATS })
    expect(onsets(performance, 'rh')).toEqual([0, 12, 24, 36, 48, 60, 72, 84])
    expect(performance.totalTicks).toBe(96)
  })

  it('plays the 3/4 variant in three', () => {
    const waltz: EventPattern = {
      id: 'waltz',
      rh: figure('4/4 C,12/4 C', { inThree: parseFigure('4/4 C,8/4 C') }),
      lh: figure('0/4 L1'),
    }
    const performance = arrange(chart([['C']], { beatsPerBar: 3 }), { key: C, pattern: waltz })
    expect(onsets(performance, 'rh')).toEqual([12, 24])
    expect(onsets(performance, 'lh')).toEqual([0])
    expect(performance.bars[0]?.beats).toBe(3)
    expect(performance.totalTicks).toBe(36)
  })

  it('clips a figure to a two-beat meter', () => {
    const performance = arrange(chart([['C']], { beatsPerBar: 2 }), {
      key: C,
      pattern: pattern('halves', '0/8 C,8/8 C', '0/8 L1'),
    })
    expect(onsets(performance, 'rh')).toEqual([0])
    expect(notesOf(performance, 'rh')[0]?.durationTicks).toBe(24)
  })

  it('leads the voices to the nearest chord', () => {
    const performance = arrange(chart([['C', 'F', 'G', 'C']]), { key: C, pattern: BLOCK })
    const hands = [0, 48, 96, 144].map((tick) => midisAt(performance, 'rh', tick))
    expect(hands).toEqual([
      [60, 64, 67],
      [60, 65, 69],
      [59, 62, 67],
      [60, 64, 67],
    ])
    hands.slice(1).forEach((voices, i) => {
      voices.forEach((m, v) => expect(Math.abs(m - (hands[i]?.[v] ?? 0))).toBeLessThanOrEqual(3))
    })
  })

  it('keeps the right hand in range for every quality on every root', () => {
    const symbols = CHORD_QUALITIES.flatMap((quality) =>
      Array.from({ length: 12 }, (_, pc) =>
        chordSymbol({ root: chordRootSpelling(pitchClass(pc), quality), quality }),
      ),
    )
    const performance = arrange(chart([symbols]), { key: C, pattern: BLOCK })
    for (const n of notesOf(performance, 'rh')) {
      expect(n.midi).toBeGreaterThanOrEqual(52)
      expect(n.midi).toBeLessThanOrEqual(79)
    }
  })

  it('fingers what the figure does not', () => {
    const block = arrange(chart([['C']]), { key: C, pattern: BEATS })
    expect(
      notesOf(block, 'rh')
        .slice(0, 3)
        .map((n) => n.finger),
    ).toEqual([1, 3, 5])
    expect(notesOf(block, 'lh').map((n) => n.finger)).toEqual([5, 1])
    const written = arrange(chart([['C']]), {
      key: C,
      pattern: pattern('written', '0/2 1^1,2/2 3^2', '0/16 L1'),
    })
    expect(notesOf(written, 'rh').map((n) => n.finger)).toEqual([1, 2])
  })

  it('reads every figure token against the chord being played', () => {
    const tokens = pattern(
      'tokens',
      '0/2 v1,2/2 v4,4/2 s2+s7,6/2 _7+_b7+_6,8/2 3+5+8+10,10/2 T1,12/2 T8,14/2 U',
      '0/4 L1+L3+L5+L10',
    )
    const major = arrange(chart([['C']]), { key: C, pattern: tokens })
    expect([0, 6, 12, 18, 24, 30, 36, 42].map((tick) => midisAt(major, 'rh', tick))).toEqual([
      [60],
      [72],
      [64, 72],
      [57, 58, 59],
      [64, 67, 72, 76],
      [64, 67, 72],
      [72, 76, 79],
      [64, 67],
    ])
    expect(midisAt(major, 'lh', 0)).toEqual([36, 40, 43, 52])
    const minor = arrange(chart([['Am']]), { key: C, pattern: tokens })
    expect(midisAt(minor, 'rh', 12)).toEqual([60, 69])
    const seventh = arrange(chart([['G7']]), {
      key: C,
      pattern: pattern('seventh', '0/16 7', '0/16 L7'),
    })
    expect(midisAt(seventh, 'rh', 0)).toEqual([65])
    expect(midisAt(seventh, 'lh', 0)).toEqual([41])
  })

  it.each([
    ['U', [3, 5]],
    ['1+5', [2, 5]],
    ['1+8', [1, 5]],
  ])('fingers two right-hand notes by their span: %s', (tones, fingers) => {
    const performance = arrange(chart([['C']]), {
      key: C,
      pattern: pattern('pair', `0/16 ${tones}`, '0/16 L1'),
    })
    expect(notesOf(performance, 'rh').map((n) => n.finger)).toEqual(fingers)
  })

  it('plays the major variant on major chords only', () => {
    const variant: EventPattern = {
      id: 'variant',
      rh: figure('0/16 C', { onMajor: parseFigure('0/16 T') }),
      lh: figure('0/16 L1'),
    }
    const major = arrange(chart([['G']]), { key: C, pattern: variant })
    expect(midisAt(major, 'rh', 0)).toEqual([55, 59, 62])
    const minor = arrange(chart([['Am']]), { key: C, pattern: variant })
    expect(midisAt(minor, 'rh', 0)).toEqual([60, 64, 69])
  })

  it('rolls a chord one tick per note', () => {
    const performance = arrange(chart([['C']]), {
      key: C,
      pattern: pattern('rolled', '0/16 T2~', '0/16 L1'),
    })
    expect(notesOf(performance, 'rh').map((n) => [n.startTick, n.durationTicks])).toEqual([
      [0, 48],
      [1, 47],
      [2, 46],
    ])
  })

  it('plays each chord with its method code’s pattern', () => {
    const performance = arrange(chart([['C:t1', 'F']]), {
      key: C,
      pattern: BLOCK,
      methods: { t1: BEATS },
    })
    expect(onsets(performance, 'rh')).toEqual([0, 12, 24, 36, 48])
    expect(performance.chords.map((chord) => [chord.method, chord.pattern])).toEqual([
      ['t1', 'beats'],
      [undefined, 'block'],
    ])
  })

  it('lets a hand override replace every chord’s figure', () => {
    const performance = arrange(chart([['C:t1', 'F']]), {
      key: C,
      pattern: BLOCK,
      methods: { t1: BEATS },
      rh: figure('0/8 C'),
      lh: figure('0/4 L1,4/4 L5'),
    })
    expect(onsets(performance, 'rh')).toEqual([0, 48])
    expect(onsets(performance, 'lh')).toEqual([0, 12, 48, 60])
  })

  const DOUBLE: MelodyFigure = { kind: 'melody', use: 'double', withoutMelody: figure('0/16 C') }
  const plain = pattern('plain', '0/4 C,4/4 C,8/4 C,12/4 C', '0/16 L1')
  const TUNE_PATTERN: MelodyPattern = {
    id: 'tune',
    rh: DOUBLE,
    lh: figure('0/16 L1+L8'),
    withoutMelody: plain,
  }

  it('falls back to the plain pattern, both hands, without a melody', () => {
    const performance = arrange(chart([['C']]), { key: C, pattern: TUNE_PATTERN })
    expect(onsets(performance, 'rh')).toEqual([0, 12, 24, 36])
    expect(midisAt(performance, 'lh', 0)).toEqual([36])
    expect(performance.chords[0]?.pattern).toBe('plain')
  })

  it('plays a chosen melody figure’s fallback without a melody', () => {
    const performance = arrange(chart([['C']]), { key: C, pattern: BEATS, rh: DOUBLE })
    expect(onsets(performance, 'rh')).toEqual([0])
    expect(midisAt(performance, 'rh', 0)).toEqual([60, 64, 67])
    expect(midisAt(performance, 'lh', 0)).toEqual([36, 48])
  })

  const tune = (...notes: [number, number, number][]): Melody =>
    notes.map(([m, startTick, durationTicks]) => ({ midi: midi(m), startTick, durationTicks }))

  it('doubles the tune an octave up', () => {
    const melody = tune([64, 0, 24], [62, 24, 24])
    const doubled = arrange(chart([['C']]), { key: C, pattern: BLOCK, melody, doubleMelody: true })
    expect(notesOf(doubled, 'melody')).toEqual([
      { midi: 76, hand: 'melody', startTick: 0, durationTicks: 24, velocity: 0.15, chord: 0 },
      { midi: 74, hand: 'melody', startTick: 24, durationTicks: 24, velocity: 0.15, chord: 0 },
    ])
    const alreadyPlayed = arrange(chart([['C']]), {
      key: C,
      pattern: BLOCK,
      rh: DOUBLE,
      melody,
      doubleMelody: true,
    })
    expect(notesOf(alreadyPlayed, 'melody')).toEqual([])
    expect(midisAt(alreadyPlayed, 'rh', 0)).toEqual([64])
    expect(notesOf(alreadyPlayed, 'rh')[0]?.velocity).toBe(0.19)
  })

  it('harmonises long tune notes with chord tones below', () => {
    const harmony: MelodyFigure = {
      kind: 'melody',
      use: 'harmony',
      withoutMelody: figure('0/16 C'),
    }
    const long = arrange(chart([['C']]), {
      key: C,
      pattern: BLOCK,
      rh: harmony,
      melody: tune([64, 0, 48]),
    })
    expect(midisAt(long, 'rh', 0)).toEqual([55, 60, 64])
    expect(notesOf(long, 'rh').map((n) => n.velocity)).toEqual([0.11, 0.11, 0.19])
    const short = arrange(chart([['C']]), {
      key: C,
      pattern: BLOCK,
      rh: harmony,
      melody: tune([64, 0, 6]),
    })
    expect(midisAt(short, 'rh', 0)).toEqual([64])
  })

  it('plays the tune only at the ends of a line', () => {
    const ends: MelodyFigure = {
      kind: 'melody',
      use: 'ends',
      between: figure('0/8 C'),
      withoutMelody: figure('0/16 C'),
    }
    const performance = arrange(chart([['C', 'F', 'G']]), {
      key: C,
      pattern: BLOCK,
      rh: ends,
      melody: tune([67, 0, 48], [71, 48, 48], [72, 96, 48]),
    })
    expect(midisAt(performance, 'rh', 0)).toEqual([67])
    expect(pitchClassesAt(performance, 'rh', 48)).toEqual(new Set([5, 9, 0]))
    expect(midisAt(performance, 'rh', 96)).toEqual([72])
  })

  it.each([
    ['D/F#', 'G', note('A', -1), 'E♭/G'],
    ['D#/G', 'G#m', note('A', 1), 'E#/G𝄪'],
    ['A#dim7', 'C', note('C', 1), 'B°7'],
  ])('transposes %s in %s to %j as %s', (symbol, key, to, expected) => {
    const performance = arrange(chart([[symbol]], { key }), { key: to, pattern: BLOCK })
    expect(performance.chords[0]?.symbol).toBe(expected)
    expect(performance.key.tonic).toEqual(to)
    expect(performance.key.mode).toBe(key.endsWith('m') ? 'minor' : 'major')
  })

  it.each([
    [note('G'), 55],
    [note('D'), 62],
  ])('moves the tune the short way to %j', (to: SpelledNote, expected) => {
    const performance = arrange(chart([['C']]), {
      key: to,
      pattern: BLOCK,
      melody: tune([60, 0, 48]),
      doubleMelody: true,
    })
    expect(notesOf(performance, 'melody')[0]?.midi).toBe(expected + 12)
  })

  it('groups notes by onset, with the bar and the chord sounding', () => {
    const performance = arrange(chart([['C@2-G@2']]), { key: C, pattern: BEATS })
    expect(performance.beatGroups.map(({ tick, bar, chord }) => ({ tick, bar, chord }))).toEqual([
      { tick: 0, bar: 0, chord: 0 },
      { tick: 12, bar: 0, chord: 0 },
      { tick: 24, bar: 0, chord: 1 },
      { tick: 36, bar: 0, chord: 1 },
    ])
    for (const group of performance.beatGroups) {
      for (const i of group.notes) expect(performance.notes[i]?.startTick).toBe(group.tick)
    }
  })

  it.each([
    [
      'C',
      [
        [0, 4, 7],
        [5, 9, 0],
        [7, 11, 2],
      ],
    ],
    [
      'Am',
      [
        [9, 0, 4],
        [2, 5, 9],
        [4, 8, 11],
      ],
    ],
  ])('voices the key triads of %s', (key, triads) => {
    const tonic = parseKey(key)?.tonic ?? C
    const performance = arrange(chart([[key]], { key }), {
      key: tonic,
      pattern: pattern('flow', '0/4 Ka,4/4 Kb,8/4 Kc', '0/16 L1'),
    })
    expect([0, 12, 24].map((tick) => pitchClassesAt(performance, 'rh', tick))).toEqual(
      triads.map((triad) => new Set(triad)),
    )
  })
})
