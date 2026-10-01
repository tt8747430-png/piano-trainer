import { keyScale, scaleChordAt, type Chord, type Key, type Tick } from '@/shared/lib/music'
import type { Draft, DraftChord } from './draft'
import { withBar } from './notes'

/** A chord set where it starts in a bar: the one there replaced (its method kept), or the bar split. */
export const setChord = (draft: Draft, index: number, at: Tick, chord: Chord): Draft =>
  withBar(draft, index, (bar) => {
    if (at < 0 || at >= bar.ticks) return bar
    const there = bar.chords.find((placed) => placed.at === at)
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
 * after, which then starts the bar; a bar's only chord stays.
 */
export function deleteChord(draft: Draft, index: number, at: Tick): Draft {
  let changed = false
  const next = withBar(draft, index, (bar) => {
    if (bar.chords.length < 2 || !bar.chords.some((chord) => chord.at === at)) return bar
    changed = true
    const kept = bar.chords.filter((chord) => chord.at !== at)
    return { ...bar, chords: kept.map((chord, i) => (i === 0 ? { ...chord, at: 0 } : chord)) }
  })
  return changed ? next : draft
}

/** The key's chords to tap: its seven triads, then its V7 (a minor key's from its harmonic minor). */
export function keyChords(key: Key): Chord[] {
  const triads = [0, 1, 2, 3, 4, 5, 6].map((degree) =>
    scaleChordAt(key.tonic, keyScale(key), degree, 3),
  )
  return [...triads, scaleChordAt(key.tonic, key.minor ? 'harmonic' : 'major', 4, 4)]
}
