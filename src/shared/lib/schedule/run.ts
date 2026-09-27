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

export interface RunOptions {
  readonly rhythm: PracticeRhythm
  readonly hands: Hands
  /** The key it is written in. */
  readonly key: Key
  /** Each hand's fingers on the notes going up; coming down, each note keeps its finger. */
  readonly fingers?: Readonly<Record<Hand, readonly Finger[]>>
}

/**
 * A scale's notes up and back down in 8ths of a practice rhythm, for one hand or both (the left an
 * octave down), as timed music in 4/4: what the Scales reference plays and writes.
 */
export function scaleRun(notes: readonly PlacedTone[], options: RunOptions): TimedMusic {
  const lengths = PRACTICE_RHYTHMS[options.rhythm]
  const up = notes.map((_, index) => index)
  const upAndDown = [...up, ...up.slice(0, -1).reverse()]
  const played: TimedNote[] = []
  let tick = 0
  upAndDown.forEach((index, i) => {
    const length = Math.round((lengths[i % lengths.length] ?? 1) * TICKS_PER_EIGHTH)
    const placed = notes[index]
    if (placed) {
      for (const hand of PLAYING[options.hands]) {
        const finger = options.fingers?.[hand][index]
        played.push({
          midi: midi(placed.midi + OCTAVE[hand]),
          spelled: placed.tone.note,
          hand,
          startTick: tick,
          durationTicks: length,
          roll: 0,
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
