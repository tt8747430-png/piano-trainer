import type { PerformanceNote } from '@/shared/lib/arrangement'
import {
  keyScale,
  isBlackKey,
  midi,
  pitchClass,
  pitchClassOf,
  spellScale,
  tremoloStrokes,
  type Dynamic,
  type Key,
  type Midi,
  type NoteMarks,
  type TremoloStrokes,
} from '@/shared/lib/music'
import type { NoteSound } from './schedule'

/** How loud each level plays a hand, against its arranged loudness. */
const LEVEL = { ppp: 0.4, pp: 0.5, p: 0.7, mp: 0.85, mf: 1, f: 1.25, ff: 1.5, fff: 1.75 } as const

/**
 * How each dynamic plays (ADR 0097): a level held from its note on; an accent striking its note
 * alone harder than the level around it; or a note struck at one level and the next held at another.
 */
const DYNAMIC_PLAY: Readonly<
  Record<Dynamic, { readonly level?: number; readonly stress?: number; readonly strike?: number }>
> = {
  ppp: { level: LEVEL.ppp },
  pp: { level: LEVEL.pp },
  p: { level: LEVEL.p },
  mp: { level: LEVEL.mp },
  mf: { level: LEVEL.mf },
  f: { level: LEVEL.f },
  ff: { level: LEVEL.ff },
  fff: { level: LEVEL.fff },
  sf: { stress: 1.5 },
  sfz: { stress: 1.5 },
  fz: { stress: 1.5 },
  sffz: { stress: 1.8 },
  rf: { stress: 1.35 },
  rfz: { stress: 1.35 },
  fp: { strike: LEVEL.f, level: LEVEL.p },
  sfp: { strike: LEVEL.ff, level: LEVEL.p },
  sfpp: { strike: LEVEL.ff, level: LEVEL.pp },
  pf: { strike: LEVEL.p, level: LEVEL.f },
}
/** How much harder an accent and a marcato strike their note. */
const ACCENT = 1.3
const MARCATO = 1.4
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
  /** The next note on its staff, where a glissando slides to. */
  readonly glissTo?: Midi
  /** A two-note tremolo's partner, and the seconds from the note's start to the partner's end. */
  readonly tremoloWith?: { readonly midi: Midi; readonly full: number }
}

/** The key's note next above or below a key, by step: an ornament's neighbour. */
function neighbour(key: Key, from: Midi, step: 1 | -1): Midi {
  const inKey = new Set(spellScale(key.tonic, keyScale(key)).map((tone) => pitchClassOf(tone.note)))
  for (let m = from + step; ; m += step) if (inKey.has(pitchClass(m))) return midi(m)
}

/** How much harder a note's marks strike it than it is arranged: an accent, a marcato, or both. */
export const stressOf = (marks: NoteMarks | undefined): number =>
  (marks?.articulations?.includes('accent') ? ACCENT : 1) *
  (marks?.articulations?.includes('marcato') ? MARCATO : 1)

/** A note's sound and its marks' sounds: its length and loudness, grace notes and ornaments. */
export function markedSounds(
  sound: NoteSound,
  marks: NoteMarks | undefined,
  timing: MarkTiming,
): NoteSound[] {
  if (!marks) return [sound]
  const has = (articulation: NonNullable<NoteMarks['articulations']>[number]) =>
    marks.articulations?.includes(articulation) ?? false
  let { duration } = sound
  if (has('tenuto')) duration = timing.full
  if (has('staccato')) duration /= 2
  if (has('staccatissimo')) duration /= 4
  if (has('marcato')) duration *= 0.75
  if (has('portato')) duration *= 0.75
  if (has('fermata')) duration *= 1.5
  // A breath mark leaves a 16th's silence before the next note, a caesura half the note.
  if (has('breath')) duration -= 2 * timing.thirtySecond
  if (has('caesura')) duration /= 2
  const main: NoteSound = {
    ...sound,
    duration: Math.max(SHORTEST, duration),
    velocity: sound.velocity * stressOf(marks),
  }

  const grace = (marks.grace ?? []).map((g, i, all): NoteSound => ({
    ...main,
    midi: g.midi,
    at: Math.max(0, main.at - GRACE * (all.length - i)),
    duration: GRACE,
  }))
  const partner = timing.tremoloWith
  if (marks.twoNoteTremolo && partner)
    return [...grace, ...twoNoteTremolo(main, partner, marks.twoNoteTremolo, timing)]
  const glissTo = timing.glissTo
  if (marks.glissando && glissTo !== undefined && glissTo !== main.midi)
    return [...grace, ...glissando(main, glissTo, timing)]
  return [...grace, ...ornamented(main, marks.ornament, timing)]
}

/**
 * A glissando: the white keys from the note towards the next, the next itself left to sound as its
 * own note, spread evenly over the note's length.
 */
function glissando(main: NoteSound, to: Midi, { thirtySecond }: MarkTiming): NoteSound[] {
  const step = to > main.midi ? 1 : -1
  const keys: Midi[] = [main.midi]
  for (let m = main.midi + step; m !== to; m += step) if (!isBlackKey(midi(m))) keys.push(midi(m))
  const each = Math.max(Math.min(thirtySecond, 0.05), main.duration / keys.length)
  return keys.map((m, i) => ({ ...main, midi: m, at: main.at + i * each, duration: each }))
}

