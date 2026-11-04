import {
  barTicks,
  beatsToTicks,
  isCompound,
  meterParts,
  midi,
  pitchClass,
  pitchClassOf,
  spellChord,
  TICKS_PER_BEAT,
  type Chord,
  type Meter,
  type Midi,
  type Tick,
} from '@/shared/lib/music'
import { arrange } from './arrange'
import { playOrder, sheetToChart, type ChordSheet, type PlayedBar } from './chord-sheet'
import type { Pattern, Performance } from './types'

/**
 * A style over a chord sheet (R29 CP3): the piano's pattern, the bass's line and the drums' groove,
 * each a bar of 16 steps (a 4/4 bar in 16ths) with a velocity a step, a fill for the section's last
 * bar on its last repeat and a crash on its first beat, as a band plays a lead sheet.
 */

/** The kit's pieces a groove strikes: the drum sounds' own (`KitPiece`), named here for the kernel. */
export const DRUM_VOICES = [
  'kick',
  'snare',
  'rim',
  'hatClosed',
  'hatOpen',
  'hatPedal',
  'ride',
  'rideBell',
  'crash',
  'tomHigh',
  'tomMid',
  'tomFloor',
] as const
export type DrumVoice = (typeof DRUM_VOICES)[number]

/** A voice's bar: its velocity on each step, 0 silent, 1 the hardest. */
export type StepVelocities = readonly number[]
/** A groove's bar: the steps of each voice it strikes, all the same length. */
export type DrumGrid = Partial<Readonly<Record<DrumVoice, StepVelocities>>>

/** What a bass note plays of the chord sounding: its root (its bass, over a slash), 5th, octave, 3rd, or a semitone to the next chord's root. */
export type BassDegree = 'root' | 'fifth' | 'octave' | 'third' | 'approach'
export interface BassStep {
  readonly step: number
  readonly degree: BassDegree
  readonly velocity: number
  /** Steps it lasts, at most to the next note, the chord's change or the bar's end. */
  readonly length: number
}
/** A bass's bar: its notes and how many steps the bar has. */
export interface BassLine {
  readonly steps: number
  readonly notes: readonly BassStep[]
}

/** A style's parts for a section (its variation's): none where the style leaves a part out. */
export interface StyleParts {
  readonly piano: Pattern | null
  readonly bass: BassLine | null
  readonly drums: DrumGrid | null
  /** What plays instead on the section's last bar, its last time round. */
  readonly fill?: { readonly bass?: BassLine; readonly drums?: DrumGrid }
  /** A crash on the section's first beat, the hi-hat and ride left out under it. */
  readonly crash?: boolean
}

export interface BassNote {
  readonly midi: Midi
  readonly startTick: Tick
  readonly durationTicks: Tick
  readonly velocity: number
}
export interface DrumHit {
  readonly voice: DrumVoice
  readonly tick: Tick
  readonly velocity: number
}
/** The band's parts over the sheet as played: its bars, the piano's Performance, the bass's notes and the drums' strokes. */
export interface Band {
  readonly bars: readonly PlayedBar[]
  readonly totalTicks: Tick
  readonly piano: Performance | null
  readonly bass: readonly BassNote[]
  readonly drums: readonly DrumHit[]
}

const DEGREES: Readonly<Record<string, BassDegree>> = {
  r: 'root',
  '5': 'fifth',
  '8': 'octave',
  '3': 'third',
  a: 'approach',
}

/** A step's velocity as written: an accent, a plain stroke, a ghost. */
const STROKES: Readonly<Record<string, number>> = { X: 1, x: 0.75, o: 0.45, '.': 0 }

/** A groove's voice written a character a step: `X` an accent, `x` a stroke, `o` a ghost note, `.` silent. */
export const drumSteps = (written: string): StepVelocities =>
  [...written].map((char) => STROKES[char] ?? 0)

/**
 * A bass's bar written a character a step: `R` the root, `5`, `8` its octave, `3`, `A` an approach to
 * the next chord; a note rings on through `.` to the next note, `_` stopping it short; an upper-case
 * `R` and `A` accented.
 */
