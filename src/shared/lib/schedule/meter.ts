/**
 * The metronome's one model of time (A39, `.scratch/r29/metronome-engine/spec.md`): any time
 * signature, counted as players count it (the dotted beat in 6/8, 9/8 and 12/8; the half in 2/2; an
 * odd meter's eighths grouped, 7/8 as 2+2+3), each beat's level as its square sets it, and a bar's
 * clicks with their subdivision, or the drum groove of the meter.
 */

/** A time signature: beats over the note that counts them. */
export interface Meter {
  readonly top: number
  readonly bottom: number
}

/** The notes a signature may count by. */
const BOTTOMS = [1, 2, 4, 8, 16] as const

/** The most beats a bar may have. */
const MOST_BEATS = 32

/** Reads "7/8"; null for what is no time signature. */
export function parseMeter(text: string): Meter | null {
  const match = /^(\d{1,2})\/(\d{1,2})$/.exec(text.trim())
  if (!match) return null
  const top = Number(match[1])
  const bottom = Number(match[2])
  if (top < 1 || top > MOST_BEATS) return null
  if (!BOTTOMS.some((each) => each === bottom)) return null
  return { top, bottom }
}

export const meterText = ({ top, bottom }: Meter): string => `${top}/${bottom}`

/** A compound meter: its beats dotted, three of its notes to each (6/8, 9/8, 12/8, 6/4). */
const compound = ({ top, bottom }: Meter) => bottom >= 4 && top > 3 && top % 3 === 0

/** An odd meter of eighths or shorter: five, seven or eleven of them, grouped in twos and threes. */
const odd = ({ top, bottom }: Meter) => bottom >= 8 && top > 4 && top % 3 !== 0 && top % 2 !== 0

/** An odd meter's usual grouping: 5 as 3+2, 7 as 2+2+3, the rest in twos closed by a three. */
function usualGroups(top: number): readonly number[] {
  if (top === 5) return [3, 2]
  return [...Array.from({ length: (top - 3) / 2 }, () => 2), 3]
}

/**
 * How a bar of `meter` is counted: its beats (each as many of the signature's notes as it lasts),
 * the note the tempo counts, and where its groups start (beat indexes). `grouping` overrides an odd
 * meter's usual one (5/8 as 2+3) where it adds up.
 */
export function meterBeats(
  meter: Meter,
  grouping?: readonly number[],
): {
  readonly beats: readonly number[]
  readonly unit: number
  readonly groups: readonly number[]
} {
  if (compound(meter))
    return {
      beats: Array.from({ length: meter.top / 3 }, () => 3),
      unit: meter.bottom,
      groups: [0],
    }
  const beats = Array.from({ length: meter.top }, () => 1)
  if (!odd(meter)) return { beats, unit: meter.bottom, groups: [0] }
  const sizes =
    grouping && grouping.reduce((sum, size) => sum + size, 0) === meter.top
      ? grouping
      : usualGroups(meter.top)
  const groups = sizes
    .slice(0, -1)
    .reduce<number[]>((starts, size, i) => [...starts, (starts[i] ?? 0) + size], [0])
  return { beats, unit: meter.bottom, groups }
}

/** A beat square's level: the bar's first, an accent, a beat, or silent. Tapping cycles the last three. */
export type BeatLevel = 'downbeat' | 'accent' | 'normal' | 'silent'

/** The next level of a square tapped: accent · normal · silent, round again. */
export const nextLevel = (level: BeatLevel): BeatLevel =>
  level === 'accent'
    ? 'normal'
    : level === 'normal'
      ? 'silent'
      : level === 'silent'
        ? 'accent'
        : 'normal'

/** A meter's levels before the learner sets any: its first beat the downbeat, each group's an accent. */
export function defaultLevels(meter: Meter, grouping?: readonly number[]): BeatLevel[] {
  const { beats, groups } = meterBeats(meter, grouping)
  return beats.map((_, i) => (i === 0 ? 'downbeat' : groups.includes(i) ? 'accent' : 'normal'))
}

/** The levels the squares show: the learner's while they fit the meter's beats, else its own. */
export function beatLevels(
  meter: Meter,
  set: readonly BeatLevel[] | null,
  grouping?: readonly number[],
): readonly BeatLevel[] {
  const count = meterBeats(meter, grouping).beats.length
  return set && set.length === count ? set : defaultLevels(meter, grouping)
}

