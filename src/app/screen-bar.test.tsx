import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderApp } from './testing/render-app'

/** Every screen in the shell that has a bar. */
const SCREENS = [
  '/',
  '/songs',
  '/songs/bz5',
  '/learn',
  '/learn/lessons/reading-chord-symbols',
  '/practice',
  '/practice/chords',
  '/practice/chords/find',
  '/practice/scales',
  '/practice/progressions',
  '/practice/progressions/passing',
  '/practice/progressions/reharmonise',
  '/practice/intervals',
  '/practice/accompaniment',
  '/practice/patterns/M1',
  '/practice/patterns/new',
  '/practice/studies/ex3',
  '/practice/exercises',
  '/practice/quiz',
  '/practice/trainers/build-chord',
  '/practice/free-play',
  '/settings',
] as const

describe('the screen’s bar', () => {
  // A sticky bar goes no further than its parent: in a wrapper shorter than the page it scrolls
  // away for good, while the keys pinned under it still leave it room.
  it.each(SCREENS)(
    'on %s is a child of the page’s root, so it holds as long as the page',
    async (path) => {
      await renderApp(path)
      const bar = (await screen.findByRole('heading', { level: 1 })).closest('header')
      expect(bar?.parentElement?.parentElement?.tagName).toBe('MAIN')
    },
  )
})
