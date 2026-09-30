import {
  noteName,
  pitchClass,
  pitchClassOf,
  rangeOf,
  scaleChordHolds,
  scaleKey,
  spellInKey,
  spellScale,
  type Finger,
  type KeyRange,
  type Midi,
  type PlacedScaleChord,
  type PlacedTone,
  type ScaleKind,
  type SpelledNote,
} from '@/shared/lib/music'
import type { KeyMark } from '@/shared/ui'

/** Scale view: each degree's key, the tonic's in its own colour, with its degree and a hand's finger. */
export function scaleMarks(
  placed: readonly PlacedTone[],
  fingering: readonly Finger[] | null,
): Map<Midi, KeyMark> {
  return new Map(
    placed.map((key, i) => {
      const finger = fingering?.[i]
      return [
        key.midi,
        {
          tone: key.tone.role === 'root' ? 'tonic' : 'scale',
          label: key.tone.degree,
          ...(finger === undefined ? {} : { finger }),
        },
      ]
    }),
  )
}

/** Chords view: each degree's key with its numeral over its chord (The Ultimate Piano's Diatonic). */
export function chordMarks(chords: readonly PlacedScaleChord[]): Map<Midi, KeyMark> {
  return new Map(
    chords.map((placed, i) => [
      placed.key,
      { tone: i === 0 ? 'tonic' : 'scale', label: placed.symbol, caption: placed.numeral },
    ]),
  )
}

/** What a key plays in Chords view: a degree's key its chord, stacked from it; any other key itself. */
export function chordKeyPlays(chords: readonly PlacedScaleChord[]): (key: Midi) => readonly Midi[] {
  const byKey = new Map(chords.map((placed) => [placed.key, placed.tones.map((tone) => tone.midi)]))
  return (key) => byKey.get(key) ?? [key]
}

/** Every key the chords play, from the tonic up: the keyboard fills its width with them. */
export const chordsRange = (chords: readonly PlacedScaleChord[]): KeyRange | undefined =>
  rangeOf(chords.flatMap((placed) => placed.tones.map((tone) => tone.midi)))

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
