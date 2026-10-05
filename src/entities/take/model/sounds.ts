import type { NoteSound } from '@/shared/lib/schedule'
import type { PedalPress, Take, TakeNote } from './types'

/** The loudest key's gain, struck at 127: the arranged music's notes sound about 0.1–0.2. */
const LOUDEST = 0.3

/** How loud a key struck at `velocity` (1–127) sounds: as the square of the velocity, as a piano's. */
export const takeGain = (velocity: number): number => LOUDEST * (velocity / 127) ** 2

/** When a key let go at `up` stops sounding: on to the pedal's release where the pedal was down. */
const releasedAt = (up: number, pedal: readonly PedalPress[]): number =>
  pedal.find((press) => press.down <= up && up < press.up)?.up ?? up

/** When the same key is struck next, after `note`; none where it is not. */
const nextStrike = (note: TakeNote, notes: readonly TakeNote[]): number | undefined =>
  notes.find((other) => other.midi === note.midi && other.at > note.at)?.at

/**
 * A take heard as played (spec 2026-10-05 §3): each key from its onset, as loud as it was struck,
 * sounding while held, or on to the pedal's release where the pedal was down as it was let go, and
 * never past the same key struck again. Seconds from the take's first downbeat.
 */
export function takeSounds(take: Take): NoteSound[] {
  const notes = [...take.notes].sort((a, b) => a.at - b.at)
  return notes.map((note) => {
    const sounding = releasedAt(note.at + note.held, take.pedal)
    const end = Math.min(sounding, nextStrike(note, notes) ?? sounding)
    return {
      kind: 'note',
      midi: note.midi,
      at: note.at / 1000,
      duration: (end - note.at) / 1000,
      velocity: takeGain(note.velocity),
    }
  })
}
