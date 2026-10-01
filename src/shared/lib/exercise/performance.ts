import type {
  BeatGroup,
  Performance,
  PerformanceBar,
  PerformanceNote,
} from '@/shared/lib/arrangement'
import {
  chordSymbol,
  spellChord,
  TICKS_PER_BEAT,
  type Chord,
  type Finger,
  type Hand,
  type Key,
  type Midi,
  type SpelledNote,
  type Tick,
} from '@/shared/lib/music'

/** A note of an exercise's line, in one hand. */
export interface LineNote {
  readonly midi: Midi
  readonly spelled: SpelledNote
  readonly hand: Hand
  readonly startTick: Tick
  readonly durationTicks: Tick
  readonly finger?: Finger
}

/** The chord a passage of an exercise is over, from its first tick. */
export interface Harmony {
  readonly chord: Chord
  readonly startTick: Tick
  readonly durationTicks: Tick
}

const BAR_BEATS = 4
const BAR_TICKS = BAR_BEATS * TICKS_PER_BEAT
const BARS_A_LINE = 4
const VELOCITY: Readonly<Record<Hand, number>> = { rh: 0.15, lh: 0.17 }

/** The index of the last start at or before `tick`. */
function sounding(starts: readonly Tick[], tick: Tick): number {
  let found = 0
  starts.forEach((start, i) => {
    if (start <= tick) found = i
  })
  return found
}

/**
 * An exercise's notes and harmony as the Player plays and writes them: bars of 4/4 to the end of the
 * last note, four bars a line, a chord at each passage's start, the notes that start together grouped.
 */
export function exercisePerformance(music: {
  readonly key: Key
  readonly notes: readonly LineNote[]
  readonly harmony: readonly Harmony[]
}): Performance {
  const end = Math.max(...music.notes.map((n) => n.startTick + n.durationTicks), 1)
  const barCount = Math.ceil(end / BAR_TICKS)
  const harmonyStarts = music.harmony.map((h) => h.startTick)
  const chords = music.harmony.map((h) => ({
    ...h.chord,
    symbol: chordSymbol(h.chord),
    tones: spellChord(h.chord.root, h.chord.quality),
    startTick: h.startTick,
    durationTicks: h.durationTicks,
    bar: Math.floor(h.startTick / BAR_TICKS),
    pattern: 'exercise',
  }))
  const bars: PerformanceBar[] = Array.from({ length: barCount }, (_, bar) => ({
    startTick: bar * BAR_TICKS,
    beats: BAR_BEATS,
    section: 0,
    line: Math.floor(bar / BARS_A_LINE),
    chords: chords.flatMap((chord, i) => (chord.bar === bar ? [i] : [])),
  }))
  const notes: PerformanceNote[] = [...music.notes]
    .sort((a, b) => a.startTick - b.startTick || a.midi - b.midi)
    .map((n) => ({
      ...n,
      roll: 0,
      velocity: VELOCITY[n.hand],
      chord: sounding(harmonyStarts, n.startTick),
    }))
  const onsets = new Map<Tick, number[]>()
  notes.forEach((n, i) => onsets.set(n.startTick, [...(onsets.get(n.startTick) ?? []), i]))
  const beatGroups = [...onsets].map(([tick, members]): BeatGroup => ({
    tick,
    bar: Math.floor(tick / BAR_TICKS),
    chord: sounding(harmonyStarts, tick),
    notes: members,
  }))
  return {
    key: music.key,
    meter: '4/4',
    totalTicks: barCount * BAR_TICKS,
    bars,
    chords,
    notes,
    beatGroups,
  }
}
