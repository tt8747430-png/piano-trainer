import { TICKS_PER_BEAT, type Tick } from '@/shared/lib/music'
import type { Draft, Layer, NoteLayer } from './draft'
import { notesOf } from './notes'
import type { TickSpan } from './state'
import { barAt, barsOf, totalTicks } from './timeline'

const sortedUnique = (ticks: readonly Tick[]) => [...new Set(ticks)].sort((a, b) => a - b)

/** Where the caret stands in the chords: every beat of every bar, and every chord's start. */
function chordPlaces(draft: Draft): Tick[] {
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

/**
 * Where the caret may stand in a layer of notes: their starts and ends, barlines, the ends, and steps
 * of the value where nothing sounds (ADR 0088): never inside a note, where it would mark empty staff.
 */
function notePlaces(draft: Draft, layer: NoteLayer, step: Tick): Tick[] {
  const notes = notesOf(draft, layer)
  const edges = notes.flatMap((n) => [n.startTick, n.startTick + n.durationTicks])
  const inside = (tick: Tick) =>
    notes.some((n) => tick > n.startTick && tick < n.startTick + n.durationTicks)
  const steps = barsOf(draft).flatMap(({ start, bar }) =>
    Array.from({ length: Math.ceil(bar.ticks / step) }, (_, k) => start + k * step),
  )
  const bars = barsOf(draft).map(({ start }) => start)
  return sortedUnique([
    0,
    totalTicks(draft),
    ...bars,
    ...edges,
    ...steps.filter((tick) => !inside(tick)),
  ]).filter((tick) => tick <= totalTicks(draft))
}

/** Every place the caret may stand in a layer, the value's step apart in the melody or a hand. */
export const caretPlaces = (draft: Draft, layer: Layer, step: Tick): Tick[] =>
  layer === 'chords' ? chordPlaces(draft) : notePlaces(draft, layer, step)

/**
 * Where a click on the sheet lands in a layer (ADR 0082): on a note's start (a chord's in the chords),
 * or on the room after a bar's last note where it ends before the barline (a rest's start too); in a
 * bar whose row writes nothing, on its start. Never on an empty step between.
 */
export function tapPlaces(draft: Draft, layer: Layer): Tick[] {
  const notes = layer === 'chords' ? [] : notesOf(draft, layer)
  return sortedUnique(
    barsOf(draft).flatMap(({ start, bar }) => {
      const end = start + bar.ticks
      if (layer === 'chords') {
        const chords = bar.chords.map((chord) => start + chord.at)
        return chords.length > 0 ? chords : [start]
      }
      const here = notes.filter((n) => n.startTick >= start && n.startTick < end)
      if (here.length === 0) return [start]
      const starts = here.map((n) => n.startTick)
      const room = here
        .map((n) => n.startTick + n.durationTicks)
        .filter((tick) => tick < end && !starts.includes(tick))
      return [...starts, ...room]
    }),
  )
}

/**
 * What stands at a place in a layer, as a span of time (ADR 0088): the notes starting there, to the
 * longest's end; a chord, to the next chord or beat; an empty place (a rest, the room after the last
 * note), to the next note or the barline.
 */
export function itemAt(draft: Draft, layer: Layer, tick: Tick): TickSpan {
  const bar = barAt(draft, tick)
  const end = bar.start + bar.bar.ticks
  if (tick >= totalTicks(draft)) return { from: tick, to: tick }
  if (layer === 'chords') {
    const at = tick - bar.start
    // On a chord, to the next chord of its bar (its place in the bar, put on the timeline); on an
    // empty beat, to the next place the caret stands on.
    const onChord = bar.bar.chords.some((each) => each.at === at)
    const next = onChord
      ? bar.bar.chords.find((each) => each.at > at)?.at
      : chordPlaces(draft).find((place) => place > tick)
    const to = next === undefined ? end : onChord ? bar.start + next : next
    return { from: tick, to: Math.min(to, end) }
  }
  const notes = notesOf(draft, layer)
  const here = notes.filter((n) => n.startTick === tick)
  if (here.length > 0)
    return { from: tick, to: Math.max(...here.map((n) => n.startTick + n.durationTicks)) }
  const next = notes.find((n) => n.startTick > tick)?.startTick ?? end
  return { from: tick, to: Math.min(next, end) }
}

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
