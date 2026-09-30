import type { NoteHand, Performance, PerformanceNote } from '@/shared/lib/arrangement'
import {
  beatsBefore,
  beatsPerBar,
  isCompound,
  TICKS_PER_BEAT,
  type Midi,
  type Tick,
} from '@/shared/lib/music'
import { swingTick } from './swing'

/** Which hands the learner hears: both, or one of them. */
export const HANDS = ['both', 'rh', 'lh'] as const
export type Hands = (typeof HANDS)[number]
export type Audible = Readonly<Record<NoteHand, boolean>>

/** The one table of which hands each choice plays; the doubled tune always sounds. */
const AUDIBLE: Readonly<Record<Hands, Audible>> = {
  both: { rh: true, lh: true, melody: true },
  rh: { rh: true, lh: false, melody: true },
  lh: { rh: false, lh: true, melody: true },
}

export const audibleHands = (hands: Hands): Audible => AUDIBLE[hands]

/** The tempos a learner can choose, in beats per minute: 50% of the slowest piece (56) is 28. */
export const TEMPO_RANGE = { min: 20, max: 160 } as const

export interface NoteSound {
  readonly kind: 'note'
  readonly midi: Midi
  /** Seconds after the pass's time 0. */
  readonly at: number
  readonly duration: number
  readonly velocity: number
}
export interface ClickSound {
  readonly kind: 'click'
  readonly at: number
  readonly accent: boolean
}
export type Sound = NoteSound | ClickSound

export interface ScheduleOptions {
  /** Beats per minute. */
  readonly tempo: number
  readonly hands: Audible
  /** Where in the piece the pass begins; 0 by default. */
  readonly fromTick?: Tick
  /** Where it ends: the piece's end by default. A note sounding past it is cut there. */
  readonly toTick?: Tick
  readonly countIn?: boolean
  readonly metronome?: boolean
  /** Off-beat 8ths late, long-short; a compound meter never swings. */
  readonly swing?: boolean
}

/** When each beat group sounds, so the Player can follow the music. */
export interface Cue {
  readonly beatGroup: number
  readonly at: number
}

export interface Scheduled {
  readonly sounds: readonly Sound[]
  readonly cues: readonly Cue[]
  /** When the pass is over. */
  readonly end: number
  /** The ticks the pass runs from and to. */
  readonly fromTick: Tick
  readonly toTick: Tick
  /** When `fromTick` sounds, after the pass's start: after its count-in. */
  readonly musicStart: number
}

/** A note never sounds shorter than this in a pass… */
const SHORTEST_NOTE = 0.15
/** …nor than this when one beat group is sounded on its own. */
const SHORTEST_ALONE = 0.35
/** Notes in a pass release a little early, so repeated notes are heard as two. */
const LEGATO = 0.95

function checkedTempo(tempo: number): number {
  if (!(tempo > 0)) throw new RangeError(`A tempo is beats per minute above 0, not ${tempo}`)
  return tempo
}

/** Ticks to seconds at a tempo, multiplying before dividing so whole beats come out exact. */
const secondsFor = (ticks: Tick, tempo: number): number =>
  (ticks * 60) / (checkedTempo(tempo) * TICKS_PER_BEAT)

const isAudible = (n: PerformanceNote, hands: Audible) => hands[n.hand]

/** A bar's beats on the meter's grid: a pickup counts from where its bar would begin. */
function barGrid(performance: Performance, index: number): { start: Tick; beats: number } {
  const bar = performance.bars[index]
  if (!bar) return { start: 0, beats: beatsPerBar(performance.meter) }
  const before = beatsBefore(performance.bars, index, performance.meter)
  return before > 0
    ? { start: bar.startTick - before * TICKS_PER_BEAT, beats: beatsPerBar(performance.meter) }
    : { start: bar.startTick, beats: Math.ceil(bar.beats) }
}

/**
 * A count-in: a bar's worth of beats before `fromTick`, on the beats of the bar it starts in, so the
 * music comes in on its beat wherever the pass begins (a pickup's too); each bar's first beat is
 * accented.
 */
