import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderApp } from './testing/render-app'

/** Every screen in the shell that has a bar. */
const SCREENS = [
  '/',
  '/songs',
  '/songs/bz5',
  '/courses/gorshkov',
  '/courses/gorshkov/chord-pulse',
  '/lessons/reading-chord-symbols',
  '/practice',
  '/practice/chords',
  '/practice/scales',
  '/practice/progressions',
  '/practice/intervals',
  '/practice/accompaniment',
  '/practice/accompaniment/patterns/M1',
  '/practice/accompaniment/patterns/new',
  '/practice/accompaniment/studies/ex3',
  '/practice/exercises',
  '/practice/quiz',
  '/practice/quiz/chords',
  '/practice/chord-finder',
  '/settings',
] as const

describe('the screen’s bar', () => {
  // A sticky bar goes no further than its parent: in a wrapper shorter than the page it scrolls
  // away for good, while the keys pinned under it still leave it room.
  it.each(SCREENS)(
    'on %s is a child of the page’s root, so it holds as long as the page',
    async (path) => {
      await renderApp(path)
      await screen.findByRole('heading', { level: 1 })
      const bar = document.querySelector('[data-slot="screen-bar"]')
      expect(bar?.parentElement?.parentElement?.tagName).toBe('MAIN')
    },
  )
})
