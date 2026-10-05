import { midi } from '@/shared/lib/music'
import type { MidiMessage } from './types'

const NOTE_OFF = 0x80
const NOTE_ON = 0x90
const CONTROL_CHANGE = 0xb0
/** The sustain pedal's controller: down from 64 on. */
const SUSTAIN = 64
const PEDAL_DOWN = 64

/**
 * A note-on or note-off on any channel (a note-on with velocity 0 is a note-off), or the sustain
 * pedal, at `time`; anything else is null.
 */
export function parseMidiMessage(data: ArrayLike<number>, time: number): MidiMessage | null {
  if (data.length < 3) return null
  const command = (data[0] ?? 0) & 0xf0
  const first = data[1] ?? -1
  const second = data[2] ?? 0
  if (command === CONTROL_CHANGE) {
    return first === SUSTAIN ? { kind: 'pedal', down: second >= PEDAL_DOWN, time } : null
  }
  if ((command !== NOTE_ON && command !== NOTE_OFF) || first < 0 || first > 127) return null
  return {
    kind: 'note',
    midi: midi(first),
    on: command === NOTE_ON && second > 0,
    velocity: second,
    time,
  }
}
