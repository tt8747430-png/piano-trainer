import { keyText, PIECE_TEMPO, type KeyText } from '@/entities/piece'
import { transposeChord, transposeNotes } from '@/shared/lib/arrangement'
import {
  beatUnit,
  midi,
  parseKey,
  tempoOfMark,
  TICKS_PER_BEAT,
  PIANO,
  transposedKey,
  transposeNote,
  writtenKey,
  type Key,
  type TempoUnit,
} from '@/shared/lib/music'
import { withEveryStaff, type Draft, type DraftNote, type DraftSection } from './draft'

/** Notes moved to a new tonic, each kept on the piano by octaves. */
function moved(notes: readonly DraftNote[], from: Key, to: Key): DraftNote[] {
  return transposeNotes(notes, from.tonic, to.tonic).map((n) => {
    const kept = n.midi < PIANO.from ? n.midi + 12 : n.midi > PIANO.to ? n.midi - 12 : n.midi
    return kept === n.midi ? n : { ...n, midi: midi(kept) }
  })
}

/**
 * The music in another key: moved by the interval between the tonics, letters kept, as the Player moves
 * it; the other mode of the same tonic moves nothing.
 */
export function setKey(draft: Draft, key: Key): Draft {
  const from = draft.key
  if (keyText(from) === keyText(key)) return draft
  // A section's own key moves with its music (ADR 0089).
  const sectionKey = (written: KeyText): KeyText => {
    const own = parseKey(written)
    return own
      ? keyText(writtenKey({ ...own, tonic: transposeNote(own.tonic, from.tonic, key.tonic) }))
      : written
  }
  return withEveryStaff(
    {
      ...draft,
      key,
      sections: draft.sections.map((section) => ({
        ...section,
        heading:
          section.heading.key === undefined
            ? section.heading
            : { ...section.heading, key: sectionKey(section.heading.key) },
        lines: section.lines.map((line) =>
          line.map((bar) => ({
            ...bar,
            chords: bar.chords.map((placed) => ({
              ...placed,
              chord: transposeChord(placed.chord, from.tonic, key.tonic),
            })),
          })),
        ),
      })),
    },
    (notes) => moved(notes, from, key),
  )
}

/** What Transpose moves besides the notes (ADR 0110): the key signature, and the chord symbols. */
export interface TransposeApplies {
  readonly key: boolean
  readonly chords: boolean
}

/** Each section's key and chords taken from `from`, its bars as `to` has them otherwise. */
const keepingFrom = (
  to: readonly DraftSection[],
  from: readonly DraftSection[],
  applies: TransposeApplies,
): DraftSection[] =>
  to.map((section, s) => {
    const was = from[s]
    if (!was) return section
    return {
      heading: applies.key ? section.heading : was.heading,
      lines: applies.chords
        ? section.lines
        : section.lines.map((line, l) =>
            line.map((bar, b) => ({ ...bar, chords: was.lines[l]?.[b]?.chords ?? bar.chords })),
          ),
    }
  })

/**
 * The music moved by semitones (ADR 0110, the transpose sheets of notation apps), the short way its
 * notes move (−5 to +6), to the key spelled by its simplest signature (`transposedKey`, ADR 0104):
 * the notes always; the key signature, a section's own key too, with `key`; the chord symbols with
 * `chords`. A key kept, the notes are spelled as in the key they moved to, accidentals printed.
 */
export function transpose(draft: Draft, semitones: number, applies: TransposeApplies): Draft {
  if (semitones === 0) return draft
  const moved = setKey(draft, transposedKey(draft.key, semitones))
  if (applies.key && applies.chords) return moved
  return {
    ...moved,
    key: applies.key ? moved.key : draft.key,
    sections: keepingFrom(moved.sections, draft.sections, applies),
  }
}

/** The tempo, kept within the tempos a piece is written at. */
export function setTempo(draft: Draft, tempo: number): Draft {
  const kept = Math.min(PIECE_TEMPO.max, Math.max(PIECE_TEMPO.min, Math.round(tempo)))
  return kept === draft.tempo ? draft : { ...draft, tempo: kept }
}

/**
 * The tempo mark as its picker sets it (ADR 0114): `mark` of `unit` a minute (♪ = 180), its tempo the
 * song's beats a minute of it to a tick's part, kept within the tempos a piece is written at; the
 * unit said only where it is not the meter's beat.
 */
export function setTempoMark(draft: Draft, mark: number, unit: TempoUnit): Draft {
  const beats = Math.round(tempoOfMark(mark, unit, draft.meter) * TICKS_PER_BEAT) / TICKS_PER_BEAT
  const tempo = Math.min(PIECE_TEMPO.max, Math.max(PIECE_TEMPO.min, beats))
  const { tempoUnit: _was, ...rest } = draft
  const next: Draft =
    unit === beatUnit(draft.meter) ? { ...rest, tempo } : { ...rest, tempo, tempoUnit: unit }
  return next.tempo === draft.tempo && next.tempoUnit === draft.tempoUnit ? draft : next
}
