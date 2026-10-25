import {
  chordSymbol,
  keyScale,
  scaleChordAt,
  type Chord,
  type Key,
  type Tick,
} from '@/shared/lib/music'
import type { Draft, DraftChord } from './draft'
import { withBar } from './notes'
import { barsOf, keyAt } from './timeline'

/**
 * A chord set where it starts in a bar: the one there replaced (its method kept), or the bar split; in
 * a bar of no chord, at its start, where a bar's chords begin (ADR 0094).
 */
export const setChord = (draft: Draft, index: number, from: Tick, chord: Chord): Draft =>
  withBar(draft, index, (bar) => {
    if (from < 0 || from >= bar.ticks) return bar
    const at = bar.chords.length === 0 ? 0 : from
    const there = bar.chords.find((placed) => placed.at === at)
    if (there && chordSymbol(there.chord) === chordSymbol(chord)) return bar
    const method = there?.method ?? bar.chords[0]?.method
    const placed: DraftChord = { at, chord, ...(method ? { method } : {}) }
    return {
      ...bar,
      chords: [...bar.chords.filter((other) => other.at !== at), placed].sort(
        (a, b) => a.at - b.at,
      ),
    }
  })

/**
 * A chord taken from its bar: its beats go to the chord before it; a bar's first chord's to the one
 * after, which then starts the bar; a bar's only chord leaves a bar of no chord (ADR 0094).
 */
export function deleteChord(draft: Draft, index: number, at: Tick): Draft {
  let changed = false
  const next = withBar(draft, index, (bar) => {
    if (!bar.chords.some((chord) => chord.at === at)) return bar
    changed = true
    const kept = bar.chords.filter((chord) => chord.at !== at)
    return { ...bar, chords: kept.map((chord, i) => (i === 0 ? { ...chord, at: 0 } : chord)) }
  })
  return changed ? next : draft
}

const DEGREES = [0, 1, 2, 3, 4, 5, 6] as const

/**
 * The key's chords, as a chord symbol is chosen from them: its triads I to vii, then its sevenths
 * (a minor key's V7 from its harmonic minor).
 */
export function keyChords(key: Key): Chord[] {
  const triads = DEGREES.map((degree) => scaleChordAt(key.tonic, keyScale(key), degree, 3))
  const sevenths = DEGREES.map((degree) =>
    scaleChordAt(key.tonic, key.minor && degree === 4 ? 'harmonic' : keyScale(key), degree, 4),
  )
  return [...triads, ...sevenths]
}

/** A symbol as typed or written, compared: its case and its ♯ ♭ left out of it. */
const comparable = (symbol: string) =>
  symbol.trim().replaceAll('♯', '#').replaceAll('♭', 'b').toLowerCase()

/**
 * The chords the chord-symbol field offers at a place as one types (ADR 0096): the key's there (its
 * section's, ADR 0089), then the song's own it lacks, each once, those whose symbol starts as typed.
 */
export function chordSuggestions(draft: Draft, tick: Tick, typed: string): Chord[] {
  const song = barsOf(draft).flatMap(({ bar }) => bar.chords.map((placed) => placed.chord))
  const offered = new Map<string, Chord>()
  for (const chord of [...keyChords(keyAt(draft, tick)), ...song])
    if (!offered.has(chordSymbol(chord))) offered.set(chordSymbol(chord), chord)
  const start = comparable(typed)
  return [...offered].filter(([symbol]) => comparable(symbol).startsWith(start)).map(([, c]) => c)
}
