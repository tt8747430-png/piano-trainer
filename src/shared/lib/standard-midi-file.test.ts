import { describe, expect, it } from 'vitest'
import {
  midiFileName,
  noteEvents,
  standardMidiFile,
  type TimedMidiEvent,
} from './standard-midi-file'

const text = (bytes: Uint8Array) => String.fromCharCode(...bytes)

/** The bytes of a file's one track, after its header and the track's own. */
const trackOf = (events: TimedMidiEvent[], end = 0) => [
  ...standardMidiFile([{ events, end }]).slice(22),
]

describe('standardMidiFile', () => {
  it('writes one track as format 0 at 480 ticks a quarter, ending where the track ends', () => {
    const file = standardMidiFile([
      { events: [{ tick: 0, kind: 'on', channel: 0, key: 60, velocity: 90 }], end: 480 },
    ])
    expect(text(file.slice(0, 4))).toBe('MThd')
    expect([...file.slice(4, 14)]).toEqual([0, 0, 0, 6, 0, 0, 0, 1, 0x01, 0xe0])
    expect(text(file.slice(14, 18))).toBe('MTrk')
    expect(new DataView(file.buffer).getUint32(18)).toBe(file.length - 22)
    expect([...file.slice(22)]).toEqual([
      ...[0x00, 0x90, 60, 90],
      // 480 as a variable-length number: 0x83 0x60.
      ...[0x83, 0x60, 0xff, 0x2f, 0x00],
    ])
  })

  it('writes several tracks as format 1, played together, each its own chunk', () => {
    const file = standardMidiFile([
      { events: [{ tick: 0, kind: 'name', text: 'Song' }], end: 0 },
      { events: [{ tick: 0, kind: 'on', channel: 1, key: 48, velocity: 100 }], end: 0 },
    ])
    expect([...file.slice(8, 12)]).toEqual([0, 1, 0, 2])
    const first = new DataView(file.buffer).getUint32(18)
    expect([...file.slice(22, 22 + first)]).toEqual([
      ...[0x00, 0xff, 0x03, 4, ...[...'Song'].map((char) => char.charCodeAt(0))],
      ...[0x00, 0xff, 0x2f, 0x00],
    ])
    expect(text(file.slice(22 + first, 26 + first))).toBe('MTrk')
    expect([...file.slice(30 + first)]).toEqual([0x00, 0x91, 48, 100, 0x00, 0xff, 0x2f, 0x00])
  })

  it('counts the time between events in variable-length numbers, seven bits a byte', () => {
    const on = (tick: number): TimedMidiEvent => ({
      tick,
      kind: 'on',
      channel: 0,
      key: 60,
      velocity: 1,
    })
    expect(trackOf([on(127), on(255), on(16_639)])).toEqual([
      ...[0x7f, 0x90, 60, 1],
      ...[0x81, 0x00, 0x90, 60, 1],
      ...[0x81, 0x80, 0x00, 0x90, 60, 1],
      ...[0x00, 0xff, 0x2f, 0x00],
    ])
  })

  it('writes the events at one tick as a file must: the name, the meter, the tempo, then the keys and pedals', () => {
    const events: TimedMidiEvent[] = [
      { tick: 0, kind: 'on', channel: 0, key: 64, velocity: 70 },
      { tick: 0, kind: 'control', channel: 0, controller: 64, value: 127 },
      { tick: 0, kind: 'control', channel: 0, controller: 64, value: 0 },
      { tick: 0, kind: 'off', channel: 0, key: 60 },
      { tick: 0, kind: 'tempo', quarters: 120 },
      { tick: 0, kind: 'time', count: 6, unit: 8, click: 1.5 },
      { tick: 0, kind: 'name', text: 'A' },
    ]
    expect(trackOf(events)).toEqual([
      ...[0x00, 0xff, 0x03, 1, 0x41],
      // 6/8, a click a dotted quarter: 36 of the MIDI clock's 24 a quarter.
      ...[0x00, 0xff, 0x58, 0x04, 6, 3, 36, 8],
      // 500,000 µs a quarter.
      ...[0x00, 0xff, 0x51, 0x03, 0x07, 0xa1, 0x20],
      // A key let go before a pedal is let up, then pressed, then a key struck.
      ...[0x00, 0x80, 60, 64],
      ...[0x00, 0xb0, 64, 0],
      ...[0x00, 0xb0, 64, 127],
      ...[0x00, 0x90, 64, 70],
      ...[0x00, 0xff, 0x2f, 0x00],
    ])
  })

  it('names a track in UTF-8, its length a variable-length number', () => {
    const name = 'Ромашки'
    const bytes = new TextEncoder().encode(name)
    expect(trackOf([{ tick: 0, kind: 'name', text: name }])).toEqual([
      ...[0x00, 0xff, 0x03, bytes.length, ...bytes],
      ...[0x00, 0xff, 0x2f, 0x00],
    ])
  })

  it('ends a track no earlier than its last event', () => {
    expect(trackOf([{ tick: 10, kind: 'off', channel: 0, key: 60 }], 4)).toEqual([
      ...[0x0a, 0x80, 60, 64],
      ...[0x00, 0xff, 0x2f, 0x00],
    ])
  })
})

describe('noteEvents', () => {
  it('strikes and lets go each note on its channel, in the notes’ order', () => {
    expect(
      noteEvents(
        [
          { key: 64, on: 0, off: 480, velocity: 70 },
          { key: 60, on: 0, off: 240, velocity: 90 },
        ],
        2,
      ),
    ).toEqual([
      { tick: 0, kind: 'on', channel: 2, key: 64, velocity: 70 },
      { tick: 480, kind: 'off', channel: 2, key: 64 },
      { tick: 0, kind: 'on', channel: 2, key: 60, velocity: 90 },
      { tick: 240, kind: 'off', channel: 2, key: 60 },
    ])
  })

  it('lets a key go when it is struck again, and no earlier than the tick after it went down', () => {
    const ticks = noteEvents(
      [
        { key: 60, on: 0, off: 960, velocity: 90 },
        { key: 60, on: 480, off: 480, velocity: 80 },
      ],
      0,
    ).map(({ kind, tick }) => `${kind} ${tick}`)
    expect(ticks).toEqual(['on 0', 'off 480', 'on 480', 'off 481'])
  })

  it('strikes a key struck twice in one tick a tick later, so it goes up between', () => {
    const ticks = noteEvents(
      [
        { key: 60, on: 0, off: 300, velocity: 90 },
        { key: 60, on: 0, off: 300, velocity: 80 },
      ],
      0,
    ).map(({ kind, tick }) => `${kind} ${tick}`)
    expect(ticks).toEqual(['on 0', 'off 1', 'on 1', 'off 300'])
  })
})

describe('midiFileName', () => {
  it('names a file by its title, with nothing a file system refuses', () => {
    expect(midiFileName('Ромашковые поля')).toBe('Ромашковые поля.mid')
    expect(midiFileName('A/B: "live"?')).toBe('A-B- -live--.mid')
  })
})
