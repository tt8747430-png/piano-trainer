import type { Midi } from '@/shared/lib/music'
import type { NoteSound } from '@/shared/lib/schedule'
import type { PedalPress, Take, TakeNote } from './types'

/** The loudest key's gain, struck at 127: the arranged music's notes sound about 0.1–0.2. */
const LOUDEST = 0.3

/** How loud a key struck at `velocity` (1–127) sounds: as the square of the velocity, as a piano's. */
const takeGain = (velocity: number): number => LOUDEST * (velocity / 127) ** 2

/** When a key let go at `up` stops sounding: on to the pedal's release where the pedal was down. */
const releasedAt = (up: number, pedal: readonly PedalPress[]): number =>
  pedal.find((press) => press.down <= up && up < press.up)?.up ?? up

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

/**
 * A take heard as played (spec 2026-10-05 §3): each key from its onset, as loud as it was struck,
 * sounding while held, or on to the pedal's release where the pedal was down as it was let go, and
 * never past the same key struck again. Seconds from the take's first downbeat.
 */
export function takeSounds(take: Take): NoteSound[] {
  const notes = take.notes.toSorted((a, b) => a.at - b.at)
  const next = nextStrikes(notes)
  return notes.map((note) => {
    const sounding = releasedAt(note.at + note.held, take.pedal)
    const end = Math.min(sounding, next.get(note) ?? sounding)
    return {
      kind: 'note',
      midi: note.midi,
      at: note.at / 1000,
      duration: (end - note.at) / 1000,
      velocity: takeGain(note.velocity),
    }
  })
}
