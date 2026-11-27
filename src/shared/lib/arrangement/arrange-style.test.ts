import { describe, expect, it } from 'vitest'
import { C_MAJOR, parseChordSymbol, pitchClass, TICKS_PER_BEAT } from '@/shared/lib/music'
import { arrangeStyle, bassLine, drumSteps, type BandBar, type StyleParts } from './arrange-style'
import { NO_MARKS, playOrder, type ChordSheet, type SheetSection } from './chord-sheet'
import { parseFigure } from './figure'
import type { EventPattern } from './types'

const B = TICKS_PER_BEAT

const section = (line: string, more: Partial<SheetSection> = {}): SheetSection => ({
  kind: 'verse',
  repeats: 1,
  marks: NO_MARKS,
  variation: 1,
  bars: line.split(' ').map((word) => {
    const [symbol = '', beats = '4'] = word.split(':')
    return { chords: [{ chord: parseChordSymbol(symbol), beats: Number(beats) }] }
  }),
  ...more,
})
const sheetOf = (...sections: SheetSection[]): ChordSheet => ({
  key: C_MAJOR,
  meter: '4/4',
  sections,
})

/** The band over a sheet in its play order, each section in its parts, `how` changing a bar's way of playing. */
const bandOf = (
  sheet: ChordSheet,
  parts: readonly StyleParts[],
  options: Parameters<typeof arrangeStyle>[3],
  how: (at: number) => Partial<BandBar> = () => ({}),
) => {
  const bars = playOrder(sheet)
  const plays = bars.map((bar, at): BandBar => ({
    parts: parts[bar.section] ?? parts[0]!,
    fill: bar.fill,
    break: false,
    ending: false,
    ...how(at),
  }))
  return arrangeStyle(sheet, bars, plays, options)
}

const block: EventPattern = {
  id: 'block',
  rh: { kind: 'events', events: parseFigure('0/16 C') },
  lh: { kind: 'events', events: parseFigure('0/16 1') },
}
const POP: StyleParts = {
  piano: block,
  bass: bassLine('R.....R.R.......'),
  drums: {
    kick: drumSteps('X.....x.X.......'),
    snare: drumSteps('....X.......X...'),
    hatClosed: drumSteps('x.x.x.x.x.x.x.x.'),
  },
  fill: { drums: { tomHigh: drumSteps('............X.x.') } },
  crash: true,
}

