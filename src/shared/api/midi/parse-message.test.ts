import { describe, expect, it } from 'vitest'
import { parseMidiMessage } from './parse-message'

describe('parseMidiMessage', () => {
  it.each([
    [[0x90, 60, 100], { midi: 60, on: true, velocity: 100 }],
    [[0x93, 60, 100], { midi: 60, on: true, velocity: 100 }],
    [[0x90, 60, 0], { midi: 60, on: false, velocity: 0 }],
    [[0x80, 60, 64], { midi: 60, on: false, velocity: 64 }],
  ])('reads %j as a key', (data, event) => {
    expect(parseMidiMessage(data)).toEqual(event)
  })

  it.each([[[0xb0, 64, 127]], [[0x90, 60]], [[]], [[0x90, 200, 100]]])('ignores %j', (data) => {
    expect(parseMidiMessage(data)).toBeNull()
  })
})
