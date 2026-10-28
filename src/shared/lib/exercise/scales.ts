import {
  fingeringsOf,
  midi,
  kindComingDown,
  PIANO,
  pitchClassOf,
  type Midi,
  ownFingering,
  runFingering,
  scaleKey,
  spellScale,
  type Fingering,
  type Hand,
  type ScaleKind,
  type SpelledNote,
} from '@/shared/lib/music'
import type { Performance } from '@/shared/lib/arrangement'
import {
  fingered,
  inEighths,
  handBelow,
  leftHandBelow,
  range,
  scaleDegrees,
  tonicChord,
  tonicKey,
  upAndBack,
  type Played,
} from './line'
import { exercisePerformance, type LineNote } from './performance'

interface ScaleRun {
  readonly root: SpelledNote
  readonly kind: ScaleKind
  readonly octaves: number
}

/** A scale's music: in its key, over its tonic chord. */
export function overTonic(run: ScaleRun, notes: readonly LineNote[]): Performance {
  return exercisePerformance({
    key: scaleKey(run.root, run.kind),
    notes,
    harmony: [{ chord: tonicChord(run.root, run.kind), startTick: 0 }],
  })
}

/** The octaves a hand may start a scale run in, by scientific pitch: C1 to C7. */
export const HAND_OCTAVES = [1, 2, 3, 4, 5, 6, 7] as const

/** Where each hand starts its run: the octave its tonic is in (4 for middle C's). */
export interface HandOctaves {
  readonly rh: number
  readonly lh: number
}

/** A run from degree `start`. */
type StartedRun = ScaleRun & { readonly start: number }

/** The key a hand's tonic stands on, in an octave. */
const tonicIn = (root: SpelledNote, octave: number): Midi =>
  midi(12 * (octave + 1) + pitchClassOf(root))

/** The octave a key's tonic is in. */
const octaveOfKey = (key: Midi): number => Math.floor(key / 12) - 1

/** Each hand's own start: the right hand where the run fits from middle C's octave, the left below. */
function ownTonics(run: StartedRun): HandOctaves {
  const tonic = tonicKey(
    run.root,
    run.octaves,
    spellScale(run.root, run.kind)[run.start]?.semitones,
  )
  return { rh: tonic, lh: tonic - leftHandBelow(run.octaves) }
}

/** Each hand's own start octave, as the run plays where nothing is asked. */
export function ownHandOctaves(run: StartedRun): HandOctaves {
  const own = ownTonics(run)
  return { rh: octaveOfKey(midi(own.rh)), lh: octaveOfKey(midi(own.lh)) }
}

/** The lowest and highest keys a run from a tonic plays, up and back as its kind comes down. */
function runSpan(run: StartedRun, tonic: Midi): { low: number; high: number } {
  const count = spellScale(run.root, run.kind).length
  const degrees = range(run.start, run.start + count * run.octaves)
  const keys = [run.kind, kindComingDown(run.kind)].flatMap((kind) =>
    degrees.map(scaleDegrees(run.root, kind, tonic)).map((key) => key.midi),
  )
  return { low: Math.min(...keys), high: Math.max(...keys) }
}

/** Where a run from an octave would leave the keyboard; none where it fits. */
function outOfKeys(run: StartedRun, octave: number): 'above' | 'below' | undefined {
  const { low, high } = runSpan(run, tonicIn(run.root, octave))
  return high > PIANO.to ? 'above' : low < PIANO.from ? 'below' : undefined
}

/**
 * The octaves a hand may start a run in, each with where its run would leave the keyboard where it
 * would (`out`): shown greyed with that reason, never left out.
 */
export function handOctaves(
  run: StartedRun,
): readonly { readonly octave: number; readonly out?: 'above' | 'below' }[] {
  return HAND_OCTAVES.map((octave) => {
    const out = outOfKeys(run, octave)
    return out ? { octave, out } : { octave }
  })
}

