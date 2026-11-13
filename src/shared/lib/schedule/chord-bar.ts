import {
  note,
  TICKS_PER_BEAT,
  type ChordFingers,
  type Finger,
  type Hand,
  type PlacedChord,
  type PlacedTone,
} from '@/shared/lib/music'
import type { TimedMusic, TimedNote } from '@/shared/lib/notation'

const WHOLE_BAR = 4 * TICKS_PER_BEAT

const held =
  (hand: Hand, fingers: readonly Finger[] | undefined, alone: boolean, startTick: number) =>
  ({ midi, tone }: PlacedTone, at: number): TimedNote => {
    const finger = fingers?.[at]
    return {
      midi,
      spelled: tone.note,
      role: tone.role,
      ...(alone ? { hand: 'staff' as const, staff: 0 } : { hand }),
      startTick,
      durationTicks: WHOLE_BAR,
      ...(finger === undefined ? {} : { finger }),
    }
  }

/** A chord as the explorers place it, with each hand's fingers where they are given. */
export interface BarChord {
  readonly placed: PlacedChord
  readonly fingers?: ChordFingers
}

/**
 * Chords as the explorers place them, each held for a bar, with no key signature and no time
 * signature (every accidental on its note), as the canvas's Chords staff writes them: one treble
 * staff where no left hand plays, the grand staff where one does; each note's finger where they are
 * given, and its tone in the chord, which paints its head.
 */
export function chordBars(chords: readonly BarChord[]): TimedMusic {
  const alone = chords.every(({ placed }) => placed.lh.length === 0)
  return {
    key: { tonic: note('C'), minor: false },
    meter: '4/4',
    timeHidden: true,
    bars: chords.map((_, i) => ({ startTick: i * WHOLE_BAR, beats: 4 })),
    notes: chords.flatMap(({ placed, fingers }, i) => [
      ...placed.lh.map(held('lh', fingers?.lh, false, i * WHOLE_BAR)),
      ...placed.rh.map(held('rh', fingers?.rh, alone, i * WHOLE_BAR)),
    ]),
    chords: [],
    ...(alone ? { staves: [{ clef: 'treble' as const }], piano: false } : {}),
  }
}
