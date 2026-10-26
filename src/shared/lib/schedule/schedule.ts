import type { NoteHand, Performance, PerformanceNote } from '@/shared/lib/arrangement'
import { isCompound, TICKS_PER_BEAT, type Midi, type Tick } from '@/shared/lib/music'
import {
  barClicks,
  barGrid,
  checkedTempo,
  countInBeats,
  secondsFor,
  type BarsInMeter,
} from './grid'
import { joinedNotes } from './legato'
import { loudness, markedSounds, rollOffsets } from './marks'
import { pedalHeld } from './pedal-marks'
import { swingTick } from './swing'
import { tempoWarp } from './tempo-marks'

/** Which hands the learner hears: both, or one of them. */
export const HANDS = ['both', 'rh', 'lh'] as const
export type Hands = (typeof HANDS)[number]
export type Audible = Readonly<Record<NoteHand, boolean>>

/** The one table of which hands each choice plays; the staves over the piano always sound (ADR 0097). */
const AUDIBLE: Readonly<Record<Hands, Audible>> = {
  both: { rh: true, lh: true, staff: true },
  rh: { rh: true, lh: false, staff: true },
  lh: { rh: false, lh: true, staff: true },
}

export const audibleHands = (hands: Hands): Audible => AUDIBLE[hands]

/**
 * The tempos a learner can choose, in beats per minute: half the slowest a piece is written at (40)
 * to twice the fastest (160), the learner's speed running from 50% to 200% of a piece's (ADR 0105).
 */
export const TEMPO_RANGE = { min: 20, max: 320 } as const

export interface NoteSound {
  readonly kind: 'note'
  readonly midi: Midi
  /** Seconds after the pass's time 0. */
  readonly at: number
  readonly duration: number
  readonly velocity: number
  /**
   * The part of a piece's music it is, its hand or a staff over the piano, which the Player's mix
   * turns up or down (ADR 0105); none for a sound of no piece's (a chord tapped, a run).
   */
  readonly part?: NoteHand
}
export interface ClickSound {
  readonly kind: 'click'
  readonly at: number
  readonly accent: boolean
}
export type Sound = NoteSound | ClickSound

interface ScheduleOptions {
  /** Beats per minute. */
  readonly tempo: number
  readonly hands: Audible
  /** Where in the piece the pass begins; 0 by default. */
  readonly fromTick?: Tick
  /** Where it ends: the piece's end by default. A note sounding past it is cut there. */
  readonly toTick?: Tick
  /** A bar counted in before the music, a click on each of its beats. */
  readonly countIn?: boolean
  /** A click on every beat of the music. */
  readonly metronome?: boolean
  /**
   * Whether the count-in and the metronome sound their clicks, true unless said: with the click
   * turned right down (ADR 0105) a count-in still counts its bar, unheard.
   */
  readonly clicks?: boolean
  /** Off-beat 8ths late, long-short; a compound meter never swings. */
  readonly swing?: boolean
}

/** When each beat group sounds, so the Player can follow the music. */
export interface Cue {
  readonly beatGroup: number
  /** The beat group's tick, where the playhead stands as it sounds. */
  readonly tick: Tick
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
  /** When each beat of its count-in sounds, after the pass's start, clicked or not; none without one. */
  readonly counts: readonly number[]
}

/** A note never sounds shorter than this in a pass… */
const SHORTEST_NOTE = 0.15
/** …nor than this when one beat group is sounded on its own. */
const SHORTEST_ALONE = 0.35
/** Notes in a pass release a little early, so repeated notes are heard as two. */
const LEGATO = 0.95
/** A joined note (under a slur, or legato) holds to the next, overlapping it as a pianist's fingers do. */
const JOINED = 1.03

/** Whether a note sounds: its hand's or its staff's heard, and not written silent (ADR 0097). */
export const isAudible = (n: PerformanceNote, hands: Audible): boolean =>
  hands[n.hand] && n.silent !== true

/**
 * Where a tick sounds swung, on its bar's beats: a pickup's beats are the full bar's it ends, and a
 * short bar's start from its own first beat (`barGrid`), so every beat after either stays a beat.
 */
function swungOnGrid(music: BarsInMeter, tick: Tick): number {
  const index = Math.max(
    0,
    music.bars.findLastIndex((bar) => bar.startTick <= tick),
  )
  const origin = barGrid(music, index).start
  return origin + swingTick(tick - origin)
}

