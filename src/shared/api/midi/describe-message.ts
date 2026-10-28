import { midi, type Midi } from '@/shared/lib/music'
import type { PedalKind } from '@/shared/lib/schedule'

/**
 * A MIDI message as the MIDI log shows it, whatever the app makes of it: a key (a note-on with
 * velocity 0 is a note-off), a pedal with the value it sent, another controller, a program change,
 * a pitch bend (centred on 0), or its bytes. Channels count from 1.
 */
export type MidiLogMessage =
  | {
      readonly kind: 'note-on' | 'note-off'
      readonly channel: number
      readonly key: Midi
      readonly velocity: number
    }
  | {
      readonly kind: 'pedal'
      readonly channel: number
      readonly pedal: PedalKind
      readonly value: number
    }
  | {
      readonly kind: 'control'
      readonly channel: number
      readonly controller: number
      readonly value: number
    }
  | { readonly kind: 'program'; readonly channel: number; readonly program: number }
  | { readonly kind: 'pitch-bend'; readonly channel: number; readonly value: number }
  | { readonly kind: 'other'; readonly bytes: string }

const PEDALS: ReadonlyMap<number, PedalKind> = new Map([
  [64, 'sustain'],
  [66, 'sostenuto'],
  [67, 'soft'],
])

const hex = (data: ArrayLike<number>) =>
  Array.from(data, (byte) => byte.toString(16).toUpperCase().padStart(2, '0')).join(' ')

/** What a message's bytes say, for the MIDI log. */
export function describeMidiData(data: ArrayLike<number>): MidiLogMessage {
  const status = data[0] ?? 0
  const command = status & 0xf0
  const channel = (status & 0x0f) + 1
  const first = data[1]
  const second = data[2]
  if (command === 0xc0 && first !== undefined) return { kind: 'program', channel, program: first }
  if (first === undefined || second === undefined || status >= 0xf0)
    return { kind: 'other', bytes: hex(data) }
  switch (command) {
    case 0x80:
    case 0x90:
      return {
        kind: command === 0x90 && second > 0 ? 'note-on' : 'note-off',
        channel,
        key: midi(first),
        velocity: second,
      }
    case 0xb0: {
      const pedal = PEDALS.get(first)
      return pedal
        ? { kind: 'pedal', channel, pedal, value: second }
        : { kind: 'control', channel, controller: first, value: second }
    }
    case 0xe0:
      return { kind: 'pitch-bend', channel, value: (second << 7) + first - 8192 }
    default:
      return { kind: 'other', bytes: hex(data) }
  }
}
