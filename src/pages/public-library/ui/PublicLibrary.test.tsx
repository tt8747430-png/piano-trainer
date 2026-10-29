import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'
import { PIECES_STORAGE_KEY, PIECES_VERSION } from '@/entities/piece'
import { createFakeAuth } from '@/shared/api/auth'
import { createFakePublicLibrary } from '@/shared/api/public-library'
import { createMemoryStorage } from '@/shared/lib'

const MUSIC = {
  key: 'G',
  meter: '3/4',
  tempo: 80,
  pattern: 'r2',
  sections: [{ kind: 'verse', lines: ['Em D C G'] }],
}
const ANA = { email: 'ana@example.com', name: 'Ana', password: 'correct horse' }

/** The library with songs others published. */
const withSongs = (...titles: string[]) =>
  createFakePublicLibrary({
    author: () => ({ id: 'bo', name: 'Bo' }),
    items: titles.map((title, i) => ({
      id: `public-${i + 1}`,
      title,
      authorName: 'Bo',
      meta: { key: 'G', meter: '3/4' },
      body: { title, ...MUSIC },
    })),
  })

async function signedIn() {
  const auth = createFakeAuth({ accounts: [ANA] })
  await auth.signIn(ANA.email, ANA.password)
  return auth
}

const ownSong = () => {
  const storage = createMemoryStorage()
  storage.setItem(
    PIECES_STORAGE_KEY,
    JSON.stringify({
      state: { songs: [{ id: 'my-1', title: 'Morning', ...MUSIC }], nextSong: 2 },
      version: PIECES_VERSION,
    }),
  )
  return storage
}

afterEach(() => vi.restoreAllMocks())