/**
 * A two-note tremolo: the note and its partner in turn, in 8ths, 16ths or 32nds by its strokes, from
 * the note's start to the partner's end.
 */
function twoNoteTremolo(
  main: NoteSound,
  partner: NonNullable<MarkTiming['tremoloWith']>,
  strokes: TremoloStrokes,
  { thirtySecond }: MarkTiming,
): NoteSound[] {
  const stroke = thirtySecond * 2 ** (3 - strokes)
  const count = Math.max(2, Math.floor(partner.full / stroke + 1e-9))
  return Array.from({ length: count }, (_, i) => ({
    ...main,
    midi: i % 2 === 0 ? main.midi : partner.midi,
    at: main.at + i * stroke,
    duration: stroke,
  }))
}

/** A note played as its ornament: strokes of 32nds, the last holding what is left of it. */
function ornamented(
  main: NoteSound,
  ornament: NoteMarks['ornament'],
  { key, thirtySecond }: MarkTiming,
): NoteSound[] {
  if (!ornament) return [main]
  // A tremolo repeats its note in 8ths, 16ths or 32nds by its strokes; the rest stroke in 32nds.
  const tremolo = tremoloStrokes(ornament)
  const stroke = tremolo ? thirtySecond * 2 ** (3 - tremolo) : thirtySecond
  const strokes = Math.max(1, Math.floor(main.duration / stroke + 1e-9))
  const above = neighbour(key, main.midi, 1)
  const below = neighbour(key, main.midi, -1)
  const keys: readonly Midi[] =
    ornament === 'trill'
      ? Array.from({ length: strokes }, (_, i) => (i % 2 === 0 ? main.midi : above))
      : tremolo
        ? Array.from({ length: strokes }, () => main.midi)
        : ornament === 'mordent'
          ? [main.midi, above, main.midi]
          : ornament === 'lower-mordent'
            ? [main.midi, below, main.midi]
            : ornament === 'inverted-turn'
              ? [below, main.midi, above, main.midi]
              : [above, main.midi, below, main.midi]
  const fits = keys.slice(0, strokes)
  return fits.map((m, i) => ({
    ...main,
    midi: m,
    at: main.at + i * stroke,
    duration: i === fits.length - 1 ? Math.max(stroke, main.duration - i * stroke) : stroke,
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
      const play = marks?.dynamic ? DYNAMIC_PLAY[marks.dynamic] : {}
      const struck = play.strike ?? level * (play.stress ?? 1)
      if (play.level !== undefined) level = play.level
      if (marks?.hairpin === 'cresc' || marks?.hairpin === 'dim') {
        const later = order.slice(k + 1).filter(({ n: next }) => next.startTick > n.startTick)
        const stop = later.find(({ n: next }) => next.marks?.dynamic || next.marks?.hairpin)
        const end = stop?.n.startTick ?? later.at(-1)?.n.startTick
        const dynamic = stop?.n.marks?.dynamic
        const to =
          (dynamic && (DYNAMIC_PLAY[dynamic].strike ?? DYNAMIC_PLAY[dynamic].level)) ||
          level * OPEN_HAIRPIN[marks.hairpin]
        ramp = end === undefined ? null : { from: level, to, start: n.startTick, end }
      }
      levels[i] = play.level !== undefined && play.strike === undefined ? level : struck
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

/**
 * Each two-note tremolo's partner (ADR 0097), by its index: the note of its part's next onset
 * nearest its pitch, which sounds only in the tremolo; none for another note.
 */
export function tremoloPartners(notes: readonly PerformanceNote[]): (number | undefined)[] {
  return notes.map((n) => {
    if (!n.marks?.twoNoteTremolo) return undefined
    const later = notes.flatMap((other, index) =>
      other.hand === n.hand && other.staff === n.staff && other.startTick > n.startTick
        ? [{ other, index }]
        : [],
    )
    const next = Math.min(...later.map(({ other }) => other.startTick))
    return later
      .filter(({ other }) => other.startTick === next)
      .sort((a, b) => Math.abs(a.other.midi - n.midi) - Math.abs(b.other.midi - n.midi))[0]?.index
  })
}

/**
 * Where each note marked glissando slides to (ADR 0097): the note of its part's next onset nearest
 * its pitch; none for another note, or one with no note after it.
 */
export function glissandoTargets(notes: readonly PerformanceNote[]): (Midi | undefined)[] {
  return notes.map((n) => {
    if (!n.marks?.glissando) return undefined
    const later = notes.filter(
      (other) => other.hand === n.hand && other.staff === n.staff && other.startTick > n.startTick,
    )
    const next = Math.min(...later.map((other) => other.startTick))
    return later
      .filter((other) => other.startTick === next)
      .sort((a, b) => Math.abs(a.midi - n.midi) - Math.abs(b.midi - n.midi))[0]?.midi
  })
}
