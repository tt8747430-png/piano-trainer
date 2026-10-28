import { describe, expect, it } from 'vitest'
import { describeMidiData } from './describe-message'

describe('describeMidiData', () => {
  it.each([
    [[0x90, 60, 100], { kind: 'note-on', channel: 1, key: 60, velocity: 100 }],
    [[0x93, 61, 20], { kind: 'note-on', channel: 4, key: 61, velocity: 20 }],
    [[0x90, 60, 0], { kind: 'note-off', channel: 1, key: 60, velocity: 0 }],
    [[0x8f, 60, 64], { kind: 'note-off', channel: 16, key: 60, velocity: 64 }],
  ])('reads %j as a key, on its channel', (data, message) => {
    expect(describeMidiData(data)).toEqual(message)
  })

  it.each([
    [[0xb0, 64, 127], { kind: 'pedal', channel: 1, pedal: 'sustain', value: 127 }],
    [[0xb1, 66, 0], { kind: 'pedal', channel: 2, pedal: 'sostenuto', value: 0 }],
    [[0xb0, 67, 90], { kind: 'pedal', channel: 1, pedal: 'soft', value: 90 }],
  ])('reads %j as a pedal, with the value it sent', (data, message) => {
    expect(describeMidiData(data)).toEqual(message)
  })

  it('reads any other controller by its number', () => {
    expect(describeMidiData([0xb0, 7, 100])).toEqual({
      kind: 'control',
      channel: 1,
      controller: 7,
      value: 100,
    })
  })

  it('reads a program change and a pitch bend', () => {
    expect(describeMidiData([0xc2, 5])).toEqual({ kind: 'program', channel: 3, program: 5 })
    expect(describeMidiData([0xe0, 0, 64])).toEqual({ kind: 'pitch-bend', channel: 1, value: 0 })
    expect(describeMidiData([0xe0, 127, 127])).toEqual({
      kind: 'pitch-bend',
      channel: 1,
      value: 8191,
    })
  })

  it('shows anything else as its bytes', () => {
    expect(describeMidiData([0xf8])).toEqual({ kind: 'other', bytes: 'F8' })
    expect(describeMidiData([0x90, 60])).toEqual({ kind: 'other', bytes: '90 3C' })
  })
})
