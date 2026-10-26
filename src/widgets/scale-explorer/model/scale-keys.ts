import {
  noteName,
  pitchClass,
  pitchClassOf,
  printedSymbol,
  scaleChordHolds,
  scaleKey,
  spellInKey,
  spellScale,
  type Midi,
  type PlacedScaleChord,
  type ScaleKind,
  type SpelledNote,
} from '@/shared/lib/music'
import type { KeyMark } from '@/shared/ui'

/**
 * Chords view: each degree's key with its numeral over its chord (The Ultimate Piano's Diatonic), the
 * chord printed as the sheets print it (`vi` over `F♯m`).
 */
export function chordMarks(chords: readonly PlacedScaleChord[]): Map<Midi, KeyMark> {
  return new Map(
    chords.map((placed, i) => [
      placed.key,
      {
        tone: i === 0 ? 'tonic' : 'scale',
        label: printedSymbol(placed.symbol),
        caption: placed.numeral,
      },
    ]),
  )
}

/** What a key plays in Chords view: a degree's key its chord, stacked from it; any other key itself. */
export function chordKeyPlays(chords: readonly PlacedScaleChord[]): (key: Midi) => readonly Midi[] {
  const byKey = new Map(chords.map((placed) => [placed.key, placed.tones.map((tone) => tone.midi)]))
  return (key) => byKey.get(key) ?? [key]
}

/** The key's chords that hold a note, in any octave, in the scale's order. */
export const chordsHolding = (
  chords: readonly PlacedScaleChord[],
  note: Midi,
): PlacedScaleChord[] => chords.filter((placed) => scaleChordHolds(placed.chord, pitchClass(note)))

/** A key a hand played, named as the scale spells it, or, not in the scale, as the scale's key does. */
export function heardName(note: Midi, root: SpelledNote, kind: ScaleKind): string {
  const pc = pitchClass(note)
  const inScale = spellScale(root, kind).find((tone) => pitchClassOf(tone.note) === pc)
  return noteName(inScale ? inScale.note : spellInKey(pc, scaleKey(root, kind)))
}
