import type { Performance } from '@/shared/lib/arrangement'
import {
  letterIndex,
  pitchClass,
  writtenOctave,
  type ChordRole,
  type Midi,
  type SpelledNote,
} from '@/shared/lib/music'

/** One note of a run's chord on the treble staff: its steps above middle C and its written accidental. */
export interface RunNote {
  /** Diatonic steps from C4: E4 is 2, B3 is −1. */
  readonly step: number
  readonly accidental: SpelledNote['accidental']
}

/** One key of a run's chord on the piano: its role's paint and its note as the chord spells it. */
export interface RunKey {
  readonly midi: Midi
  readonly role: ChordRole
  readonly note: SpelledNote
}

/** A run's chord as the run view shows it: a whole note on the treble staff, its keys lit. */
export interface RunChord {
  readonly notes: readonly RunNote[]
  readonly keys: readonly RunKey[]
}

/**
 * The run's chords as the run boards draw them (`r56_results.py`'s `PV_LINE`): each the right hand's
 * chord as it is voiced, spelled as its chord spells it, lowest first. A chord whose right hand plays
 * no voiced chord (a figure of its own) reads its right hand's notes.
 */
export function runChords(performance: Performance): RunChord[] {
  return performance.chords.map((chord, index) => {
    const voiced =
      chord.hand ??
      performance.notes
        .filter((each) => each.chord === index && each.hand === 'rh' && each.silent !== true)
        .map((each) => each.midi)
    const keys = [...new Set(voiced)]
      .sort((a, b) => a - b)
      .flatMap((key): RunKey[] => {
        const tone = chord.tones.find((each) => each.pitchClass === pitchClass(key))
        return tone ? [{ midi: key, role: tone.role, note: tone.note }] : []
      })
    const notes = keys.map((key) => ({
      step: letterIndex(key.note.letter) + 7 * (writtenOctave(key.midi, key.note) - 4),
      accidental: key.note.accidental,
    }))
    return { notes, keys }
  })
}

/**
 * Where a run stands (the boards' "Chord 1 of 8", "Key 1 of 12"): a run through the keys counts its
 * keys, one in a key its chords.
 */
export interface RunPlace {
  readonly unit: 'chord' | 'key'
  /** From 1. */
  readonly at: number
  readonly of: number
}

export function runPlace(chord: number, chords: number, keys: number): RunPlace {
  if (keys <= 1) return { unit: 'chord', at: chord + 1, of: chords }
  const perKey = Math.max(1, Math.round(chords / keys))
  return { unit: 'key', at: Math.min(keys, Math.floor(chord / perKey) + 1), of: keys }
}
