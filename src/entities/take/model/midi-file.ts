import { beatsPerBar, isCompound, timeSignature } from '@/shared/lib/music'
import type { PedalKind } from '@/shared/lib/schedule'
import type { Take } from './types'

/** Ticks a quarter note in the file. */
const DIVISION = 480
/** The MIDI clock's ticks a quarter note, by which a time signature counts its click. */
const CLOCKS_PER_QUARTER = 24

const NOTE_ON = 0x90
const NOTE_OFF = 0x80
const CONTROL_CHANGE = 0xb0
/** Each pedal's controller. */
const PEDAL_CONTROLLER: Readonly<Record<PedalKind, number>> = {
  sustain: 64,
  sostenuto: 66,
  soft: 67,
}
/** The velocity a note-off carries where a keyboard sends none. */
const RELEASE_VELOCITY = 64

/** An event in the track, and the order events at one tick are written: offs, the pedals, then ons. */
interface TrackEvent {
  readonly tick: number
  readonly order: number
  readonly bytes: readonly number[]
}

/** A number as MIDI's variable-length quantity: seven bits a byte, the high bit on all but the last. */
function variableLength(value: number): number[] {
  const bytes = [value & 0x7f]
  for (let rest = value >> 7; rest > 0; rest >>= 7) bytes.unshift((rest & 0x7f) | 0x80)
  return bytes
}

const bigEndian = (value: number, size: number): number[] =>
  Array.from({ length: size }, (_, i) => (value >> (8 * (size - 1 - i))) & 0xff)

const ascii = (text: string): number[] => [...text].map((char) => char.charCodeAt(0))

/**
 * A take as a Standard MIDI File (format 0): its tempo (a compound meter's beat a dotted quarter) and
 * time signature, each key on and off with its velocity as played, and the pedals as their
 * controllers: the sustain 64, the sostenuto 66, the soft 67.
 */
export function midiFile(take: Take): Uint8Array<ArrayBuffer> {
  const { count, unit } = timeSignature(beatsPerBar(take.meter), take.meter)
  const compound = isCompound(take.meter)
  const quartersPerMinute = take.tempo * (compound ? 1.5 : 1)
  const tickAt = (ms: number) => Math.round((ms / 60_000) * quartersPerMinute * DIVISION)
  const events: TrackEvent[] = [
    ...take.notes.flatMap((note) => {
      const on = tickAt(note.at)
      // Offs come first at a tick: a key let go within its own tick goes up on the next.
      const off = Math.max(tickAt(note.at + note.held), on + 1)
      return [
        { tick: on, order: 3, bytes: [NOTE_ON, note.midi, note.velocity] },
        { tick: off, order: 0, bytes: [NOTE_OFF, note.midi, RELEASE_VELOCITY] },
      ]
    }),
    ...take.pedals.flatMap((press) => {
      const controller = PEDAL_CONTROLLER[press.pedal]
      return [
        { tick: tickAt(press.down), order: 2, bytes: [CONTROL_CHANGE, controller, 127] },
        { tick: tickAt(press.up), order: 1, bytes: [CONTROL_CHANGE, controller, 0] },
      ]
    }),
  ].sort((a, b) => a.tick - b.tick || a.order - b.order)
  const clocksPerClick = CLOCKS_PER_QUARTER * (compound ? 1.5 : 1)
  const track: number[] = [
    ...[0x00, 0xff, 0x58, 0x04, count, Math.log2(unit), clocksPerClick, 8],
    ...[0x00, 0xff, 0x51, 0x03, ...bigEndian(Math.round(60_000_000 / quartersPerMinute), 3)],
  ]
  let last = 0
  for (const event of events) {
    track.push(...variableLength(event.tick - last), ...event.bytes)
    last = event.tick
  }
  track.push(...variableLength(Math.max(0, tickAt(take.length) - last)), 0xff, 0x2f, 0x00)
  return Uint8Array.from([
    ...ascii('MThd'),
    ...bigEndian(6, 4),
    ...bigEndian(0, 2),
    ...bigEndian(1, 2),
    ...bigEndian(DIVISION, 2),
    ...ascii('MTrk'),
    ...bigEndian(track.length, 4),
    ...track,
  ])
}

/** What a file system refuses in a name. */
const UNSAFE = /[/\\:*?"<>|]/g

const twoDigits = (n: number) => String(n).padStart(2, '0')

/** A take's file: the piece's title and when it was made (`2026-10-05 14.07`), as `.mid`. */
export function takeFileName(title: string, made: number): string {
  const at = new Date(made)
  const day = `${at.getFullYear()}-${twoDigits(at.getMonth() + 1)}-${twoDigits(at.getDate())}`
  const time = `${twoDigits(at.getHours())}.${twoDigits(at.getMinutes())}`
  return `${title.replace(UNSAFE, '-')} ${day} ${time}.mid`
}
