import {
  numeralOf,
  numeralText,
  type Articulation,
  type Dynamic,
  type Expression,
  type Hairpin,
  type NoteMarks,
  type OctaveLine,
  type Ornament,
  type Pedal,
  type SwingMark,
  type TremoloStrokes,
} from '@/shared/lib/music'
import type { Draft, DraftNote, NoteLayer } from './draft'
import { isAt, notesOf, withNotes, type Where } from './notes'
import { chordAt, keyAt } from './timeline'

/** A mark the palette puts on notes (ADR 0097). */
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
  | { readonly kind: 'swing'; readonly swing: SwingMark }
  | { readonly kind: 'twoNoteTremolo'; readonly strokes: TremoloStrokes }

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
    case 'swing':
      return marks?.swing === mark.swing
    case 'twoNoteTremolo':
      return marks?.twoNoteTremolo === mark.strokes
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
    case 'swing':
      if (on) next.swing = mark.swing
      else if (next.swing === mark.swing) delete next.swing
      break
    case 'twoNoteTremolo':
      if (on) next.twoNoteTremolo = mark.strokes
      else if (next.twoNoteTremolo === mark.strokes) delete next.twoNoteTremolo
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
 * A mark toggled on the notes `span` takes: at the caret (or a chord's one note) each marked as
 * itself; over a span of notes chosen, a slur or a hairpin or the pedal from the first onset to the
 * last, a dynamic or an expression on the first, any other mark on them all. On where any lacks it,
 * else off.
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
    end !== null ||
    (spans && (mark.kind === 'dynamic' || mark.kind === 'expression' || mark.kind === 'swing'))
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

/** What words a note's first onset in a span carries: a tempo mark, a Roman numeral, free text (ADR 0097). */
type Words = Pick<NoteMarks, 'tempo' | 'numeral' | 'text'>

/** The notes of a span's first onset with their words changed, every note there alike. */
function wordsOnFirst(
  draft: Draft,
  layer: NoteLayer,
  span: Where,
  words: (now: NoteMarks | undefined, tick: number) => Partial<Record<keyof Words, unknown>>,
): Draft {
  const notes = notesOf(draft, layer)
  const inSpan = notes.filter(isAt(span))
  if (inSpan.length === 0) return draft
  const first = Math.min(...inSpan.map((n) => n.startTick))
  const there = notes.filter((n) => n.startTick === first)
  const change = words(there[0]?.marks, first)
  return withNotes(
    draft,
    layer,
    notes.map((n) => {
      if (n.startTick !== first) return n
      const next: Writable = { ...n.marks }
      for (const [key, value] of Object.entries(change)) {
        const field = key as keyof Words
        if (value === undefined) delete next[field]
        else Object.assign(next, { [field]: value })
      }
      const { marks: _old, ...note } = n
      return Object.keys(next).length > 0 ? { ...note, marks: next } : note
    }),
  )
}

/**
 * A tempo mark at the span's first onset (ADR 0097): the song's beats a minute from there on; null
 * takes it off.
 */
export const setTempoChange = (draft: Draft, layer: NoteLayer, span: Where, tempo: number | null) =>
  wordsOnFirst(draft, layer, span, () => ({ tempo: tempo ?? undefined }))

/** Free text over the span's first onset, as typed; empty takes it off. */
export const setText = (draft: Draft, layer: NoteLayer, span: Where, text: string) =>
  wordsOnFirst(draft, layer, span, () => ({ text: text.trim() === '' ? undefined : text.trim() }))

/**
 * The Roman numeral of the chord sounding at the span's first onset, in the key there, put under it
 * (from the numerals kernel, ADR 0097), or taken off where it is there; none in a bar of no chord.
 */
export const toggleNumeral = (draft: Draft, layer: NoteLayer, span: Where) =>
  wordsOnFirst(draft, layer, span, (now, tick) => {
    if (now?.numeral) return { numeral: undefined }
    const chord = chordAt(draft, tick)
    const numeral = chord ? numeralOf(chord, keyAt(draft, tick)) : null
    return numeral ? { numeral: numeralText(numeral) } : {}
  })