describe('a style over a chord sheet', () => {
  it('writes the bass on each chord’s root on beat 1, in the bass’s register', () => {
    const band = bandOf(sheetOf(section('C G Am F')), [POP], {})
    const downbeats = band.bass.filter((note) => note.startTick % (4 * B) === 0)
    expect(downbeats.map((note) => pitchClass(note.midi))).toEqual([0, 7, 9, 5])
    for (const note of band.bass) expect(note.midi).toBeGreaterThanOrEqual(28)
    for (const note of band.bass) expect(note.midi).toBeLessThan(52)
  })
  it('changes the bass on beat 3 under a 2-beat chord', () => {
    const band = bandOf(
      sheetOf(section('C:2 G:2')),
      [{ ...POP, bass: bassLine('R...............') }],
      {},
    )
    expect(band.bass.map((note) => [note.startTick / B, pitchClass(note.midi)])).toEqual([
      [0, 0],
      [2, 7],
    ])
    expect(band.bass[0]?.durationTicks).toBe(2 * B)
  })
  it('plays the fill on the section’s last bar on its last repeat, the crash on its first beat', () => {
    const band = bandOf(sheetOf(section('C G', { repeats: 2 })), [POP], {})
    const toms = band.drums.filter((hit) => hit.voice === 'tomHigh')
    expect(toms.map((hit) => hit.tick / B)).toEqual([12 + 3, 12 + 3.5])
    const crashes = band.drums.filter((hit) => hit.voice === 'crash')
    expect(crashes.map((hit) => hit.tick)).toEqual([0])
    // The crash is heard alone on its beat: no hi-hat under it.
    expect(band.drums.some((hit) => hit.voice === 'hatClosed' && hit.tick === 0)).toBe(false)
    expect(band.drums.some((hit) => hit.voice === 'hatClosed' && hit.tick === 4 * B)).toBe(true)
  })
  it('swings as triplets: each beat’s fourth 16th dropped, the off-beat 8th on its third triplet', () => {
    const swung: StyleParts = {
      ...POP,
      drums: { ride: drumSteps('xxxx............') },
      fill: {},
      crash: false,
    }
    const band = bandOf(sheetOf(section('C')), [swung], { swing: true })
    expect(band.drums.map((hit) => hit.tick)).toEqual([0, B / 3, (2 * B) / 3])
  })
  it('fits a 4/4 grid to 3/4 by its first three beats', () => {
    const band = bandOf(
      { ...sheetOf(section('C:3 G:3')), meter: '3/4' },
      [{ ...POP, fill: {}, crash: false }],
      {},
    )
    expect(band.drums.filter((hit) => hit.voice === 'snare').map((hit) => hit.tick / B)).toEqual([
      1, 4,
    ])
  })
  it('walks to the next chord: an approach a semitone from its root', () => {
    const band = bandOf(
      sheetOf(section('C F')),
      [{ ...POP, bass: bassLine('R...5...8...A...') }],
      {},
    )
    const bar = band.bass.filter((note) => note.startTick < 4 * B)
    const [root, fifth, octave, approach] = bar.map((note) => note.midi)
    expect(fifth! - root!).toBe(7)
    expect(octave! - root!).toBe(12)
    const nextRoot = band.bass.find((note) => note.startTick === 4 * B)?.midi
    expect(Math.abs(approach! - nextRoot!)).toBe(1)
  })
  it('plays the piano part through its pattern, section by section, and nothing for no chords', () => {
    const band = bandOf(sheetOf(section('C G')), [POP], {})
    expect(band.piano?.notes.length).toBeGreaterThan(0)
    const none = bandOf(sheetOf({ ...section('C'), bars: [] }), [POP], {})
    expect(none.piano).toBeNull()
    expect(none.bass).toEqual([])
    expect(none.totalTicks).toBe(0)
  })
  it('voices the piano in root-position blocks where asked', () => {
    const band = bandOf(sheetOf(section('G')), [POP], { block: true })
    const right = band.piano?.notes.filter((note) => note.hand === 'rh') ?? []
    expect(Math.min(...right.map((note) => note.midi)) % 12).toBe(7)
  })
  it('a part a style has none of plays nothing', () => {
    const band = bandOf(sheetOf(section('C')), [{ piano: block, bass: null, drums: null }], {})
    expect(band.bass).toEqual([])
    expect(band.drums).toEqual([])
  })
  it('a Break strikes its bar’s first beat with the crash and rests the beats after', () => {
    const band = bandOf(sheetOf(section('C G')), [POP], {}, (at) => ({ break: at === 1 }))
    const second = (tick: number) => tick >= 4 * B
    expect(
      band.drums.filter((hit) => second(hit.tick)).map((hit) => [hit.voice, hit.tick]),
    ).toEqual([
      ['crash', 4 * B],
      ['kick', 4 * B],
    ])
    const piano = band.piano?.notes.filter((note) => second(note.startTick)) ?? []
    expect(piano.length).toBeGreaterThan(0)
    for (const note of piano) {
      expect(note.startTick).toBe(4 * B)
      expect(note.durationTicks).toBeLessThanOrEqual(B)
    }
    expect(
      band.bass.filter((note) => second(note.startTick)).map((note) => note.startTick),
    ).toEqual([4 * B])
  })
  it('the Ending strikes its bar’s chord and holds it to the bar’s end', () => {
    const band = bandOf(sheetOf(section('C G')), [POP], {}, (at) => ({ ending: at === 1 }))
    const last = band.piano?.notes.filter((note) => note.startTick >= 4 * B) ?? []
    expect(last.length).toBeGreaterThan(0)
    for (const note of last) expect([note.startTick, note.durationTicks]).toEqual([4 * B, 4 * B])
  })
  it('each bar takes its own parts: a Main changed mid-section is heard from that bar', () => {
    const quiet: StyleParts = {
      ...POP,
      drums: { ride: drumSteps('x...............') },
      fill: {},
      crash: false,
    }
    const band = bandOf(sheetOf(section('C G')), [POP], {}, (at) =>
      at === 1 ? { parts: quiet } : {},
    )
    expect(band.drums.filter((hit) => hit.tick >= 4 * B).map((hit) => hit.voice)).toEqual(['ride'])
  })
})
