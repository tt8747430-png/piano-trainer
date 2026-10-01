import type { PatternId } from '@/entities/pattern'
import { PIECE_TEMPO } from '@/entities/piece'
import { transposeChord, transposeNotes } from '@/shared/lib/arrangement'
import { midi, PIANO, type Key } from '@/shared/lib/music'
import type { Draft, DraftNote } from './draft'

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
  return {
    ...draft,
    key,
    sections: draft.sections.map((section) => ({
      ...section,
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
    melody: moved(draft.melody, from, key),
    hands: { rh: moved(draft.hands.rh, from, key), lh: moved(draft.hands.lh, from, key) },
  }
}

/** The tempo, kept within the tempos a piece is written at. */
export const setTempo = (draft: Draft, tempo: number): Draft => ({
  ...draft,
  tempo: Math.min(PIECE_TEMPO.max, Math.max(PIECE_TEMPO.min, Math.round(tempo))),
})

export const setPattern = (draft: Draft, pattern: PatternId): Draft => ({ ...draft, pattern })
