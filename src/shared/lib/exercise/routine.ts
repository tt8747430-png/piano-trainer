import type { Performance } from '@/shared/lib/arrangement'
import type { Hand, NoteMarks, ScaleKind, SpelledNote } from '@/shared/lib/music'
import type { Played } from './line'
import { inEighths } from './line'
import type { LineNote } from './performance'
import { overTonic, scaleRunHands } from './scales'
import { BAR } from './time'

/**
 * The parts of the daily scale routine, in order: each hand alone to warm up, hands together, hands
 * together staccato, then hands together from piano up to forte and back.
 */
export const ROUTINE_PARTS = ['rh', 'lh', 'together', 'staccato', 'dynamics'] as const
export type RoutinePart = (typeof ROUTINE_PARTS)[number]

/** The octaves each part climbs: two, as the routine plays a scale. */
const OCTAVES = 2

/** Each part's hands. */
const HANDS: Readonly<Record<RoutinePart, readonly Hand[]>> = {
  rh: ['rh'],
  lh: ['lh'],
  together: ['rh', 'lh'],
  staccato: ['rh', 'lh'],
  dynamics: ['rh', 'lh'],
}

const STACCATO: NoteMarks = { articulations: ['staccato'] }

/**
 * What a part writes on its run's notes (the right hand's, `at` its place, `top` its turn): staccato
 * on every note, or piano with a crescendo to forte at the top, then a diminuendo back to piano.
 */
function marksOf(part: RoutinePart, hand: Hand, at: number, top: number, last: number) {
  if (part === 'staccato') return STACCATO
  if (part !== 'dynamics' || hand !== 'rh') return undefined
  if (at === 0) return { dynamic: 'p', hairpin: 'cresc' } satisfies NoteMarks
  if (at === top) return { dynamic: 'f', hairpin: 'dim' } satisfies NoteMarks
  if (at === last) return { dynamic: 'p', hairpin: 'end' } satisfies NoteMarks
  return undefined
}

/**
 * The fifteen-minute scale routine (piano.org's, the tempo left to the exercise's ladder): the scale
 * two octaves up and back in each of its parts, one after another, each from a new bar, fingered as
 * the scale is taught.
 */
export function scaleRoutine(choice: {
  readonly root: SpelledNote
  readonly kind: ScaleKind
}): Performance {
  const run = { ...choice, octaves: OCTAVES, start: 0, fingering: 'scale' as const }
  const hands = scaleRunHands(run)
  const notes: LineNote[] = []
  let from = 0
  for (const part of ROUTINE_PARTS) {
    const played: Partial<Record<Hand, Played[]>> = {}
    for (const hand of HANDS[part]) {
      const keys = hands[hand]
      const top = (keys.length - 1) / 2
      played[hand] = keys.map((key, at) => {
        const marks = marksOf(part, hand, at, top, keys.length - 1)
        return marks ? { ...key, marks } : key
      })
    }
    const written = inEighths(played, from)
    notes.push(...written)
    from = Math.max(...written.map((n) => n.startTick + n.durationTicks))
    from = Math.ceil(from / BAR) * BAR
  }
  return overTonic(run, notes)
}