/** What sounds between the beats. */
export const SUBDIVISIONS = ['none', '8ths', 'triplets', '16ths', 'swing'] as const
export type Subdivision = (typeof SUBDIVISIONS)[number]

/** How many clicks a beat of `size` notes holds under a subdivision, and where (as parts of it). */
function partsOf(size: number, unit: number, subdivision: Subdivision): readonly number[] {
  const even = (count: number) => Array.from({ length: count }, (_, i) => i / count)
  if (subdivision === 'none') return [0]
  // A dotted beat holds its three notes; 16ths split each.
  if (size === 3) return subdivision === '16ths' ? even(6) : even(3)
  // A beat of an eighth or shorter is subdivided only into its halves.
  if (unit >= 8)
    return subdivision === '16ths' ? even(2) : subdivision === 'swing' ? [0, 2 / 3] : [0]
  if (subdivision === '8ths') return even(2)
  if (subdivision === 'triplets') return even(3)
  if (subdivision === '16ths') return even(4)
  return [0, 2 / 3]
}

/** The kit a groove strikes. */
export type DrumVoice = 'kick' | 'snare' | 'hat'

/** A click of a bar: when (seconds from the bar's start), its beat, its level, what a drum kit strikes. */
export interface BarClick {
  readonly at: number
  readonly beat: number
  readonly level: Exclude<BeatLevel, 'silent'> | 'sub'
  readonly voices: readonly DrumVoice[]
}

/** The kick and snare of each beat: rock in 4, a waltz in 3, the backbeat in 2, odd meters by group. */
function groove(beats: number, groups: readonly number[], beat: number): DrumVoice | null {
  if (groups.length > 1) return beat === 0 ? 'kick' : groups.includes(beat) ? 'snare' : null
  if (beats === 3) return beat === 0 ? 'kick' : 'snare'
  if (beats === 4) return beat % 2 === 0 ? 'kick' : 'snare'
  if (beats === 2) return beat === 0 ? 'kick' : 'snare'
  return beat === 0 ? 'kick' : null
}

/**
 * A bar's clicks at `secondsPerBeat` (the tempo's beat: dotted in compound meters): each beat at
 * its level, its subdivisions after it, a silent beat left out whole. With `drums`, each click
 * carries the groove: the kick and snare on the beats, the hat on 8ths (or the subdivision chosen).
 */
export function barClicks({
  meter,
  levels,
  subdivision,
  secondsPerBeat,
  grouping,
  drums = false,
}: {
  meter: Meter
  levels: readonly BeatLevel[] | null
  subdivision: Subdivision
  secondsPerBeat: number
  grouping?: readonly number[]
  drums?: boolean
}): BarClick[] {
  const { beats, unit, groups } = meterBeats(meter, grouping)
  const shown = beatLevels(meter, levels, grouping)
  // A groove's hat runs on 8ths where no subdivision is asked.
  const heard = drums && subdivision === 'none' ? '8ths' : subdivision
  return beats.flatMap((size, beat) => {
    const level = shown[beat] ?? 'normal'
    if (level === 'silent') return []
    const kicked = drums ? groove(beats.length, groups, beat) : null
    return partsOf(size, unit, heard).map((part, i): BarClick => {
      const at = (beat + part) * secondsPerBeat
      if (i === 0)
        return { at, beat, level, voices: drums ? [...(kicked ? [kicked] : []), 'hat'] : [] }
      return { at, beat, level: 'sub', voices: drums ? ['hat'] : [] }
    })
  })
}

/** How loud a click of each level sounds, the downbeat the loudest. */
export const LEVEL_GAIN: Readonly<Record<BarClick['level'], number>> = {
  downbeat: 1,
  accent: 0.85,
  normal: 0.6,
  sub: 0.35,
}

/**
 * The speed trainer (A39, as Pro Metronome's): from one tempo toward another by `step` beats a
 * minute every `every` bars, then held there.
 */
export interface SpeedTrainer {
  readonly from: number
  readonly to: number
  readonly step: number
  readonly every: number
}

/** The tempo of bar `bar` (from 0) under the speed trainer. */
export function speedAt(bar: number, { from, to, step, every }: SpeedTrainer): number {
  const steps = Math.floor(bar / Math.max(1, every))
  const moved = from + Math.sign(to - from) * Math.abs(step) * steps
  return to >= from ? Math.min(to, moved) : Math.max(to, moved)
}
