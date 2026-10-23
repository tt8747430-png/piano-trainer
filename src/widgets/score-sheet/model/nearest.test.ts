import { describe, expect, it } from 'vitest'
import { nearestPlace, roomAt } from './nearest'

describe('nearestPlace', () => {
  it('is the place drawn nearest the click', () => {
    expect(nearestPlace([0, 24, 48], 70, (tick) => tick * 3)).toBe(24)
  })
})

describe('roomAt (ADR 0088)', () => {
  // Notes at 0 and 24, then the room after them from 48, in a bar to x 200; a tick 2 px each.
  const places = [
    { tick: 0, empty: false },
    { tick: 24, empty: false },
    { tick: 48, empty: true },
  ]
  const xOf = (tick: number) => 20 + tick * 2

  it('lands on the room after the last note, from just before its place to the barline', () => {
    expect(roomAt(places, 112, xOf, { start: 0, end: 200, lead: 9 })).toBe(48)
    expect(roomAt(places, 199, xOf, { start: 0, end: 200, lead: 9 })).toBe(48)
  })

  it('lands on nothing between notes, on a note’s own room, or past the bar', () => {
    expect(roomAt(places, 40, xOf, { start: 0, end: 200, lead: 9 })).toBeUndefined()
    expect(roomAt(places, 70, xOf, { start: 0, end: 200, lead: 9 })).toBeUndefined()
    expect(roomAt(places, 205, xOf, { start: 0, end: 200, lead: 9 })).toBeUndefined()
  })

  it('lands on a bar the pattern plays, all of it', () => {
    expect(roomAt([{ tick: 0, empty: true }], 150, xOf, { start: 0, end: 200, lead: 9 })).toBe(0)
    expect(roomAt([{ tick: 0, empty: true }], 2, xOf, { start: 0, end: 200, lead: 9 })).toBe(0)
  })
})
