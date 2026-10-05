import {
  note,
  TICKS_PER_BEAT,
  type Hand,
  type PlacedChord,
  type PlacedTone,
} from '@/shared/lib/music'
import type { TimedMusic, TimedNote } from '@/shared/lib/notation'

const WHOLE_BAR = 4 * TICKS_PER_BEAT

const held =
  (hand: Hand) =>
  ({ midi, tone }: PlacedTone): TimedNote => ({
    midi,
    spelled: tone.note,
    hand,
    startTick: 0,
    durationTicks: WHOLE_BAR,
    roll: 0,
  })

/**
 * A chord as the explorers place it, held for a bar of 4/4 with no key signature (every accidental
 * on its note): how the Chords explorer writes it.
 */
export function chordBar(placed: PlacedChord): TimedMusic {
  return {
    key: { tonic: note('C'), minor: false },
    meter: '4/4',
    bars: [{ startTick: 0, beats: 4 }],
    notes: [...placed.lh.map(held('lh')), ...placed.rh.map(held('rh'))],
    chords: [],
  }
}
