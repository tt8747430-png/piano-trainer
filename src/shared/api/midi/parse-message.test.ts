import { describe, expect, it } from 'vitest'
import { parseMidiMessage } from './parse-message'

describe('parseMidiMessage', () => {
  it.each([
    [[0x90, 60, 100], { kind: 'note', midi: 60, on: true, velocity: 100, time: 5 }],
    [[0x93, 60, 100], { kind: 'note', midi: 60, on: true, velocity: 100, time: 5 }],
    [[0x90, 60, 0], { kind: 'note', midi: 60, on: false, velocity: 0, time: 5 }],
    [[0x80, 60, 64], { kind: 'note', midi: 60, on: false, velocity: 64, time: 5 }],
  ])('reads %j as a key, at the time it came', (data, event) => {
    expect(parseMidiMessage(data, 5)).toEqual(event)
  })

  it.each([
    [[0xb0, 64, 127], true],
    [[0xb2, 64, 64], true],
    [[0xb0, 64, 63], false],
    [[0xb0, 64, 0], false],
  ])('reads %j as the sustain pedal, down %s', (data, down) => {
    expect(parseMidiMessage(data, 7)).toEqual({ kind: 'pedal', pedal: 'sustain', down, time: 7 })
  })

  it.each([
    [66, 'sostenuto'],
    [67, 'soft'],
  ] as const)('reads controller %i as the %s pedal', (controller, pedal) => {
    expect(parseMidiMessage([0xb0, controller, 127], 7)).toEqual({
      kind: 'pedal',
      pedal,
      down: true,
      time: 7,
    })
  })

  it.each([
    [0, true],
    [63, true],
    [64, false],
    [127, false],
  ])('reads a reversed pedal’s %i as down %s', (value, down) => {
    expect(parseMidiMessage([0xb0, 64, value], 7, true)).toMatchObject({ down })
  })

  it.each([[[0xb0, 1, 127]], [[0x90, 60]], [[]], [[0x90, 200, 100]], [[0xe0, 0, 64]]])(
    'ignores %j',
    (data) => {
      expect(parseMidiMessage(data, 0)).toBeNull()
    },
  )
})
