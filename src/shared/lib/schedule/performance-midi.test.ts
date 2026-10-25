import { describe, expect, it } from 'vitest'
import {
  arrange,
  parseFigure,
  type ChartBar,
  type EventPattern,
  type Performance,
  type StaffNote,
} from '@/shared/lib/arrangement'
import { midi, note, parseChordSymbol, type NoteMarks } from '@/shared/lib/music'
import { performanceMidi } from './performance-midi'
import { gainVelocity } from './velocity'

const BEATS: EventPattern = {
  id: 'beats',
  rh: { kind: 'events', events: parseFigure('0/4 C,4/4 C,8/4 C,12/4 C') },
  lh: { kind: 'events', events: parseFigure('0/16 L1+L8') },
}

/** A bar of `beats` beats holding its chords end to end, each `[symbol, beats]`. */
const bar = (beats: number, ...chords: [string, number][]): ChartBar => ({
  chords: chords.map(([symbol, length]) => ({ ...parseChordSymbol(symbol), beats: length })),
  beats,
})

const tuneNote = (
  m: number,
  startTick: number,
  durationTicks: number,
  marks?: NoteMarks,
): StaffNote => ({
  midi: midi(m),
  spelled: note('C'),
  startTick,
  durationTicks,
  ...(marks ? { marks } : {}),
})

/**
 * A beat's pickup, two bars of 4/4, then a section of 3/4 (ticks 216 and 288), under a tune not
 * heard (its notes written silent) that marks the pedal and a rit.: down at bar 2, changed at bar 3,
 * up at bar 4, where the rit. starts; a tempo at bar 5.
 */
const PICKUP_AND_THREE: Performance = arrange(
  {
    key: { tonic: note('C'), minor: false },
    meter: '4/4',
    sections: [
      { lines: [[bar(1, ['G', 1]), bar(4, ['C', 4]), bar(4, ['F', 2], ['G', 2])]] },
      { meter: '3/4', lines: [[bar(3, ['Am', 3]), bar(3, ['C', 3])]] },
    ],
  },
  {
    tonic: note('C'),
    pattern: BEATS,
    staves: [
      {
        clef: 'treble',
        notes: [
          tuneNote(67, 0, 24),
          tuneNote(72, 24, 96, { pedal: 'down' }),
          tuneNote(69, 120, 96, { pedal: 'change' }),
          tuneNote(76, 216, 72, { pedal: 'up', expression: 'rit' }),
          tuneNote(72, 288, 72, { expression: 'a-tempo' }),
        ],
      },
    ],
  },
)

/** A 6/8 bar of two chords, a dotted quarter's beat each. */
const SIX_EIGHT: Performance = arrange(
  {
    key: { tonic: note('C'), minor: false },
    meter: '6/8',
    sections: [{ lines: [[bar(2, ['C', 1], ['G', 1])]] }],
  },
  { tonic: note('C'), pattern: BEATS },
)

/** Two bars of C and G in 4/4, both hands. */
const TWO: Performance = arrange(
  {
    key: { tonic: note('C'), minor: false },
    meter: '4/4',
    sections: [{ lines: [[bar(4, ['C', 4]), bar(4, ['G', 4])]] }],
  },
  { tonic: note('C'), pattern: BEATS },
)

interface ReadEvent {
  readonly tick: number
  /** A meta event's type, or a channel event's status. */
  readonly meta?: number
  readonly status?: number
  readonly data: readonly number[]
}

/** A Standard MIDI File read back: its format, division and each track's events in its ticks. */
function readMidi(file: Uint8Array) {
  const view = new DataView(file.buffer, file.byteOffset, file.byteLength)
  const text = (from: number, to: number) => String.fromCharCode(...file.slice(from, to))
  expect(text(0, 4)).toBe('MThd')
  const tracks: ReadEvent[][] = []
  let at = 14
  for (let t = 0; t < view.getUint16(10); t++) {
    expect(text(at, at + 4)).toBe('MTrk')
    const end = at + 8 + view.getUint32(at + 4)
    let i = at + 8
    const byte = () => file[i++] ?? 0
    const variableLength = () => {
      let value = 0
      for (;;) {
        const next = byte()
        value = (value << 7) | (next & 0x7f)
        if (next < 0x80) return value
      }
    }
    const events: ReadEvent[] = []
    let tick = 0
    while (i < end) {
      tick += variableLength()
      const status = byte()
      if (status === 0xff) {
        const meta = byte()
        const length = variableLength()
        events.push({ tick, meta, data: [...file.slice(i, i + length)] })
        i += length
      } else events.push({ tick, status, data: [byte(), byte()] })
    }
    tracks.push(events)
    at = end
  }
  return { format: view.getUint16(8), division: view.getUint16(12), tracks }
}

