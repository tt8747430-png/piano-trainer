import { describe, expect, it } from 'vitest'
import { FLICK, pairRelease, pairSwipe, rubberBand } from './swipe'

describe('rubberBand', () => {
  it('gives less and less the further past an end, never as far as the room', () => {
    expect(rubberBand(0, 300)).toBe(0)
    const near = rubberBand(30, 300)
    const far = rubberBand(300, 300)
    expect(near).toBeGreaterThan(0)
    expect(near).toBeLessThan(30)
    expect(far).toBeLessThan(300 * 0.4)
    expect(rubberBand(3000, 300)).toBeLessThan(300)
  })

  it('pulls the same way back past either end', () => {
    expect(rubberBand(-30, 300)).toBe(-rubberBand(30, 300))
  })
})

describe('pairSwipe', () => {
  const both = { before: true, after: true }

  it('follows the finger one to one, as a share of a diagram’s width, the next coming as it goes left', () => {
    expect(pairSwipe(-150, 300, both)).toBe(0.5)
    expect(pairSwipe(90, 300, both)).toBe(-0.3)
  })

  it('gives like a rubber band towards an end with no chord', () => {
    const atEnd = pairSwipe(-150, 300, { before: true, after: false })
    expect(atEnd).toBeGreaterThan(0)
    expect(atEnd).toBeLessThan(0.5)
    expect(pairSwipe(150, 300, { before: false, after: true })).toBeGreaterThan(-0.5)
  })

  it('goes one chord at most: past a whole diagram it gives', () => {
    const past = pairSwipe(-450, 300, both)
    expect(past).toBeGreaterThan(1)
    expect(past).toBeLessThan(1.5)
  })
})

describe('pairRelease', () => {
  const at = (offset: number, velocity = 0, ends = { before: true, after: true }) =>
    pairRelease({ offset, velocity, width: 300, ...ends })

  it('goes on to the next past a third of a diagram, back to the one before the other way', () => {
    expect(at(-100)).toBe(1)
    expect(at(100)).toBe(-1)
  })

  it('springs back short of it', () => {
    expect(at(-80)).toBe(0)
    expect(at(60)).toBe(0)
    expect(at(0)).toBe(0)
  })

  it('goes on with a flick, however short, the way the finger went', () => {
    expect(at(-20, -FLICK)).toBe(1)
    expect(at(20, FLICK * 2)).toBe(-1)
  })

  it('takes no flick for a touch that hardly moved, nor one turned back against the drag', () => {
    expect(at(-4, -FLICK * 3)).toBe(0)
    expect(at(-200, FLICK)).toBe(0)
  })

  it('springs back at the song’s ends', () => {
    expect(at(-200, -FLICK, { before: true, after: false })).toBe(0)
    expect(at(200, FLICK, { before: false, after: true })).toBe(0)
  })
})
