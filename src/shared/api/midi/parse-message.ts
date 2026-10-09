import { midi } from '@/shared/lib/music'
import type { PedalKind } from '@/shared/lib/schedule'
import type { MidiMessage } from './types'

const NOTE_OFF = 0x80
const NOTE_ON = 0x90
const CONTROL_CHANGE = 0xb0
/** The pedals' controllers. */
const PEDAL_CONTROLLERS: ReadonlyMap<number, PedalKind> = new Map([
  [64, 'sustain'],
  [66, 'sostenuto'],
  [67, 'soft'],
])
/** A pedal is down from 64 on; a reversed one, below it. */
const PEDAL_DOWN = 64

/**
 * A note-on or note-off on any channel (a note-on with velocity 0 is a note-off), or a pedal (the
 * sustain, the sostenuto or the soft; `reversedPedal` for one that sends up when pressed), at
 * `time`; anything else is null.
 */
export function parseMidiMessage(
  data: ArrayLike<number>,
  time: number,
  reversedPedal = false,
): MidiMessage | null {
  if (data.length < 3) return null
  const command = (data[0] ?? 0) & 0xf0
  const first = data[1] ?? -1
  const second = data[2] ?? 0
  if (command === CONTROL_CHANGE) {
    const pedal = PEDAL_CONTROLLERS.get(first)
    if (!pedal) return null
    return { kind: 'pedal', pedal, down: second >= PEDAL_DOWN !== reversedPedal, time }
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