function countInBeats(performance: Performance, fromTick: Tick): { tick: Tick; accent: boolean }[] {
  const index = performance.bars.findLastIndex((candidate) => candidate.startTick <= fromTick)
  if (index < 0) return []
  const { start, beats } = barGrid(performance, index)
  const earliest = fromTick - beats * TICKS_PER_BEAT
  return Array.from({ length: 2 * beats }, (_, k) => k - beats).flatMap((k) => {
    const tick = start + k * TICKS_PER_BEAT
    return tick >= earliest && tick < fromTick ? [{ tick, accent: (k + beats) % beats === 0 }] : []
  })
}

/** One pass through the piece from `fromTick` to `toTick`: its notes, clicks and cues in seconds from its start. */
export function schedule(performance: Performance, options: ScheduleOptions): Scheduled {
  const { hands, fromTick = 0, toTick = performance.totalTicks } = options
  const tempo = checkedTempo(options.tempo)
  const place = options.swing && !isCompound(performance.meter) ? swingTick : (tick: Tick) => tick
  const counted = options.countIn ? countInBeats(performance, fromTick) : []
  const musicStart = secondsFor(place(fromTick) - place(counted[0]?.tick ?? fromTick), tempo)
  const at = (tick: Tick) => musicStart + secondsFor(place(tick) - place(fromTick), tempo)
  const countIn: Sound[] = counted.map(({ tick, accent }) => ({
    kind: 'click',
    at: at(tick),
    accent,
  }))
  const inPass = (tick: Tick) => tick >= fromTick && tick < toTick

  // A note still held where the pass starts sounds from there, for what is left of it.
  const heard = (n: PerformanceNote) =>
    inPass(n.startTick) || (n.startTick < fromTick && n.startTick + n.durationTicks > fromTick)
  const played: Sound[] = performance.notes
    .filter((n) => heard(n) && isAudible(n, hands))
    .map((n) => {
      const start = Math.max(fromTick, n.startTick + n.roll)
      const end = Math.min(n.startTick + n.durationTicks, toTick)
      return {
        kind: 'note',
        midi: n.midi,
        at: at(start),
        duration: Math.max(SHORTEST_NOTE, (at(end) - at(start)) * LEGATO),
        velocity: n.velocity,
      }
    })

  const metronome: Sound[] = options.metronome
    ? performance.bars.flatMap((bar, index) => {
        const { start, beats } = barGrid(performance, index)
        return Array.from({ length: beats }, (_, k) => k).flatMap((k): Sound[] => {
          const tick = start + k * TICKS_PER_BEAT
          const inBar = tick >= bar.startTick
          return inBar && inPass(tick) ? [{ kind: 'click', at: at(tick), accent: k === 0 }] : []
        })
      })
    : []

  const cues = performance.beatGroups.flatMap((group, beatGroup) =>
    inPass(group.tick) ? [{ beatGroup, at: at(group.tick) }] : [],
  )

  return {
    sounds: [...countIn, ...played, ...metronome].sort((a, b) => a.at - b.at),
    cues,
    end: at(toTick),
    fromTick,
    toTick,
    musicStart,
  }
}

/** One beat group's audible notes, to sound at once (Step mode, a tap on a bar). */
export function beatGroupSounds(
  performance: Performance,
  beatGroup: number,
  options: { readonly tempo: number; readonly hands: Audible },
): NoteSound[] {
  const tempo = checkedTempo(options.tempo)
  const group = performance.beatGroups[beatGroup]
  if (!group) return []
  return group.notes.flatMap((index) => {
    const n = performance.notes[index]
    if (!n || !isAudible(n, options.hands)) return []
    return [
      {
        kind: 'note',
        midi: n.midi,
        at: secondsFor(n.roll, tempo),
        duration: Math.max(SHORTEST_ALONE, secondsFor(n.durationTicks - n.roll, tempo)),
        velocity: n.velocity,
      },
    ]
  })
}

/** How long Wait mode gives a beat group: until the next one sounds, or one beat for the last. */
export function untilNextBeatGroup(
  performance: Performance,
  beatGroup: number,
  options: { readonly tempo: number },
): number {
  const tick = performance.beatGroups[beatGroup]?.tick ?? 0
  const next = performance.beatGroups[beatGroup + 1]?.tick ?? tick + TICKS_PER_BEAT
  return secondsFor(next - tick, options.tempo)
}
