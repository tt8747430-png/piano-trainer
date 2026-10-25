import { keyText, PIECE_TEMPO, type KeyText } from '@/entities/piece'
import { transposeChord, transposeNotes } from '@/shared/lib/arrangement'
import { midi, parseKey, PIANO, transposeNote, writtenKey, type Key } from '@/shared/lib/music'
import { withEveryStaff, type Draft, type DraftNote } from './draft'

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

/** The tempo, kept within the tempos a piece is written at. */
export function setTempo(draft: Draft, tempo: number): Draft {
  const kept = Math.min(PIECE_TEMPO.max, Math.max(PIECE_TEMPO.min, Math.round(tempo)))
  return kept === draft.tempo ? draft : { ...draft, tempo: kept }
}
