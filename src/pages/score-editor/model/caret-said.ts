import {
  barAt,
  notesAt,
  notesOf,
  totalTicks,
  type DraftNote,
  type EditorState,
} from '@/features/score-editor'
import { chordSymbol, TICKS_PER_BEAT, writtenName, type Meter, type Tick } from '@/shared/lib/music'
import { ticksOf, valuesOf, type Duration } from '@/shared/lib/notation'

interface Place {
  readonly bar: number
  readonly beat: string
}

/** What the caret line says: where the caret is, and what is there. */
export type CaretSaid =
  | { readonly kind: 'end' }
  | (Place & {
      readonly kind: 'notes'
      readonly what: string
      /** The value they are written as; none for a length no one value writes (tied over). */
      readonly value: Duration | null
    })
  | (Place & { readonly kind: 'at' | 'held' | 'rest' | 'pattern'; readonly what: string })

/** A beat counted from 1, a part of one as a decimal: 1, 2.5. */
const beatOf = (ticks: number) => String(Math.round((ticks / TICKS_PER_BEAT + 1) * 100) / 100)

/** The one value a length is written as in the meter, plain, dotted or a triplet's; or none. */
const valueOf = (ticks: Tick, meter: Meter): Duration | null =>
  [...valuesOf(meter, false), ...valuesOf(meter, true)].find(
    (duration) => ticksOf(duration, meter) === ticks,
  ) ?? null

const names = (notes: readonly DraftNote[]) =>
  notes.map((n) => writtenName(n.midi, n.spelled)).join(' ')

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
