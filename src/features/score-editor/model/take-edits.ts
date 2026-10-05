import type { HandId } from '@/entities/piece'
import type { QuantisedNote } from '@/entities/take'
import { isCompound, type Meter, type Midi, type Tick } from '@/shared/lib/music'
import type { Duration } from '@/shared/lib/notation'
import { isHandLayer, type Draft, type DraftNote, type NoteLayer } from './draft'
import { notesOf, reaching, spelledIn, withBar, withNotes } from './notes'
import { barAt, barsOf } from './timeline'

/** Where a take is written (spec 2026-10-05 §4): both hands, split at a key, or one layer. */
export const TAKE_INTO = ['both', 'rh', 'lh', 'melody'] as const
export type TakeInto = (typeof TAKE_INTO)[number]

/** A take's notes for one layer, in ticks from the take's first downbeat. */
export interface TakePart {
  readonly layer: NoteLayer
  readonly notes: readonly QuantisedNote[]
}

/** A take's notes in the layers it is written in: split between the hands at `split` (it and up the right). */
export function takeParts(
  notes: readonly QuantisedNote[],
  into: TakeInto,
  split: Midi,
): TakePart[] {
  if (into !== 'both') return [{ layer: into, notes }]
  return [
    { layer: 'rh', notes: notes.filter((n) => n.midi >= split) },
    { layer: 'lh', notes: notes.filter((n) => n.midi < split) },
  ]
}

const SIMPLE_GRIDS: readonly Duration[] = [
  { value: 4, dots: 0, triplet: false },
  { value: 8, dots: 0, triplet: false },
  { value: 16, dots: 0, triplet: false },
  { value: 8, dots: 0, triplet: true },
]
const COMPOUND_GRIDS: readonly Duration[] = [
  { value: 4, dots: 1, triplet: false },
  { value: 8, dots: 0, triplet: false },
  { value: 16, dots: 0, triplet: false },
]

/** The shortest notes a take is snapped to: the beat, an eighth, a sixteenth, and in x/4 an eighth triplet. */
export const takeGrids = (meter: Meter): readonly Duration[] =>
  isCompound(meter) ? COMPOUND_GRIDS : SIMPLE_GRIDS

/** The ticks a take's notes cover: from the bar it is written from to the end of the bar it ends in. */
interface Span {
  readonly from: Tick
  readonly to: Tick
}

/** A layer's notes with those starting in the span taken, and one sounding into it cut at its start. */
const clearedIn = (notes: readonly DraftNote[], { from, to }: Span): DraftNote[] =>
  notes.flatMap((n) => {
    if (n.startTick >= from && n.startTick < to) return []
    return n.startTick < from && n.startTick + n.durationTicks > from
      ? [{ ...n, durationTicks: from - n.startTick }]
      : [n]
  })

/** The tune in a take: the highest key at each onset, each note cut where the next starts. */
function oneLine(notes: readonly QuantisedNote[]): QuantisedNote[] {
  const onsets = [...new Set(notes.map((n) => n.startTick))].sort((a, b) => a - b)
  return onsets.flatMap((onset, i) => {
    const at = notes.filter((n) => n.startTick === onset)
    const highest = at.reduce((top, n) => (n.midi > top.midi ? n : top))
    const next = onsets[i + 1]
    const end = Math.min(onset + highest.durationTicks, next ?? Infinity)
    return [{ ...highest, durationTicks: end - onset }]
  })
}

/** A hand's bars in the span written out, so it plays what was played there, or silence. */
function writtenOut(draft: Draft, hand: HandId, { from, to }: Span): Draft {
  return barsOf(draft)
    .filter(({ start }) => start >= from && start < to)
    .reduce(
      (next, { index }) =>
        withBar(next, index, (bar) => (bar[hand] ? bar : { ...bar, [hand]: true })),
      draft,
    )
}

/** One layer's part written over the span: what started there replaced by the take's notes. */
function writePart(draft: Draft, { layer, notes }: TakePart, span: Span): Draft {
  const ready = isHandLayer(layer) ? writtenOut(draft, layer, span) : draft
  const played = layer === 'melody' ? oneLine(notes) : notes
  const added = played.map((n) => ({
    ...spelledIn(ready, n.midi),
    startTick: span.from + n.startTick,
    durationTicks: n.durationTicks,
  }))
  return withNotes(ready, layer, [...clearedIn(notesOf(ready, layer), span), ...added])
}

/**
 * A take written into the draft from the bar starting at `from` (spec 2026-10-05 §4): over whole bars
 * to the bar it ends in, bars added past the piece's end; in each part's layer the notes starting
 * there are replaced, a hand's bars written out. The draft as it was for a take with no notes.
 */
export function writeTake(draft: Draft, from: Tick, parts: readonly TakePart[]): Draft {
  const ends = parts.flatMap((part) => part.notes.map((n) => n.startTick + n.durationTicks))
  if (ends.length === 0) return draft
  const last = from + Math.max(...ends) - 1
  const grown = reaching(draft, last)
  const lastBar = barAt(grown, last)
  const span = { from, to: lastBar.start + lastBar.bar.ticks }
  return parts.reduce((next, part) => writePart(next, part, span), grown)
}