export function bassLine(written: string): BassLine {
  const chars = [...written]
  const notes: BassStep[] = []
  chars.forEach((char, step) => {
    const degree = DEGREES[char.toLowerCase()]
    if (!degree) return
    let length = 1
    while (step + length < chars.length && chars[step + length] === '.') length++
    const accented = char === 'R' || char === 'A' || step === 0
    notes.push({ step, degree, velocity: accented ? 1 : step % 4 === 0 ? 0.85 : 0.7, length })
  })
  return { steps: chars.length, notes }
}

/** A bar's steps: 16ths, so 16 in 4/4, 12 in 3/4 and 6/8, 24 in 12/8. */
export function barSteps(meter: Meter): number {
  const { count, unit } = meterParts(meter)
  return unit === 2 ? count * 8 : unit === 4 ? count * 4 : count * 2
}

/**
 * Where step `k` of a bar falls, from its start; null for a step a swing leaves out. Swung, each
 * beat's 16ths play on its triplets and the fourth is dropped, the beat itself kept (a simple meter's).
 */
function stepTick(meter: Meter, k: number, swing: boolean): Tick | null {
  const step = barTicks(meter) / barSteps(meter)
  if (!swing || isCompound(meter)) return Math.round(k * step)
  const into = k % 4
  if (into === 3) return null
  return Math.floor(k / 4) * TICKS_PER_BEAT + Math.round((into * TICKS_PER_BEAT) / 3)
}

/** A step of a grid written for `length` steps, read on a bar of other steps: from its start, round again past its end. */
const gridAt = <T>(grid: readonly T[], k: number): T | undefined =>
  grid.length === 0 ? undefined : grid[k % grid.length]

/** The bass's register: a root from E1 to D♯2, as a bass guitar plays it. */
const LOWEST_ROOT = 28
const rootMidi = (chord: Chord): number =>
  LOWEST_ROOT + pitchClass(pitchClassOf(chord.bass ?? chord.root) - LOWEST_ROOT)

function degreeMidi(degree: BassDegree, chord: Chord, next: Chord | undefined): number {
  const root = rootMidi(chord)
  const own = pitchClassOf(chord.root)
  const above = (role: string, otherwise: number) => {
    const tone = spellChord(chord.root, chord.quality).find((each) => each.role === role)
    return root + (tone ? pitchClass(tone.pitchClass - own) : otherwise)
  }
  switch (degree) {
    case 'root':
      return root
    case 'fifth':
      return above('5th', 7)
    case 'octave':
      return root + 12
    case 'third':
      return above('3rd', 4)
    case 'approach': {
      if (!next || pitchClassOf(next.root) === own) return above('5th', 7)
      const target = rootMidi(next)
      // From the side nearer the note before it.
      return target + (target > root ? -1 : 1)
    }
  }
}

/** Velocity of the band's bass, a share of a piano note's loudness scale. */
const BASS_LEVEL = 0.22

/** Where the chord at a tick of a bar starts and ends, and which it is. */
interface Sounding {
  readonly chord: Chord
  readonly from: Tick
  readonly to: Tick
  readonly struck: boolean
}

function chordsOf(bar: PlayedBar): Sounding[] {
  return bar.chords.map((each) => ({
    chord: each.chord,
    from: beatsToTicks(each.from),
    to: beatsToTicks(each.from + each.beats),
    struck: !each.held,
  }))
}