describe('the Public library', () => {
  it('is reached from Songs, and lists the songs published, newest first, by author', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/songs', { publicLibrary: withSongs('Older', 'Newer') })
    await user.click(await screen.findByRole('link', { name: 'Public library' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/songs/public'))
    const list = await screen.findByRole('list', { name: 'Public library' })
    expect(
      within(list)
        .getAllByRole('link')
        .map((row) => row.textContent),
    ).toEqual([
      expect.stringMatching(/^Newer\s*by Bo · 0 saves/),
      expect.stringMatching(/^Older\s*by Bo · 0 saves/),
    ])
  })

  it('searches by title, and says when nothing matches', async () => {
    const user = userEvent.setup()
    await renderApp('/songs/public', { publicLibrary: withSongs('Morning', 'Evening') })
    await user.type(
      await screen.findByRole('searchbox', { name: 'Search the Public library' }),
      'zzz',
    )
    expect(await screen.findByText('No song matches “zzz”.')).toBeVisible()
  })

  it('says it needs a connection, offline', async () => {
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false)
    await renderApp('/songs/public', {
      publicLibrary: createFakePublicLibrary({ online: () => false }),
    })
    expect(
      await screen.findByText('You’re offline. The Public library needs a connection.'),
    ).toBeVisible()
  })

  it('opens a song to hear, and saves it to the learner’s songs, counted once', async () => {
    const user = userEvent.setup()
    const publicLibrary = withSongs('Morning')
    const { router, piecesStore } = await renderApp('/songs/public/public-1', {
      publicLibrary,
      auth: await signedIn(),
    })
    expect(await screen.findByRole('heading', { level: 1, name: 'Morning' })).toBeVisible()
    expect(screen.getByText(/by Bo · 0 saves/)).toBeVisible()
    await user.click(screen.getByRole('button', { name: 'Save to my songs' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/songs/my-1'))
    expect(piecesStore.getState().songs).toMatchObject([
      { id: 'my-1', title: 'Morning', author: 'Bo' },
    ])
    // The copy names who published it, under its title.
    expect(await screen.findByText('Bo')).toBeVisible()
    expect(screen.getByText(/Published by/)).toBeVisible()
    const item = await publicLibrary.item('public-1')
    expect(item.ok && item.value?.entry.saves).toBe(1)
  })

  it('says a song no longer there is gone', async () => {
    await renderApp('/songs/public/nothing')
    expect(await screen.findByText('This song is no longer in the Public library.')).toBeVisible()
  })

  it('reports a song to the editors, signed in', async () => {
    const user = userEvent.setup()
    const publicLibrary = withSongs('Morning')
    await renderApp('/songs/public/public-1', { publicLibrary, auth: await signedIn() })
    await user.click(await screen.findByRole('button', { name: 'Report' }))
    const dialog = await screen.findByRole('alertdialog', { name: 'Report this song?' })
    await user.click(within(dialog).getByRole('radio', { name: 'Spam' }))
    await user.type(within(dialog).getByLabelText('A note (optional)'), 'Ads')
    await user.click(within(dialog).getByRole('button', { name: 'Send report' }))
    expect(await within(dialog).findByText('Thanks: the song is reported.')).toBeVisible()
    expect(publicLibrary.reports).toEqual([{ id: 'public-1', reason: 'spam', note: 'Ads' }])
  })

  it('reads in Russian', async () => {
    await renderApp('/songs/public', { locale: 'ru', publicLibrary: withSongs('Morning') })
    await screen.findByRole('list', { name: 'Общая библиотека' })
    expect(untranslated(document.body)).toEqual([])
  })
})

describe('publishing an own song', () => {
  it('publishes it after saying what that means, then offers to take it out', async () => {
    const user = userEvent.setup()
    const publicLibrary = createFakePublicLibrary({ author: () => ({ id: 'ana', name: 'Ana' }) })
    await renderApp('/songs/my-1', { storage: ownSong(), publicLibrary, auth: await signedIn() })
    await user.click(await screen.findByRole('button', { name: 'More' }))
    await user.click(
      within(await screen.findByRole('dialog', { name: 'More' })).getByRole('button', {
        name: 'Publish to the Public library',
      }),
    )
    const dialog = await screen.findByRole('alertdialog', { name: 'Publish “Morning”?' })
    expect(dialog).toHaveTextContent('Publish only music you wrote or may share.')
    await user.click(within(dialog).getByRole('button', { name: 'Publish' }))
    expect(await screen.findByText('Published to the Public library.')).toBeVisible()
    const found = await publicLibrary.browse({ kind: 'song', sort: 'new', query: '' })
    expect(found.ok && found.value.map((entry) => entry.title)).toEqual(['Morning'])
    await user.click(screen.getByRole('button', { name: 'More' }))
    await user.click(
      within(await screen.findByRole('dialog', { name: 'More' })).getByRole('button', {
        name: 'Remove from the Public library',
      }),
    )
    expect(await screen.findByText('Removed from the Public library.')).toBeVisible()
  })

  it('asks a learner signed out to sign in first', async () => {
    const user = userEvent.setup()
    await renderApp('/songs/my-1', { storage: ownSong() })
    await user.click(await screen.findByRole('button', { name: 'More' }))
    await user.click(
      within(await screen.findByRole('dialog', { name: 'More' })).getByRole('button', {
        name: 'Publish to the Public library',
      }),
    )
    const dialog = await screen.findByRole('alertdialog')
    expect(within(dialog).getByRole('link', { name: 'Sign in' })).toHaveAttribute(
      'href',
      '/account/sign-in',
    )
  })
})

describe('patterns in the Public library', () => {
  const withPattern = () =>
    createFakePublicLibrary({
      author: () => ({ id: 'bo', name: 'Bo' }),
      items: [
        {
          id: 'public-9',
          kind: 'pattern',
          title: 'Waltz of mine',
          authorName: 'Bo',
          meta: { rh: 'b1', lh: 'r' },
          body: { name: 'Waltz of mine', rh: 'b1', lh: 'r' },
        },
      ],
    })

  it('lists the patterns apart from the songs, each by its figures', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/songs/public', { publicLibrary: withPattern() })
    expect(await screen.findByText('No songs here yet.')).toBeVisible()
    await user.click(screen.getByRole('radio', { name: 'Patterns' }))
    await waitFor(() => expect(router.state.location.search).toMatchObject({ kind: 'pattern' }))
    const list = await screen.findByRole('list', { name: 'Public library' })
    expect(within(list).getByRole('link', { name: /Waltz of mine/ })).toBeVisible()
  })

  it('opens a pattern by its figures, and saves it to the learner’s patterns', async () => {
    const user = userEvent.setup()
    const { router, patternsStore } = await renderApp('/songs/public/public-9', {
      publicLibrary: withPattern(),
      auth: await signedIn(),
    })
    expect(await screen.findByRole('heading', { level: 1, name: 'Waltz of mine' })).toBeVisible()
    expect(screen.getByText('Right hand')).toBeVisible()
    await user.click(screen.getByRole('button', { name: 'Save to my patterns' }))
    await waitFor(() =>
      expect(router.state.location.pathname).toBe('/practice/accompaniment/patterns/my-1'),
    )
    expect(patternsStore.getState().own).toMatchObject([
      { id: 'my-1', name: 'Waltz of mine', rh: 'b1', lh: 'r' },
    ])
  })
})
