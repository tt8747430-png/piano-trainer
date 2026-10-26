import { act, cleanup, fireEvent, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'
import { LIBRARY_STORAGE_KEY, LIBRARY_VERSION, MOST_SETLISTS } from '@/entities/library'
import { createMemoryStorage } from '@/shared/lib'
import { stubBox } from '@/shared/test/layout'

const SUNDAY = { id: 'set-1', name: 'Sunday', pieces: ['silent', 'bz5', 'gone', 'amazing'] }

/** A device whose library holds `setlists`. */
function kept(setlists: readonly object[], nextSetlist = 2) {
  const storage = createMemoryStorage()
  storage.setItem(
    LIBRARY_STORAGE_KEY,
    JSON.stringify({ state: { favourites: [], setlists, nextSetlist }, version: LIBRARY_VERSION }),
  )
  return storage
}

/** The setlist's songs as its list shows them, in order. */
const songs = () =>
  within(screen.getByRole('list', { name: 'Songs' }))
    .getAllByRole('link')
    .map((link) => link.getAttribute('href'))

/** Opens the bar's More and chooses one of its actions. */
async function chooseMore(user: ReturnType<typeof userEvent.setup>, action: string) {
  await user.click(await screen.findByRole('button', { name: 'More' }))
  await user.click(await screen.findByRole('button', { name: action }))
}

describe('A setlist (ADR 0103)', () => {
  it('lists its songs in its order, each a row to its page, leaving out a song no longer there', async () => {
    await renderApp('/songs/setlists/set-1', { storage: kept([SUNDAY]) })
    expect(await screen.findByRole('heading', { level: 1, name: 'Sunday' })).toBeInTheDocument()
    expect(songs()).toEqual(['/songs/silent', '/songs/bz5', '/songs/amazing'])
    // Each numbered by its place, as a sequence's rows are.
    expect(screen.getByRole('link', { name: /Silent Night/ })).toHaveTextContent(/^1/)
  })

  it('is not found where the library has no such setlist', async () => {
    await renderApp('/songs/setlists/set-9', { storage: kept([SUNDAY]) })
    expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Go to Songs' })).toHaveAttribute('href', '/songs')
  })

  it('renames it in place: a double tap on its title, or Rename in More', async () => {
    const user = userEvent.setup()
    const { libraryStore } = await renderApp('/songs/setlists/set-1', { storage: kept([SUNDAY]) })
    await user.dblClick(await screen.findByRole('button', { name: 'Sunday' }))
    const field = screen.getByRole('textbox', { name: 'Setlist name' })
    await user.clear(field)
    await user.type(field, 'Easter{Enter}')
    expect(libraryStore.getState().setlists[0]?.name).toBe('Easter')
    expect(screen.getByRole('heading', { level: 1, name: 'Easter' })).toBeInTheDocument()
    await chooseMore(user, 'Rename')
    await user.type(await screen.findByRole('textbox', { name: 'Setlist name' }), ' Day{Enter}')
    expect(libraryStore.getState().setlists[0]?.name).toBe('Easter Day')
  })

  it('duplicates it, opening the copy', async () => {
    const user = userEvent.setup()
    const { libraryStore, router } = await renderApp('/songs/setlists/set-1', {
      storage: kept([SUNDAY]),
    })
    await chooseMore(user, 'Duplicate')
    await waitFor(() => expect(router.state.location.pathname).toBe('/songs/setlists/set-2'))
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Sunday (copy)' }),
    ).toBeInTheDocument()
    expect(libraryStore.getState().setlists.map((setlist) => setlist.name)).toEqual([
      'Sunday',
      'Sunday (copy)',
    ])
    expect(songs()).toEqual(['/songs/silent', '/songs/bz5', '/songs/amazing'])
  })

  it('greys Duplicate once the library holds as many setlists as it keeps, saying why', async () => {
    const user = userEvent.setup()
    const full = Array.from({ length: MOST_SETLISTS }, (_, i) => ({
      id: `set-${i + 1}`,
      name: `List ${i + 1}`,
      pieces: [],
    }))
    await renderApp('/songs/setlists/set-1', { storage: kept(full, MOST_SETLISTS + 1) })
    await user.click(await screen.findByRole('button', { name: 'More' }))
    const duplicate = await screen.findByRole('button', { name: 'Duplicate' })
    expect(duplicate).toBeDisabled()
    expect(duplicate).toHaveAccessibleDescription(
      'There is no room for another setlist: delete one first.',
    )
  })

  it('deletes it once asked, back on Songs’ setlists; keeping it changes nothing', async () => {
    const user = userEvent.setup()
    const { libraryStore, router } = await renderApp('/songs/setlists/set-1', {
      storage: kept([SUNDAY]),
    })
    await chooseMore(user, 'Delete')
    const asked = await screen.findByRole('alertdialog', { name: 'Delete “Sunday”?' })
    await user.click(within(asked).getByRole('button', { name: 'Keep it' }))
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument())
    expect(libraryStore.getState().setlists).toHaveLength(1)
    await chooseMore(user, 'Delete')
    await user.click(
      within(await screen.findByRole('alertdialog')).getByRole('button', { name: 'Delete' }),
    )
    await waitFor(() => expect(router.state.location.pathname).toBe('/songs'))
    expect(router.state.location.search).toEqual({ collection: 'setlists' })
    expect(libraryStore.getState().setlists).toEqual([])
  })

  it('takes a song out, the song itself kept in Songs', async () => {
    const user = userEvent.setup()
    const { libraryStore } = await renderApp('/songs/setlists/set-1', { storage: kept([SUNDAY]) })
    await user.click(
      await screen.findByRole('button', { name: 'Remove Silent Night from the setlist' }),
    )
    expect(songs()).toEqual(['/songs/bz5', '/songs/amazing'])
    expect(libraryStore.getState().setlists[0]?.pieces).toEqual(['bz5', 'gone', 'amazing'])
  })

  it('moves a song by keyboard: Space picks it up, the arrows move it, Space puts it down', async () => {
    const { libraryStore } = await renderApp('/songs/setlists/set-1', { storage: kept([SUNDAY]) })
    const handle = await screen.findByRole('button', { name: 'Move Silent Night' })
    // jsdom lays nothing out: the rows stand one under the other.
    const rows = within(screen.getByRole('list', { name: 'Songs' })).getAllByRole('listitem')
    rows.forEach((row, i) => stubBox(row, { top: i * 72, width: 400, height: 64 }))
    // The keyboard's sensor hears the keys from the next task on, as it does in a browser.
    const settle = () => act(() => new Promise((done) => setTimeout(done, 0)))
    act(() => handle.focus())
    fireEvent.keyDown(handle, { code: 'Space', key: ' ' })
    await settle()
    fireEvent.keyDown(handle, { code: 'ArrowDown', key: 'ArrowDown' })
    await settle()
    fireEvent.keyDown(handle, { code: 'Space', key: ' ' })
    await waitFor(() =>
      expect(libraryStore.getState().setlists[0]?.pieces).toEqual([
        'bz5',
        'silent',
        'gone',
        'amazing',
      ]),
    )
    expect(songs()).toEqual(['/songs/bz5', '/songs/silent', '/songs/amazing'])
    // A screen reader hears where it went, by its title and its place.
    expect(await screen.findByText('Silent Night put down at place 2 of 3.')).toBeInTheDocument()
  })

  it('searches its songs, in the URL', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/songs/setlists/set-1', { storage: kept([SUNDAY]) })
    await user.type(await screen.findByRole('searchbox', { name: 'Search this setlist' }), 'grace')
    await waitFor(() => expect(router.state.location.search).toEqual({ q: 'grace' }))
    expect(songs()).toEqual(['/songs/amazing'])
    await user.clear(screen.getByRole('searchbox', { name: 'Search this setlist' }))
    await user.type(screen.getByRole('searchbox', { name: 'Search this setlist' }), 'zzzz')
    expect(await screen.findByText('No songs here match “zzzz”.')).toBeInTheDocument()
  })

  it('adds songs by search from a sheet, a tap putting one in or taking it out', async () => {
    const user = userEvent.setup()
    const { libraryStore } = await renderApp('/songs/setlists/set-1', { storage: kept([SUNDAY]) })
    await user.click(await screen.findByRole('button', { name: 'Add songs' }))
    const sheet = await screen.findByRole('dialog', { name: 'Add songs' })
    expect(within(sheet).getByRole('checkbox', { name: /^Silent Night/ })).toBeChecked()
    await user.type(within(sheet).getByRole('searchbox', { name: 'Search songs' }), 'lamb')
    const lamb = await within(sheet).findByRole('checkbox', { name: /Mary Had a Little Lamb/ })
    expect(within(sheet).queryByRole('checkbox', { name: /^Silent Night/ })).toBeNull()
    await user.click(lamb)
    expect(libraryStore.getState().setlists[0]?.pieces).toEqual([
      'silent',
      'bz5',
      'gone',
      'amazing',
      'mary-lamb',
    ])
    expect(lamb).toBeChecked()
    await user.click(lamb)
    expect(libraryStore.getState().setlists[0]?.pieces).not.toContain('mary-lamb')
  })

  it('says how to fill an empty setlist, its Add songs there', async () => {
    const user = userEvent.setup()
    await renderApp('/songs/setlists/set-1', {
      storage: kept([{ id: 'set-1', name: 'Sunday', pieces: [] }]),
    })
    const empty = (await screen.findByText('No songs here yet')).closest('[data-slot=empty]')
    if (!(empty instanceof HTMLElement)) throw new Error('an empty setlist says so')
    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument()
    await user.click(within(empty).getByRole('button', { name: 'Add songs' }))
    expect(await screen.findByRole('dialog', { name: 'Add songs' })).toBeInTheDocument()
  })

  it('reads in Russian', async () => {
    await renderApp('/songs/setlists/set-1', { locale: 'ru', storage: kept([SUNDAY]) })
    expect(await screen.findByRole('heading', { level: 1, name: 'Sunday' })).toBeInTheDocument()
    expect(untranslated(document.body)).toEqual([])
    cleanup()
  })
})
