// A Standard MIDI File (MIDI 1.0's file format) as bytes: the header, and each track's timed events,
// a take's and a piece's alike.

/** Ticks a quarter note in the app's files. */
export const MIDI_DIVISION = 480

/** The MIDI clock's ticks a quarter note, by which a time signature counts its click. */
const CLOCKS_PER_QUARTER = 24
/** The 32nds in a quarter note, as a time signature says them. */
const THIRTY_SECONDS_PER_QUARTER = 8
/** The velocity a key let go carries. */
const RELEASE_VELOCITY = 64
/** A controller's value from which a pedal is down. */
const PRESSED = 64

/** What a track says at a tick: its name, the meter and the tempo, a key or a pedal. */
export type MidiEvent =
  /** A track's name: a part's, or the first track's, the music's title. */
  | { readonly kind: 'name'; readonly text: string }
  /** A time signature, `count` over `unit`, clicked every `click` quarters (a dotted quarter: 1.5). */
  | { readonly kind: 'time'; readonly count: number; readonly unit: number; readonly click: number }
  /** The tempo, in quarter notes a minute. */
  | { readonly kind: 'tempo'; readonly quarters: number }
  | { readonly kind: 'off'; readonly channel: number; readonly key: number }
  /** A controller set: a pedal pressed (64 and up) or let up. */
  | {
      readonly kind: 'control'
      readonly channel: number
      readonly controller: number
      readonly value: number
    }
  | {
      readonly kind: 'on'
      readonly channel: number
      readonly key: number
      readonly velocity: number
    }

/** An event at its tick, in the file's ticks. */
export type TimedMidiEvent = MidiEvent & { readonly tick: number }

/** A track: its events in any order, and the tick it ends at. */
export interface MidiTrack {
  readonly events: readonly TimedMidiEvent[]
  /** Where it ends: no earlier than its last event. */
  readonly end: number
}

/** A key held on a channel, in the file's ticks. */
export interface MidiNote {
  readonly key: number
  readonly on: number
  readonly off: number
  readonly velocity: number
}

/**
 * Where an event stands among those at its tick: the name, the time signature and the tempo first;
 * then the keys let go, the pedals let up and pressed, and the keys struck, so a key struck again
 * sounds again and a pedal changed at a chord holds it.
 */
const ORDER = {
  name: 0,
  time: 1,
  tempo: 2,
  off: 3,
  lifted: 4,
  pressed: 5,
  on: 6,
} as const
const orderOf = (event: MidiEvent): number =>
  event.kind !== 'control'
    ? ORDER[event.kind]
    : event.value >= PRESSED
      ? ORDER.pressed
      : ORDER.lifted

/** A number as MIDI's variable-length quantity: seven bits a byte, the high bit on all but the last. */
function variableLength(value: number): number[] {
  const bytes = [value & 0x7f]
  for (let rest = value >> 7; rest > 0; rest >>= 7) bytes.unshift((rest & 0x7f) | 0x80)
  return bytes
}

const bigEndian = (value: number, size: number): number[] =>
  Array.from({ length: size }, (_, i) => (value >> (8 * (size - 1 - i))) & 0xff)

const ascii = (text: string): number[] => [...text].map((char) => char.charCodeAt(0))

function eventBytes(event: MidiEvent): number[] {
  switch (event.kind) {
    case 'name': {
      const text = [...new TextEncoder().encode(event.text)]
      return [0xff, 0x03, ...variableLength(text.length), ...text]
    }
    case 'time':
      return [
        ...[0xff, 0x58, 0x04, event.count, Math.log2(event.unit)],
        ...[Math.round(CLOCKS_PER_QUARTER * event.click), THIRTY_SECONDS_PER_QUARTER],
      ]
    case 'tempo':
      return [0xff, 0x51, 0x03, ...bigEndian(Math.round(60_000_000 / event.quarters), 3)]
    case 'off':
      return [0x80 | event.channel, event.key, RELEASE_VELOCITY]
    case 'control':
      return [0xb0 | event.channel, event.controller, event.value]
    case 'on':
      return [0x90 | event.channel, event.key, event.velocity]
  }
}

/** A track's chunk: its events in order, each after the time since the one before, then its end. */
function trackChunk({ events, end }: MidiTrack): number[] {
  const bytes: number[] = []
  let last = 0
  for (const event of events.toSorted((a, b) => a.tick - b.tick || orderOf(a) - orderOf(b))) {
    bytes.push(...variableLength(event.tick - last), ...eventBytes(event))
    last = event.tick
  }
  bytes.push(...variableLength(Math.max(0, end - last)), 0xff, 0x2f, 0x00)
  return [...ascii('MTrk'), ...bigEndian(bytes.length, 4), ...bytes]
}

/**
 * Tracks as a Standard MIDI File at `MIDI_DIVISION` ticks a quarter: one track as format 0, several
 * as format 1, played together (the first, by custom, the tempo's and the meter's).
 */
export function standardMidiFile(tracks: readonly MidiTrack[]): Uint8Array<ArrayBuffer> {
  const format = tracks.length === 1 ? 0 : 1
  const chunks = [
    [
      ...ascii('MThd'),
      ...bigEndian(6, 4),
      ...bigEndian(format, 2),
      ...bigEndian(tracks.length, 2),
      ...bigEndian(MIDI_DIVISION, 2),
    ],
    ...tracks.map(trackChunk),
  ]
  const file = new Uint8Array(chunks.reduce((length, chunk) => length + chunk.length, 0))
  let at = 0
  for (const chunk of chunks) {
    file.set(chunk, at)
    at += chunk.length
  }
  return file
}

/**
 * Notes as their keys struck and let go on a channel, each note's pair in the notes' order. A key
 * struck again within the tick it was struck is struck a tick later, so it can go up between; a
 * key goes up no earlier than the tick after it went down, and never after it is struck again.
 */
export function noteEvents(notes: readonly MidiNote[], channel: number): TimedMidiEvent[] {
  const struck = new Map<MidiNote, number>()
  const next = new Map<MidiNote, number>()
  const byKey = notes.toSorted((a, b) => a.key - b.key || a.on - b.on)
  byKey.forEach((note, i) => {
    const before = byKey[i - 1]
    const again = before?.key === note.key
    struck.set(note, Math.max(note.on, again ? (struck.get(before) ?? 0) + 1 : 0))
    if (again) next.set(before, struck.get(note) ?? 0)
  })
  return notes.flatMap((note): TimedMidiEvent[] => {
    const on = struck.get(note) ?? note.on
    const off = Math.min(Math.max(note.off, on + 1), next.get(note) ?? Infinity)
    return [
      { tick: on, kind: 'on', channel, key: note.key, velocity: note.velocity },
      { tick: off, kind: 'off', channel, key: note.key },
    ]
  })
}

/** What a file system refuses in a name. */
const UNSAFE = /[/\\:*?"<>|]/g

/**
 * A MIDI file's name: its title, with nothing a file system refuses, then the tempo its music is
 * written at where one is given (`Daisy fields (73 BPM)`, Chordify's), as `.mid`.
 */
export const midiFileName = (title: string, bpm?: number): string =>
  `${title.replace(UNSAFE, '-')}${bpm === undefined ? '' : ` (${bpm} BPM)`}.mid`
