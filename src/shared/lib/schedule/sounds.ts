import type { Performance } from '@/shared/lib/arrangement'
import type { Midi } from '@/shared/lib/music'
import { schedule, type Audible, type NoteSound, type Sound } from './schedule'

/** One bar on its own at a tempo: what a tap on a bar plays. */
export function barSounds(
  performance: Performance,
  bar: number,
  options: { readonly tempo: number; readonly hands: Audible },
): Sound[] {
  const placed = performance.bars[bar]
  if (!placed) return []
  const { sounds } = schedule(performance, { ...options, fromTick: placed.startTick })
  const end = (placed.beats * 60) / options.tempo
  return sounds.filter((sound) => sound.at < end - 1e-9)
}

const BLOCK = { duration: 1.6, velocity: 0.18 } as const
const ARPEGGIO = { gap: 0.22, duration: 1.4, velocity: 0.2 } as const
const TAP = { duration: 1.2, velocity: 0.2 } as const

/** A chord struck at once or rolled upwards: the explorers' Play and Arpeggio. */
export function chordSounds(
  keys: readonly Midi[],
  options: { readonly arpeggio: boolean },
): NoteSound[] {
  return [...keys]
    .sort((a, b) => a - b)
    .map((key, i) => ({
      kind: 'note',
      midi: key,
      at: options.arpeggio ? i * ARPEGGIO.gap : 0,
      duration: options.arpeggio ? ARPEGGIO.duration : BLOCK.duration,
      velocity: options.arpeggio ? ARPEGGIO.velocity : BLOCK.velocity,
    }))
}

/** The keys a hand plays at once, now: a tap's key, or the chord a key stands for, each softer. */
export const keySounds = (keys: readonly Midi[]): NoteSound[] =>
  keys.map((key) => ({
    kind: 'note',
    midi: key,
    at: 0,
    duration: TAP.duration,
    velocity: keys.length > 1 ? BLOCK.velocity : TAP.velocity,
  }))

export const PRACTICE_RHYTHM_IDS = [
  'even',
  'long-short',
  'short-long',
  'long-short-short-short',
  'short-short-short-long',
] as const
export type PracticeRhythm = (typeof PRACTICE_RHYTHM_IDS)[number]

/** The five practice rhythms: note lengths in eighth notes, repeating through the run. */
export const PRACTICE_RHYTHMS: Readonly<Record<PracticeRhythm, readonly number[]>> = {
  even: [1],
  'long-short': [1.5, 0.5],
  'short-long': [0.5, 1.5],
  'long-short-short-short': [2, 2 / 3, 2 / 3, 2 / 3],
  'short-short-short-long': [2 / 3, 2 / 3, 2 / 3, 2],
}

/** A walk's chords: a struck one softer than a rolled one, each note released a little before the next chord. */
const WALKED = { struck: 0.16, rolled: 0.2, legato: 0.95 } as const

/**
 * Chords one after another, Walk the chords: struck together for two beats each, or rolled upwards
 * an 8th a note, each chord lasting two beats or as many as its notes need.
 */
export function walkSounds(
  chords: readonly (readonly Midi[])[],
  options: { readonly arpeggio: boolean; readonly tempo: number },
): NoteSound[] {
  const beat = 60 / options.tempo
  const sounds: NoteSound[] = []
  let at = 0
  for (const chord of chords) {
    const keys = [...chord].sort((a, b) => a - b)
    const length = (options.arpeggio ? Math.max(2, Math.ceil(keys.length / 2)) : 2) * beat
    keys.forEach((key, i) => {
      const offset = options.arpeggio ? (i * beat) / 2 : 0
      sounds.push({
        kind: 'note',
        midi: key,
        at: at + offset,
        duration: (length - offset) * WALKED.legato,
        velocity: options.arpeggio ? WALKED.rolled : WALKED.struck,
      })
    })
    at += length
  }
  return sounds
}
