import type {
  Articulation,
  Dynamic,
  Expression,
  Hairpin,
  NoteMarks,
  OctaveLine,
  Ornament,
  Pedal,
} from '@/shared/lib/music'
import type { Draft, DraftNote, NoteLayer } from './draft'
import { isAt, notesOf, withNotes, type Where } from './notes'

/** A mark the palette puts on notes (ADR 0063). */
export type MarkChoice =
  | { readonly kind: 'articulation'; readonly articulation: Articulation }
  | { readonly kind: 'ornament'; readonly ornament: Ornament }
  | { readonly kind: 'arpeggio' }
  | { readonly kind: 'slurStart' }
  | { readonly kind: 'slurEnd' }
  | { readonly kind: 'octave'; readonly octave: OctaveLine }
  | { readonly kind: 'dynamic'; readonly dynamic: Dynamic }
  | { readonly kind: 'hairpin'; readonly hairpin: Hairpin }
  | { readonly kind: 'expression'; readonly expression: Expression }
  | { readonly kind: 'pedal'; readonly pedal: Pedal }

type Writable = { -readonly [K in keyof NoteMarks]: NoteMarks[K] }

/** Whether marks hold the mark chosen. */
export function hasMark(marks: NoteMarks | undefined, mark: MarkChoice): boolean {
  switch (mark.kind) {
    case 'articulation':
      return marks?.articulations?.includes(mark.articulation) ?? false
    case 'ornament':
      return marks?.ornament === mark.ornament
    case 'octave':
      return marks?.octave === mark.octave
    case 'dynamic':
      return marks?.dynamic === mark.dynamic
    case 'hairpin':
      return marks?.hairpin === mark.hairpin
    case 'expression':
      return marks?.expression === mark.expression
    case 'pedal':
      return marks?.pedal === mark.pedal
    default:
      return marks?.[mark.kind] === true
  }
}

/** Marks with the mark put on (one of a kind in place of another) or taken off; none left, undefined. */
export function withMark(
  marks: NoteMarks | undefined,
  mark: MarkChoice,
  on: boolean,
): NoteMarks | undefined {
  const next: Writable = { ...marks }
  switch (mark.kind) {
    case 'articulation': {
      const kept = (marks?.articulations ?? []).filter((a) => a !== mark.articulation)
      const articulations = on ? [...kept, mark.articulation] : kept
      if (articulations.length > 0) next.articulations = articulations
      else delete next.articulations
      break
    }
    case 'ornament':
      if (on) next.ornament = mark.ornament
      else if (next.ornament === mark.ornament) delete next.ornament
      break
    case 'octave':
      if (on) next.octave = mark.octave
      else if (next.octave === mark.octave) delete next.octave
      break
    case 'dynamic':
      if (on) next.dynamic = mark.dynamic
      else if (next.dynamic === mark.dynamic) delete next.dynamic
      break
    case 'hairpin':
      if (on) next.hairpin = mark.hairpin
      else if (next.hairpin === mark.hairpin) delete next.hairpin
      break
    case 'expression':
      if (on) next.expression = mark.expression
      else if (next.expression === mark.expression) delete next.expression
      break
    case 'pedal':
      if (on) next.pedal = mark.pedal
      else if (next.pedal === mark.pedal) delete next.pedal
      break
    default:
      if (on) next[mark.kind] = true
      else delete next[mark.kind]
  }
  return Object.keys(next).length > 0 ? next : undefined
}

const marked = (n: DraftNote, mark: MarkChoice, on: boolean): DraftNote => {
  const { marks: _old, ...note } = n
  const marks = withMark(n.marks, mark, on)
  return marks ? { ...note, marks } : note
}

/**
 * What a mark over a span of notes ends with: a slur its `)`, a hairpin its end, the pedal its
 * release; none for the rest.
 */
function endOf(mark: MarkChoice): MarkChoice | null {
  if (mark.kind === 'slurStart' || mark.kind === 'slurEnd') return { kind: 'slurEnd' }
  if (mark.kind === 'hairpin' && mark.hairpin !== 'end') return { kind: 'hairpin', hairpin: 'end' }
  if (mark.kind === 'pedal' && mark.pedal === 'down') return { kind: 'pedal', pedal: 'up' }
  return null
}

/**
 * A mark toggled on the notes at the caret, or over the notes starting in a span of bars: a slur or a
 * hairpin or the pedal from the first onset to the last, a dynamic or an expression on the first, any
 * other mark on them all. On
 * where any lacks it, else off.
 */
export function markNotes(draft: Draft, layer: NoteLayer, span: Where, mark: MarkChoice): Draft {
  const notes = notesOf(draft, layer)
  const inSpan = notes.filter(isAt(span))
  if (inSpan.length === 0) return draft
  const first = Math.min(...inSpan.map((n) => n.startTick))
  const last = Math.max(...inSpan.map((n) => n.startTick))
  // A span of notes: a note or a chord at the caret is marked as itself.
  const spans = typeof span !== 'number' && 'from' in span
  const end = spans ? endOf(mark) : null
  const start: MarkChoice = end && mark.kind === 'slurEnd' ? { kind: 'slurStart' } : mark
  const startsOnFirst =
    end !== null || (spans && (mark.kind === 'dynamic' || mark.kind === 'expression'))
  const targets = startsOnFirst ? inSpan.filter((n) => n.startTick === first) : inSpan
  const on = !targets.every((n) => hasMark(n.marks, start))
  return withNotes(
    draft,
    layer,
    notes.map((n) => {
      if (!inSpan.includes(n)) return n
      let changed = targets.includes(n) ? marked(n, start, on) : n
      if (end && n.startTick === last && last !== first) changed = marked(changed, end, on)
      return changed
    }),
  )
}
