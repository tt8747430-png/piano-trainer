import { describe, expect, it } from 'vitest'
import { PRACTICE_GROUPS, PRACTICE_PAGE_IDS, PRACTICE_PAGES } from './practice-pages'

describe('Practice’s pages', () => {
  it('Tools is the first group, in this order (R29 B11)', () => {
    expect(PRACTICE_GROUPS[0]).toEqual({
      id: 'tools',
      pages: ['metronome', 'chordFinder', 'circleOfFifths', 'tuner'],
    })
  })

  it('lists every page once, in a group', () => {
    expect([...PRACTICE_PAGE_IDS].sort()).toEqual(Object.keys(PRACTICE_PAGES).sort())
  })

  it('gives each page a path of its own under Practice', () => {
    const paths = Object.values(PRACTICE_PAGES).map((page) => page.to)
    expect(new Set(paths).size).toBe(paths.length)
    for (const path of paths) expect(path).toMatch(/^\/practice\/[a-z-]+$/)
  })
})
