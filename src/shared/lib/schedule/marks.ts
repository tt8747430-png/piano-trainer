import type { PerformanceNote } from '@/shared/lib/arrangement'
import {
  keyScale,
  midi,
  pitchClass,
  pitchClassOf,
  spellScale,
  type Dynamic,
  type Key,
  type Midi,
  type NoteMarks,
} from '@/shared/lib/music'
import type { NoteSound } from './schedule'

/** How loud each dynamic plays a hand, against its arranged loudness (spec 2026-10-20 §4). */
const DYNAMIC_LEVEL: Readonly<Record<Dynamic, number>> = {
  pp: 0.5,
  p: 0.7,
  mp: 0.85,
  mf: 1,
  f: 1.25,
  ff: 1.5,
}
/** Where a hairpin with no dynamic after it ends, against where it began. */
const OPEN_HAIRPIN = { cresc: 1.25, dim: 0.8 } as const
/** A rolled chord's keys follow each other by this, from the lowest up. */
const ROLL_STEP = 0.03
/** A grace note sounds this long, just before its note's beat. */
const GRACE = 0.06
/** An articulated note never sounds shorter than this. */
const SHORTEST = 0.06

export interface MarkTiming {
  /** The key the note is in, whose notes a trill, mordent and turn take. */
  readonly key: Key
  /** A 32nd's seconds at the pass's tempo: an ornament's stroke. */
  readonly thirtySecond: number
  /** The note's whole written length in seconds: a tenuto holds it all. */
  readonly full: number
}

/** The key's note next above or below a key, by step: an ornament's neighbour. */
function neighbour(key: Key, from: Midi, step: 1 | -1): Midi {
  const inKey = new Set(spellScale(key.tonic, keyScale(key)).map((tone) => pitchClassOf(tone.note)))
  for (let m = from + step; ; m += step) if (inKey.has(pitchClass(m))) return midi(m)
}

/** A note's sound and its marks' sounds: its length and loudness, grace notes and ornaments. */
export function markedSounds(
  sound: NoteSound,
  marks: NoteMarks | undefined,
  timing: MarkTiming,
): NoteSound[] {
  if (!marks) return [sound]
  const has = (articulation: NonNullable<NoteMarks['articulations']>[number]) =>
    marks.articulations?.includes(articulation) ?? false
  let { duration, velocity } = sound
  if (has('tenuto')) duration = timing.full
  if (has('staccato')) duration /= 2
  if (has('staccatissimo')) duration /= 4
  if (has('marcato')) duration *= 0.75
  if (has('fermata')) duration *= 1.5
  if (has('accent')) velocity *= 1.3
  if (has('marcato')) velocity *= 1.4
  const main: NoteSound = { ...sound, duration: Math.max(SHORTEST, duration), velocity }

  const grace = (marks.grace ?? []).map((g, i, all): NoteSound => ({
    ...main,
    midi: g.midi,
    at: Math.max(0, main.at - GRACE * (all.length - i)),
    duration: GRACE,
  }))
  return [...grace, ...ornamented(main, marks.ornament, timing)]
}

/** A note played as its ornament: strokes of 32nds, the last holding what is left of it. */
function ornamented(
  main: NoteSound,
  ornament: NoteMarks['ornament'],
  { key, thirtySecond }: MarkTiming,
): NoteSound[] {
  if (!ornament) return [main]
  const strokes = Math.max(1, Math.floor(main.duration / thirtySecond + 1e-9))
  const above = neighbour(key, main.midi, 1)
  const below = neighbour(key, main.midi, -1)
  const keys: readonly Midi[] =
    ornament === 'trill'
      ? Array.from({ length: strokes }, (_, i) => (i % 2 === 0 ? main.midi : above))
      : ornament === 'tremolo'
        ? Array.from({ length: strokes }, () => main.midi)
        : ornament === 'mordent'
          ? [main.midi, above, main.midi]
          : ornament === 'lower-mordent'
            ? [main.midi, below, main.midi]
            : [above, main.midi, below, main.midi]
  const fits = keys.slice(0, strokes)
  return fits.map((m, i) => ({
    ...main,
    midi: m,
    at: main.at + i * thirtySecond,
    duration:
      i === fits.length - 1
        ? Math.max(thirtySecond, main.duration - i * thirtySecond)
        : thirtySecond,
  }))
}

/**
 * Each note's loudness against its arranged velocity: a hand's dynamics set it from where they are on,
 * a hairpin ramps it to the next dynamic, or a step past where it began.
 */
export function loudness(notes: readonly PerformanceNote[]): number[] {
  const levels = notes.map(() => 1)
  const hands = new Set(notes.map((n) => n.hand))
  for (const hand of hands) {
    const order = notes
      .map((n, i) => ({ n, i }))
      .filter(({ n }) => n.hand === hand)
      .sort((a, b) => a.n.startTick - b.n.startTick)
    let level = 1
    let ramp: { from: number; to: number; start: number; end: number } | null = null
    for (const [k, { n, i }] of order.entries()) {
      const marks = n.marks
      if (ramp && n.startTick > ramp.start) {
        const done = n.startTick >= ramp.end
        level = done
          ? ramp.to
          : ramp.from +
            ((ramp.to - ramp.from) * (n.startTick - ramp.start)) / (ramp.end - ramp.start)
        if (done) ramp = null
      }
      if (marks?.dynamic) level = DYNAMIC_LEVEL[marks.dynamic]
      if (marks?.hairpin === 'cresc' || marks?.hairpin === 'dim') {
        const later = order.slice(k + 1).filter(({ n: next }) => next.startTick > n.startTick)
        const stop = later.find(({ n: next }) => next.marks?.dynamic || next.marks?.hairpin)
        const end = stop?.n.startTick ?? later.at(-1)?.n.startTick
        const dynamic = stop?.n.marks?.dynamic
        const to = dynamic ? DYNAMIC_LEVEL[dynamic] : level * OPEN_HAIRPIN[marks.hairpin]
        ramp = end === undefined ? null : { from: level, to, start: n.startTick, end }
      }
      levels[i] = level
    }
  }
  return levels
}

/** Each note's delay in a rolled chord, its hand's keys struck together from the lowest up. */
export function rollOffsets(notes: readonly PerformanceNote[]): number[] {
  return notes.map((n) => {
    if (!n.marks?.arpeggio) return 0
    const below = notes.filter(
      (other) =>
        other.marks?.arpeggio &&
        other.hand === n.hand &&
        other.startTick === n.startTick &&
        other.midi < n.midi,
    )
    return +(below.length * ROLL_STEP).toFixed(3)
  })
}
