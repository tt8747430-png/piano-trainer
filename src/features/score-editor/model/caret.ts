import { TICKS_PER_BEAT, type Tick } from '@/shared/lib/music'
import type { Draft, Layer, NoteLayer } from './draft'
import { notesOf } from './notes'
import { barsOf, totalTicks } from './timeline'

const sortedUnique = (ticks: readonly Tick[]) => [...new Set(ticks)].sort((a, b) => a - b)

/** Where the caret stands in the chords: every beat of every bar, and every chord's start. */
export function chordPlaces(draft: Draft): Tick[] {
  return sortedUnique(
    barsOf(draft).flatMap(({ start, bar }) => [
      ...Array.from(
        { length: Math.ceil(bar.ticks / TICKS_PER_BEAT) },
        (_, k) => start + k * TICKS_PER_BEAT,
      ),
      ...bar.chords.map((chord) => start + chord.at),
    ]),
  )
}

/** The chords' place at or before a tick: where a click or another layer's caret lands in them. */
export function snapToChord(draft: Draft, tick: Tick): Tick {
  const places = chordPlaces(draft)
  return places.findLast((place) => place <= tick) ?? places[0] ?? 0
}

/** Where the caret may stand in a layer of notes: their starts and ends, steps of the value, barlines, the ends. */
function notePlaces(draft: Draft, layer: NoteLayer, step: Tick): Tick[] {
  const steps = barsOf(draft).flatMap(({ start, bar }) =>
    Array.from({ length: Math.ceil(bar.ticks / step) }, (_, k) => start + k * step),
  )
  const notes = notesOf(draft, layer).flatMap((n) => [n.startTick, n.startTick + n.durationTicks])
  return sortedUnique([0, totalTicks(draft), ...steps, ...notes]).filter(
    (tick) => tick <= totalTicks(draft),
  )
}

/** Every place the caret may stand in a layer, the value's step apart in the melody or a hand. */
export const caretPlaces = (draft: Draft, layer: Layer, step: Tick): Tick[] =>
  layer === 'chords' ? chordPlaces(draft) : notePlaces(draft, layer, step)

/** The caret's next place forwards (1) or back (−1), staying where it is at either end. */
export function nextCaret(
  draft: Draft,
  layer: Layer,
  caret: Tick,
  step: Tick,
  direction: -1 | 1,
): Tick {
  const places = caretPlaces(draft, layer, step)
  const next =
    direction > 0
      ? places.find((place) => place > caret)
      : places.findLast((place) => place < caret)
  return next ?? caret
}
