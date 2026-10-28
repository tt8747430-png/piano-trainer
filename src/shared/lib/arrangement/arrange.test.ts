import { describe, expect, it } from 'vitest'
import {
  beatsPerBar,
  CHORD_QUALITIES,
  chordRootSpelling,
  chordSymbol,
  midi,
  note,
  noteName,
  noteParam,
  parseChordSymbol,
  parseKey,
  pitchClass,
  plainSpelling,
  qualityIntervals,
  TICKS_PER_BEAT,
  type Meter,
  type SpelledNote,
} from '@/shared/lib/music'
import { arrange, transposeChord } from './arrange'
import { parseFigure } from './figure'
import type {
  Chart,
  ChartBar,
  EventFigure,
  EventPattern,
  HandNote,
  TuneFigure,
  TunePattern,
  NoteHand,
  Performance,
  StaffMusic,
  StaffNote,
  WrittenHands,
} from './types'

const B = TICKS_PER_BEAT

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

/**
 * A bar written `C`, `F@2-G@2` or `C:t1`; chords without @beats share what is left equally. `_` is a
 * bar of no chord (ADR 0114).
 */
function bar(text: string, barBeats: number): ChartBar {
  if (text === '_') return { chords: [], beats: barBeats }
  const parts = text.split('-').map((part) => {
    const [head = '', method] = part.split(':')
    const [symbol = '', beats] = head.split('@')
    return { symbol, method, beats: beats ? Number(beats) : undefined }
  })
  const given = parts.reduce((sum, part) => sum + (part.beats ?? 0), 0)
  const shared = parts.filter((part) => part.beats === undefined).length
  const chords = parts.map((part) => ({
    ...parseChordSymbol(part.symbol),
    beats: part.beats ?? (barBeats - given) / shared,
    ...(part.method ? { method: part.method } : {}),
  }))
  return { chords, beats: chords.reduce((sum, chord) => sum + chord.beats, 0) }
}

