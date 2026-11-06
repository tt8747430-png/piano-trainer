import { describe, expect, it } from 'vitest'
import {
  isPracticePageId,
  practicePageAt,
  PRACTICE_GROUPS,
  PRACTICE_PAGE_IDS,
  PRACTICE_PAGES,
} from './practice-pages'

describe('Practice’s pages', () => {
  it('lists learning before training and the tools last, by relevance (R32)', () => {
    expect(PRACTICE_GROUPS.map((group) => group.id)).toEqual([
      'theory',
      'playing',
      'training',
      'tools',
    ])
    expect(PRACTICE_GROUPS.at(-1)).toEqual({
      id: 'tools',
      pages: ['metronome', 'tuner', 'chordFinder', 'circleOfFifths'],
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

  it('finds the page a path is on, its own or one under it, and none off Practice (R32)', () => {
    expect(practicePageAt('/practice/metronome')).toBe('metronome')
    expect(practicePageAt('/practice/progressions/axis')).toBe('progressions')
    expect(practicePageAt('/practice/quiz/chords')).toBe('quiz')
    expect(practicePageAt('/practice/chords-and-more')).toBeNull()
    expect(practicePageAt('/practice')).toBeNull()
    expect(practicePageAt('/songs')).toBeNull()
  })

  it('reads back only a page id it knows', () => {
    expect(isPracticePageId('chordFinder')).toBe(true)
    expect(isPracticePageId('drone')).toBe(false)
  })
})
