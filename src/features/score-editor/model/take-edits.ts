import type { HandId } from '@/entities/piece'
import type { QuantisedNote } from '@/entities/take'
import type { Midi, Tick } from '@/shared/lib/music'
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
  const highest = new Map<Tick, QuantisedNote>()
  for (const n of notes) {
    const top = highest.get(n.startTick)
    if (!top || n.midi > top.midi) highest.set(n.startTick, n)
  }
  const line = [...highest.values()].sort((a, b) => a.startTick - b.startTick)
  return line.map((n, i) => {
    const next = line[i + 1]?.startTick ?? Infinity
    return { ...n, durationTicks: Math.min(n.startTick + n.durationTicks, next) - n.startTick }
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
  const notes = parts.flatMap((part) => part.notes)
  if (notes.length === 0) return draft
  const end = notes.reduce((latest, n) => Math.max(latest, n.startTick + n.durationTicks), 0)
  const last = from + end - 1
  const grown = reaching(draft, last)
  const lastBar = barAt(grown, last)
  const span = { from, to: lastBar.start + lastBar.bar.ticks }
  return parts.reduce((next, part) => writePart(next, part, span), grown)
}
