import type { ClickSound, ClickVoice } from './schedule'

/** The Metronome's meters (ADR 0113): a beat of 6/8 is an eighth, each counted. */
export const METRONOME_METERS = ['4/4', '3/4', '2/4', '6/8', '1/4'] as const
export type MetronomeMeter = (typeof METRONOME_METERS)[number]

/** What the Metronome sounds on each beat: a click, a beep or a drum beat. */
export const METRONOME_SOUNDS = ['click', 'beep', 'drum'] as const
export type MetronomeSound = (typeof METRONOME_SOUNDS)[number]

/** The tempos the Metronome keeps, in beats a minute. */
export const BPM_RANGE = { min: 30, max: 300 } as const

/** A tempo the Metronome keeps: whole beats a minute, within its range. */
export const clampBpm = (bpm: number): number =>
  Math.min(BPM_RANGE.max, Math.max(BPM_RANGE.min, Math.round(bpm)))

const BEATS: Readonly<Record<MetronomeMeter, number>> = {
  '4/4': 4,
  '3/4': 3,
  '2/4': 2,
  '6/8': 6,
  '1/4': 1,
}

/** How many beats a bar of `meter` counts. */
export const beatsOf = (meter: MetronomeMeter): number => BEATS[meter]

/**
 * A drum beat's bar under the hat on every beat: the kick on the first (and the middle of 4/4), the
 * snare on the backbeat; a waltz's boom-chick-chick, 6/8's two halves.
 */
const DRUMS: Readonly<Record<MetronomeMeter, readonly ('kick' | 'snare' | null)[]>> = {
  '4/4': ['kick', 'snare', 'kick', 'snare'],
  '3/4': ['kick', 'snare', 'snare'],
  '2/4': ['kick', 'snare'],
  '6/8': ['kick', null, null, 'snare', null, null],
  '1/4': ['kick'],
}

const sound = (voice: ClickVoice, accent: boolean): ClickSound => ({
  kind: 'click',
  at: 0,
  accent,
  ...(voice === 'click' ? {} : { voice }),
})

/** What sounds on beat `beat` of a bar of `meter` (from 0), at its start: the first accented. */
export function beatSounds(
  meter: MetronomeMeter,
  kind: MetronomeSound,
  beat: number,
): readonly ClickSound[] {
  const first = beat === 0
  if (kind !== 'drum') return [sound(kind, first)]
  const drum = DRUMS[meter][beat] ?? null
  return [sound('hat', false), ...(drum ? [sound(drum, first)] : [])]
}

/** A beat of the Metronome: when it sounds on the audio clock, and which beat of its bar it is. */
export interface MetronomeBeat {
  readonly at: number
  readonly beat: number
}

/** How the Metronome keeps time: its tempo and its meter. */
export interface MetronomeTime {
  readonly bpm: number
  readonly meter: MetronomeMeter
}

const secondsPerBeat = (bpm: number) => 60 / bpm

/** The beat after `beat`, at the tempo: round the bar. */
const after = (beat: MetronomeBeat, { bpm, meter }: MetronomeTime): MetronomeBeat => ({
  at: beat.at + secondsPerBeat(bpm),
  beat: (beat.beat + 1) % beatsOf(meter),
})

/** The beats from `next` due before `until`, and the beat after them. */
export function plannedBeats(
  next: MetronomeBeat,
  until: number,
  time: MetronomeTime,
): { readonly beats: readonly MetronomeBeat[]; readonly next: MetronomeBeat } {
  const beats: MetronomeBeat[] = []
  let beat = next
  while (beat.at < until) {
    beats.push(beat)
    beat = after(beat, time)
  }
  return { beats, next: beat }
}

/** The beat heard at `now`: the last planned at or before it. */
export const beatHeard = (
  planned: readonly MetronomeBeat[],
  now: number,
): MetronomeBeat | undefined => planned.findLast((beat) => beat.at <= now)

/** How soon a beat sounds that would be due already: long enough to schedule it. */
const SOON = 0.05

/**
 * Where the Metronome goes on when its tempo, meter or sound changes as it plays: a beat at the new
 * tempo after the beat heard (a new bar where the meter changed), never in the past; with no beat
 * heard yet, its bar starts a moment from now.
 */
export function goOnFrom(
  heard: MetronomeBeat | undefined,
  now: number,
  time: MetronomeTime,
  meterChanged: boolean,
): MetronomeBeat {
  if (!heard) return { at: now + SOON, beat: 0 }
  const next = after(heard, time)
  return {
    at: Math.max(next.at, now + SOON),
    beat: meterChanged || heard.beat + 1 >= beatsOf(time.meter) ? 0 : next.beat,
  }
}
