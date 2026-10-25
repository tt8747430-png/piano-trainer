import type { Performance, PerformedChord } from '@/shared/lib/arrangement'
import {
  pitchClass,
  pitchClassOf,
  placeChord,
  spellInKey,
  type Key,
  type Midi,
  type PitchClass,
  type SpelledNote,
} from '@/shared/lib/music'

// A chord as its diagram draws it (ADR 0099): the keys the Player's right hand plays it with.

/** A chord of the music as a diagram shows it. */
export interface DiagramChord {
  /** Where it sounds: its index among the performance's chords. */
  readonly chord: number
  readonly symbol: string
  /** The keys its diagram marks, lowest first. */
  readonly keys: readonly Midi[]
  /** Those keys' notes as the chord spells them, lowest first. */
  readonly notes: readonly SpelledNote[]
  /** Every note the chord has, its root first: its tones, and a slash chord's bass. */
  readonly pitchClasses: readonly PitchClass[]
}

/**
 * The keys a performed chord is drawn with: the right hand's chord as the Player voices it; where its
 * figure voices none (a tune, a figure of its own shapes, a bar written out), the chord's tones close
 * from its root, from middle C up. None for a chord the music has not.
 */
export function diagramKeys(performance: Performance, chord: number): Midi[] {
  const performed = performance.chords[chord]
  if (!performed) return []
  const keys =
    performed.hand ??
    placeChord(performed.tones, { inversion: 0, bothHands: false }).rh.map(({ midi }) => midi)
  return keys.toSorted((a, b) => a - b)
}

/** A key's note as the chord spells it: one of its tones, else as the key spells it. */
const spelledIn = (performed: PerformedChord, key: Midi, musicKey: Key): SpelledNote =>
  performed.tones.find((tone) => tone.pitchClass === pitchClass(key))?.note ??
  spellInKey(pitchClass(key), musicKey)

/** A performed chord as its diagram shows it; none for a chord the music has not. */
export function diagramChord(performance: Performance, chord: number): DiagramChord | null {
  const performed = performance.chords[chord]
  if (!performed) return null
  const keys = diagramKeys(performance, chord)
  const tones = performed.tones.map((tone) => tone.pitchClass)
  const bass = performed.bass ? pitchClassOf(performed.bass) : undefined
  return {
    chord,
    symbol: performed.symbol,
    keys,
    notes: keys.map((key) => spelledIn(performed, key, performance.key)),
    pitchClasses: bass === undefined || tones.includes(bass) ? tones : [...tones, bass],
  }
}

/**
 * The music's chords in the order they first sound, each symbol once, as it is first voiced: its
 * chord summary.
 */
export function chordSummary(performance: Performance): DiagramChord[] {
  const seen = new Set<string>()
  return performance.chords.flatMap((performed, chord) => {
    if (seen.has(performed.symbol)) return []
    seen.add(performed.symbol)
    return diagramChord(performance, chord) ?? []
  })
}
