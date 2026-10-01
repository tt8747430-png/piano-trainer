import {
  fingeringsOf,
  midi,
  kindComingDown,
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
  scaleDegrees,
  tonicChord,
  tonicKey,
  type Played,
} from './line'
import { exercisePerformance, type LineNote } from './performance'

export interface ScaleRun {
  readonly root: SpelledNote
  readonly kind: ScaleKind
  readonly octaves: number
}

const range = (from: number, to: number): number[] => {
  const step = to >= from ? 1 : -1
  return Array.from({ length: Math.abs(to - from) + 1 }, (_, i) => from + i * step)
}

/** A scale's music: in its key, over its tonic chord. */
function overTonic(run: ScaleRun, notes: readonly LineNote[]): Performance {
  return exercisePerformance({
    key: scaleKey(run.root, run.kind),
    notes,
    harmony: [{ chord: tonicChord(run.root, run.kind), startTick: 0, durationTicks: 1 }],
  })
}

/**
 * The scale up `octaves` octaves from degree `start` and back in 8ths, the left hand below the right:
 * fingered as the scale or from the thumb (a fingering the scale cannot take is its own), and coming
 * down as the scale comes down (melodic minor as natural minor).
 */
export function scaleExercise(
  run: ScaleRun & { readonly start: number; readonly fingering: Fingering },
): Performance {
  const { root, kind, octaves, start } = run
  const count = spellScale(root, kind).length
  const way = fingeringsOf(kind, start).includes(run.fingering)
    ? run.fingering
    : ownFingering(kind, start)
  const degrees = range(start, start + count * octaves)
  const tonic = tonicKey(root, octaves)
  const handRun = (scale: ScaleKind, hand: Hand): Played[] => {
    const place = scaleDegrees(
      root,
      scale,
      hand === 'rh' ? tonic : midi(tonic - leftHandBelow(octaves)),
    )
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
  return overTonic(run, inEighths({ rh: both('rh'), lh: both('lh') }))
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
    return [...out, ...[...out].reverse().slice(1)]
  }
  return overTonic(run, inEighths({ rh: hand('rh'), lh: hand('lh') }))
}
