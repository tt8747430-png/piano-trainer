import type { HandId } from '@/entities/piece'
import type { Tick } from '@/shared/lib/music'
import {
  isHandLayer,
  type DraftBar,
  type DraftNote,
  type Draft,
  type Layer,
  type NoteLayer,
} from './draft'
import { clearUnder, makeRoom, notesOf, oneLine, reaching, spelledIn, withNotes } from './notes'
import type { TickSpan } from './state'
import { totalTicks } from './timeline'

/**
 * Bars copied with their notes, which are timed from the first bar's start: the chord row's clip,
 * each single staff's notes by its place (ADR 0097) and each hand's.
 */
export interface BarsClip {
  readonly kind: 'bars'
  readonly bars: readonly DraftBar[]
  readonly staves: readonly (readonly DraftNote[])[]
  readonly hands: Readonly<Record<HandId, readonly DraftNote[]>>
}

/** Notes copied from one staff (ADR 0114), timed from the start of the span they were chosen in, and its length. */
export interface NotesClip {
  readonly kind: 'notes'
  readonly layer: NoteLayer
  readonly notes: readonly DraftNote[]
  readonly ticks: Tick
}

/** What the clipboard holds: bars, copied in the chord row, or notes, copied on a staff. */
export type Clip = BarsClip | NotesClip

/** Whether a clip goes where the caret is: bars in the chord row, notes on a staff. */
export const clipFits = (clip: Clip, layer: Layer): boolean =>
  (clip.kind === 'bars') === (layer === 'chords')

/** The notes of a staff starting in `span`, timed from its start. */
export function copyNotes(draft: Draft, layer: NoteLayer, { from, to }: TickSpan): NotesClip {
  const notes = notesOf(draft, layer)
    .filter((n) => n.startTick >= from && n.startTick < to)
    .map((n) => ({ ...n, startTick: n.startTick - from }))
  return { kind: 'notes', layer, notes, ticks: to - from }
}

/**
 * The clip's notes as a staff takes them: a hand every note; a single staff one line (`oneLine`)
 * ending by the clip's end, so it never sounds over its notes after it, with no finger.
 */
function fitTo({ notes, ticks }: NotesClip, layer: NoteLayer): DraftNote[] {
  if (isHandLayer(layer)) return [...notes]
  return oneLine(notes).map(({ finger: _finger, ...n }) =>
    n.startTick + n.durationTicks > ticks ? { ...n, durationTicks: ticks - n.startTick } : n,
  )
}

/**
 * Copied notes written from `at` on a staff (ADR 0114), spelled in the key there: over what is in
 * their time, or, in Insert mode, in room made for them, the later notes pushed right; bars added at
 * the end of the song for what runs past it. Where the notes end, the caret goes next.
 */
export function pasteNotes(
  draft: Draft,
  layer: NoteLayer,
  at: Tick,
  clip: NotesClip,
  insert: boolean,
): { readonly draft: Draft; readonly end: Tick } {
  const end = at + clip.ticks
  const placed = fitTo(clip, layer).map((n) => ({ ...n, startTick: n.startTick + at }))
  const last = Math.max(end, ...placed.map((n) => n.startTick + n.durationTicks))
  const roomy = insert ? makeRoom(draft, layer, at, clip.ticks) : draft
  const grown = last > totalTicks(roomy) ? reaching(roomy, last - 1) : roomy
  const written = placed.map((n) => ({ ...n, ...spelledIn(grown, n.midi, n.startTick) }))
  return { draft: withNotes(grown, layer, [...clearUnder(grown, layer, at, end), ...written]), end }
}
