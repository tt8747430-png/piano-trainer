import { HAND_IDS } from '@/entities/piece'
import {
  barsOf,
  lyricsLayer,
  sectionKey,
  sectionMeter,
  type Draft,
  type DraftNote,
  type NoteLayer,
} from '@/features/score-editor'
import { barMarksOf, chordSymbol, keySignature, TICKS_PER_BEAT } from '@/shared/lib/music'
import { singleStaff, staffPlace, type TimedMusic, type TimedNote } from '@/shared/lib/notation'

/** How a layer's notes are timed: a hand's, or a single staff's by its place. */
const playedBy = (layer: NoteLayer): Pick<TimedNote, 'hand' | 'staff'> =>
  layer === 'rh' || layer === 'lh' ? { hand: layer } : { hand: 'staff', staff: staffPlace(layer) }

const timed = (notes: readonly DraftNote[], layer: NoteLayer, sings: boolean): TimedNote[] =>
  notes.map((n) => ({
    midi: n.midi,
    spelled: n.spelled,
    ...playedBy(layer),
    startTick: n.startTick,
    durationTicks: n.durationTicks,
    ...(n.finger === undefined ? {} : { finger: n.finger }),
    ...(n.marks ? { marks: n.marks } : {}),
    ...(sings && n.lyrics ? { lyrics: n.lyrics } : {}),
  }))

/**
 * The whole of a draft as timed music, as a file writes it (ADR 0107): every single staff and the
 * piano's two staves (a lead sheet's too: kept, its file says not printed), the words under the staff
 * they are on, each section's key and meter on its bars, the tempo over the first, the chord
 * symbols.
 */
export function draftMusic(draft: Draft): TimedMusic {
  const sung = lyricsLayer(draft)
  const notes = [
    ...draft.staves.flatMap((staff, place) =>
      timed(staff.notes, singleStaff(place), sung === singleStaff(place)),
    ),
    ...HAND_IDS.flatMap((hand) => timed(draft.hands[hand], hand, sung === hand)),
  ]
  const placed = barsOf(draft)
  const bars = placed.map(({ start, bar, section, index }) => {
    const key = sectionKey(draft, section)
    const meter = sectionMeter(draft, section)
    return {
      startTick: start,
      beats: bar.ticks / TICKS_PER_BEAT,
      ...(index === 0 ? { tempo: draft.tempo } : {}),
      ...barMarksOf(bar),
      ...(keySignature(key) !== keySignature(draft.key) || key.minor !== draft.key.minor
        ? { key }
        : {}),
      ...(meter === draft.meter ? {} : { meter }),
      ...(bar.clefs ? { clefs: bar.clefs } : {}),
    }
  })
  const chords = placed.flatMap(({ start, bar }) =>
    bar.chords.map((chord) => ({ startTick: start + chord.at, symbol: chordSymbol(chord.chord) })),
  )
  return {
    key: draft.key,
    meter: draft.meter,
    ...(draft.timeSymbol ? { timeSymbol: true } : {}),
    ...(draft.tempoUnit ? { tempoUnit: draft.tempoUnit } : {}),
    bars,
    notes,
    chords,
    ...(draft.staves.length > 0 ? { staves: draft.staves.map(({ clef }) => ({ clef })) } : {}),
  }
}
