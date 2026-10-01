import { barAt, notesAt, totalTicks, type EditorState } from '@/features/score-editor'
import { chordSymbol, noteName, TICKS_PER_BEAT, writtenOctave } from '@/shared/lib/music'

/** What the caret line says: where the caret is, and what is there. */
export type CaretSaid =
  | { readonly kind: 'end' }
  | {
      readonly kind: 'at' | 'rest' | 'pattern'
      readonly bar: number
      readonly beat: string
      readonly what: string
    }

/** A beat counted from 1, a part of one as a decimal: 1, 2.5. */
const beatOf = (ticks: number) => String(Math.round((ticks / TICKS_PER_BEAT + 1) * 100) / 100)

export function caretSaid({
  draft,
  caret,
  layer,
}: Pick<EditorState, 'draft' | 'caret' | 'layer'>): CaretSaid {
  if (caret >= totalTicks(draft)) return { kind: 'end' }
  const { index, start, bar } = barAt(draft, caret)
  const at = { bar: index + 1, beat: beatOf(caret - start) }
  if (layer === 'chords') {
    const chord = bar.chords.findLast((placed) => placed.at <= caret - start)
    return { kind: 'at', ...at, what: chord ? chordSymbol(chord.chord) : '' }
  }
  if (layer !== 'melody' && !bar[layer]) return { kind: 'pattern', ...at, what: '' }
  const notes = notesAt(draft, layer, caret)
  if (notes.length === 0) return { kind: 'rest', ...at, what: '' }
  return {
    kind: 'at',
    ...at,
    what: notes.map((n) => `${noteName(n.spelled)}${writtenOctave(n.midi, n.spelled)}`).join(' '),
  }
}
