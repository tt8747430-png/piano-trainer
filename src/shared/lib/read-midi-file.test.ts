import { describe, expect, it } from 'vitest'
import { isMidiFile, MidiFileError, readMidiFile } from './read-midi-file'
import { MIDI_DIVISION, noteEvents, standardMidiFile } from './standard-midi-file'

describe('readMidiFile', () => {
  it('reads back what the app writes: the title, tempo, meter, key, each track’s notes and pedal', () => {
    const bytes = standardMidiFile([
      {
        events: [
          { tick: 0, kind: 'name', text: 'Minuet' },
          { tick: 0, kind: 'time', count: 3, unit: 4, click: 1 },
          { tick: 0, kind: 'tempo', quarters: 100 },
        ],
        end: 0,
      },
      {
        events: [
          { tick: 0, kind: 'name', text: 'Right hand' },
          ...noteEvents(
            [
              { key: 67, on: 0, off: 480, velocity: 80 },
              { key: 71, on: 480, off: 1440, velocity: 70 },
            ],
            0,
          ),
          { tick: 0, kind: 'control', channel: 0, controller: 64, value: 127 },
          { tick: 960, kind: 'control', channel: 0, controller: 64, value: 0 },
        ],
        end: 1440,
      },
      {
        events: [...noteEvents([{ key: 43, on: 0, off: 1440, velocity: 60 }], 1)],
        end: 1440,
      },
    ])
    expect(isMidiFile(bytes)).toBe(true)
    const file = readMidiFile(bytes)
    expect(file).toMatchObject({
      division: MIDI_DIVISION,
      title: 'Minuet',
      tempos: [{ tick: 0, quarters: 100 }],
      times: [{ tick: 0, count: 3, unit: 4 }],
      keys: [],
      drums: 0,
    })
    expect(file.parts).toEqual([
      {
        name: 'Right hand',
        channel: 0,
        notes: [
          { key: 67, on: 0, off: 480, velocity: 80 },
          { key: 71, on: 480, off: 1440, velocity: 70 },
        ],
        pedals: [{ down: 0, up: 960 }],
      },
      { channel: 1, notes: [{ key: 43, on: 0, off: 1440, velocity: 60 }], pedals: [] },
    ])
  })

  it('reads a key signature, and leaves the drums out', () => {
    const bytes = standardMidiFile([
      { events: [...noteEvents([{ key: 36, on: 0, off: 10, velocity: 90 }], 9)], end: 10 },
    ])
    // A key signature of three flats, minor (C minor), put in by hand after the track's start.
    const withKey = new Uint8Array([
      ...bytes.subarray(0, 18),
      ...[0, 0, 0, bytes[21]! + 7],
      ...[0x00, 0xff, 0x59, 0x02, 0xfd, 0x01],
      ...bytes.subarray(22),
    ])
    const file = readMidiFile(withKey)
    expect(file.keys).toEqual([{ tick: 0, fifths: -3, minor: true }])
    expect(file.parts).toEqual([])
    expect(file.drums).toBe(1)
  })

  it('refuses bytes that are no MIDI file', () => {
    expect(() => readMidiFile(new TextEncoder().encode('<score/>'))).toThrow(MidiFileError)
  })
})