/**
 * The scale up `octaves` octaves from degree `start` and back in 8ths, the left hand below the right:
 * fingered as the scale or from the thumb (a fingering the scale cannot take is its own), and coming
 * down as the scale comes down (melodic minor as natural minor).
 */
export function scaleExercise(run: FingeredRun): Performance {
  return overTonic(run, inEighths(scaleRunHands(run)))
}

/** A run as a scale exercise takes it: from where, fingered how, each hand starting where. */
export type FingeredRun = StartedRun & {
  readonly fingering: Fingering
  /** The octave each hand starts in, where asked and its run fits on the keys; else its own. */
  readonly startOctaves?: Partial<HandOctaves>
}

/** Each hand's keys of a scale exercise's run, up and back, fingered (`scaleExercise`). */
export function scaleRunHands(run: FingeredRun): Readonly<Record<Hand, readonly Played[]>> {
  const { root, kind, octaves, start } = run
  const count = spellScale(root, kind).length
  const way = fingeringsOf(kind, start).includes(run.fingering)
    ? run.fingering
    : ownFingering(kind, start)
  const degrees = range(start, start + count * octaves)
  const own = ownTonics(run)
  const tonicOf = (hand: Hand): Midi => {
    const asked = run.startOctaves?.[hand]
    return asked !== undefined && outOfKeys(run, asked) === undefined
      ? tonicIn(root, asked)
      : midi(own[hand])
  }
  const handRun = (scale: ScaleKind, hand: Hand): Played[] => {
    const place = scaleDegrees(root, scale, tonicOf(hand))
    const keys = degrees.map(place)
    const fingers = runFingering(
      root,
      scale,
      start,
      keys.map((key) => key.midi),
      hand,
      way,
    )
    return fingered(keys, fingers)
  }
  const down = kindComingDown(kind)
  const both = (hand: Hand) => [...handRun(kind, hand), ...handRun(down, hand).reverse().slice(1)]
  return { rh: both('rh'), lh: both('lh') }
}

/**
 * A figure (degrees above its first note) restarted on each degree up the scale, then mirrored down
 * from the top, home on the tonic: broken 3rds are [0, 2], groups of four [0, 1, 2, 3]. The left hand
 * below the right; no fingers, as no method gives one rule for them.
 */
export function sequenceExercise(
  run: ScaleRun & { readonly figure: readonly number[] },
): Performance {
  const { root, kind, octaves, figure } = run
  const top = spellScale(root, kind).length * octaves
  const span = Math.max(...figure)
  const up = range(0, top - span).flatMap((from) => figure.map((step) => from + step))
  const down = range(top, span).flatMap((from) => figure.map((step) => from - step))
  const degrees = [...up, ...down]
  if (degrees.at(-1) !== 0) degrees.push(0)
  const keys = degrees.map(scaleDegrees(root, kind, tonicKey(root, octaves)))
  return overTonic(run, inEighths({ rh: keys, lh: handBelow(keys, leftHandBelow(octaves)) }))
}

/**
 * Both hands from the same tonic at middle C, the right going up while the left comes down, and back,
 * each fingered as its scale: one or two octaves, which the keyboard holds either way.
 */
export function contraryExercise(run: ScaleRun): Performance {
  const { root, kind, octaves } = run
  const count = spellScale(root, kind).length
  const top = count * octaves
  const tonic = tonicKey(root)
  const way = ownFingering(kind, 0)
  const hand = (side: Hand): Played[] => {
    const degrees = side === 'rh' ? range(0, top) : range(-top, 0)
    const keys = degrees.map(scaleDegrees(root, kind, tonic))
    const fingers = runFingering(
      root,
      kind,
      0,
      keys.map((key) => key.midi),
      side,
      way,
    )
    const bottomUp = fingered(keys, fingers)
    // The right hand reads its run up; the left plays its own from the top down.
    const out = side === 'rh' ? bottomUp : [...bottomUp].reverse()
    return upAndBack(out)
  }
  return overTonic(run, inEighths({ rh: hand('rh'), lh: hand('lh') }))
}
