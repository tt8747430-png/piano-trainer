import { describe, expect, it } from 'vitest'
import { PIANO_LAYOUT } from './keyboard-layout'
import { keysInView, scrollByOctave, scrollToCentre, viewFrame } from './keyboard-view'

/** The whole piano's 52 white keys, 100px wide each, with 1300px in view. */
const at = (scrollLeft: number) => ({ scrollLeft, clientWidth: 1300, scrollWidth: 5200 })

describe('the keyboard view', () => {
  it('frames the stretch in view, or all of it where nothing scrolls', () => {
    expect(viewFrame(at(520))).toEqual({ left: 0.1, width: 0.25 })
    expect(viewFrame({ scrollLeft: 0, clientWidth: 400, scrollWidth: 400 })).toEqual({
      left: 0,
      width: 1,
    })
  })

  it('centres the view on a point, within the keyboard', () => {
    expect(scrollToCentre(at(0), 0.5)).toBe(1950)
    expect(scrollToCentre(at(0), 0.01)).toBe(0)
    expect(scrollToCentre(at(0), 0.99)).toBe(3900)
  })

  it('moves the view an octave, within the keyboard', () => {
    expect(scrollByOctave(at(1000), 52, 1)).toBe(1700)
    expect(scrollByOctave(at(300), 52, -1)).toBe(0)
    expect(scrollByOctave(at(3500), 52, 1)).toBe(3900)
  })

  it('names the white keys wholly in view', () => {
    expect(keysInView(PIANO_LAYOUT.keys, { left: 23 / 52, width: 14 / 52 })).toEqual({
      from: 60,
      to: 83,
    })
    expect(keysInView(PIANO_LAYOUT.keys, { left: 23.2 / 52, width: 0.5 / 52 })).toBeNull()
  })
})
