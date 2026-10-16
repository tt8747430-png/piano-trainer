import { noteName, TICKS_PER_BEAT, type Tick } from '@/shared/lib/music'
import type { StaffId, TimedMusic } from '@/shared/lib/notation'

/** A written onset's column on the staff: where a tap on it plays the notes struck there. */
export interface NoteColumn {
  readonly tick: Tick
  /** From the half-way point to the onset before to the half-way point to the next (CSS pixels). */
  readonly left: number
  readonly width: number
}

/** Room a column takes past the first or last onset, and the least it is wide. */
const EDGE = 20
const LEAST = 24

/**
 * Each onset's column across the staff, split half-way between its neighbours, so every note has a
 * place to tap that touches the next one's.
 */
export function noteColumns(
  onsets: readonly { readonly tick: Tick; readonly x: number }[],
): NoteColumn[] {
  return onsets.map((onset, i) => {
    const before = onsets[i - 1]
    const after = onsets[i + 1]
    const left = before ? (before.x + onset.x) / 2 : onset.x - EDGE
    const right = after ? (onset.x + after.x) / 2 : onset.x + EDGE
    const width = Math.max(LEAST, right - left)
    return { tick: onset.tick, left: right - left < LEAST ? onset.x - LEAST / 2 : left, width }
  })
}

/** The notes struck from `from` up to `to`, as music of their own starting at its first tick. */
export function passage(music: TimedMusic, from: Tick, to: Tick): TimedMusic {
  return {
    ...music,
    bars: [],
    chords: [],
    notes: music.notes
      .filter((n) => n.startTick >= from && n.startTick < to)
      .map((n) => ({ ...n, startTick: n.startTick - from })),
  }
}

/** The notes struck at a tick, named as written, lowest first: what a tap on its column says. */
export const namesAt = (music: TimedMusic, tick: Tick): string =>
  music.notes
    .filter((n) => n.startTick === tick)
    .toSorted((a, b) => a.midi - b.midi)
    .map((n) => noteName(n.spelled))
    .join(' ')

/** Where music's notes start, each once, earliest first: by tick, and in seconds at `tempo`. */
export function onsetsOf(
  music: TimedMusic,
  tempo: number,
): { readonly ticks: readonly Tick[]; readonly seconds: readonly number[] } {
  const ticks = [...new Set(music.notes.map((n) => n.startTick))].toSorted((a, b) => a - b)
  const perTick = 60 / (tempo * TICKS_PER_BEAT)
  return { ticks, seconds: ticks.map((tick) => tick * perTick) }
}

/** The staff a note struck at `tick` is marked on: the right hand's treble where it plays then. */
export const staffAt = (music: TimedMusic, tick: Tick): StaffId =>
  music.notes.some((n) => n.startTick === tick && n.hand === 'rh') ? 'treble' : 'bass'
