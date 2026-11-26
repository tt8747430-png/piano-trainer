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
const escaped = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
/** A run of rows, named by its place and its count. */
const named = (name: string) => new RegExp(`^${escaped(name)}\\d+$`)
const shelf = (name: string) => screen.getByRole('region', { name: named(name) })
/** The runs' names, without their counts. */
const shelves = () =>
  screen.getAllByRole('heading', { level: 2 }).map((each) =>
    [...(each.querySelector('button')?.childNodes ?? [])]
      .filter((node) => node.nodeType === Node.TEXT_NODE)
      .map((node) => node.textContent)
      .join(''),
  )
const rows = (name: string) =>
  within(shelf(name))
    .getAllByRole('link')
    .map((link) => link.getAttribute('href'))
const opened = () => screen.findByRole('heading', { level: 1, name: 'Accompaniment' })

describe('Practice → Accompaniment, the library on a phone (R30-4)', () => {
  it('opens from Practice on every book’s patterns, patterns only (R32)', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice')
    // The phone's list and the laptop's cards both stand in jsdom: the first is the list's.
    const [row] = await screen.findAllByRole('link', { name: /^Accompaniment/ })
    await user.click(row ?? document.body)
    await opened()
    expect(router.state.location.pathname).toBe('/practice/accompaniment')
    expect(shelves()).toEqual([
      'Called to Play',
      'Called to Play 2',
      'Bobrova',
      'Gorshkov',
      'Rhythm styles',
    ])
    const m1 = within(shelf('Called to Play')).getByRole('link', { name: /^1 · Bass \+ chords/ })
    expect(m1).toHaveAttribute('href', '/practice/accompaniment/patterns/M1')
    expect(m1).toHaveTextContent(
      'The right hand plays the chord on every beat over an octave held in the left.',
    )
    // Each run folds after five: Show all says how many it holds.
    const patterns = () => rows('Called to Play').filter((href) => href?.includes('/patterns/'))
    expect(patterns()).toHaveLength(5)
    await user.click(within(shelf('Called to Play')).getByRole('button', { name: /^Show all/ }))
    expect(patterns().length).toBeGreaterThan(5)
    // No song or study among them.
    expect(screen.queryByRole('link', { name: /^Amazing Grace/ })).toBeNull()
  })

  it('marks a book’s patterns at its course’s level, and none on the rhythm styles', async () => {
    await renderApp('/practice/accompaniment?place=gorshkov')
    // Its first pattern, after the book's links to its course and songs.
    const [m1] = within(
      await screen.findByRole('region', { name: named('Gorshkov') }),
    ).getAllByRole('link')
    expect(m1).toHaveTextContent(/Level 3$/)
  })

  it('renames, moves and hides a pattern from its More, each undone or restored (R32)', async () => {
    const user = userEvent.setup()
    const { patternsStore, practiceLibraryStore } = await renderApp(
      '/practice/accompaniment?place=styles',
    )
    await opened()
    await user.click(screen.getByRole('button', { name: /^More for Ballad arpeggio/ }))
    await user.click(await screen.findByRole('menuitem', { name: 'Rename…' }))
    const rename = await screen.findByRole('dialog', { name: 'Rename' })
    const name = within(rename).getByRole('textbox', { name: 'Name' })
    await user.clear(name)
    await user.type(name, 'Opening ballad')
    await user.click(within(rename).getByRole('button', { name: 'Save' }))
    expect(
      await within(shelf('Rhythm styles')).findByRole('link', { name: /^Opening ballad/ }),
    ).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /^More for Opening ballad/ }))
    await user.click(await screen.findByRole('menuitem', { name: 'Restore original name' }))
    expect(practiceLibraryStore.getState().arrangements.accompaniment.itemNames).toEqual({})
    // Hidden as its own page hides it, so the Player's picker leaves it out too.
    await user.click(screen.getByRole('button', { name: /^More for Ballad arpeggio/ }))
    await user.click(await screen.findByRole('menuitem', { name: 'Hide' }))
    expect(patternsStore.getState().hidden).toContain('ballad')
  })

  it('arranges its books in Edit: renames one, makes a folder and moves a pattern into it (R32)', async () => {
    const user = userEvent.setup()
    const { practiceLibraryStore } = await renderApp('/practice/accompaniment')
    await opened()
    await user.click(screen.getByRole('button', { name: 'Edit' }))
    const places = await screen.findByRole('list', { name: 'Places' })
    expect(within(places).getByRole('button', { name: 'Reorder Gorshkov' })).toBeInTheDocument()
    await user.click(within(places).getByRole('button', { name: 'Gorshkov: more' }))
    await user.click(await screen.findByRole('menuitem', { name: 'Rename…' }))
    const rename = await screen.findByRole('dialog', { name: 'Rename' })
    const name = within(rename).getByRole('textbox', { name: 'Name' })
    await user.clear(name)
    await user.type(name, 'Горшков')
    await user.click(within(rename).getByRole('button', { name: 'Save' }))
    await user.click(screen.getByRole('button', { name: 'Done' }))
    expect(shelves()).toContain('Горшков')
    // New folder from the floating New, beside New pattern.
    await user.click(screen.getByRole('button', { name: 'New' }))
    await user.click(await screen.findByRole('button', { name: 'New folder' }))
    const folder = await screen.findByRole('dialog', { name: 'New folder' })
    await user.type(within(folder).getByRole('textbox', { name: 'Name' }), 'Sunday service')
    await user.click(within(folder).getByRole('button', { name: 'Create folder' }))
    await user.click(screen.getAllByRole('button', { name: /^More for / })[0] ?? document.body)
    await user.click(await screen.findByRole('menuitem', { name: 'Move to…' }))
    const move = await screen.findByRole('dialog', { name: /^Move/ })
    await user.click(within(move).getByRole('button', { name: /^Sunday service/ }))
    expect(shelves()).toContain('Sunday service')
    expect(practiceLibraryStore.getState().arrangements.accompaniment.folders).toEqual([
      { id: 'folder-1', name: 'Sunday service' },
    ])
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
    expect(await screen.findByRole('region', { name: named('Hidden') })).toBeInTheDocument()
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

  it('makes a pattern a favourite from its More', async () => {
    const user = userEvent.setup()
    const { patternsStore } = await renderApp('/practice/accompaniment?place=seven-types')
    await opened()
    const first = within(shelf('Bobrova')).getAllByRole('button', { name: /^More for / })[0]
    await user.click(first ?? document.body)
    await user.click(await screen.findByRole('menuitem', { name: 'Add to Favourites' }))
    expect(patternsStore.getState().favourites).toHaveLength(1)
  })

  it('opens on All for a place the URL names that it does not have', async () => {
    await renderApp('/practice/accompaniment?place=psalms')
    expect(await screen.findByRole('region', { name: named('Called to Play') })).toBeInTheDocument()
  })

  it('makes a new pattern from the floating +', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/accompaniment')
    await opened()
    await user.click(screen.getByRole('button', { name: 'New' }))
    await user.click(await screen.findByRole('button', { name: 'New pattern' }))
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
  it('shows a table of Pattern, Hands and Level under its place chips', async () => {
    stubMatchMedia({ dark: true })
    await renderApp('/practice/accompaniment?place=called-to-play')
    const places = await screen.findByRole('radiogroup', { name: 'Show' })
    expect(within(places).getByRole('radio', { name: 'Mine' })).toBeInTheDocument()
    // A book's place is said as a chip that takes it off.
    expect(screen.getByRole('button', { name: 'Remove Called to Play' })).toBeInTheDocument()
    const table = screen.getByRole('table', { name: 'The library' })
    const [head] = within(table).getAllByRole('rowgroup')
    expect(
      within(head ?? table)
        .getAllByRole('columnheader')
        .map((cell) => cell.textContent),
    ).toEqual(['Pattern', 'Hands', 'Level', 'Actions'])
    const m1 = within(table).getByRole('rowheader', { name: /1 · Bass \+ chords/ })
    expect(m1.closest('tr')).toHaveTextContent('LH: Octave, whole note · RH: Chord on every beat')
  })

  it('opens a place from its chips without a new step of history, and opens on it again', async () => {
    const user = userEvent.setup()
    stubMatchMedia({ dark: true })
    const { router } = await renderApp('/practice/accompaniment', {
      storage: saved({ favourites: ['ballad'] }),
    })
    const places = await screen.findByRole('radiogroup', { name: 'Show' })
    const before = router.history.length
    await user.click(within(places).getByRole('radio', { name: 'Favourites' }))
    await waitFor(() => expect(router.state.location.search).toMatchObject({ place: 'favourites' }))
    expect(router.history.length).toBe(before)
    const nav = screen.getByRole('navigation', { name: 'Main navigation' })
    await user.click(within(nav).getByRole('link', { name: 'Practice' }))
    const [row] = await screen.findAllByRole('link', { name: /^Accompaniment/ })
    await user.click(row ?? document.body)
    await waitFor(() => expect(router.state.location.search).toMatchObject({ place: 'favourites' }))
  })
})
