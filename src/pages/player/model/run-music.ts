import type { RunKey as HistoryKey, RunStep, StaffNote } from '@/entities/progress'
import type { Performance } from '@/shared/lib/arrangement'
import {
  letterIndex,
  pitchClass,
  writtenOctave,
  type ChordRole,
  type Midi,
  type SpelledNote,
} from '@/shared/lib/music'

/** One key of a run's chord on the piano: its role's paint and its note as the chord spells it. */
export interface RunKey {
  readonly midi: Midi
  readonly role: ChordRole
  readonly note: SpelledNote
}

/** A run's chord as the run view shows it: a whole note on the treble staff, its keys lit. */
export interface RunChord {
  readonly notes: readonly StaffNote[]
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

/**
 * The keys an engraved run (an exercise's line) sounds at a beat group, lowest first, and those of
 * them that are a tone of its chord, to be painted as that tone; the others light plain.
 */
export function soundingKeys(
  performance: Performance,
  at: number,
): { readonly keys: readonly Midi[]; readonly marked: readonly RunKey[] } {
  const group = performance.beatGroups[at]
  const keys = [
    ...new Set(group?.notes.flatMap((index) => performance.notes[index]?.midi ?? []) ?? []),
  ].sort((a, b) => a - b)
  const chord = group?.chord === undefined ? undefined : performance.chords[group.chord]
  const marked = keys.flatMap((key): RunKey[] => {
    const tone = chord?.tones.find((each) => each.pitchClass === pitchClass(key))
    return tone ? [{ midi: key, role: tone.role, note: tone.note }] : []
  })
  return { keys, marked }
}

/** A short, steady name for a text: FNV-1a, in base 36. */
function hashOf(text: string): string {
  let hash = 0x811c9dc5
  for (const char of text) {
    hash ^= char.codePointAt(0) ?? 0
    hash = Math.imul(hash, 0x01000193) >>> 0
  }
  return hash.toString(36)
}

/**
 * Where a played run's attempts are counted: the run (its path, `/play/exercise/hanon-1`) and its
 * choices (its search), so the same run with the same root and tempo ladder is the same key.
 */
export function playedKey(pathname: string, search: string): HistoryKey {
  const run = pathname
    .split('/')
    .filter((part) => part !== '' && part !== 'play')
    .join('-')
    .toLowerCase()
    .replaceAll(/[^a-z0-9-]+/g, '-')
  return `play:${run || 'run'}:${hashOf(search)}`
}

/** Each bar of a Wait pass as it went: a slip, else a pause of over two beats, else played at once. */
export function playedSteps(
  bars: number,
  slips: Readonly<Partial<Record<number, number>>>,
  pauses: Readonly<Partial<Record<number, number>>>,
): RunStep[] {
  return Array.from({ length: bars }, (_, bar): RunStep =>
    (slips[bar] ?? 0) > 0 ? 'slip' : (pauses[bar] ?? 0) > 0 ? 'pause' : 'clean',
  )
}
