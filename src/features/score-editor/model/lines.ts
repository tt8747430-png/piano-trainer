import type { NoteMarks, Tick } from '@/shared/lib/music'
import type { Draft, DraftNote, NoteLayer } from './draft'
import { selectionSpan } from './caret-moves'
import { notesOf, withNotes } from './notes'
import type { EditorState, TickSpan } from './state'
import { barAt } from './timeline'

/**
 * The lines the palette draws over notes (Slurs & lines, Dynamics & hairpins, ADR 0114), as a
 * notation app's Lines palette does: a slur, a crescendo or diminuendo hairpin, an octave line up or
 * down.
 */
export const LINES = ['slur', 'cresc', 'dim', '8va', '8vb'] as const
export type Line = (typeof LINES)[number]

type Writable = { -readonly [K in keyof NoteMarks]: NoteMarks[K] }

/**
 * Where a line goes: over the notes chosen, from the first's start to the last's end; else from the
 * caret to the end of its bar, as a notation app draws a line from one note selected to the bar's end.
 */
export function lineSpan(state: EditorState): TickSpan {
  if (state.selection) return selectionSpan(state.selection)
  const bar = barAt(state.draft, state.caret)
  return { from: state.caret, to: bar.start + bar.bar.ticks }
}

/**
 * The onsets a line runs between: the span's first and last; a span of one onset reaching the next
 * note after it, since a line joins two notes. Null where the span starts no note.
 */
function reach(notes: readonly DraftNote[], { from, to }: TickSpan) {
  const onsets = notes.map((n) => n.startTick).filter((at) => at >= from && at < to)
  if (onsets.length === 0) return null
  const first = Math.min(...onsets)
  const last = Math.max(...onsets)
  if (last > first) return { first, last }
  const next = notes.find((n) => n.startTick > first)?.startTick
  return { first, last: next ?? first }
}

/** Whether a line is drawn from `first` to `last` on these notes. */
function drawn(notes: readonly DraftNote[], first: Tick, last: Tick, line: Line): boolean {
  const at = (tick: Tick) => notes.filter((n) => n.startTick === tick)
  switch (line) {
    case 'slur':
      return at(first).some((n) => n.marks?.slurStart) && at(last).some((n) => n.marks?.slurEnd)
    case 'cresc':
    case 'dim':
      return (
        at(first).some((n) => n.marks?.hairpin === line) &&
        at(last).some((n) => n.marks?.hairpin !== undefined)
      )
    default:
      return notes
        .filter((n) => n.startTick >= first && n.startTick <= last)
        .every((n) => n.marks?.octave === line)
  }
}

/** A note's marks with the line's part at `place` put on (or, `on` false, taken off). */
function lineMarks(
  marks: NoteMarks | undefined,
  line: Line,
  place: 'first' | 'inside' | 'last',
  on: boolean,
): NoteMarks | undefined {
  const next: Writable = { ...marks }
  if (line === 'slur') {
    // A slur ending where this one starts, or starting where it ends, is another's: kept.
    if (place !== 'last') delete next.slurStart
    if (place !== 'first') delete next.slurEnd
    if (on && place === 'first') next.slurStart = true
    if (on && place === 'last') next.slurEnd = true
  } else if (line === 'cresc' || line === 'dim') {
    // The last note may start the next hairpin, which ends this one.
    const startsNext = place === 'last' && next.hairpin !== undefined && next.hairpin !== 'end'
    if (!startsNext) delete next.hairpin
    if (on && place === 'first') next.hairpin = line
    if (on && place === 'last' && !startsNext) next.hairpin = 'end'
  } else {
    delete next.octave
    if (on) next.octave = line
  }
  return Object.keys(next).length > 0 ? next : undefined
}

/**
 * A line drawn over the notes of a span in one go: a slur or a hairpin from its first note to its
 * last, an octave line over every note between; drawn there already, taken away. A line drawn over
 * a line of its kind replaces what lay inside it.
 */
export function lineOver(draft: Draft, layer: NoteLayer, span: TickSpan, line: Line): Draft {
  const notes = notesOf(draft, layer)
  const ends = reach(notes, span)
  if (!ends) return draft
  const { first, last } = ends
  const on = !drawn(notes, first, last, line)
  return withNotes(
    draft,
    layer,
    notes.map((n) => {
      if (n.startTick < first || n.startTick > last) return n
      const place =
        n.startTick === first ? 'first' : n.startTick === last ? 'last' : ('inside' as const)
      // A line over one note alone (the last of the music): an octave line, or nothing to join.
      if (first === last && line !== '8va' && line !== '8vb') return n
      const { marks: _old, ...note } = n
      const marks = lineMarks(n.marks, line, place, on)
      return marks ? { ...note, marks } : note
    }),
  )
}

/**
 * Whether a line is drawn where its key would draw it now; null where it has no notes to go over
 * (the chord row, or no note from the caret on in its bar).
 */
export function lineDrawn(state: EditorState, line: Line): boolean | null {
  if (state.layer === 'chords') return null
  const notes = notesOf(state.draft, state.layer)
  const ends = reach(notes, lineSpan(state))
  if (!ends) return null
  if (ends.first === ends.last && line !== '8va' && line !== '8vb') return null
  return drawn(notes, ends.first, ends.last, line)
}
