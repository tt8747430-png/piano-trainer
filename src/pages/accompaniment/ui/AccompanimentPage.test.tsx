import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'
import { PATTERNS_STORAGE_KEY } from '@/entities/pattern'
import { createMemoryStorage } from '@/shared/lib'
import { stubMatchMedia } from '@/shared/test/match-media'

const saved = (state: object) => {
  const storage = createMemoryStorage()
  storage.setItem(
    PATTERNS_STORAGE_KEY,
    JSON.stringify({
      state: { favourites: [], hidden: [], own: [], nextOwn: 1, ...state },
      version: 1,
    }),
  )
  return storage
}
const shelf = (name: string) => screen.getByRole('region', { name })
const shelves = () => screen.getAllByRole('heading', { level: 2 }).map((each) => each.textContent)
const rows = (name: string) =>
  within(shelf(name))
    .getAllByRole('link')
    .map((link) => link.getAttribute('href'))
const opened = () => screen.findByRole('heading', { level: 1, name: 'Accompaniment' })

describe('Practice → Accompaniment, the library on a phone (R30-4)', () => {
  it('opens from Practice on every book: its patterns, then the songs they are practised on', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice')
    await user.click(await screen.findByRole('link', { name: /^Accompaniment / }))
    await opened()
    expect(router.state.location.pathname).toBe('/practice/accompaniment')
    expect(shelves()).toEqual([
      'Called to Play',
      'Called to Play: songs',
      'Called to Play 2',
      'Called to Play 2: songs',
      'Bobrova',
      'Bobrova: songs',
      'Gorshkov',
      'Gorshkov: songs',
      'Rhythm styles',
    ])
    expect(
      within(shelf('Called to Play')).getByRole('link', {
        name: /^1 · Bass \+ chords The right hand plays the chord on every beat over an octave held in the left\. /,
      }),
    ).toHaveAttribute('href', '/practice/accompaniment/patterns/M1')
    // Each run folds after five: Show all says how many it holds.
    expect(rows('Called to Play')).toHaveLength(5)
    await user.click(within(shelf('Called to Play')).getByRole('button', { name: 'Show all 17' }))
    expect(rows('Called to Play')).toHaveLength(17)
  })

  it('lists a book’s songs, each opening its page: Called to Play’s studies', async () => {
    await renderApp('/practice/accompaniment?place=called-to-play')
    await opened()
    expect(rows('Called to Play: songs')).toEqual(
      ['ex3', 'exm1', 'exm2', 'exm3', 'ex5', 'ex6', 'ex7', 'ex8', 'ex9'].map(
        (id) => `/practice/accompaniment/studies/${id}`,
      ),
    )
  })

  it('lists on Bobrova her seven types and the hymns they are practised on, each on Songs', async () => {
    await renderApp('/practice/accompaniment?place=seven-types')
    await opened()
    expect(shelves()).toEqual(['Bobrova', 'Bobrova: songs'])
    expect(rows('Bobrova')).toHaveLength(8)
    expect(rows('Bobrova: songs')).toEqual([
      '/songs/otche',
      '/songs/ode',
      '/songs/silent',
      '/songs/amazing',
      '/songs/wonderful',
    ])
  })

  it('lists on Called to Play 2 its octaves and chords, and the songs of its workbook', async () => {
    await renderApp('/practice/accompaniment?place=called-to-play-2')
    await opened()
    expect(rows('Called to Play 2')).toEqual(
      ['oct', 'octs', 'chd'].map((id) => `/practice/accompaniment/patterns/${id}`),
    )
    expect(rows('Called to Play 2: songs')).toHaveLength(25)
    expect(rows('Called to Play 2: songs')[0]).toBe('/songs/molitva')
  })

  it('lists on Gorshkov his textures and the songs his lessons play them on', async () => {
    await renderApp('/practice/accompaniment?place=gorshkov')
    await opened()
    expect(rows('Gorshkov')).toEqual(
      ['g1', 'g2', 'g3', 'g4', 'g5', 'g6'].map((id) => `/practice/accompaniment/patterns/${id}`),
    )
    expect(rows('Gorshkov: songs')).toEqual([
      '/songs/romashki',
      '/songs/olen',
      '/songs/wafriend',
      '/songs/metel',
    ])
  })

  it('lists no lessons: a book’s lessons are its course on Learn', async () => {
    await renderApp('/practice/accompaniment?place=gorshkov')
    await screen.findByRole('region', { name: 'Gorshkov' })
    expect(screen.queryByRole('link', { name: /lessons/i })).not.toBeInTheDocument()
  })

  it('marks a book’s patterns at its course’s level, and none on the rhythm styles', async () => {
    await renderApp('/practice/accompaniment?place=gorshkov')
    const m1 = within(await screen.findByRole('region', { name: 'Gorshkov' })).getAllByRole(
      'link',
    )[0]
    expect(within(m1 ?? document.body).getByRole('img', { name: 'Advanced' })).toBeInTheDocument()
  })

  it('lists the rhythm styles, each pattern with its idea', async () => {
    await renderApp('/practice/accompaniment?place=styles')
    await opened()
    expect(shelves()).toEqual(['Rhythm styles'])
    const ballad = within(shelf('Rhythm styles')).getByRole('link', {
      name: /^Ballad arpeggio A gentle arpeggio over the root and 5th\.$/,
    })
    expect(ballad).toHaveAttribute('href', '/practice/accompaniment/patterns/ballad')
    expect(within(ballad).queryByRole('img')).not.toBeInTheDocument()
  })

  it('lists Favourites first, the learner’s own under Mine, and leaves the hidden out of their book', async () => {
    await renderApp('/practice/accompaniment', {
      storage: saved({
        favourites: ['ballad'],
        hidden: ['funk'],
        own: [{ id: 'my-1', name: 'Sunday', rh: 'jaz', lh: 'walk' }],
        nextOwn: 2,
      }),
    })
    await opened()
    expect(shelves()[0]).toBe('Favourites')
    expect(shelves().at(-1)).toBe('Mine')
    expect(rows('Favourites')).toEqual(['/practice/accompaniment/patterns/ballad'])
    expect(within(shelf('Mine')).getByRole('link', { name: /^Sunday/ })).toHaveAttribute(
      'href',
      '/practice/accompaniment/patterns/my-1',
    )
    await userEvent
      .setup()
      .click(within(shelf('Rhythm styles')).getByRole('button', { name: /^Show all/ }))
    expect(within(shelf('Rhythm styles')).queryByRole('link', { name: /^Funk/ })).toBeNull()
  })

  it('keeps the hidden under Hidden, where they can be found', async () => {
    await renderApp('/practice/accompaniment?place=hidden', {
      storage: saved({ hidden: ['funk'] }),
    })
    expect(await screen.findByRole('region', { name: 'Hidden' })).toBeInTheDocument()
    expect(within(shelf('Hidden')).getByRole('link', { name: /^Funk/ })).toBeInTheDocument()
  })

  it('says on Mine what is kept there, with New pattern, before the learner makes one', async () => {
    await renderApp('/practice/accompaniment?place=mine')
    await opened()
    expect(await screen.findByText('Patterns you make are kept here.')).toBeInTheDocument()
    expect(
      within(screen.getByRole('main')).getAllByRole('link', { name: 'New pattern' }),
    ).not.toHaveLength(0)
  })

  it('makes a pattern and a song favourites from their More', async () => {
    const user = userEvent.setup()
    const { patternsStore, libraryStore } = await renderApp(
      '/practice/accompaniment?place=seven-types',
    )
    await opened()
    await user.click(screen.getByRole('button', { name: /^More for Amazing Grace/ }))
    await user.click(await screen.findByRole('menuitem', { name: 'Add to favourites' }))
    expect(libraryStore.getState().favourites).toContain('amazing')
    const first = within(shelf('Bobrova')).getAllByRole('button', { name: /^More for / })[0]
    await user.click(first ?? document.body)
    await user.click(await screen.findByRole('menuitem', { name: 'Add to favourites' }))
    expect(patternsStore.getState().favourites).toHaveLength(1)
  })

  it('leaves out a book its Settings hide', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/settings/accompaniment')
    await user.click(await screen.findByRole('switch', { name: 'Gorshkov' }))
    await router.navigate({ to: '/practice/accompaniment' })
    await opened()
    expect(shelves()).not.toContain('Gorshkov')
    expect(shelves()).toContain('Bobrova')
  })

  it('opens on All for a place the URL names that it does not have', async () => {
    await renderApp('/practice/accompaniment?place=psalms')
    expect(await screen.findByRole('region', { name: 'Called to Play' })).toBeInTheDocument()
  })

  it('makes a new pattern from the floating +', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/accompaniment')
    await opened()
    const floating = document.querySelector<HTMLElement>('[data-slot="floating-actions"]')
    await user.click(within(floating ?? document.body).getByRole('link', { name: 'New pattern' }))
    expect(
      await screen.findByRole('heading', { level: 1, name: 'New pattern' }),
    ).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/practice/accompaniment/patterns/new')
  })

  it.each(['all', 'called-to-play', 'seven-types', 'styles', 'mine'])(
    'reads in Russian on %s, with nothing left in English',
    async (place) => {
      await renderApp(`/practice/accompaniment?place=${place}`, { locale: 'ru' })
      expect(
        await screen.findByRole('heading', { level: 1, name: 'Аккомпанемент' }),
      ).toBeInTheDocument()
      expect(untranslated(document.body)).toEqual([])
    },
  )
})

