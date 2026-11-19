import type {
  BeatGroup,
  Performance,
  PerformanceBar,
  PerformanceNote,
} from '@/shared/lib/arrangement'
import {
  chordSymbol,
  spellChord,
  type Chord,
  type Finger,
  type Hand,
  type Key,
  type Midi,
  type NoteMarks,
  type SpelledNote,
  type Tick,
  TICKS_PER_BEAT,
} from '@/shared/lib/music'
import { BAR_BEATS } from './time'

/** A note of an exercise's line, in one hand. */
export interface LineNote {
  readonly midi: Midi
  readonly spelled: SpelledNote
  readonly hand: Hand
  readonly startTick: Tick
  readonly durationTicks: Tick
  readonly finger?: Finger
  /** What is written on it: an articulation, a dynamic, a hairpin. */
  readonly marks?: NoteMarks
}

/** The chord a passage of an exercise is over, from its first tick until the next chord or the end. */
export interface Harmony {
  readonly chord: Chord
  readonly startTick: Tick
}
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
 * An exercise's notes and harmony as the Player plays and writes them: bars of 4/4 (of `beats`
 * quarters where it says, Hanon's 2/4) to the end of the last note, four bars a line, a chord at each passage's start (heard, and shown by the chord views,
 * but printed on none of its score), the notes that start together grouped.
 */
export function exercisePerformance(music: {
  readonly key: Key
  readonly notes: readonly LineNote[]
  readonly harmony: readonly Harmony[]
  /** The quarters in its bar, where not four. */
  readonly beats?: number
}): Performance {
  const beats = music.beats ?? BAR_BEATS
  const barTicks = beats * TICKS_PER_BEAT
  const end = Math.max(...music.notes.map((n) => n.startTick + n.durationTicks), 1)
  const barCount = Math.ceil(end / barTicks)
  const harmonyStarts = music.harmony.map((h) => h.startTick)
  const chords = music.harmony.map((h, i) => ({
    ...h.chord,
    symbol: chordSymbol(h.chord),
    tones: spellChord(h.chord.root, h.chord.quality),
    startTick: h.startTick,
    durationTicks: (harmonyStarts[i + 1] ?? barCount * barTicks) - h.startTick,
    bar: Math.floor(h.startTick / barTicks),
    pattern: 'exercise',
  }))
  const bars: PerformanceBar[] = Array.from({ length: barCount }, (_, bar) => ({
    startTick: bar * barTicks,
    beats,
    section: 0,
    line: Math.floor(bar / BARS_A_LINE),
    chords: chords.flatMap((chord, i) => (chord.bar === bar ? [i] : [])),
  }))
  const notes: PerformanceNote[] = [...music.notes]
    .sort((a, b) => a.startTick - b.startTick || a.midi - b.midi)
    .map((n) => ({
      ...n,
      velocity: VELOCITY[n.hand],
      chord: sounding(harmonyStarts, n.startTick),
    }))
  const onsets = new Map<Tick, number[]>()
  notes.forEach((n, i) => onsets.set(n.startTick, [...(onsets.get(n.startTick) ?? []), i]))
  const beatGroups = [...onsets].map(([tick, members]): BeatGroup => ({
    tick,
    bar: Math.floor(tick / barTicks),
    chord: sounding(harmonyStarts, tick),
    notes: members,
  }))
  return {
    key: music.key,
    meter: `${beats}/4`,
    // A drill, not a song: its score prints no chord symbol and no staff name (A41).
    plain: true,
    totalTicks: barCount * barTicks,
    bars,
    chords,
    notes,
    beatGroups,
    pedal: [],
  }
}
