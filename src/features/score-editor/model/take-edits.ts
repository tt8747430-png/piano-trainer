import type { QuantisedNote } from '@/entities/take'
import type { Midi, Tick } from '@/shared/lib/music'
import { isHandLayer, type Draft, type DraftNote, type NoteLayer } from './draft'
import { notesOf, oneLine, reaching, spelledIn, withNotes } from './notes'
import { barAt } from './timeline'

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

/** One layer's part written over the span: what started there replaced by the take's notes; the tune one line. */
function writePart(draft: Draft, { layer, notes }: TakePart, span: Span): Draft {
  const played = isHandLayer(layer) ? notes : oneLine(notes)
  const added = played.map((n) => ({
    ...spelledIn(draft, n.midi, span.from + n.startTick),
    startTick: span.from + n.startTick,
    durationTicks: n.durationTicks,
  }))
  return withNotes(draft, layer, [...clearedIn(notesOf(draft, layer), span), ...added])
}

/**
 * A take written into the draft from the bar starting at `from` (spec 2026-10-05 §4): over whole bars
 * to the bar it ends in, bars added past the piece's end; in each part's layer the notes starting
 * there are replaced. The draft as it was for a take with no notes.
 */
export function writeTake(draft: Draft, from: Tick, parts: readonly TakePart[]): Draft {
  const notes = parts.flatMap((part) => part.notes)
  if (notes.length === 0) return draft
  const end = notes.reduce((latest, n) => Math.max(latest, n.startTick + n.durationTicks), 0)
  const last = from + end - 1
  const grown = reaching(draft, last)
  const lastBar = barAt(grown, last)
  const span = { from, to: lastBar.start + lastBar.bar.ticks }
  return parts.reduce((next, part) => writePart(next, part, span), grown)
}