describe('Practice → Accompaniment on a laptop (R30-4)', () => {
  it('shows the books in the tree and a table of Name, Book, Level and Hands', async () => {
    stubMatchMedia({ dark: true })
    await renderApp('/practice/accompaniment?place=called-to-play')
    const tree = await screen.findByRole('navigation', { name: 'Accompaniment by book' })
    expect(within(tree).getByRole('button', { name: /^Called to Play\s*26$/ })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(within(tree).getByRole('button', { name: 'Mine' })).toBeInTheDocument()
    const table = screen.getByRole('table')
    expect(
      within(table)
        .getAllByRole('columnheader')
        .map((cell) => cell.textContent),
    ).toEqual(['Name', 'Book', 'Level', 'Hands', 'Actions'])
    const m1 = within(table).getByRole('rowheader', { name: /^1 · Bass \+ chords/ })
    expect(m1.closest('tr')).toHaveTextContent('LH: Octave, whole note · RH: Chord on every beat')
  })

  it('opens a place from the tree without a new step of history, and opens on it again', async () => {
    const user = userEvent.setup()
    stubMatchMedia({ dark: true })
    const { router } = await renderApp('/practice/accompaniment')
    const tree = await screen.findByRole('navigation', { name: 'Accompaniment by book' })
    const before = router.history.length
    await user.click(within(tree).getByRole('button', { name: /^Bobrova/ }))
    await waitFor(() =>
      expect(router.state.location.search).toMatchObject({ place: 'seven-types' }),
    )
    expect(router.history.length).toBe(before)
    const nav = screen.getByRole('navigation', { name: 'Main navigation' })
    await user.click(within(nav).getByRole('link', { name: 'Practice' }))
    await user.click(await screen.findByRole('link', { name: /^Accompaniment / }))
    await waitFor(() =>
      expect(router.state.location.search).toMatchObject({ place: 'seven-types' }),
    )
  })
})
