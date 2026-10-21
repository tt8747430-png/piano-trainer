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

/**
 * An event in the track, and the order events at one tick are written: a time signature, the tempo,
 * then offs, the pedals and ons.
 */
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

/** The beats each whole bar of a take holds, from its barlines: a pickup's, a short bar's, the meter's. */
function barBeats(take: Take): { readonly ms: number; readonly beats: number }[] {
  const beatMs = 60_000 / take.tempo
  // To the nearest eighth of the meter (a third of a compound beat, half a simple one): the barlines
  // are where the click fell, in milliseconds.
  const eighths = isCompound(take.meter) ? 3 : 2
  // A bar shorter than an eighth (a barline just before the take's end) is the bar before's.
  return take.bars
    .slice(0, -1)
    .map((ms, i) => ({
      ms,
      beats: Math.round((((take.bars[i + 1] ?? ms) - ms) / beatMs) * eighths) / eighths,
    }))
    .filter((bar) => bar.beats > 0)
}

/**
 * A take as a Standard MIDI File (format 0): its tempo (a compound meter's beat a dotted quarter) and
 * time signature, again at each barline where a bar's length changes (a pickup, a short bar), so a
 * DAW's bars are the piece's; each key on and off with its velocity as played, and the pedals as
 * their controllers: the sustain 64, the sostenuto 66, the soft 67.
 */
export function midiFile(take: Take): Uint8Array<ArrayBuffer> {
  const compound = isCompound(take.meter)
  const quartersPerMinute = take.tempo * (compound ? 1.5 : 1)
  const tickAt = (ms: number) => Math.round((ms / 60_000) * quartersPerMinute * DIVISION)
  const clocksPerClick = CLOCKS_PER_QUARTER * (compound ? 1.5 : 1)
  const signatureOf = (beats: number): number[] => {
    const { count, unit } = timeSignature(beats, take.meter)
    return [0xff, 0x58, 0x04, count, Math.log2(unit), clocksPerClick, 8]
  }
  const signatures: TrackEvent[] = []
  let beatsNow = beatsPerBar(take.meter)
  signatures.push({ tick: 0, order: -2, bytes: signatureOf(barBeats(take)[0]?.beats ?? beatsNow) })
  for (const [i, bar] of barBeats(take).entries()) {
    if (i === 0) beatsNow = bar.beats
    else if (bar.beats !== beatsNow) {
      beatsNow = bar.beats
      signatures.push({ tick: tickAt(bar.ms), order: -2, bytes: signatureOf(bar.beats) })
    }
  }
  // Each note's tick, a key struck again within one tick a tick later, so it can go up between; and
  // its next strike, so a note's end never passes it.
  type Note = (typeof take.notes)[number]
  const onTick = new Map<Note, number>()
  const nextOn = new Map<Note, number>()
  const byKey = [...take.notes].sort((a, b) => a.midi - b.midi || a.at - b.at)
  byKey.forEach((note, i) => {
    const before = byKey[i - 1]
    const after = before?.midi === note.midi ? (onTick.get(before) ?? 0) + 1 : 0
    onTick.set(note, Math.max(tickAt(note.at), after))
    if (before?.midi === note.midi) nextOn.set(before, onTick.get(note) ?? 0)
  })
  const tempo: TrackEvent = {
    tick: 0,
    order: -1,
    bytes: [0xff, 0x51, 0x03, ...bigEndian(Math.round(60_000_000 / quartersPerMinute), 3)],
  }
  const events: TrackEvent[] = [
    ...signatures,
    tempo,
    ...take.notes.flatMap((note) => {
      const on = onTick.get(note) ?? tickAt(note.at)
      // Offs come first at a tick: a key let go within its own tick goes up on the next, though never
      // after the same key is struck again.
      const off = Math.min(
        Math.max(tickAt(note.at + note.held), on + 1),
        nextOn.get(note) ?? Infinity,
      )
      return [
        { tick: on, order: 3, bytes: [NOTE_ON, note.midi, note.velocity] },
        { tick: off, order: 0, bytes: [NOTE_OFF, note.midi, RELEASE_VELOCITY] },
      ]
    }),
    ...take.pedals.flatMap((press) => {
      const controller = PEDAL_CONTROLLER[press.pedal]
      // As a key: a pedal let go within its own tick comes up on the next, never before it went down.
      const down = tickAt(press.down)
      const up = Math.max(tickAt(press.up), down + 1)
      return [
        { tick: down, order: 2, bytes: [CONTROL_CHANGE, controller, 127] },
        { tick: up, order: 1, bytes: [CONTROL_CHANGE, controller, 0] },
      ]
    }),
  ].sort((a, b) => a.tick - b.tick || a.order - b.order)
  const track: number[] = []
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
