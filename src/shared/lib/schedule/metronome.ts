import {
  barClicks,
  LEVEL_GAIN,
  meterBeats,
  parseMeter,
  type BeatLevel,
  type DrumVoice,
  type Subdivision,
} from './meter'
import type { ClickSound, DrumSound, KitPiece } from './schedule'

/**
 * The meters the Metronome offers in its menu (A39); any signature `parseMeter` reads is kept, the
 * tempo counting the beat players count (the dotted beat in 6/8, 9/8, 12/8; the half in 2/2).
 */
export const METRONOME_METERS = [
  '2/4',
  '3/4',
  '4/4',
  '5/4',
  '6/4',
  '2/2',
  '3/8',
  '5/8',
  '6/8',
  '7/8',
  '9/8',
  '12/8',
] as const
/** A meter the Metronome keeps, as its signature's text. */
export type MetronomeMeter = string
/** Whether `value` is a time signature the Metronome can count. */
export const isMetronomeMeter = (value: unknown): value is MetronomeMeter =>
  typeof value === 'string' && parseMeter(value) !== null

/** What the Metronome sounds on each beat: a click, a beep or a drum groove. */
export const METRONOME_SOUNDS = ['click', 'beep', 'drum'] as const
export type MetronomeSound = (typeof METRONOME_SOUNDS)[number]

/** The tempos the Metronome keeps, in beats a minute. */
export const BPM_RANGE = { min: 30, max: 300 } as const

/** A tempo the Metronome keeps: whole beats a minute, within its range. */
export const clampBpm = (bpm: number): number =>
  Math.min(BPM_RANGE.max, Math.max(BPM_RANGE.min, Math.round(bpm)))

const meterOf = (meter: MetronomeMeter) => parseMeter(meter) ?? '4/4'

/** How many beats a bar of `meter` counts: the beats the tempo counts (two in 6/8). */
export const beatsOf = (meter: MetronomeMeter): number => meterBeats(meterOf(meter)).beats.length

/** How the Metronome sounds a bar: its levels, subdivision and sound. */
export interface MetronomeVoice {
  readonly meter: MetronomeMeter
  readonly sound: MetronomeSound
  /** Each beat's level as its square sets it; null for the meter's own. */
  readonly levels: readonly BeatLevel[] | null
  readonly subdivision: Subdivision
}

/** A drum groove's loudness: its kick and snare, its hat on the beat and off it. */
const DRUM_GAIN = { drum: 1, backbeat: 0.9, hat: 0.8, offbeat: 0.55 } as const

/** The kit's piece each voice of the groove strikes. */
const KIT_OF: Readonly<Record<DrumVoice, KitPiece>> = {
  kick: 'kick',
  snare: 'snare',
  hat: 'hatClosed',
}

/**
 * What sounds on beat `beat` of a bar (from 0), at its offsets from the beat's start: the beat at
 * its level, its subdivisions softer; a drum groove's kick, snare and hat; nothing on a silent beat.
 */
export function beatSounds(
  { meter, sound, levels, subdivision }: MetronomeVoice,
  beat: number,
  secondsPerBeat: number,
): readonly (ClickSound | DrumSound)[] {
  const clicks = barClicks({
    meter: meterOf(meter),
    levels,
    subdivision,
    secondsPerBeat,
    drums: sound === 'drum',
  }).filter((click) => click.beat === beat)
  return clicks.flatMap((click): (ClickSound | DrumSound)[] => {
    const at = click.at - beat * secondsPerBeat
    const accent = click.level === 'downbeat' || click.level === 'accent'
    const gain = LEVEL_GAIN[click.level]
    if (sound !== 'drum')
      return [{ kind: 'click', at, accent, gain, ...(sound === 'click' ? {} : { voice: sound }) }]
    // The groove on the recorded kit (R29 SND): the kick and snare as strong as the bar's first, a
    // square's accent striking them hardest; the closed hat under them, softer off the beat.
    return click.voices.map((voice) => ({
      kind: 'drum',
      at,
      piece: KIT_OF[voice],
      velocity:
        voice === 'hat'
          ? click.level === 'sub'
            ? DRUM_GAIN.offbeat
            : DRUM_GAIN.hat
          : accent
            ? DRUM_GAIN.drum
            : DRUM_GAIN.backbeat,
    }))
  })
}

/**
 * A beat of the Metronome: when it sounds on the audio clock, which beat of its bar it is, and which
 * bar since it started (for the bar trainer).
 */
export interface MetronomeBeat {
  readonly at: number
  readonly beat: number
  readonly bar: number
}

/** The bar trainer's counts: bars played, then bars muted, each from 1 to 8. */
export const TRAINER_BARS = [1, 2, 3, 4, 5, 6, 7, 8] as const
export type TrainerBars = (typeof TRAINER_BARS)[number]

/** The bar trainer (ADR 0052): `play` bars heard, then `mute` bars silent, round and round. */
export interface BarTrainer {
  readonly play: TrainerBars
  readonly mute: TrainerBars
}

/** Whether bar `bar` (from 0, since the start) is silent under the bar trainer; none while it is off. */
export const mutedBar = (bar: number, trainer: BarTrainer | null): boolean =>
  trainer !== null && bar % (trainer.play + trainer.mute) >= trainer.play

/** How the Metronome keeps time: its tempo and its meter. */
export interface MetronomeTime {
  readonly bpm: number
  readonly meter: MetronomeMeter
  /** The tempo of each bar where it changes as it goes (the speed trainer); `bpm` throughout else. */
  readonly bpmAt?: (bar: number) => number
}

const secondsPerBeat = (bpm: number) => 60 / bpm

/** The beat after `beat`, at the tempo: round the bar, into the next. */
function after(beat: MetronomeBeat, { bpm, meter, bpmAt }: MetronomeTime): MetronomeBeat {
  const next = (beat.beat + 1) % beatsOf(meter)
  const tempo = bpmAt ? bpmAt(beat.bar) : bpm
  return { at: beat.at + secondsPerBeat(tempo), beat: next, bar: beat.bar + (next === 0 ? 1 : 0) }
}

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
  if (!heard) return { at: now + SOON, beat: 0, bar: 0 }
  const next = after(heard, time)
  const newBar = meterChanged || heard.beat + 1 >= beatsOf(time.meter)
  return {
    at: Math.max(next.at, now + SOON),
    beat: newBar ? 0 : next.beat,
    bar: heard.bar + (newBar ? 1 : 0),
  }
}
