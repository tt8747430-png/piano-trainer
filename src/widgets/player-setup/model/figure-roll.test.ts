import { describe, expect, it } from 'vitest'
import { LEFT_FIGURES, RIGHT_FIGURES } from '@/entities/pattern'
import { figureRoll } from './figure-roll'

describe('figureRoll (ADR 0115)', () => {
  it('draws a hand’s figure over a bar of C: each note where it starts and how long, by its height', () => {
    const roll = figureRoll('lh', LEFT_FIGURES.r.figure)
    expect(roll.length).toBeGreaterThan(0)
    for (const note of roll) {
      expect(note.start).toBeGreaterThanOrEqual(0)
      expect(note.start + note.length).toBeLessThanOrEqual(1.0001)
      expect(note.height).toBeGreaterThanOrEqual(0)
      expect(note.height).toBeLessThanOrEqual(1)
    }
  })

  it('tells a chord on every beat from one held the whole bar', () => {
    const starts = (hand: 'rh' | 'lh', figure: Parameters<typeof figureRoll>[1]) =>
      new Set(figureRoll(hand, figure).map((note) => note.start))
    const ids = Object.keys(RIGHT_FIGURES) as (keyof typeof RIGHT_FIGURES)[]
    const counts = ids.map((id) => starts('rh', RIGHT_FIGURES[id].figure).size)
    // The figures differ in their rhythm: not all of them start their notes alike.
    expect(new Set(counts).size).toBeGreaterThan(1)
  })
})
