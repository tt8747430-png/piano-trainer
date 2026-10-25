import type { Performance, PerformedChord } from '@/shared/lib/arrangement'
import {
  midi,
  pitchClass,
  pitchClassOf,
  placeChord,
  spellInKey,
  type Key,
  type Midi,
  type PitchClass,
  type SpelledNote,
} from '@/shared/lib/music'

// A chord as its diagram draws it (ADR 0099): the keys the Player's right hand plays it with, over
// the bass the left hand plays where the right leaves it out.

/** A chord of the music as a diagram shows it. */
export interface DiagramChord {
  /** Where it sounds: its index among the performance's chords. */
  readonly chord: number
  readonly symbol: string
  /** The keys its diagram marks, lowest first. */
  readonly keys: readonly Midi[]
  /** Its lowest key is the chord's bass, which the right hand leaves to the left: drawn as a ring. */
  readonly bass: boolean
  /** Those keys' notes as the chord spells them, lowest first. */
  readonly notes: readonly SpelledNote[]
  /** Every note the chord has, its root first: its tones, and a slash chord's bass. */
  readonly pitchClasses: readonly PitchClass[]
}

/** A chord's bass as its symbol writes it: a slash chord's, else its root. */
const bassOf = (performed: PerformedChord): PitchClass =>
  pitchClassOf(performed.bass ?? performed.root)

/**
 * A performed chord's keys, lowest first: the right hand's chord as the Player voices it; where its
 * figure voices none (a tune, a figure of its own shapes, a bar written out), the chord's tones close
 * from its root, from middle C up. Where the hand leaves the chord's bass to the left (a 7th's root,
 * a slash chord's bass), the bass is the nearest key below it, so every note of the chord is drawn.
 */
function drawnKeys(performed: PerformedChord): { keys: Midi[]; bass: boolean } {
  const hand = (
    performed.hand ??
    placeChord(performed.tones, { inversion: 0, bothHands: false }).rh.map(({ midi }) => midi)
  ).toSorted((a, b) => a - b)
  const bass = bassOf(performed)
  const lowest = hand[0]
  if (lowest === undefined || hand.some((key) => pitchClass(key) === bass)) {
    return { keys: hand, bass: false }
  }
  // The hand has not the bass's pitch class, so it is 1 to 11 semitones under its lowest key.
  const under = (pitchClass(lowest) - bass + 12) % 12
  return { keys: [midi(lowest - under), ...hand], bass: true }
}

/** The keys a performed chord is drawn with (`drawnKeys`); none for a chord the music has not. */
export function diagramKeys(performance: Performance, chord: number): Midi[] {
  const performed = performance.chords[chord]
  return performed ? drawnKeys(performed).keys : []
}

/** A key's note as the chord spells it: one of its tones or its bass, else as the key spells it. */
const spelledIn = (performed: PerformedChord, key: Midi, musicKey: Key): SpelledNote =>
  performed.tones.find((tone) => tone.pitchClass === pitchClass(key))?.note ??
  (performed.bass && pitchClassOf(performed.bass) === pitchClass(key)
    ? performed.bass
    : spellInKey(pitchClass(key), musicKey))

/** A performed chord as its diagram shows it; none for a chord the music has not. */
export function diagramChord(performance: Performance, chord: number): DiagramChord | null {
  const performed = performance.chords[chord]
  if (!performed) return null
  const { keys, bass: drawnBass } = drawnKeys(performed)
  const tones = performed.tones.map((tone) => tone.pitchClass)
  const bass = performed.bass ? pitchClassOf(performed.bass) : undefined
  return {
    chord,
    symbol: performed.symbol,
    keys,
    bass: drawnBass,
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
