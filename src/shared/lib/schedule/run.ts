import {
  midi,
  TICKS_PER_BEAT,
  type Finger,
  type Hand,
  type Key,
  type PlacedTone,
} from '@/shared/lib/music'
import type { TimedMusic, TimedNote } from '@/shared/lib/notation'
import type { Hands, NoteSound } from './schedule'
import { PRACTICE_RHYTHMS, type PracticeRhythm } from './sounds'

const TICKS_PER_EIGHTH = TICKS_PER_BEAT / 2
const BAR_TICKS = 4 * TICKS_PER_BEAT
const OCTAVE: Readonly<Record<Hand, number>> = { rh: 0, lh: -12 }
const PLAYING: Readonly<Record<Hands, readonly Hand[]>> = {
  rh: ['rh'],
  lh: ['lh'],
  both: ['lh', 'rh'],
}

/** A run's notes one way, from the bottom note up, and each hand's finger on each. */
export interface RunWay {
  readonly notes: readonly PlacedTone[]
  readonly fingers?: Readonly<Record<Hand, readonly Finger[]>>
}

export interface RunOptions {
  readonly rhythm: PracticeRhythm
  readonly hands: Hands
  /** The key it is written in. */
  readonly key: Key
  /** The way down where it is not the way up (melodic minor's natural minor), with its own fingers. */
  readonly down?: RunWay
}

/**
 * A scale's notes up and back down in 8ths of a practice rhythm, for one hand or both (the left an
 * octave down), as timed music in 4/4: what the Scales explorer plays and writes. Coming down, each
 * note keeps its finger.
 */
export function scaleRun(up: RunWay, options: RunOptions): TimedMusic {
  const lengths = PRACTICE_RHYTHMS[options.rhythm]
  const down = options.down ?? up
  const indices = up.notes.map((_, index) => index)
  const upAndDown = [
    ...indices.map((index) => ({ way: up, index })),
    ...indices
      .slice(0, -1)
      .reverse()
      .map((index) => ({ way: down, index })),
  ]
  const played: TimedNote[] = []
  let tick = 0
  upAndDown.forEach(({ way, index }, i) => {
    const length = Math.round((lengths[i % lengths.length] ?? 1) * TICKS_PER_EIGHTH)
    const placed = way.notes[index]
    if (placed) {
      for (const hand of PLAYING[options.hands]) {
        const finger = way.fingers?.[hand][index]
        played.push({
          midi: midi(placed.midi + OCTAVE[hand]),
          spelled: placed.tone.note,
          hand,
          startTick: tick,
          durationTicks: length,
          ...(finger === undefined ? {} : { finger }),
        })
      }
    }
    tick += length
  })
  return {
    key: options.key,
    meter: '4/4',
    bars: Array.from({ length: Math.ceil(tick / BAR_TICKS) }, (_, bar) => ({
      startTick: bar * BAR_TICKS,
      beats: 4,
    })),
    notes: played,
    chords: [],
  }
}

/** A run as it sounds at a tempo: each note a little longer than written, softer with both hands. */
export function runSounds(run: TimedMusic, tempo: number): NoteSound[] {
  const secondsPerTick = 60 / (tempo * TICKS_PER_BEAT)
  const together = new Set(run.notes.map((n) => n.hand)).size > 1
  return run.notes.map((n) => ({
    kind: 'note',
    midi: n.midi,
    at: n.startTick * secondsPerTick,
    duration: Math.max(0.25, n.durationTicks * secondsPerTick * 1.1),
    velocity: together ? 0.16 : 0.2,
  }))
}
