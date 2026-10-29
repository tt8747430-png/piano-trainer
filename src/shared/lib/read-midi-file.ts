// A Standard MIDI File (MIDI 1.0's file format) read: each track's name, its notes and its pedal,
// and the file's tempos, time signatures and key signatures, all in the file's ticks.

import { plainText } from './plain-text'
import type { MidiNote } from './standard-midi-file'

/** A file that is no Standard MIDI File, or is broken. */
export class MidiFileError extends Error {
  override readonly name = 'MidiFileError'
}

/** The channel General MIDI keeps for drums: its notes are no pitches. */
const DRUMS = 9
const SUSTAIN = 64
const PRESSED = 64

/** A track's notes on one channel: a part. */
export interface MidiPart {
  /** The name of the track it is on. */
  readonly name?: string
  readonly channel: number
  readonly notes: readonly MidiNote[]
  /** The sustain pedal held down, from `down` to `up`. */
  readonly pedals: readonly { readonly down: number; readonly up: number }[]
}

export interface MidiFile {
  /** Ticks a quarter note. */
  readonly division: number
  /** The first track's name: the music's title, by custom. */
  readonly title?: string
  readonly parts: readonly MidiPart[]
  /** Quarter notes a minute from each tick on. */
  readonly tempos: readonly { readonly tick: number; readonly quarters: number }[]
  readonly times: readonly {
    readonly tick: number
    readonly count: number
    readonly unit: number
  }[]
  /** Sharps (> 0) or flats (< 0), and whether minor. */
  readonly keys: readonly {
    readonly tick: number
    readonly fifths: number
    readonly minor: boolean
  }[]
  /** Drum notes left out. */
  readonly drums: number
}

/** Whether bytes begin as a Standard MIDI File does. */
export const isMidiFile = (bytes: Uint8Array): boolean =>
  bytes.length >= 4 && String.fromCharCode(...bytes.subarray(0, 4)) === 'MThd'

/**
 * Reads a Standard MIDI File (format 0 or 1, ticks a quarter): each track's notes, a part a channel,
 * a key struck again before it was let go ending the first; notes on the drum channel are left out
 * and counted. Throws a MidiFileError where the bytes are no such file.
 */
export function readMidiFile(bytes: Uint8Array): MidiFile {
  if (!isMidiFile(bytes)) throw new MidiFileError('No MThd')
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  const headerLength = view.getUint32(4)
  if (bytes.length < 8 + headerLength || headerLength < 6) throw new MidiFileError('Short header')
  const count = view.getUint16(10)
  const division = view.getUint16(12)
  if (division & 0x8000) throw new MidiFileError('SMPTE time')
  const decoder = new TextDecoder()
  const parts: MidiPart[] = []
  const tempos: { tick: number; quarters: number }[] = []
  const times: { tick: number; count: number; unit: number }[] = []
  const keys: { tick: number; fifths: number; minor: boolean }[] = []
  let drums = 0
  let title: string | undefined
  let at = 8 + headerLength
  for (let track = 0; track < count && at + 8 <= bytes.length; track += 1) {
    if (String.fromCharCode(...bytes.subarray(at, at + 4)) !== 'MTrk')
      throw new MidiFileError('No MTrk')
    const length = view.getUint32(at + 4)
    const end = Math.min(bytes.length, at + 8 + length)
    let p = at + 8
    let tick = 0
    let status = 0
    let name: string | undefined
    const held = new Map<string, { on: number; velocity: number }>()
    const notes = new Map<number, MidiNote[]>()
    const pedals = new Map<number, { down: number; up: number }[]>()
    const down = new Map<number, number>()
    const variable = () => {
      let value = 0
      for (let i = 0; i < 4 && p < end; i += 1) {
        const byte = bytes[p++] ?? 0
        value = (value << 7) | (byte & 0x7f)
        if (!(byte & 0x80)) break
      }
      return value
    }
    const release = (channel: number, key: number) => {
      const id = `${channel} ${key}`
      const struck = held.get(id)
      if (!struck) return
      held.delete(id)
      notes.set(channel, [
        ...(notes.get(channel) ?? []),
        { key, on: struck.on, off: Math.max(tick, struck.on + 1), velocity: struck.velocity },
      ])
    }
    while (p < end) {
      tick += variable()
      let byte = bytes[p] ?? 0
      if (byte & 0x80) {
        p += 1
        if (byte < 0xf0) status = byte
      } else byte = status
      if (byte === 0xff) {
        const type = bytes[p++] ?? 0
        const size = variable()
        const data = bytes.subarray(p, p + size)
        p += size
        if (type === 0x2f) break
        if (type === 0x03) name = plainText(decoder.decode(data)) || undefined
        if (type === 0x51 && size === 3) {
          const micros = ((data[0] ?? 0) << 16) | ((data[1] ?? 0) << 8) | (data[2] ?? 0)
          if (micros > 0) tempos.push({ tick, quarters: 60_000_000 / micros })
        }
        if (type === 0x58 && size >= 2)
          times.push({ tick, count: data[0] ?? 4, unit: 2 ** (data[1] ?? 2) })
        if (type === 0x59 && size >= 2) {
          const fifths = ((data[0] ?? 0) << 24) >> 24
          keys.push({ tick, fifths, minor: data[1] === 1 })
        }
        continue
      }
      if (byte === 0xf0 || byte === 0xf7) {
        p += variable()
        continue
      }
      const kind = byte & 0xf0
      const channel = byte & 0x0f
      const first = bytes[p++] ?? 0
      const second = kind === 0xc0 || kind === 0xd0 ? 0 : (bytes[p++] ?? 0)
      if (kind === 0x90 && second > 0) {
        if (channel === DRUMS) {
          drums += 1
          continue
        }
        release(channel, first)
        held.set(`${channel} ${first}`, { on: tick, velocity: second })
      } else if (kind === 0x80 || kind === 0x90) release(channel, first)
      else if (kind === 0xb0 && first === SUSTAIN) {
        if (second >= PRESSED && !down.has(channel)) down.set(channel, tick)
        else if (second < PRESSED && down.has(channel)) {
          pedals.set(channel, [
            ...(pedals.get(channel) ?? []),
            { down: down.get(channel) ?? 0, up: tick },
          ])
          down.delete(channel)
        }
      }
    }
    for (const id of [...held.keys()]) {
      const [channel = 0, key = 0] = id.split(' ').map(Number)
      release(channel, key)
    }
    if (track === 0 && name) title = name
    for (const [channel, played] of notes)
      parts.push({
        ...(name ? { name } : {}),
        channel,
        notes: played.sort((a, b) => a.on - b.on || a.key - b.key),
        pedals: pedals.get(channel) ?? [],
      })
    at = end
  }
  return {
    division,
    ...(title ? { title } : {}),
    parts,
    tempos: tempos.sort((a, b) => a.tick - b.tick),
    times: times.sort((a, b) => a.tick - b.tick),
    keys: keys.sort((a, b) => a.tick - b.tick),
    drums,
  }
}
