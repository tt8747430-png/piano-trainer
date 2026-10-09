import type { Finger, Hand, Midi, SpelledNote, Tick } from '@/shared/lib/music'
import type { Stem } from './types'

/** A note of a chord in one bar: whether it goes on from the bar before, or into the next. */
export interface BarNote {
  readonly midi: Midi
  readonly spelled: SpelledNote
  readonly finger?: Finger
  readonly tiedFrom: boolean
  readonly tiedTo: boolean
}

/** One hand's notes sounding together in a bar, from `start` to `end` (ticks from the bar's start). */
export interface BarChord {
  readonly hand: Hand | 'melody'
  readonly start: Tick
  readonly end: Tick
  readonly notes: readonly BarNote[]
}

/** A voice's chords in time order, not yet written in values, and its stem. */
export interface VoiceChords {
  readonly chords: readonly BarChord[]
  readonly stem: Stem
}

const MAX_VOICES = 2

const top = (chord: BarChord) => Math.max(...chord.notes.map((n) => n.midi))
const endOf = (voice: readonly BarChord[]) => voice.at(-1)?.end ?? 0
const meanPitch = (voice: readonly BarChord[]) => {
  const keys = voice.flatMap((chord) => chord.notes.map((n) => n.midi))
  return keys.reduce((sum, key) => sum + key, 0) / keys.length
}

/** A chord's notes written to end at `end`: a note cut short no longer goes into the next bar. */
const endingAt = (chord: BarChord, end: Tick): BarNote[] =>
  chord.notes.map((n) => ({ ...n, tiedTo: n.tiedTo && chord.end === end }))

/**
 * Adds a chord to a voice. A chord the voice still sounds at its onset is cut short to it (in
 * writing only: the sound is the Performance's); one that starts with it joins it, the shorter length
 * kept.
 */
function place(voice: BarChord[], chord: BarChord) {
  const last = voice.at(-1)
  if (!last || last.end <= chord.start) {
    voice.push(chord)
    return
  }
  if (last.start === chord.start) {
    const end = Math.min(last.end, chord.end)
    const kept = endingAt(last, end)
    const joined = endingAt(chord, end).filter((n) => !kept.some((other) => other.midi === n.midi))
    voice[voice.length - 1] = {
      ...last,
      end,
      notes: [...kept, ...joined].sort((a, b) => a.midi - b.midi),
    }
    return
  }
  voice[voice.length - 1] = { ...last, end: chord.start, notes: endingAt(last, chord.start) }
  voice.push(chord)
}

/**
 * A staff's chords in a bar as one or two voices (spec §2.4 step 3): the tune, when there is one,
 * is voice 1 over the right hand; otherwise each chord goes in the first voice free at its onset, or
 * a second, the higher voice first. With two, the higher has its stems up.
 */
export function separateVoices(chords: readonly BarChord[]): VoiceChords[] {
  const ordered = [...chords].sort(
    (a, b) =>
      a.start - b.start ||
      Number(b.hand === 'melody') - Number(a.hand === 'melody') ||
      top(b) - top(a),
  )
  const withTune = ordered.some((chord) => chord.hand === 'melody')
  const tune: BarChord[] = []
  const accompaniment: BarChord[] = []
  const voices: BarChord[][] = withTune ? [tune, accompaniment] : []
  for (const chord of ordered) {
    if (withTune) {
      place(chord.hand === 'melody' ? tune : accompaniment, chord)
      continue
    }
    const free = voices.find((voice) => endOf(voice) <= chord.start)
    if (free) free.push(chord)
    else if (voices.length < MAX_VOICES) voices.push([chord])
    else
      place(
        voices.reduce((a, b) => (endOf(b) < endOf(a) ? b : a)),
        chord,
      )
  }
  const [first, second] = voices.filter((voice) => voice.length > 0)
  if (!first) return []
  if (!second) return [{ chords: first, stem: 'auto' }]
  const [one, two] =
    withTune || meanPitch(first) >= meanPitch(second) ? [first, second] : [second, first]
  const oneUp = meanPitch(one) >= meanPitch(two)
  return [
    { chords: one, stem: oneUp ? 'up' : 'down' },
    { chords: two, stem: oneUp ? 'down' : 'up' },
  ]
}
