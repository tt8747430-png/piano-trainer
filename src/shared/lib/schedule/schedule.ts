import {
  TICKS_PER_BEAT,
  type NoteHand,
  type Performance,
  type PerformanceNote,
  type Tick,
} from '@/shared/lib/arrangement'
import type { Midi } from '@/shared/lib/music'

/** Which hands the learner hears: both, or one of them. */
export type Hands = 'both' | 'rh' | 'lh'
export type Audible = Readonly<Record<NoteHand, boolean>>

/** The one table of which hands each choice plays; the doubled tune always sounds. */
const AUDIBLE: Readonly<Record<Hands, Audible>> = {
  both: { rh: true, lh: true, melody: true },
  rh: { rh: true, lh: false, melody: true },
  lh: { rh: false, lh: true, melody: true },
}

export const audibleHands = (hands: Hands): Audible => AUDIBLE[hands]

/** The tempos a learner can choose, in beats per minute. */
export const TEMPO_RANGE = { min: 40, max: 160 } as const

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
  readonly countIn?: boolean
  readonly metronome?: boolean
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

/** One pass through the piece from `fromTick`: its notes, clicks and cues in seconds from its start. */
export function schedule(performance: Performance, options: ScheduleOptions): Scheduled {
  const { hands, fromTick = 0 } = options
  const tempo = checkedTempo(options.tempo)
  const beat = secondsFor(TICKS_PER_BEAT, tempo)
  const countIn: Sound[] = options.countIn
    ? Array.from({ length: performance.beatsPerBar }, (_, k) => ({
        kind: 'click',
        at: k * beat,
        accent: k === 0,
      }))
    : []
  const musicStart = countIn.length * beat
  const at = (tick: Tick) => musicStart + secondsFor(tick - fromTick, tempo)

  const played: Sound[] = performance.notes
    .filter((n) => n.startTick >= fromTick && isAudible(n, hands))
    .map((n) => ({
      kind: 'note',
      midi: n.midi,
      at: at(n.startTick),
      duration: Math.max(SHORTEST_NOTE, secondsFor(n.durationTicks, tempo) * LEGATO),
      velocity: n.velocity,
    }))

  const metronome: Sound[] = options.metronome
    ? performance.bars.flatMap((bar) =>
        Array.from({ length: Math.ceil(bar.beats) }, (_, k) => k).flatMap((k): Sound[] => {
          const tick = bar.startTick + k * TICKS_PER_BEAT
          return tick >= fromTick ? [{ kind: 'click', at: at(tick), accent: k === 0 }] : []
        }),
      )
    : []

  const cues = performance.beatGroups.flatMap((group, beatGroup) =>
    group.tick >= fromTick ? [{ beatGroup, at: at(group.tick) }] : [],
  )

  return {
    sounds: [...countIn, ...played, ...metronome].sort((a, b) => a.at - b.at),
    cues,
    end: at(performance.totalTicks),
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
        at: 0,
        duration: Math.max(SHORTEST_ALONE, secondsFor(n.durationTicks, tempo)),
        velocity: n.velocity,
      },
    ]
  })
}

/** How long Your turn gives a beat group: until the next one sounds, or one beat for the last. */
export function untilNextBeatGroup(
  performance: Performance,
  beatGroup: number,
  options: { readonly tempo: number },
): number {
  const tick = performance.beatGroups[beatGroup]?.tick ?? 0
  const next = performance.beatGroups[beatGroup + 1]?.tick ?? tick + TICKS_PER_BEAT
  return secondsFor(next - tick, options.tempo)
}
