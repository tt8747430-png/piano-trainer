import {
  noteName,
  pitchClass,
  spellChord,
  type Chord,
  type ChordRole,
  type Midi,
} from '@/shared/lib/music'
import type { KeyMark, ShownKeys } from '@/shared/ui'

/** The four voices of a chorale, from the bass up: bass, tenor, alto, soprano. */
export const VOICES = ['B', 'T', 'A', 'S'] as const

/**
 * A four-voice chord on the keys: each key its voice's letter, in its chord tone's colour, the bass
 * first. Where the chord before is given, each key a voice left keeps its letter, faint, so the
 * voices' moves show. A chord not of four keys names no voices.
 */
export function satbShown(
  chord: Chord,
  keys: readonly Midi[],
  before: readonly Midi[] = [],
): ShownKeys {
  const marks = new Map<Midi, KeyMark>()
  const voiced = [...keys].sort((a, b) => a - b)
  if (voiced.length !== VOICES.length) return { keys, marks }
  const tones = spellChord(chord.root, chord.quality)
  const roleOf = (key: Midi): ChordRole | undefined =>
    tones.find((tone) => tone.pitchClass === pitchClass(key))?.role
  const left = [...before].sort((a, b) => a - b)
  voiced.forEach((key, voice) => {
    const label = VOICES[voice] ?? ''
    const tone = roleOf(key) ?? 'root'
    const was = left.length === VOICES.length ? left[voice] : undefined
    if (was !== undefined && was !== key && !voiced.includes(was))
      marks.set(was, { tone, label, ghost: true })
    const spelled = tones.find((each) => each.pitchClass === pitchClass(key))?.note
    marks.set(key, { tone, label, ...(spelled ? { note: noteName(spelled) } : {}) })
  })
  return { keys, marks }
}
