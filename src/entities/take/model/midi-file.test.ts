import { describe, expect, it } from 'vitest'
import { midi } from '@/shared/lib/music'
import { midiFile, takeFileName } from './midi-file'
import type { Take } from './types'

/** At 120 a quarter is half a second: 480 ticks. */
const TAKE: Take = {
  id: 'take-1',
  pieceId: 'bz1',
  made: 0,
  tempo: 120,
  meter: '3/4',
  length: 1500,
  notes: [
    { midi: midi(60), at: 0, held: 500, velocity: 90 },
    { midi: midi(64), at: 500, held: 1000, velocity: 70 },
  ],
  pedal: [{ down: 250, up: 1000 }],
}

const text = (bytes: Uint8Array) => String.fromCharCode(...bytes)

describe('midiFile', () => {
  it('writes one track at 480 ticks a quarter: the tempo, the meter, the keys and the pedal', () => {
    const file = midiFile(TAKE)
    expect(text(file.slice(0, 4))).toBe('MThd')
    expect([...file.slice(4, 14)]).toEqual([0, 0, 0, 6, 0, 0, 0, 1, 0x01, 0xe0])
    expect(text(file.slice(14, 18))).toBe('MTrk')
    const length = new DataView(file.buffer).getUint32(18)
    expect(file.length).toBe(22 + length)
    expect([...file.slice(22)]).toEqual([
      // 3/4, a click a quarter; 500,000 µs a quarter (120 a minute).
      ...[0x00, 0xff, 0x58, 0x04, 3, 2, 24, 8],
      ...[0x00, 0xff, 0x51, 0x03, 0x07, 0xa1, 0x20],
      ...[0x00, 0x90, 60, 90],
      ...[0x81, 0x70, 0xb0, 64, 127],
      ...[0x81, 0x70, 0x80, 60, 64],
      ...[0x00, 0x90, 64, 70],
      ...[0x83, 0x60, 0xb0, 64, 0],
      ...[0x83, 0x60, 0x80, 64, 64],
      ...[0x00, 0xff, 0x2f, 0x00],
    ])
  })

  it('lets go of a key no earlier than the tick after it went down, so no note is left on', () => {
    const file = midiFile({
      ...TAKE,
      length: 1000,
      notes: [{ midi: midi(60), at: 0, held: 0, velocity: 90 }],
      pedal: [],
    })
    expect([...file.slice(37)]).toEqual([
      ...[0x00, 0x90, 60, 90],
      ...[0x01, 0x80, 60, 64],
      ...[0x87, 0x3f, 0xff, 0x2f, 0x00],
    ])
  })

  it('counts a compound meter’s beat as a dotted quarter', () => {
    const file = midiFile({ ...TAKE, meter: '6/8', tempo: 60, notes: [], pedal: [] })
    expect([...file.slice(22, 37)]).toEqual([
      ...[0x00, 0xff, 0x58, 0x04, 6, 3, 36, 8],
      // A dotted quarter a second: a quarter in 666,667 µs.
      ...[0x00, 0xff, 0x51, 0x03, 0x0a, 0x2c, 0x2b],
    ])
  })
})

describe('takeFileName', () => {
  it('names the file by the piece and when the take was made, with nothing a file system refuses', () => {
    const made = new Date(2026, 9, 5, 14, 7).getTime()
    expect(takeFileName('Ромашковые поля', made)).toBe('Ромашковые поля 2026-10-05 14.07.mid')
    expect(takeFileName('A/B: "live"?', made)).toBe('A-B- -live-- 2026-10-05 14.07.mid')
  })
})