const nameOf = (track: readonly ReadEvent[]) =>
  new TextDecoder().decode(Uint8Array.from(track.find((e) => e.meta === 0x03)?.data ?? []))
/** Each time signature: where, its count and unit, and its click in MIDI clocks. */
const signaturesOf = (track: readonly ReadEvent[]) =>
  track.flatMap((e) =>
    e.meta === 0x58 ? [[e.tick, e.data[0], 2 ** (e.data[1] ?? 0), e.data[2]]] : [],
  )
/** Each tempo: where, and its microseconds a quarter. */
const temposOf = (track: readonly ReadEvent[]) =>
  track.flatMap((e) =>
    e.meta === 0x51
      ? [[e.tick, ((e.data[0] ?? 0) << 16) | ((e.data[1] ?? 0) << 8) | (e.data[2] ?? 0)]]
      : [],
  )
/** Each controller set: where, its channel, the controller and its value. */
const controlsOf = (track: readonly ReadEvent[]) =>
  track.flatMap((e) =>
    e.status !== undefined && e.status >> 4 === 0xb
      ? [[e.tick, e.status & 0x0f, e.data[0], e.data[1]]]
      : [],
  )
/** Each key struck and let go, by its channel. */
function notesOf(track: readonly ReadEvent[]) {
  const held = new Map<number, { on: number; velocity: number }>()
  const notes: { channel: number; key: number; on: number; off: number; velocity: number }[] = []
  for (const { tick, status, data } of track) {
    if (status === undefined) continue
    const [key = 0, velocity = 0] = data
    if (status >> 4 === 0x9) held.set(key, { on: tick, velocity })
    if (status >> 4 === 0x8) {
      const struck = held.get(key)
      if (struck) notes.push({ channel: status & 0x0f, key, off: tick, ...struck })
      held.delete(key)
    }
  }
  return notes.sort((a, b) => a.on - b.on || a.key - b.key)
}

/** A part's notes as the file should write them: 20 of its ticks a performance's (480 a quarter). */
const expected = (performance: Performance, part: (n: Performance['notes'][number]) => boolean) =>
  performance.notes
    .filter(part)
    .map((n) => ({
      key: n.midi,
      on: n.startTick * 20,
      off: (n.startTick + n.durationTicks) * 20,
      velocity: gainVelocity(n.velocity),
    }))
    .sort((a, b) => a.on - b.on || a.key - b.key)