/** Where a tick sounds, in ticks: swung on its bar's beats when asked, straight in a compound meter. */
const placement = (performance: Performance, swing: boolean | undefined) =>
  swing && !isCompound(performance.meter)
    ? (tick: Tick) => swungOnGrid(performance, tick)
    : (tick: Tick) => tick

/** The key a tick is played in: its bar's, else the piece's. */
const keyAt = (performance: Performance, tick: Tick) =>
  performance.bars.findLast((bar) => bar.startTick <= tick)?.key ?? performance.key

/** One pass through the piece from `fromTick` to `toTick`: its notes, clicks and cues in seconds from its start. */
export function schedule(performance: Performance, options: ScheduleOptions): Scheduled {
  const { hands, fromTick = 0, toTick = performance.totalTicks } = options
  const tempo = checkedTempo(options.tempo)
  // Swung where asked, then held back or pressed on where the notes mark the tempo (ADR 0068).
  const swung = placement(performance, options.swing)
  const marked = performance.timing ?? performance.notes
  const warp = tempoWarp(marked)
  const place = (tick: Tick) => warp(swung(tick))
  const pedal = pedalHeld(marked)
  const counted = options.countIn ? countInBeats(performance, fromTick) : []
  const musicStart = secondsFor(place(fromTick) - place(counted[0]?.tick ?? fromTick), tempo)
  const at = (tick: Tick) => musicStart + secondsFor(place(tick) - place(fromTick), tempo)
  const clicked = options.clicks !== false
  const countIn: Sound[] = clicked
    ? counted.map(({ tick, accent }) => ({ kind: 'click', at: at(tick), accent }))
    : []
  const inPass = (tick: Tick) => tick >= fromTick && tick < toTick

  // A note still held where the pass starts sounds from there, for what is left of it.
  const heard = (n: PerformanceNote) =>
    inPass(n.startTick) || (n.startTick < fromTick && n.startTick + n.durationTicks > fromTick)
  // The notes' marks (ADR 0063): their dynamics, rolls, lengths, grace notes and ornaments.
  const levels = loudness(performance.notes)
  const rolls = rollOffsets(performance.notes)
  const thirtySecond = secondsFor(TICKS_PER_BEAT / 8, tempo)
  const joined = joinedNotes(performance.notes)
  const played: Sound[] = performance.notes.flatMap((n, i) => {
    if (!heard(n) || !isAudible(n, hands)) return []
    const start = Math.max(fromTick, n.startTick)
    // Under the pedal a note sounds on until it is let up.
    const released = pedal(n.startTick) ?? 0
    const end = Math.min(Math.max(n.startTick + n.durationTicks, released), toTick)
    const full = at(end) - at(start)
    const sound = {
      kind: 'note' as const,
      midi: n.midi,
      at: at(start) + (rolls[i] ?? 0),
      duration: Math.max(SHORTEST_NOTE, full * (joined.has(i) ? JOINED : LEGATO)),
      velocity: n.velocity * (levels[i] ?? 1),
      part: n.hand,
    }
    // A note held over from before the pass sounds plainly: its marks were where it began.
    const marks = n.startTick >= fromTick ? n.marks : undefined
    return markedSounds(sound, marks, { key: keyAt(performance, n.startTick), thirtySecond, full })
  })

  const metronome: Sound[] =
    options.metronome && clicked
      ? performance.bars.flatMap((_, index) =>
          barClicks(performance, index).flatMap(({ tick, accent }): Sound[] =>
            inPass(tick) ? [{ kind: 'click', at: at(tick), accent }] : [],
          ),
        )
      : []

  const cues = performance.beatGroups.flatMap((group, beatGroup) =>
    inPass(group.tick) ? [{ beatGroup, tick: group.tick, at: at(group.tick) }] : [],
  )

  return {
    sounds: [...countIn, ...played, ...metronome].sort((a, b) => a.at - b.at),
    cues,
    end: at(toTick),
    fromTick,
    toTick,
    musicStart,
    counts: counted.map(({ tick }) => at(tick)),
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
        part: n.hand,
      },
    ]
  })
}

/**
 * How long Wait mode gives a beat group: until the next one sounds, or one beat for the last, on the
 * grid `schedule` plays it on (swung when asked).
 */
export function untilNextBeatGroup(
  performance: Performance,
  beatGroup: number,
  options: { readonly tempo: number; readonly swing?: boolean },
): number {
  const place = placement(performance, options.swing)
  const tick = performance.beatGroups[beatGroup]?.tick ?? 0
  const next = performance.beatGroups[beatGroup + 1]?.tick ?? tick + TICKS_PER_BEAT
  return secondsFor(place(next) - place(tick), options.tempo)
}
