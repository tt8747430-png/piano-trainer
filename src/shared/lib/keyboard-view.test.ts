import { describe, expect, it } from 'vitest'
import { PIANO_LAYOUT } from './keyboard-layout'
import {
  keepCentre,
  keysInView,
  scrollByOctave,
  scrollToCentre,
  scrollToReveal,
  viewFrame,
} from './keyboard-view'

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

describe('revealing keys', () => {
  // A span in percent of the whole keyboard: 1% is 52px here.
  const span = (left: number, right: number) => ({ left, right, whites: 0 })

  it('leaves the view where the keys are already in it', () => {
    expect(scrollToReveal(at(1300), span(30, 40))).toBeNull()
  })

  it('scrolls only as far as brings them in, a little clear of the edge', () => {
    // 50–55% is 2600–2860px; the view is 1300–2600: it moves right, the keys at its right edge.
    expect(scrollToReveal(at(1300), span(50, 55))).toBeCloseTo(2860 + 52 - 1300)
    // 10–12% is 520–624px: it moves left, the keys at its left edge.
    expect(scrollToReveal(at(1300), span(10, 12))).toBeCloseTo(520 - 52)
  })

  it('keeps a stretch wider than the view where part of it shows, else centres it', () => {
    expect(scrollToReveal(at(1300), span(20, 60))).toBeNull()
    expect(scrollToReveal(at(0), span(60, 95))).toBe(scrollToCentre(at(0), 0.775))
  })
})

describe('keeping the view as the keyboard grows', () => {
  it('keeps the same point of the keyboard in the middle', () => {
    expect(keepCentre(at(1300), 6000)).toBeCloseTo(((1300 + 650) / 5200) * 6000 - 650)
  })
})