describe('performanceMidi', () => {
  const file = readMidi(
    performanceMidi(PICKUP_AND_THREE, { tempo: 90, title: 'Ромашки', staves: ['Voice'] }),
  )
  const [conductor = [], staff = [], right = [], left = []] = file.tracks

  it('writes format 1 at 480 ticks a quarter: the music’s track, then a part’s each, top down', () => {
    expect(file.format).toBe(1)
    expect(file.division).toBe(480)
    expect(file.tracks.map(nameOf)).toEqual(['Ромашки', 'Voice', 'Right hand', 'Left hand'])
  })

  it('writes a time signature where a bar’s length or meter changes: the pickup’s, 4/4, 3/4', () => {
    expect(signaturesOf(conductor)).toEqual([
      [0, 1, 4, 24],
      [24 * 20, 4, 4, 24],
      [216 * 20, 3, 4, 24],
    ])
  })

  it('writes the tempo, slowing at the rit. as the Player does and back at a tempo', () => {
    const tempos = temposOf(conductor)
    // 90 a minute: 666,667 µs a quarter.
    expect(tempos[0]).toEqual([0, 666_667])
    const slowing = tempos.filter(([tick = 0]) => tick >= 216 * 20 && tick < 264 * 20)
    expect(slowing).toHaveLength(16)
    // Three quarters of 90 two beats on, until a tempo.
    expect(tempos.slice(-2)).toEqual([
      [264 * 20, 888_889],
      [288 * 20, 666_667],
    ])
  })

  it('writes each part’s notes as written on its own channel, the tune not heard too', () => {
    expect(notesOf(staff)).toEqual(
      expected(PICKUP_AND_THREE, (n) => n.hand === 'staff').map((n) => ({ channel: 2, ...n })),
    )
    expect(PICKUP_AND_THREE.notes.filter((n) => n.hand === 'staff').every((n) => n.silent)).toBe(
      true,
    )
    expect(notesOf(right)).toEqual(
      expected(PICKUP_AND_THREE, (n) => n.hand === 'rh').map((n) => ({ channel: 0, ...n })),
    )
    expect(notesOf(left)).toEqual(
      expected(PICKUP_AND_THREE, (n) => n.hand === 'lh').map((n) => ({ channel: 1, ...n })),
    )
  })

  it('holds the sustain pedal on the hands’ tracks as the marks do, a change let up then pressed', () => {
    const pedal = (channel: number) => [
      [24 * 20, channel, 64, 127],
      [120 * 20, channel, 64, 0],
      [120 * 20, channel, 64, 127],
      [216 * 20, channel, 64, 0],
    ]
    expect(controlsOf(right)).toEqual(pedal(0))
    expect(controlsOf(left)).toEqual(pedal(1))
    expect(controlsOf(staff)).toEqual([])
  })

  it('ends every track where the music ends', () => {
    for (const track of file.tracks)
      expect(track.at(-1)).toEqual({ tick: 360 * 20, meta: 0x2f, data: [] })
  })

  it('counts a compound meter’s beat as a dotted quarter', () => {
    const [music = [], right = []] = readMidi(
      performanceMidi(SIX_EIGHT, { tempo: 60, title: '6/8' }),
    ).tracks
    expect(signaturesOf(music)).toEqual([[0, 6, 8, 36]])
    // A dotted quarter a second: a quarter in 666,667 µs.
    expect(temposOf(music)).toEqual([[0, 666_667]])
    // The second chord a dotted quarter in: 720 of the file's ticks.
    expect(new Set(notesOf(right).map((n) => n.on))).toEqual(new Set([0, 720]))
  })

  it('names a staff of no name by its place', () => {
    const names = readMidi(
      performanceMidi(PICKUP_AND_THREE, { tempo: 90, title: 'Song' }),
    ).tracks.map(nameOf)
    expect(names[1]).toBe('Staff 1')
  })

  it('strikes a note as loud as its dynamics and accents play it', () => {
    const at = TWO.notes.findIndex((n) => n.hand === 'rh')
    const n = TWO.notes[at]
    if (!n) throw new Error('no right hand')
    const struck = (marks?: NoteMarks) => {
      const notes = TWO.notes.map((each, i) => (i === at && marks ? { ...each, marks } : each))
      const midiFile = performanceMidi({ ...TWO, notes }, { tempo: 90, title: '' })
      return notesOf(readMidi(midiFile).tracks[1] ?? []).find(
        (each) => each.key === n.midi && each.on === n.startTick * 20,
      )?.velocity
    }
    const plain = gainVelocity(n.velocity)
    expect(struck()).toBe(plain)
    expect(struck({ dynamic: 'ff' })).toBeGreaterThan(plain)
    expect(struck({ dynamic: 'pp' })).toBeLessThan(plain)
    expect(struck({ articulations: ['accent'] })).toBeGreaterThan(plain)
  })

  it('strikes a key a part doubles at once once, held the longer, as loud as the louder', () => {
    const [n] = TWO.notes.filter((each) => each.hand === 'rh')
    if (!n) throw new Error('no right hand')
    const doubled: Performance = {
      ...TWO,
      notes: [...TWO.notes, { ...n, durationTicks: n.durationTicks / 2, velocity: n.velocity / 2 }],
    }
    const midiFile = performanceMidi(doubled, { tempo: 90, title: '' })
    const right = notesOf(readMidi(midiFile).tracks[1] ?? [])
    expect(right.filter((each) => each.key === n.midi && each.on === n.startTick * 20)).toEqual([
      {
        channel: 0,
        key: n.midi,
        on: n.startTick * 20,
        off: (n.startTick + n.durationTicks) * 20,
        velocity: gainVelocity(n.velocity),
      },
    ])
  })
})
