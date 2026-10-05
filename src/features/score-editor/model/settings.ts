import { keyText, PIECE_TEMPO } from '@/entities/piece'
import { transposeChord, transposeNotes } from '@/shared/lib/arrangement'
import {
  beatsPerBar,
  isCompound,
  METERS,
  midi,
  PIANO,
  TICKS_PER_BEAT,
  type Key,
  type Meter,
} from '@/shared/lib/music'
import { setBarTicks } from './bars'
import { barsOf } from './timeline'
import type { Draft, DraftNote } from './draft'

/** Notes moved to a new tonic, each kept on the piano by octaves. */
function moved(notes: readonly DraftNote[], from: Key, to: Key): DraftNote[] {
  return transposeNotes(notes, from.tonic, to.tonic).map((n) => {
    const kept = n.midi < PIANO.from ? n.midi + 12 : n.midi > PIANO.to ? n.midi - 12 : n.midi
    return kept === n.midi ? n : { ...n, midi: midi(kept) }
  })
}

/**
 * The music in another key: moved by the interval between the tonics, letters kept, as the Player moves
 * it; the other mode of the same tonic moves nothing.
 */
export function setKey(draft: Draft, key: Key): Draft {
  const from = draft.key
  if (keyText(from) === keyText(key)) return draft
  return {
    ...draft,
    key,
    sections: draft.sections.map((section) => ({
      ...section,
      lines: section.lines.map((line) =>
        line.map((bar) => ({
          ...bar,
          chords: bar.chords.map((placed) => ({
            ...placed,
            chord: transposeChord(placed.chord, from.tonic, key.tonic),
          })),
        })),
      ),
    })),
    melody: moved(draft.melody, from, key),
    hands: { rh: moved(draft.hands.rh, from, key), lh: moved(draft.hands.lh, from, key) },
  }
}

/** The tempo, kept within the tempos a piece is written at. */
export function setTempo(draft: Draft, tempo: number): Draft {
  const kept = Math.min(PIECE_TEMPO.max, Math.max(PIECE_TEMPO.min, Math.round(tempo)))
  return kept === draft.tempo ? draft : { ...draft, tempo: kept }
}

/**
 * The meters a piece may change to: those of its own kind, where a written value keeps its length (a
 * quarter in 2/4, 3/4 and 4/4; an eighth in 6/8 and 12/8). Across kinds every note would be another.
 */
export const metersFor = (meter: Meter): Meter[] =>
  METERS.filter((each) => isCompound(each) === isCompound(meter))

/** A bar's length in a meter: its beats in ticks. */
const fullBar = (meter: Meter) => beatsPerBar(meter) * TICKS_PER_BEAT

/**
 * The music in another meter of its kind: each full bar made the new meter's (shorter, its notes and
 * chords past the new end taken; longer, its last chord held on), a shorter bar (a pickup) kept as it
 * is unless it outruns the new bar.
 */
export function setMeter(draft: Draft, meter: Meter): Draft {
  if (meter === draft.meter || !metersFor(draft.meter).includes(meter)) return draft
  const from = fullBar(draft.meter)
  const to = fullBar(meter)
  // From the last bar back, so each bar's start is still where it was when it is resized.
  const resized = barsOf(draft).reduceRight((music, { bar }, index) => {
    const ticks = bar.ticks === from || bar.ticks > to ? to : bar.ticks
    return setBarTicks(music, index, ticks)
  }, draft)
  return { ...resized, meter }
}