function chart(
  lines: string[][],
  { key = 'C', meter = '4/4' }: { key?: string; meter?: Meter } = {},
): Chart {
  const parsedKey = parseKey(key)
  if (!parsedKey) throw new Error(`test key ${key}`)
  return {
    key: parsedKey,
    meter,
    sections: [{ lines: lines.map((line) => line.map((text) => bar(text, beatsPerBar(meter)))) }],
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
    const performance = arrange(chart([['C']]), { tonic: C, pattern: BLOCK })
    expect(performance.notes).toEqual([
      {
        midi: 36,
        spelled: C,
        hand: 'lh',
        startTick: 0,
        durationTicks: 4 * B,
        velocity: 0.2,
        chord: 0,
      },
      {
        midi: 60,
        spelled: C,
        hand: 'rh',
        finger: 1,
        startTick: 0,
        durationTicks: 4 * B,
        velocity: 0.12,
        chord: 0,
      },
      {
        midi: 64,
        spelled: note('E'),
        hand: 'rh',
        finger: 3,
        startTick: 0,
        durationTicks: 4 * B,
        velocity: 0.12,
        chord: 0,
      },
      {
        midi: 67,
        spelled: note('G'),
        hand: 'rh',
        finger: 5,
        startTick: 0,
        durationTicks: 4 * B,
        velocity: 0.12,
        chord: 0,
      },
    ])
    expect(performance.beatGroups).toEqual([{ tick: 0, bar: 0, chord: 0, notes: [0, 1, 2, 3] }])
    expect(performance.bars).toEqual([{ startTick: 0, beats: 4, section: 0, line: 0, chords: [0] }])
    expect(performance.totalTicks).toBe(4 * B)
    expect(performance.key).toEqual({ tonic: C, minor: false })
  })

  it('keeps the left hand’s figure under the right hand, an octave lower where it climbs over', () => {
    const performance = arrange(chart([['C']]), {
      tonic: C,
      pattern: pattern('climb', '0/16 C', '0/16 L1+L17'),
    })
    expect(midisAt(performance, 'rh', 0)).toEqual([60, 64, 67])
    expect(midisAt(performance, 'lh', 0)).toEqual([36, 52])
  })

  it('plays the 7th the key gives a chord written without one', () => {
    const SEVENTH = pattern('seventh', '0/16 7', '0/16 L1')
    const sevenths = (symbols: string) =>
      arrange(chart([symbols.split(' ')]), { tonic: C, pattern: SEVENTH })
        .notes.filter((n) => n.hand === 'rh')
        .map((n) => noteName(n.spelled))
    expect(sevenths('C C6 F G Am Dm Bdim')).toEqual(['B', 'B', 'E', 'F', 'G', 'C', 'A'])
    expect(sevenths('Cmaj7 C7')).toEqual(['B', 'B♭'])
  })

  it('plays a section written in its own key in it, moved as the chart is', () => {
    const base = chart([['C']])
    const changing: Chart = {
      ...base,
      sections: [
        ...base.sections,
        { key: { tonic: note('D', -1), minor: false }, lines: [[bar('Db', 4)]] },
      ],
    }
    const inC = arrange(changing, { tonic: C, pattern: BLOCK })
    expect(inC.bars.map((b) => b.key && noteName(b.key.tonic))).toEqual([undefined, 'D♭'])
    const inD = arrange(changing, { tonic: note('D'), pattern: BLOCK })
    expect(inD.bars.map((b) => b.key && noteName(b.key.tonic))).toEqual([undefined, 'E♭'])
  })

  it('carries 4/4 printed as common time to the score (ADR 0114)', () => {
    const common = { ...chart([['C']]), timeSymbol: true } as const
    expect(arrange(common, { tonic: C, pattern: BLOCK }).timeSymbol).toBe(true)
    expect(arrange(chart([['C']]), { tonic: C, pattern: BLOCK })).not.toHaveProperty('timeSymbol')
  })

  it('puts bars and chords end to end', () => {
    const performance = arrange(chart([['C', 'F@2-G@2', 'Am@2-G@1-F@1']]), {
      tonic: C,
      pattern: BLOCK,
    })
    expect(performance.chords.map((chord) => chord.startTick)).toEqual([
      0,
      4 * B,
      6 * B,
      8 * B,
      10 * B,
      11 * B,
    ])
    expect(performance.chords.map((chord) => chord.bar)).toEqual([0, 1, 1, 2, 2, 2])
    expect(performance.bars.map((b) => b.chords)).toEqual([[0], [1, 2], [3, 4, 5]])
    expect(performance.totalTicks).toBe(12 * B)
  })

  it('lays a bar of no chord end to end with the others, the pattern playing nothing there (ADR 0114)', () => {
    const performance = arrange(chart([['C', '_', 'G']]), { tonic: C, pattern: BEATS })
    expect(performance.bars.map((b) => [b.startTick, b.chords])).toEqual([
      [0, [0]],
      [4 * B, []],
      [8 * B, [1]],
    ])
    expect(performance.chords.map((chord) => [chord.symbol, chord.startTick])).toEqual([
      ['C', 0],
      ['G', 8 * B],
    ])
    expect(onsets(performance, 'rh')).toEqual([0, B, 2 * B, 3 * B, 8 * B, 9 * B, 10 * B, 11 * B])
    expect(onsets(performance, 'lh')).toEqual([0, 8 * B])
    expect(performance.totalTicks).toBe(12 * B)
  })

  it('starts a short chord where it sits in the bar', () => {
    const performance = arrange(chart([['C@2-F@1-G@1']]), { tonic: C, pattern: BEATS })
    expect(onsets(performance, 'rh')).toEqual([0, B, 2 * B, 3 * B])
    expect(pitchClassesAt(performance, 'rh', 2 * B)).toEqual(new Set([5, 9, 0]))
    expect(pitchClassesAt(performance, 'rh', 3 * B)).toEqual(new Set([7, 11, 2]))
  })

  it('repeats the pattern through a chord longer than the meter', () => {
    const performance = arrange(chart([['C@8']]), { tonic: C, pattern: BEATS })
    expect(onsets(performance, 'rh')).toEqual([0, B, 2 * B, 3 * B, 4 * B, 5 * B, 6 * B, 7 * B])
    expect(performance.totalTicks).toBe(8 * B)
  })

  it('plays the 3/4 variant in three', () => {
    const waltz: EventPattern = {
      id: 'waltz',
      rh: figure('4/4 C,12/4 C', { inThree: parseFigure('4/4 C,8/4 C') }),
      lh: figure('0/4 L1'),
    }
    const performance = arrange(chart([['C']], { meter: '3/4' }), { tonic: C, pattern: waltz })
    expect(onsets(performance, 'rh')).toEqual([B, 2 * B])
    expect(onsets(performance, 'lh')).toEqual([0])
    expect(performance.bars[0]?.beats).toBe(3)
    expect(performance.totalTicks).toBe(3 * B)
  })

  it('plays a section in a meter of its own as its meter plays it: its 3/4 variant in three (ADR 0097)', () => {
    const waltz: EventPattern = {
      id: 'waltz',
      rh: figure('4/4 C,12/4 C', { inThree: parseFigure('4/4 C,8/4 C') }),
      lh: figure('0/4 L1'),
    }
    const base = chart([['C']])
    const changing: Chart = {
      ...base,
      sections: [...base.sections, { meter: '3/4', lines: [[bar('F', 3), bar('G', 3)]] }],
    }
    const performance = arrange(changing, { tonic: C, pattern: waltz })
    expect(performance.bars.map((b) => [b.startTick, b.beats, b.meter])).toEqual([
      [0, 4, undefined],
      [4 * B, 3, '3/4'],
      [7 * B, 3, '3/4'],
    ])
    // The 4/4 bar's figure, then each 3/4 bar's own: beats 2 and 3 of each.
    expect(onsets(performance, 'rh')).toEqual([B, 3 * B, 5 * B, 6 * B, 8 * B, 9 * B])
    expect(performance.totalTicks).toBe(10 * B)
  })

  it('counts a first section in a meter of its own from its own whole bar, no pickup (ADR 0097)', () => {
    const waltz = chart([['C', 'G']])
    const three: Chart = {
      ...waltz,
      sections: [{ meter: '3/4', lines: [[bar('C', 3), bar('G', 3)]] }],
    }
    const performance = arrange(three, { tonic: C, pattern: BLOCK })
    // Each bar's chord on its downbeat: as a pickup, the first bar would leave its downbeat out.
    expect(onsets(performance, 'rh')).toEqual([0, 3 * B])
  })

  it('plays a figure’s compound version in 12/8, and its first half in 6/8', () => {
    const rocking: EventPattern = {
      id: 'rocking',
      rh: figure('0/2 C,2/2 C', {
        inCompound: parseFigure('0/4 C,4/2 C,12/4 C,16/2 C', { perBeat: 6 }),
      }),
      lh: figure('0/16 L1'),
    }
    const inMeter = (meter: '4/4' | '6/8' | '12/8') =>
      onsets(arrange(chart([['Am']], { meter }), { tonic: C, pattern: rocking }), 'rh')
    expect(inMeter('12/8')).toEqual([0, (2 * B) / 3, 2 * B, (8 * B) / 3])
    expect(inMeter('6/8')).toEqual([0, (2 * B) / 3])
    expect(inMeter('4/4')).toEqual([0, 0.5 * B])
  })

  it('plays a major chord’s compound version in compound time, where it has one', () => {
    const lighter: EventPattern = {
      id: 'lighter',
      rh: figure('0/4 C', {
        inCompound: parseFigure('0/6 C,6/6 C,12/6 C,18/6 C', { perBeat: 6 }),
        inCompoundOnMajor: parseFigure('0/12 C,12/12 C', { perBeat: 6 }),
      }),
      lh: figure('0/16 L1'),
    }
    const performance = arrange(chart([['Am', 'C']], { meter: '12/8' }), {
      tonic: C,
      pattern: lighter,
    })
    expect(onsets(performance, 'rh')).toEqual([0, B, 2 * B, 3 * B, 4 * B, 6 * B])
  })

  it('plays a figure’s 6/8 version in a 6/8 bar, where its 12/8 bar is no two bars of 6/8', () => {
    const steps: EventPattern = {
      id: 'steps',
      rh: figure('0/4 C,4/4 C,8/4 C,12/4 C', {
        inSix: parseFigure('0/4 C,4/2 C', { perBeat: 6 }),
      }),
      lh: figure('0/16 L1'),
    }
    const inMeter = (meter: '6/8' | '12/8') =>
      onsets(arrange(chart([['Am']], { meter }), { tonic: C, pattern: steps }), 'rh')
    expect(inMeter('6/8')).toEqual([0, (2 * B) / 3])
    expect(inMeter('12/8')).toEqual([0, B, 2 * B, 3 * B])
  })

  describe('the meters of ADR 0114', () => {
    it('plays a figure in 2/2 as in 4/4: a bar of four quarters', () => {
      const performance = arrange(chart([['C', 'G']], { meter: '2/2' }), {
        tonic: C,
        pattern: BEATS,
      })
      expect(onsets(performance, 'rh')).toEqual([0, B, 2 * B, 3 * B, 4 * B, 5 * B, 6 * B, 7 * B])
      expect(performance.bars.map((b) => b.beats)).toEqual([4, 4])
      expect(performance.meter).toBe('2/2')
    })

    it('plays a figure once in each group of 5/4: three beats, then two', () => {
      const performance = arrange(chart([['C']], { meter: '5/4' }), { tonic: C, pattern: BEATS })
      expect(onsets(performance, 'rh')).toEqual([0, B, 2 * B, 3 * B, 4 * B])
      expect(onsets(performance, 'lh')).toEqual([0, 3 * B])
      expect(performance.totalTicks).toBe(5 * B)
    })

    it('plays the 3/4 variant in each three of 6/4', () => {
      const waltz: EventPattern = {
        id: 'waltz',
        rh: figure('4/4 C,12/4 C', { inThree: parseFigure('4/4 C,8/4 C') }),
        lh: figure('0/4 L1'),
      }
      const performance = arrange(chart([['C']], { meter: '6/4' }), { tonic: C, pattern: waltz })
      expect(onsets(performance, 'rh')).toEqual([B, 2 * B, 4 * B, 5 * B])
      expect(onsets(performance, 'lh')).toEqual([0, 3 * B])
    })

    it('plays a figure’s compound version in 9/8, clipped to its three beats', () => {
      const performance = arrange(chart([['C']], { meter: '9/8' }), {
        tonic: C,
        pattern: pattern('beats', '0/4 C,4/4 C,8/4 C,12/4 C', '0/16 L1'),
      })
      expect(onsets(performance, 'rh')).toEqual([0, B, 2 * B])
      expect(performance.totalTicks).toBe(3 * B)
    })
  })

  it('clips a figure to a two-beat meter', () => {
    const performance = arrange(chart([['C']], { meter: '2/4' }), {
      tonic: C,
      pattern: pattern('halves', '0/8 C,8/8 C', '0/8 L1'),
    })
    expect(onsets(performance, 'rh')).toEqual([0])
    expect(notesOf(performance, 'rh')[0]?.durationTicks).toBe(2 * B)
  })

  it('leads the voices to the nearest chord', () => {
    const performance = arrange(chart([['C', 'F', 'G', 'C']]), { tonic: C, pattern: BLOCK })
    const hands = [0, 4 * B, 8 * B, 12 * B].map((tick) => midisAt(performance, 'rh', tick))
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

  describe('in an inversion', () => {
    const rhAt = (symbols: string[], inversion: 0 | 1 | 2 | 3, tick = 0) =>
      midisAt(
        arrange(chart([symbols]), { tonic: C, pattern: BLOCK, inversion }),
        'rh',
        tick,
      ).toSorted((a, b) => a - b)

    it('stacks a chord from its note, the lowest from E3 to E4', () => {
      expect(rhAt(['C'], 0)).toEqual([60, 64, 67]) // C4 E4 G4
      expect(rhAt(['C'], 1)).toEqual([64, 67, 72]) // E4 G4 C5
      expect(rhAt(['C'], 2)).toEqual([55, 60, 64]) // G3 C4 E4
    })

    it('gives a triad asked for its 3rd inversion its 2nd', () => {
      expect(rhAt(['C'], 3)).toEqual([55, 60, 64])
    })

    it('plays a bigger chord rootless, its 9th where the root was', () => {
      expect(rhAt(['Dm9'], 0)).toEqual([64, 65, 69, 72]) // E F A C
      expect(rhAt(['Dm9'], 1)).toEqual([53, 57, 60, 64]) // F A C E: 3-5-7-9
      expect(rhAt(['Dm9'], 3)).toEqual([60, 64, 65, 69]) // C E F A: 7-9-3-5
      expect(rhAt(['G13'], 0)).toEqual([57, 59, 64, 65]) // A B E F: root and 5th out
    })

    it('takes the octave nearer the last chord when there are two', () => {
      expect(rhAt(['G', 'Em'], 0, 4 * B)).toEqual([52, 55, 59]) // after G3 B3 D4: E3, not E4
      expect(rhAt(['C', 'Em'], 1, 4 * B)).toEqual([55, 59, 64]) // after E4 G4 C5: G3 (no G4 under E4)
    })
  })

  it('keeps every chord in the inversion asked for: its lowest note the 3rd', () => {
    const performance = arrange(chart([['Dm7', 'G7', 'Cmaj7']]), {
      tonic: C,
      pattern: BLOCK,
      inversion: 1,
    })
    const lowest = [0, 4 * B, 8 * B].map(
      (tick) => Math.min(...midisAt(performance, 'rh', tick)) % 12,
    )
    expect(lowest).toEqual([5, 11, 4]) // F, B, E
    expect(midisAt(performance, 'rh', 0)).toHaveLength(4) // the root kept: D F A C from F
  })

  it('plays a shell: the 7th over the bass, or the 5th where the chord has none', () => {
    const SHELL = pattern('shell', '0/16 C', '0/16 L1+Sh')
    const lh = (symbol: string) =>
      notesOf(arrange(chart([[symbol]]), { tonic: C, pattern: SHELL }), 'lh').map((n) => n.midi)
    expect(lh('Dm7')).toEqual([38, 48]) // D2 C3
    expect(lh('CMaj7')).toEqual([36, 47]) // C2 B2
    expect(lh('F')).toEqual([41, 48]) // F2 C3
  })

  describe('a walking bass', () => {
    const WALK = pattern('walk', '0/16 C', '0/4 L1,4/4 L3,8/4 L5,12/4 A')
    const lhOf = (symbols: string[][]) =>
      notesOf(arrange(chart(symbols), { tonic: C, pattern: WALK }), 'lh').map((n) => n.midi)

    it('steps a semitone under the next chord’s bass on the last beat', () => {
      const lh = lhOf([['C'], ['F'], ['G']])
      expect(lh.slice(0, 4)).toEqual([36, 40, 43, 40]) // C2 E2 G2, E2 into F
      expect(lh.slice(4, 8)).toEqual([41, 45, 48, 42]) // F2 A2 C3, F♯2 into G
      expect(lh.slice(8)).toEqual([31, 35, 38, 30]) // G1 B1 D2, F♯1 back to G
    })

    it('leads a chord over two bars back to its own bass first, then to the next', () => {
      expect(lhOf([['C'], ['C'], ['F']]).filter((_, i) => i % 4 === 3)).toEqual([35, 40, 40])
    })
  })

  describe('from an inversion, nearest after', () => {
    const performance = (inversion: 0 | 1 | 2) =>
      arrange(chart([['C', 'F', 'G', 'C']]), { tonic: C, pattern: BLOCK, inversion, nearest: true })
    const rh = (inversion: 0 | 1 | 2, tick: number) =>
      midisAt(performance(inversion), 'rh', tick).toSorted((a, b) => a - b)

    it('starts on the inversion asked for', () => {
      expect(rh(0, 0)).toEqual([60, 64, 67]) // C4 E4 G4
      expect(rh(1, 0)).toEqual([64, 67, 72]) // E4 G4 C5
      expect(rh(2, 0)).toEqual([55, 60, 64]) // G3 C4 E4
    })

    it('moves each chord after it to the nearest voicing, common tones held', () => {
      expect(rh(0, 4 * B)).toEqual([60, 65, 69]) // C F A: C held
      expect(rh(0, 8 * B)).toEqual([59, 62, 67]) // B D G
      expect(rh(2, 4 * B)).toEqual([57, 60, 65]) // A C F, from G C E
    })

    it('keeps a 7th chord whole, as the inversions do', () => {
      const sevenths = arrange(chart([['Dm7', 'G7', 'Cmaj7']]), {
        tonic: C,
        pattern: BLOCK,
        inversion: 1,
        nearest: true,
      })
      for (const tick of [0, 4 * B, 8 * B]) expect(midisAt(sevenths, 'rh', tick)).toHaveLength(4)
      expect(Math.min(...midisAt(sevenths, 'rh', 0)) % 12).toBe(5) // F: the 1st inversion
    })
  })

  it('keeps the right hand in range for every quality on every root', () => {
    const symbols = CHORD_QUALITIES.flatMap((quality) =>
      Array.from({ length: 12 }, (_, pc) =>
        chordSymbol({
          root: chordRootSpelling(pitchClass(pc), qualityIntervals(quality)),
          quality,
        }),
      ),
    )
    const performance = arrange(chart([symbols]), { tonic: C, pattern: BLOCK })
    for (const n of notesOf(performance, 'rh')) {
      expect(n.midi).toBeGreaterThanOrEqual(52)
      expect(n.midi).toBeLessThanOrEqual(79)
    }
  })

  it('fingers what the figure does not', () => {
    const block = arrange(chart([['C']]), { tonic: C, pattern: BEATS })
    expect(
      notesOf(block, 'rh')
        .slice(0, 3)
        .map((n) => n.finger),
    ).toEqual([1, 3, 5])
    expect(notesOf(block, 'lh').map((n) => n.finger)).toEqual([5, 1])
    const written = arrange(chart([['C']]), {
      tonic: C,
      pattern: pattern('written', '0/2 1^1,2/2 3^2', '0/16 L1'),
    })
    expect(notesOf(written, 'rh').map((n) => n.finger)).toEqual([1, 2])
  })

  it('reads every figure token against the chord being played', () => {
    const tokens = pattern(
      'tokens',
      '0/2 v1,2/2 v4,4/2 s2+s7,6/2 _7+_b7+_6,8/2 3+5+8+10,10/2 T1,12/2 T8,14/2 U,15/1 T15',
      '0/4 L1+L3+L5+L10',
    )
    const major = arrange(chart([['C']]), { tonic: C, pattern: tokens })
    expect(
      [0, 0.5 * B, B, 1.5 * B, 2 * B, 2.5 * B, 3 * B, 3.5 * B, 3.75 * B].map((tick) =>
        midisAt(major, 'rh', tick),
      ),
    ).toEqual([
      [60],
      [72],
      [64, 72],
      [57, 58, 59],
      [64, 67, 72, 76],
      [64, 67, 72],
      [72, 76, 79],
      [64, 67],
      [84, 88, 91],
    ])
    expect(midisAt(major, 'lh', 0)).toEqual([36, 40, 43, 52])
    const minor = arrange(chart([['Am']]), { tonic: C, pattern: tokens })
    expect(midisAt(minor, 'rh', B)).toEqual([60, 69])
    const led = arrange(chart([['C', 'G']]), {
      tonic: C,
      pattern: pattern('upper', '0/16 U', '0/16 L1'),
    })
    expect(midisAt(led, 'rh', 4 * B)).toEqual([62, 67]) // G led to B3 D4 G4: all but its lowest
    const seventh = arrange(chart([['G7']]), {
      tonic: C,
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
      tonic: C,
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
    const major = arrange(chart([['G']]), { tonic: C, pattern: variant })
    expect(midisAt(major, 'rh', 0)).toEqual([55, 59, 62])
    const minor = arrange(chart([['Am']]), { tonic: C, pattern: variant })
    expect(midisAt(minor, 'rh', 0)).toEqual([60, 64, 69])
  })

  it('spells chord tones as the chord, and other notes by letter steps from the root or bass', () => {
    const performance = arrange(chart([['G7']], { key: 'G' }), {
      tonic: note('G'),
      pattern: pattern('steps', '0/4 _7,4/4 _b7,8/4 _6,12/4 s1', '0/8 L3,8/8 L1'),
    })
    expect(notesOf(performance, 'rh').map((n) => n.spelled)).toEqual([
      note('F', 1),
      note('F'),
      note('E'),
      note('A'),
    ])
    expect(notesOf(performance, 'lh').map((n) => n.spelled)).toEqual([note('B'), note('G')])
  })

  it.each([
    ['Dm/F', note('F'), [note('F'), note('A'), note('D'), note('F')]],
    ['Cm/Eb', note('E', -1), [note('E', -1), note('G'), note('C'), note('E', -1)]],
    ['Fm/D', note('F'), [note('D'), note('F'), note('A', -1), note('D')]],
  ] as const)(
    'plays %s’s left hand in its own tones, stacked up from the bass',
    (symbol, tonic, expected) => {
      const performance = arrange(chart([[symbol]], { key: noteParam(tonic) }), {
        tonic,
        pattern: pattern('arp', '0/16 C', '0/4 L1,4/4 L3,8/4 L5,12/4 L8'),
      })
      expect(notesOf(performance, 'lh').map((n) => n.spelled)).toEqual(expected)
      const lh = notesOf(performance, 'lh').map((n) => n.midi)
      expect(lh).toEqual([...lh].sort((a, b) => a - b))
    },
  )

  it('plays a pickup as the end of a bar: the pattern’s last beat, not its first', () => {
    const performance = arrange(chart([['C@1', 'F']]), { tonic: C, pattern: BEATS })
    expect(performance.bars[0]?.beats).toBe(1)
    const inPickup = performance.notes.filter((n) => n.startTick < 24)
    expect(new Set(inPickup.map((n) => n.hand))).toEqual(new Set(['rh']))
  })

  it('spells the key’s triads from the key', () => {
    const performance = arrange(chart([['C']], { key: 'Ab' }), {
      tonic: note('A', -1),
      pattern: pattern('flow', '0/16 Kb', '0/16 L1'),
    })
    expect(new Set(notesOf(performance, 'rh').map((n) => n.spelled))).toEqual(
      new Set([note('D', -1), note('F'), note('A', -1)]),
    )
  })

  it('keeps a staff’s spelling, moved by the interval between the keys', () => {
    const sharp: StaffMusic = {
      clef: 'treble',
      notes: [{ midi: midi(73), spelled: note('C', 1), startTick: 0, durationTicks: 4 * B }],
    }
    const performance = arrange(chart([['A']], { key: 'D' }), {
      tonic: note('E', -1),
      pattern: BLOCK,
      staves: [sharp],
    })
    expect(notesOf(performance, 'staff')[0]).toMatchObject({ midi: 74, spelled: note('D') })
  })

  it('plays each chord with its method code’s pattern', () => {
    const performance = arrange(chart([['C:t1', 'F']]), {
      tonic: C,
      pattern: BLOCK,
      methods: new Map([['t1', BEATS]]),
    })
    expect(onsets(performance, 'rh')).toEqual([0, B, 2 * B, 3 * B, 4 * B])
    expect(performance.chords.map((chord) => [chord.method, chord.pattern])).toEqual([
      ['t1', 'beats'],
      [undefined, 'block'],
    ])
  })

  it('plays each section with its own pattern, a chord’s method code before it', () => {
    const twoSections: Chart = {
      ...chart([['C', 'F']]),
      sections: [...chart([['C', 'F']]).sections, ...chart([['G:t1', 'C']]).sections],
    }
    const performance = arrange(twoSections, {
      tonic: C,
      pattern: BLOCK,
      methods: new Map([['t1', BLOCK]]),
      sections: [undefined, BEATS],
    })
    expect(performance.chords.map((chord) => chord.pattern)).toEqual([
      'block',
      'block',
      'block',
      'beats',
    ])
  })

  it('engraves the barlines as written, or plays the repeats taken, the tune going round with them', () => {
    const marked = chart([['C', 'F', 'G']])
    const [line = []] = marked.sections[0]?.lines ?? []
    const repeated: Chart = {
      ...marked,
      sections: [
        {
          lines: [
            [
              { ...line[0]!, repeatStart: true },
              { ...line[1]!, barline: 'repeat' },
              { ...line[2]!, barline: 'final' },
            ],
          ],
        },
      ],
    }
    const tune: StaffMusic = {
      clef: 'treble',
      notes: [{ midi: midi(72), spelled: note('C'), startTick: 4 * B, durationTicks: 4 * B }],
    }
    const written = arrange(repeated, { tonic: C, pattern: BLOCK, staves: [tune] })
    expect(written.bars.map((bar) => [bar.repeatStart, bar.barline])).toEqual([
      [true, undefined],
      [undefined, 'repeat'],
      [undefined, 'final'],
    ])
    const played = arrange(repeated, { tonic: C, pattern: BLOCK, staves: [tune], unfold: true })
    expect(played.bars.map((bar) => [bar.written, bar.startTick, bar.barline])).toEqual([
      [0, 0, undefined],
      [1, 4 * B, undefined],
      [0, 8 * B, undefined],
      [1, 12 * B, undefined],
      [2, 16 * B, 'final'],
    ])
    expect(played.chords.map((chord) => chord.symbol)).toEqual(['C', 'F', 'C', 'F', 'G'])
    expect(notesOf(played, 'staff').map((n) => n.startTick)).toEqual([4 * B, 12 * B])
  })

  it('keeps each bar’s clef change, and the clefs as they stand where a repeat goes back', () => {
    const [line = []] = chart([['C', 'F', 'G']]).sections[0]?.lines ?? []
    const changed: Chart = {
      ...chart([['C']]),
      sections: [
        {
          lines: [
            [
              line[0]!,
              { ...line[1]!, clefs: { lh: 'treble' } },
              { ...line[2]!, barline: 'repeat' },
            ],
          ],
        },
      ],
    }
    const played = arrange(changed, { tonic: C, pattern: BLOCK, unfold: true })
    expect(played.bars.map((bar) => bar.clefs)).toEqual([
      undefined,
      { lh: 'treble' },
      undefined,
      { rh: 'treble', lh: 'bass' },
      { lh: 'treble' },
      undefined,
    ])
  })

  it('lets a hand override replace every chord’s figure', () => {
    const performance = arrange(chart([['C:t1', 'F']]), {
      tonic: C,
      pattern: BLOCK,
      methods: new Map([['t1', BEATS]]),
      rh: figure('0/8 C'),
      lh: figure('0/4 L1,4/4 L5'),
    })
    expect(onsets(performance, 'rh')).toEqual([0, 4 * B])
    expect(onsets(performance, 'lh')).toEqual([0, B, 4 * B, 5 * B])
  })

  const DOUBLE: TuneFigure = { kind: 'tune', use: 'double', withoutTune: figure('0/16 C') }
  const plain = pattern('plain', '0/4 C,4/4 C,8/4 C,12/4 C', '0/16 L1')
  const TUNE_PATTERN: TunePattern = {
    id: 'tune',
    rh: DOUBLE,
    lh: figure('0/16 L1+L8'),
    withoutTune: plain,
  }

  it('falls back to the plain pattern, both hands, without a tune', () => {
    const performance = arrange(chart([['C']]), { tonic: C, pattern: TUNE_PATTERN })
    expect(onsets(performance, 'rh')).toEqual([0, B, 2 * B, 3 * B])
    expect(midisAt(performance, 'lh', 0)).toEqual([36])
    expect(performance.chords[0]?.pattern).toBe('plain')
  })

  it('plays a chosen tune figure’s fallback without a tune', () => {
    const performance = arrange(chart([['C']]), { tonic: C, pattern: BEATS, rh: DOUBLE })
    expect(onsets(performance, 'rh')).toEqual([0])
    expect(midisAt(performance, 'rh', 0)).toEqual([60, 64, 67])
    expect(midisAt(performance, 'lh', 0)).toEqual([36, 48])
  })

  const line = (...notes: [number, number, number][]): StaffNote[] =>
    notes.map(([m, startTick, durationTicks]) => ({
      midi: midi(m),
      spelled: plainSpelling(pitchClass(m), true),
      startTick,
      durationTicks,
    }))
  /** A single staff of these notes in the treble clef. */
  const tune = (...notes: [number, number, number][]): StaffMusic[] => [
    { clef: 'treble', notes: line(...notes) },
  ]

  it('carries each single staff’s notes as written, on its staff, under the chord sounding (ADR 0097)', () => {
    const performance = arrange(chart([['C']]), {
      tonic: C,
      pattern: BLOCK,
      staves: [
        { clef: 'treble', notes: line([64, 0, 2 * B], [62, 2 * B, 2 * B]) },
        { clef: 'bass', notes: line([43, 0, 4 * B]) },
      ],
      hearTune: true,
    })
    expect(notesOf(performance, 'staff')).toEqual([
      {
        midi: 43,
        spelled: note('G'),
        hand: 'staff',
        staff: 1,
        startTick: 0,
        durationTicks: 4 * B,
        velocity: 0.17,
        chord: 0,
      },
      {
        midi: 64,
        spelled: note('E'),
        hand: 'staff',
        staff: 0,
        startTick: 0,
        durationTicks: 2 * B,
        velocity: 0.17,
        chord: 0,
      },
      {
        midi: 62,
        spelled: note('D'),
        hand: 'staff',
        staff: 0,
        startTick: 2 * B,
        durationTicks: 2 * B,
        velocity: 0.17,
        chord: 0,
      },
    ])
    expect(performance.staves).toEqual([{ clef: 'treble' }, { clef: 'bass' }])
    expect(arrange(chart([['C']]), { tonic: C, pattern: BLOCK }).staves).toBeUndefined()
  })

  it('writes the tune silent where it is not heard, the other staves heard all the same', () => {
    const performance = arrange(chart([['C']]), {
      tonic: C,
      pattern: BLOCK,
      staves: [...tune([64, 0, 4 * B]), { clef: 'bass', notes: line([43, 0, 4 * B]) }],
    })
    expect(notesOf(performance, 'staff').map((n) => [n.staff, n.silent])).toEqual([
      [1, undefined],
      [0, true],
    ])
  })

  it('hears the tune once where the right hand plays it: its staff silent there', () => {
    const played = arrange(chart([['C']]), {
      tonic: C,
      pattern: BLOCK,
      rh: DOUBLE,
      staves: tune([64, 0, 2 * B], [62, 2 * B, 2 * B]),
      hearTune: true,
    })
    expect(notesOf(played, 'staff').map((n) => [n.midi, n.silent])).toEqual([
      [64, true],
      [62, true],
    ])
    expect(midisAt(played, 'rh', 0)).toEqual([64])
    expect(notesOf(played, 'rh')[0]?.velocity).toBe(0.19)
  })

  it('hears the tune in a bar of no chord, where no pattern plays it (ADR 0114)', () => {
    const performance = arrange(chart([['C', '_']]), {
      tonic: C,
      pattern: BLOCK,
      rh: DOUBLE,
      staves: tune([64, 0, 4 * B], [62, 4 * B, 4 * B]),
      hearTune: true,
    })
    expect(midisAt(performance, 'rh', 0)).toEqual([64])
    expect(onsets(performance, 'rh')).toEqual([0])
    expect(
      notesOf(performance, 'staff').map((n) => [n.midi, n.startTick, n.chord, n.silent]),
    ).toEqual([
      [64, 0, 0, true],
      [62, 4 * B, undefined, undefined],
    ])
  })

  it('harmonises long tune notes with chord tones below', () => {
    const harmony: TuneFigure = {
      kind: 'tune',
      use: 'harmony',
      withoutTune: figure('0/16 C'),
    }
    const long = arrange(chart([['C']]), {
      tonic: C,
      pattern: BLOCK,
      rh: harmony,
      staves: tune([64, 0, 4 * B]),
    })
    expect(midisAt(long, 'rh', 0)).toEqual([55, 60, 64])
    expect(notesOf(long, 'rh').map((n) => n.velocity)).toEqual([0.11, 0.11, 0.19])
    const short = arrange(chart([['C']]), {
      tonic: C,
      pattern: BLOCK,
      rh: harmony,
      staves: tune([64, 0, 0.5 * B]),
    })
    expect(midisAt(short, 'rh', 0)).toEqual([64])
  })

  it('plays the tune only at the ends of a line', () => {
    const ends: TuneFigure = {
      kind: 'tune',
      use: 'ends',
      between: figure('0/8 C'),
      withoutTune: figure('0/16 C'),
    }
    const performance = arrange(chart([['C', 'F', 'G']]), {
      tonic: C,
      pattern: BLOCK,
      rh: ends,
      staves: tune([67, 0, 4 * B], [71, 4 * B, 4 * B], [72, 8 * B, 4 * B]),
    })
    expect(midisAt(performance, 'rh', 0)).toEqual([67])
    expect(pitchClassesAt(performance, 'rh', 4 * B)).toEqual(new Set([5, 9, 0]))
    expect(midisAt(performance, 'rh', 8 * B)).toEqual([72])
  })

  it('hears the tune’s staff where a line’s middle plays the figure between its ends', () => {
    const ends: TuneFigure = {
      kind: 'tune',
      use: 'ends',
      between: figure('0/8 C'),
      withoutTune: figure('0/16 C'),
    }
    const performance = arrange(chart([['C', 'F', 'G']]), {
      tonic: C,
      pattern: BLOCK,
      rh: ends,
      staves: tune([67, 0, 4 * B], [71, 4 * B, 4 * B], [72, 8 * B, 4 * B]),
      hearTune: true,
    })
    expect(
      notesOf(performance, 'staff').flatMap((n) => (n.silent ? [] : [[n.midi, n.startTick]])),
    ).toEqual([[71, 4 * B]])
  })

  it.each([
    ['D/F#', 'G', note('A', -1), 'E♭/G'],
    ['D#/G', 'G#m', note('A', 1), 'E#/A'],
    ['A#dim7', 'C', note('C', 1), 'A𝄪°7'],
  ])('transposes %s in %s to %j as %s', (symbol, key, to, expected) => {
    const performance = arrange(chart([[symbol]], { key }), { tonic: to, pattern: BLOCK })
    expect(performance.chords[0]?.symbol).toBe(expected)
    expect(performance.key.tonic).toEqual(to)
    expect(performance.key.minor).toBe(key.endsWith('m'))
  })

  it.each([
    [note('G'), 55],
    [note('D'), 62],
  ])('moves the tune the short way to %j', (to: SpelledNote, expected) => {
    const performance = arrange(chart([['C']]), {
      tonic: to,
      pattern: BLOCK,
      staves: tune([60, 0, 4 * B]),
      hearTune: true,
    })
    expect(notesOf(performance, 'staff')[0]?.midi).toBe(expected)
  })

  it('groups notes by onset, with the bar and the chord sounding', () => {
    const performance = arrange(chart([['C@2-G@2']]), { tonic: C, pattern: BEATS })
    expect(performance.beatGroups.map(({ tick, bar, chord }) => ({ tick, bar, chord }))).toEqual([
      { tick: 0, bar: 0, chord: 0 },
      { tick: B, bar: 0, chord: 0 },
      { tick: 2 * B, bar: 0, chord: 1 },
      { tick: 3 * B, bar: 0, chord: 1 },
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
      tonic,
      pattern: pattern('flow', '0/4 Ka,4/4 Kb,8/4 Kc', '0/16 L1'),
    })
    expect([0, B, 2 * B].map((tick) => pitchClassesAt(performance, 'rh', tick))).toEqual(
      triads.map((triad) => new Set(triad)),
    )
  })
})

describe('a hand written into a bar', () => {
  const hand = (...notes: [number, number, number, (1 | 2 | 3 | 4 | 5)?][]): HandNote[] =>
    notes.map(([m, startTick, durationTicks, finger]) => ({
      midi: midi(m),
      spelled: plainSpelling(pitchClass(m), true),
      startTick,
      durationTicks,
      ...(finger ? { finger } : {}),
    }))
  const writing = (written: ChartBar, hands: WrittenHands): ChartBar => ({ ...written, hands })
  const twoBars = (hands: WrittenHands): Chart => {
    const plain = chart([['C', 'G']])
    const [first, second] = plain.sections[0]?.lines[0] ?? []
    if (!first || !second) throw new Error('two bars')
    return { ...plain, sections: [{ lines: [[writing(first, hands), second]] }] }
  }

  it('plays the written left hand in its bar, and the pattern’s everywhere else', () => {
    const performance = arrange(twoBars({ lh: hand([36, 0, 2 * B], [43, 2 * B, 2 * B]) }), {
      tonic: C,
      pattern: BEATS,
    })
    expect(notesOf(performance, 'lh').map((n) => [n.midi, n.startTick, n.durationTicks])).toEqual([
      [36, 0, 2 * B],
      [43, 2 * B, 2 * B],
      [31, 4 * B, 4 * B],
      [43, 4 * B, 4 * B],
    ])
    expect(onsets(performance, 'rh')).toEqual([0, B, 2 * B, 3 * B, 4 * B, 5 * B, 6 * B, 7 * B])
  })

  it('plays a written note moved past the end of the piano an octave back onto it', () => {
    const bar = 4 * TICKS_PER_BEAT
    const lowC = arrange(twoBars({ lh: hand([24, 0, bar]) }), { tonic: note('G'), pattern: BEATS })
    // C1 a fourth down is G0, under the piano's A0: it plays G1.
    expect(notesOf(lowC, 'lh')[0]?.midi).toBe(31)
  })

  it('carries a written note’s marks, its grace notes moved with the key', () => {
    const [written] = hand([60, 0, 4 * TICKS_PER_BEAT])
    if (!written) throw new Error('a note')
    const marked = {
      ...written,
      marks: {
        articulations: ['accent' as const],
        grace: [{ midi: midi(62), spelled: note('D') }],
      },
    }
    const performance = arrange(twoBars({ rh: [marked] }), { tonic: note('D'), pattern: BEATS })
    const [played] = notesOf(performance, 'rh')
    expect(played?.marks?.articulations).toEqual(['accent'])
    expect(played?.marks?.grace?.map((g) => [g.midi, noteName(g.spelled)])).toEqual([[64, 'E']])
  })

  it('plays the written right hand in place of the tune a tune pattern gives it', () => {
    const DOUBLING: TunePattern = {
      id: 'tune',
      rh: { kind: 'tune', use: 'double', withoutTune: figure('0/16 C') },
      lh: figure('0/16 L1'),
      withoutTune: BLOCK,
    }
    const tune: StaffMusic = {
      clef: 'treble',
      notes: [
        { midi: midi(76), spelled: note('E'), startTick: 0, durationTicks: 4 * B },
        { midi: midi(74), spelled: note('D'), startTick: 4 * B, durationTicks: 4 * B },
      ],
    }
    const performance = arrange(twoBars({ rh: hand([72, 0, 4 * B]) }), {
      tonic: C,
      pattern: DOUBLING,
      staves: [tune],
      hearTune: true,
    })
    expect(notesOf(performance, 'rh').map((n) => [n.midi, n.startTick])).toEqual([
      [72, 0],
      [74, 4 * B],
    ])
    // The tune's staff heard where the written hand plays in its place, silent where the pattern plays it.
    expect(notesOf(performance, 'staff').map((n) => [n.midi, n.silent])).toEqual([
      [76, undefined],
      [74, true],
    ])
  })

  it('names the pattern each chord is played by, none where its bar writes both hands (ADR 0111)', () => {
    const written = arrange(twoBars({ rh: hand([72, 0, 4 * B]), lh: hand([36, 0, 4 * B]) }), {
      tonic: C,
      pattern: BEATS,
    })
    expect(written.chords.map((chord) => chord.pattern)).toEqual([undefined, 'beats'])
    // A hand left to it is still the pattern's.
    const left = arrange(twoBars({ rh: hand([72, 0, 4 * B]) }), { tonic: C, pattern: BEATS })
    expect(left.chords.map((chord) => chord.pattern)).toEqual(['beats', 'beats'])
  })

  it('moves the written notes to the chosen key, letters with it, fingers kept', () => {
    const performance = arrange(twoBars({ rh: hand([64, 0, 4 * B, 3]) }), {
      tonic: note('E', -1),
      pattern: BLOCK,
    })
    const [written] = notesOf(performance, 'rh')
    expect(written).toMatchObject({ midi: 67, spelled: note('G'), finger: 3, startTick: 0 })
  })

  it('puts each written note under the chord sounding at its onset', () => {
    const plain = chart([['C-G']])
    const [only] = plain.sections[0]?.lines[0] ?? []
    if (!only) throw new Error('one bar')
    const performance = arrange(
      {
        ...plain,
        sections: [{ lines: [[writing(only, { lh: hand([36, 0, B], [43, 2 * B, B]) })]] }],
      },
      { tonic: C, pattern: BLOCK },
    )
    expect(notesOf(performance, 'lh').map((n) => n.chord)).toEqual([0, 1])
  })

  it('plays a bar of no chord’s written notes, for no chord, and groups them so (ADR 0114)', () => {
    const plain = chart([['C', '_']])
    const [first, second] = plain.sections[0]?.lines[0] ?? []
    if (!first || !second) throw new Error('two bars')
    const performance = arrange(
      {
        ...plain,
        sections: [
          { lines: [[first, writing(second, { lh: hand([43, 0, 2 * B], [36, 2 * B, 2 * B]) })]] },
        ],
      },
      { tonic: C, pattern: BLOCK },
    )
    expect(notesOf(performance, 'lh').map((n) => [n.midi, n.startTick, n.chord])).toEqual([
      [36, 0, 0],
      [43, 4 * B, undefined],
      [36, 6 * B, undefined],
    ])
    expect(performance.beatGroups.map(({ tick, bar, chord }) => [tick, bar, chord])).toEqual([
      [0, 0, 0],
      [4 * B, 1, undefined],
      [6 * B, 1, undefined],
    ])
  })

  it('holds a written note across the barline into a bar the hand writes too', () => {
    const plain = chart([['C', 'G']])
    const [first, second] = plain.sections[0]?.lines[0] ?? []
    if (!first || !second) throw new Error('two bars')
    const held: Chart = {
      ...plain,
      sections: [
        {
          lines: [
            [
              writing(first, { lh: hand([36, 0, 6 * B]) }),
              writing(second, { lh: hand([43, 2 * B, 2 * B]) }),
            ],
          ],
        },
      ],
    }
    const performance = arrange(held, { tonic: C, pattern: BLOCK })
    expect(notesOf(performance, 'lh').map((n) => [n.midi, n.startTick, n.durationTicks])).toEqual([
      [36, 0, 6 * B],
      [43, 6 * B, 2 * B],
    ])
  })
})

describe('transposeChord', () => {
  it('spells a chord as the written notes are, a double sharp where the key writes one', () => {
    const moved = transposeChord(
      { root: note('F', 1), quality: 'dim', bass: note('A') },
      note('G'),
      note('D', 1),
    )
    expect(moved).toEqual({ root: note('C', 2), quality: 'dim', bass: note('E', 1) })
  })
})
