import type { Midi } from '@/shared/lib/music'
import {
  SOFT_GAIN,
  touchVelocity,
  velocityGain,
  type NoteSound,
  type Touch,
} from '@/shared/lib/schedule'
import type { PedalPress, Take, TakeNote } from './types'

/** When each note's key is struck next after it, by the note; none where it is not. */
function nextStrikes(notes: readonly TakeNote[]): Map<TakeNote, number> {
  const byKey = new Map<Midi, TakeNote[]>()
  for (const note of notes) {
    const struck = byKey.get(note.midi) ?? []
    struck.push(note)
    byKey.set(note.midi, struck)
  }
  const next = new Map<TakeNote, number>()
  for (const struck of byKey.values()) {
    // From the last strike back: the latest onset after each note's own.
    let after: number | undefined
    let previous: number | undefined
    for (let i = struck.length - 1; i >= 0; i--) {
      const note = struck[i]
      if (!note) continue
      if (note.at !== previous) after = previous
      if (after !== undefined) next.set(note, after)
      previous = note.at
    }
  }
  return next
}

/** When a note let go at `release` stops sounding: on to a sustain's up where it was down as the key
 * was let go, or to a sostenuto's that caught the key as it went down. */
function soundsUntil(note: TakeNote, pedals: readonly PedalPress[]): number {
  const release = note.at + note.held
  let end = release
  for (const press of pedals) {
    const holds =
      press.pedal === 'sustain'
        ? press.down <= release && release < press.up
        : press.pedal === 'sostenuto' && note.at <= press.down && press.down < release
    if (holds) end = Math.max(end, press.up)
  }
  return end
}

/** Whether the soft pedal was down as the key was struck. */
const struckSoft = (note: TakeNote, pedals: readonly PedalPress[]): boolean =>
  pedals.some((press) => press.pedal === 'soft' && press.down <= note.at && note.at < press.up)

/**
 * A take heard as played (spec 2026-10-09 §3.4, §3.5): each key from its onset, as loud as the Touch
 * hears how it was struck (two thirds under the soft pedal), sounding while held, or on to the
 * sustain's up where it was down as the key was let go, or to the sostenuto's that caught it, and
 * never past the same key struck again. Seconds from the take's first downbeat.
 */
export function takeSounds(take: Take, touch: Touch): NoteSound[] {
  const notes = take.notes.toSorted((a, b) => a.at - b.at)
  const next = nextStrikes(notes)
  return notes.map((note) => {
    const sounding = soundsUntil(note, take.pedals)
    const end = Math.min(sounding, next.get(note) ?? sounding)
    const gain = velocityGain(touchVelocity(note.velocity, touch))
    return {
      kind: 'note',
      midi: note.midi,
      at: note.at / 1000,
      duration: (end - note.at) / 1000,
      velocity: struckSoft(note, take.pedals) ? gain * SOFT_GAIN : gain,
    }
  })
}

/** The take heard from `fromMs` on: what starts there or later, its time from there. */
export function takeSoundsFrom(take: Take, touch: Touch, fromMs: number): NoteSound[] {
  const from = fromMs / 1000
  return takeSounds(take, touch)
    .filter((sound) => sound.at >= from)
    .map((sound) => ({ ...sound, at: sound.at - from }))
}
