import {
  MIDDLE_C,
  note,
  pitchClass,
  plainSpelling,
  spellChord,
  TICKS_PER_BEAT,
  type Chord,
  type Midi,
  type SpelledNote,
} from '@/shared/lib/music'
import type { TimedMusic, TimedNote } from '@/shared/lib/notation'

const WHOLE_BAR = 4 * TICKS_PER_BEAT

/** A key of a chord written as the chord spells it: its tone of that pitch class, or a slash chord's bass. */
function spelledIn(chord: Chord, key: Midi): SpelledNote {
  const tone = spellChord(chord.root, chord.quality).find(
    (each) => each.pitchClass === pitchClass(key),
  )
  if (tone) return tone.note
  if (chord.bass) return chord.bass
  return plainSpelling(pitchClass(key), true)
}

/**
 * A row of chords on the grand staff as the keys play it: each chord a whole note in a bar of its
 * own, with its symbol over it, every key under middle C on the bass staff and the rest on the
 * treble, each spelled as its chord spells it. No key signature: every accidental is written.
 */
export function chordsMusic(
  chords: readonly {
    readonly chord: Chord
    readonly symbol: string
    readonly keys: readonly Midi[]
  }[],
): TimedMusic {
  return {
    key: { tonic: note('C'), minor: false },
    meter: '4/4',
    bars: chords.map((_, i) => ({ startTick: i * WHOLE_BAR, beats: 4 })),
    chords: chords.map(({ symbol }, i) => ({ startTick: i * WHOLE_BAR, symbol })),
    notes: chords.flatMap(({ chord, keys }, i) =>
      keys.map((key): TimedNote => ({
        midi: key,
        spelled: spelledIn(chord, key),
        hand: key < MIDDLE_C ? 'lh' : 'rh',
        startTick: i * WHOLE_BAR,
        durationTicks: WHOLE_BAR,
      })),
    ),
  }
}
