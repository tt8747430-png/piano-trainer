import { midi } from '@/shared/lib/music'
import type { NoteEvent } from './types'

const NOTE_OFF = 0x80
const NOTE_ON = 0x90

/** A note-on or note-off on any channel; a note-on with velocity 0 is a note-off. Anything else is null. */
export function parseMidiMessage(data: ArrayLike<number>): NoteEvent | null {
  if (data.length < 3) return null
  const command = (data[0] ?? 0) & 0xf0
  const key = data[1] ?? -1
  const velocity = data[2] ?? 0
  if ((command !== NOTE_ON && command !== NOTE_OFF) || key < 0 || key > 127) return null
  return { midi: midi(key), on: command === NOTE_ON && velocity > 0, velocity }
}
