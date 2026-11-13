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
  (hand: Hand, fingers: readonly Finger[] | undefined, alone: boolean) =>
  ({ midi, tone }: PlacedTone, at: number): TimedNote => {
    const finger = fingers?.[at]
    return {
      midi,
      spelled: tone.note,
      role: tone.role,
      ...(alone ? { hand: 'staff' as const, staff: 0 } : { hand }),
      startTick: 0,
      durationTicks: WHOLE_BAR,
      ...(finger === undefined ? {} : { finger }),
    }
  }

/**
 * A chord as the explorers place it, held for a bar with no key signature and no time signature
 * (every accidental on its note), as the canvas's Chords staff writes it: one treble staff where the
 * left hand rests, the grand staff where it plays; each note's finger where they are given, and
 * its tone in the chord, which paints its head.
 */
export function chordBar(
  placed: PlacedChord,
  { fingers }: { fingers?: ChordFingers } = {},
): TimedMusic {
  const alone = placed.lh.length === 0
  return {
    key: { tonic: note('C'), minor: false },
    meter: '4/4',
    timeHidden: true,
    bars: [{ startTick: 0, beats: 4 }],
    notes: [
      ...placed.lh.map(held('lh', fingers?.lh, false)),
      ...placed.rh.map(held('rh', fingers?.rh, alone)),
    ],
    chords: [],
    ...(alone ? { staves: [{ clef: 'treble' as const }], piano: false } : {}),
  }
}
