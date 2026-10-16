import { describe, expect, it } from 'vitest'
import { PRACTICE_PAGE_IDS, PRACTICE_PAGES, recentPages } from './practice-pages'

describe('Practice’s pages', () => {
  it('lists every page once, in a group', () => {
    expect([...PRACTICE_PAGE_IDS].sort()).toEqual(Object.keys(PRACTICE_PAGES).sort())
  })

  it('gives each page a path of its own under Practice', () => {
    const paths = Object.values(PRACTICE_PAGES).map((page) => page.to)
    expect(new Set(paths).size).toBe(paths.length)
    for (const path of paths) expect(path).toMatch(/^\/practice\/[a-z-]+$/)
  })

  it('lists the pages used last, the latest first, from the screens remembered', () => {
    const used = ['/practice/scales', '/play/bz5', '/practice/chords', '/practice/chord-finder']
    expect(recentPages(used)).toEqual(['chordFinder', 'chords', 'scales'])
    expect(recentPages([...used, '/practice/intervals'], 2)).toEqual(['intervals', 'chordFinder'])
    expect(recentPages(['/', '/songs'])).toEqual([])
  })
})
