import {
  barAt,
  chordAt,
  notesAt,
  notesOf,
  totalTicks,
  valueOf,
  type DraftNote,
  type EditMode,
  type EditorState,
} from '@/features/score-editor'
import { printedChord, TICKS_PER_BEAT, writtenName, type Tick } from '@/shared/lib/music'
import type { Duration } from '@/shared/lib/notation'

interface Place {
  readonly bar: number
  readonly beat: string
}

/** Where the caret is, and what is there. */
type CaretPlace =
  | { readonly kind: 'end' }
  | (Place & {
      readonly kind: 'notes'
      readonly what: string
      /** The value they are written as; none for a length no one value writes (tied over). */
      readonly value: Duration | null
    })
  | (Place & { readonly kind: 'at' | 'held' | 'rest'; readonly what: string })
  /** The chord row of a bar of no chord (ADR 0114). */
  | (Place & { readonly kind: 'noChord' })

/** What the caret line says: the place, and the editing mode where it is not Replace (ADR 0114). */
type CaretSaid = CaretPlace & { readonly mode?: Exclude<EditMode, 'replace'> }

/** A beat counted from 1, a part of one as a decimal: 1, 2.5. */
const beatOf = (ticks: number) => String(Math.round((ticks / TICKS_PER_BEAT + 1) * 100) / 100)

const names = (notes: readonly DraftNote[]) =>
  notes.map((n) => writtenName(n.midi, n.spelled)).join(' ')

export function caretSaid({
  draft,
  caret,
  layer,
  chordNote = null,
  mode = 'replace',
}: Pick<EditorState, 'draft' | 'caret' | 'layer'> &
  Partial<Pick<EditorState, 'chordNote' | 'mode'>>): CaretSaid {
  // The mode is a staff's: the chord row writes chords whatever it is.
  const said = mode === 'replace' || layer === 'chords' ? {} : { mode }
  return { ...placeSaid(draft, caret, layer, chordNote), ...said }
}

function placeSaid(
  draft: EditorState['draft'],
  caret: Tick,
  layer: EditorState['layer'],
  chordNote: EditorState['chordNote'],
): CaretPlace {
  if (caret >= totalTicks(draft)) return { kind: 'end' }
  const { index, start } = barAt(draft, caret)
  const at = { bar: index + 1, beat: beatOf(caret - start) }
  if (layer === 'chords') {
    const chord = chordAt(draft, caret)
    // The chord as the sheet prints it over the bar (`C♯m7`).
    return chord ? { kind: 'at', ...at, what: printedChord(chord) } : { kind: 'noChord', ...at }
  }
  // One note of a chord chosen alone: that note (ADR 0096).
  const all = notesAt(draft, layer, caret)
  const one = all.filter((n) => n.midi === chordNote)
  const notes = one.length > 0 ? one : all
  const [first] = notes
  if (first) {
    const same = notes.every((n) => n.durationTicks === first.durationTicks)
    const value = same ? valueOf(first.durationTicks, draft.meter) : null
    return { kind: 'notes', ...at, what: names(notes), value }
  }
  const held = notesOf(draft, layer).filter(
    (n) => n.startTick < caret && n.startTick + n.durationTicks > caret,
  )
  return held.length > 0
    ? { kind: 'held', ...at, what: names(held) }
    : { kind: 'rest', ...at, what: '' }
}