function bassOf(
  bar: PlayedBar,
  line: BassLine,
  meter: Meter,
  swing: boolean,
  after: Chord | undefined,
): BassNote[] {
  const steps = barSteps(meter)
  const end = barTicks(meter)
  const chords = chordsOf(bar)
  const at = (tick: Tick) => chords.findLast((each) => each.from <= tick)
  // Each written note, its line round again where the bar is longer than it.
  const written = Array.from({ length: Math.ceil(steps / line.steps) }, (_, round) =>
    line.notes.map((note) => ({ ...note, step: note.step + round * line.steps })),
  )
    .flat()
    .filter((note) => note.step < steps)
  const placed = written.flatMap((note) => {
    const tick = stepTick(meter, note.step, swing)
    const until = stepTick(meter, Math.min(steps, note.step + note.length), false) ?? end
    return tick === null ? [] : [{ ...note, tick, until: Math.max(until, tick + 1) }]
  })
  // A chord struck where no note of the line starts has its root there: the bass changes with it.
  const changes = chords
    .filter((each) => each.struck && !placed.some((note) => note.tick === each.from))
    .map((each) => ({
      step: -1,
      degree: 'root' as const,
      velocity: 0.85,
      length: 0,
      tick: each.from,
      until: end,
    }))
  if (line.notes.length === 0) return []
  const notes = [...placed, ...changes].sort((a, b) => a.tick - b.tick)
  return notes.map((note, i) => {
    const sounding = at(note.tick) ?? chords[0]
    const chordIndex = sounding ? chords.indexOf(sounding) : -1
    const next = chords[chordIndex + 1]?.chord ?? after
    const stop = Math.min(note.until, notes[i + 1]?.tick ?? end, sounding?.to ?? end)
    const chord = sounding?.chord ?? bar.chords[0]?.chord
    return {
      midi: midi(chord ? degreeMidi(note.degree, chord, next) : LOWEST_ROOT),
      startTick: bar.startTick + note.tick,
      durationTicks: Math.max(1, stop - note.tick),
      velocity: note.velocity * BASS_LEVEL,
    }
  })
}

function drumsOf(
  bar: PlayedBar,
  grid: DrumGrid,
  meter: Meter,
  swing: boolean,
  crash: boolean,
): DrumHit[] {
  const steps = barSteps(meter)
  const hits: DrumHit[] = []
  if (crash) hits.push({ voice: 'crash', tick: bar.startTick, velocity: 0.9 })
  for (const voice of Object.keys(grid) as DrumVoice[]) {
    const velocities = grid[voice] ?? []
    for (let k = 0; k < steps; k++) {
      const velocity = gridAt(velocities, k) ?? 0
      if (velocity <= 0) continue
      if (crash && k === 0 && (voice === 'hatClosed' || voice === 'ride' || voice === 'crash'))
        continue
      const tick = stepTick(meter, k, swing)
      if (tick !== null) hits.push({ voice, tick: bar.startTick + tick, velocity })
    }
  }
  return hits.sort((a, b) => a.tick - b.tick)
}

/**
 * The band over a sheet: each section in its parts (`parts`, by the section's index), every bar as
 * played. The piano by its pattern (`arrange`); the bass by its line on the chord sounding, changing
 * with every chord struck; the drums by their grid; the fill on a section's last bar its last time
 * round and the crash on its first beat. `swing` plays the 16ths on triplets; `block` voices
 * the piano's chords in root position.
 */
export function arrangeStyle(
  sheet: ChordSheet,
  parts: readonly StyleParts[],
  options: { readonly swing?: boolean; readonly block?: boolean },
): Band {
  const swing = options.swing === true
  const bars = playOrder(sheet)
  const totalTicks = bars.length * barTicks(sheet.meter)
  if (bars.length === 0) return { bars, totalTicks, piano: null, bass: [], drums: [] }
  // Each time round a section is a section of the chart: its pattern is its section's.
  const rounds = [...new Set(bars.map((bar) => `${bar.section}.${bar.repeat}`))].map((round) =>
    Number(round.split('.')[0]),
  )
  const patterns = rounds.map((section) => parts[section]?.piano ?? undefined)
  const first = patterns.find((pattern) => pattern !== undefined)
  const piano = first
    ? arrange(sheetToChart(sheet), {
        tonic: sheet.key.tonic,
        pattern: first,
        sections: patterns,
        // Blocks: every chord in root position; else each voice-led from the one before.
        ...(options.block ? { inversion: 0, nearest: false } : {}),
      })
    : null
  const bass: BassNote[] = []
  const drums: DrumHit[] = []
  bars.forEach((bar, i) => {
    const own = parts[bar.section]
    if (!own) return
    const after = bars[i + 1]?.chords[0]?.chord
    const line = (bar.fill ? own.fill?.bass : undefined) ?? own.bass
    if (line) bass.push(...bassOf(bar, line, sheet.meter, swing, after))
    const grid = (bar.fill ? own.fill?.drums : undefined) ?? own.drums
    if (grid)
      drums.push(...drumsOf(bar, grid, sheet.meter, swing, own.crash === true && bar.sectionStart))
  })
  return { bars, totalTicks, piano, bass, drums }
}
