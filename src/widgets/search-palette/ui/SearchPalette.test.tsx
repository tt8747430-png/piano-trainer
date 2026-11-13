import { stubMatchMedia } from '@/shared/test/match-media'
import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'
import { LIBRARY_STORAGE_KEY, LIBRARY_VERSION } from '@/entities/library'
import { createMemoryStorage } from '@/shared/lib'

const field = () => screen.findByRole('combobox', { name: 'Search everything' })
const palette = () => screen.findByRole('dialog', { name: 'Search' })

/** The rows of a group, by its heading. */
const rowsOf = async (heading: string) =>
  within(await screen.findByRole('group', { name: heading })).getAllByRole('option')

/** Where the router is: its path, and its entry in the history. */
const at = (router: Awaited<ReturnType<typeof renderApp>>['router']) => ({
  path: router.state.location.pathname,
  entry: router.history.location.state.__TSR_index,
})

describe('the Search palette', () => {
  it('opens on the modifier and K over the screen, and Escape closes it with nothing pushed', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/songs')
    await screen.findByRole('heading', { level: 1, name: 'Songs' })
    await user.keyboard('{Control>}k{/Control}')
    const input = await field()
    await waitFor(() => expect(input).toHaveFocus())
    // Over the screen, which stays as it was under it.
    expect(
      screen.getByRole('heading', { level: 1, name: 'Songs', hidden: true }),
    ).toBeInTheDocument()
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    expect(at(router)).toEqual({ path: '/songs', entry: 0 })
  })

  it('opens from a place’s search button on a phone', async () => {
    const user = userEvent.setup()
    await renderApp('/practice')
    await user.click(
      within(await screen.findByRole('main')).getByRole('button', { name: 'Search' }),
    )
    expect(await palette()).toBeInTheDocument()
  })

  it('opens from the sidebar’s Search on a laptop', async () => {
    // Every media query matches: the sidebar's among them.
    stubMatchMedia({ dark: true })
    const user = userEvent.setup()
    await renderApp('/practice')
    const nav = await screen.findByRole('navigation', { name: 'Main navigation' })
    await user.click(within(nav).getByRole('button', { name: 'Search' }))
    expect(await palette()).toBeInTheDocument()
  })

  it('suggests Practice’s pages before anything is typed', async () => {
    const user = userEvent.setup()
    await renderApp('/')
    await screen.findByRole('heading', { level: 1, name: 'Learn' })
    await user.keyboard('{Control>}k{/Control}')
    const suggested = await rowsOf('Suggestions')
    expect(suggested[0]).toHaveTextContent(/^Chords/)
    expect(screen.queryByRole('group', { name: 'Recent searches' })).toBeNull()
  })

  it('filters as it is typed, grouped Practice · Songs · Folders · Lessons', async () => {
    const user = userEvent.setup()
    await renderApp('/')
    await screen.findByRole('heading', { level: 1, name: 'Learn' })
    await user.keyboard('{Control>}k{/Control}')
    await user.type(await field(), 'c')
    await waitFor(async () =>
      expect(
        within(await screen.findByRole('listbox'))
          .getAllByRole('group')
          .map((group) => group.firstElementChild?.textContent),
      ).toEqual(['Practice', 'Songs', 'Folders', 'Lessons']),
    )
  })

  it('opens a song on ↓ and Enter, one entry from the screen under it, which Back returns to', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice')
    await screen.findByRole('heading', { level: 1, name: 'Practice' })
    await user.keyboard('{Control>}k{/Control}')
    await user.type(await field(), 'still my soul')
    const [song] = await rowsOf('Songs')
    expect(song).toHaveTextContent(/Still, my soul/)
    // The first row is chosen as the list is shown; the arrows move from it.
    await waitFor(() => expect(song).toHaveAttribute('aria-selected', 'true'))
    await user.keyboard('{ArrowDown}{ArrowUp}{Enter}')
    await waitFor(() => expect(at(router)).toEqual({ path: '/songs/bz5', entry: 1 }))
    expect(screen.queryByRole('dialog')).toBeNull()
    await act(() => router.history.back())
    await waitFor(() => expect(at(router)).toEqual({ path: '/practice', entry: 0 }))
  })

  it('keeps what was searched among the recent searches, to type again', async () => {
    const user = userEvent.setup()
    const { viewsStore } = await renderApp('/')
    await screen.findByRole('heading', { level: 1, name: 'Learn' })
    await user.keyboard('{Control>}k{/Control}')
    await user.type(await field(), 'dorian')
    await user.click((await rowsOf('Practice'))[0]!)
    expect(viewsStore.getState().searchRecent).toEqual(['dorian'])
    await user.keyboard('{Control>}k{/Control}')
    const [recent] = await rowsOf('Recent searches')
    expect(recent).toHaveTextContent('dorian')
    await user.click(recent!)
    expect(await field()).toHaveValue('dorian')
  })

  it('reads a chord symbol typed as the chord, and leads with it, printed as the sheets print it', async () => {
    const user = userEvent.setup()
    await renderApp('/')
    await screen.findByRole('heading', { level: 1, name: 'Learn' })
    await user.keyboard('{Control>}k{/Control}')
    await user.type(await field(), 'F#m7b5')
    const [first] = await rowsOf('Practice')
    expect(first).toHaveTextContent('F♯m7♭5')
    expect(first).toHaveTextContent('Half-diminished 7th')
  })

  it('finds a folder by its name, its songs counted, and says a song archived is', async () => {
    const user = userEvent.setup()
    const storage = createMemoryStorage()
    storage.setItem(
      LIBRARY_STORAGE_KEY,
      JSON.stringify({
        state: {
          folders: [
            {
              id: 'folder-1',
              name: 'Sunday service',
              picture: 'church',
              paint: 'grass',
              songs: ['silent'],
            },
          ],
          archive: [{ kind: 'song', id: 'bz5', from: { folder: 'bozhe-spasibo', index: 4 } }],
        },
        version: LIBRARY_VERSION,
      }),
    )
    await renderApp('/', { storage })
    await screen.findByRole('heading', { level: 1, name: 'Learn' })
    await user.keyboard('{Control>}k{/Control}')
    await user.type(await field(), 'sunday')
    expect((await rowsOf('Folders'))[0]).toHaveTextContent(/Sunday service.*1 song/)
    await user.clear(await field())
    await user.type(await field(), 'still my soul')
    expect((await rowsOf('Songs'))[0]).toHaveTextContent('Archived')
  })

  it('says so when nothing is found', async () => {
    const user = userEvent.setup()
    await renderApp('/')
    await screen.findByRole('heading', { level: 1, name: 'Learn' })
    await user.keyboard('{Control>}k{/Control}')
    await user.type(await field(), 'zzzz')
    expect(await screen.findByText(/^No results for/)).toBeInTheDocument()
  })

  it('opens from a /search?q= link over Learn, on what the link names', async () => {
    const { router } = await renderApp('/search?q=dorian')
    expect(await field()).toHaveValue('dorian')
    await waitFor(() => expect(at(router)).toEqual({ path: '/', entry: 0 }))
  })

  it('opens from Songs’ own search on what was typed there', async () => {
    const user = userEvent.setup()
    await renderApp('/songs?q=grace')
    await user.click(await screen.findByRole('button', { name: 'Search everywhere' }))
    expect(await field()).toHaveValue('grace')
  })

  it('reads in Russian, with nothing left in English', async () => {
    const user = userEvent.setup()
    await renderApp('/', { locale: 'ru' })
    await screen.findByRole('heading', { level: 1 })
    await user.keyboard('{Control>}k{/Control}')
    await user.type(await screen.findByRole('combobox'), 'дорийск')
    expect(await screen.findByRole('group', { name: 'Практика' })).toBeInTheDocument()
    expect(untranslated(screen.getByRole('dialog'))).toEqual([])
  })
})
