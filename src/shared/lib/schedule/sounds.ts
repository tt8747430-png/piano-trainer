import type { Performance } from '@/shared/lib/arrangement'
import { midi, placeChord, type Chord, type Midi } from '@/shared/lib/music'
import { schedule, type Audible, type Hands, type NoteSound, type Sound } from './schedule'

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

/** How the explorers sound a chord: its inversion, one hand or two, struck at once or rolled. */
export interface ChordPlaying {
  readonly inversion?: number
  readonly bothHands?: boolean
  readonly arpeggio?: boolean
}

/** A chord as the explorers place it (`placeChord`), struck at once or rolled upwards. */
export function placedChordSounds(
  chord: Chord,
  { inversion = 0, bothHands = false, arpeggio = false }: ChordPlaying = {},
): NoteSound[] {
  const placed = placeChord(chord.root, chord.quality, { inversion, bothHands })
  return chordSounds(
    [...placed.lh, ...placed.rh].map((tone) => tone.midi),
    { arpeggio },
  )
}

/** One key, now: what a tap on a key sounds. */
export const keySound = (key: Midi): NoteSound => ({ kind: 'note', midi: key, at: 0, ...TAP })

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

const OCTAVES_BY_HANDS: Readonly<Record<Hands, readonly number[]>> = {
  rh: [0],
  lh: [-12],
  both: [-12, 0],
}

/** A scale up and back down in eighth notes, in a practice rhythm, for one hand or both. */
export function scaleRun(
  notes: readonly Midi[],
  options: { readonly rhythm: PracticeRhythm; readonly tempo: number; readonly hands: Hands },
): NoteSound[] {
  const lengths = PRACTICE_RHYTHMS[options.rhythm]
  const eighth = 60 / options.tempo / 2
  const upAndDown = [...notes, ...notes.slice(0, -1).reverse()]
  const offsets = OCTAVES_BY_HANDS[options.hands]
  const velocity = offsets.length > 1 ? 0.16 : 0.2
  const sounds: NoteSound[] = []
  let at = 0
  upAndDown.forEach((note, i) => {
    const length = (lengths[i % lengths.length] ?? 1) * eighth
    for (const offset of offsets) {
      sounds.push({
        kind: 'note',
        midi: midi(note + offset),
        at,
        duration: Math.max(0.25, length * 1.1),
        velocity,
      })
    }
    at += length
  })
  return sounds
}
