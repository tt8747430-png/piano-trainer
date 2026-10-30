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
    await user.click(await screen.findByRole('link', { name: /^Public library/ }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/songs/public'))
    const list = await screen.findByRole('list', { name: 'Public library' })
    expect(
      within(list)
        .getAllByRole('link')
        .map((row) => row.textContent),
    ).toEqual([
      expect.stringMatching(/^Newer\s*Bo · G · 3\/4/),
      expect.stringMatching(/^Older\s*Bo · G · 3\/4/),
    ])
    expect(screen.getByText('2 songs')).toBeVisible()
  })

  it('sorts by the most saved, from the pop-up by the search', async () => {
    const user = userEvent.setup()
    const publicLibrary = withSongs('Quiet', 'Loved')
    await publicLibrary.save('public-1')
    await renderApp('/songs/public', { publicLibrary })
    const list = await screen.findByRole('list', { name: 'Public library' })
    expect(within(list).getAllByRole('link')[0]).toHaveTextContent(/^Loved/)
    await user.click(screen.getByRole('combobox', { name: /^Sort/ }))
    await user.click(await screen.findByRole('option', { name: 'Most saved' }))
    await waitFor(() =>
      expect(
        within(screen.getByRole('list', { name: 'Public library' })).getAllByRole('link')[0],
      ).toHaveTextContent(/^Quiet.*1 save/),
    )
  })

  it('searches by title, says when nothing matches, and shows all again', async () => {
    const user = userEvent.setup()
    await renderApp('/songs/public', { publicLibrary: withSongs('Morning', 'Evening') })
    await user.type(
      await screen.findByRole('searchbox', { name: 'Search the Public library' }),
      'zzz',
    )
    expect(await screen.findByText('No song matches “zzz”.')).toBeVisible()
    await user.click(screen.getByRole('button', { name: 'Show all' }))
    expect(await screen.findByRole('list', { name: 'Public library' })).toBeVisible()
  })

  it('says it is loading while the library is asked', async () => {
    const publicLibrary = withSongs('Morning')
    await renderApp('/songs/public', {
      publicLibrary: { ...publicLibrary, browse: () => new Promise(() => {}) },
    })
    expect(await screen.findByRole('status')).toHaveTextContent('Loading the Public library…')
  })

  it('says nothing is published yet, and how to publish the first', async () => {
    await renderApp('/songs/public', { publicLibrary: createFakePublicLibrary() })
    expect(await screen.findByText('No songs here yet.')).toBeVisible()
    expect(screen.getByRole('link', { name: 'Your songs' })).toHaveAttribute('href', '/songs')
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
    expect(screen.getByText('Bo')).toBeVisible()
    expect(screen.getByText('Not saved yet')).toBeVisible()
    // Its facts, a line of chips.
    expect(screen.getByText('Key').nextElementSibling).toHaveTextContent('G')
    expect(screen.getByText('Time').nextElementSibling).toHaveTextContent('3/4')
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
  it('publishes it from its own sheet: a description long enough, its row previewed', async () => {
    const user = userEvent.setup()
    const publicLibrary = createFakePublicLibrary({ author: () => ({ id: 'ana', name: 'Ana' }) })
    await renderApp('/songs/my-1', { storage: ownSong(), publicLibrary, auth: await signedIn() })
    await user.click(await screen.findByRole('button', { name: 'More' }))
    await user.click(
      within(await screen.findByRole('dialog', { name: 'More' })).getByRole('button', {
        name: 'Publish to the Public library',
      }),
    )
    const sheet = await screen.findByRole('dialog', { name: 'Publish to the Public library' })
    expect(sheet).toHaveTextContent('Publish only music you wrote or may share.')
    // Its row as others will see it: its title, by whom, its key and time.
    expect(within(sheet).getByRole('region', { name: 'As others will see it' })).toHaveTextContent(
      /Morning.*Ana/,
    )
    expect(within(sheet).getByRole('button', { name: 'About Publish to the Public library' }))
    const publish = within(sheet).getByRole('button', { name: 'Publish' })
    expect(publish).toBeDisabled()
    const description = within(sheet).getByRole('textbox', { name: 'Description' })
    await user.type(description, 'A slow song')
    expect(sheet).toHaveTextContent('9 more characters to go')
    expect(publish).toBeDisabled()
    await user.type(description, ' for the morning')
    expect(publish).toBeEnabled()
    await user.click(publish)
    expect(await screen.findByText('Published to the Public library.')).toBeVisible()
    const found = await publicLibrary.browse({ kind: 'song', sort: 'new', query: '' })
    expect(found).toMatchObject({
      ok: true,
      value: [{ title: 'Morning', meta: { description: 'A slow song for the morning' } }],
    })
    // The song's page says where it stands: in the library, to view, edit or take out.
    const card = await screen.findByRole('region', { name: 'In the Public library' })
    const id = found.ok ? found.value[0]?.id : ''
    expect(within(card).getByRole('link', { name: 'View in the library' })).toHaveAttribute(
      'href',
      `/songs/public/${id}`,
    )
    await user.click(within(card).getByRole('button', { name: 'Unpublish' }))
    expect(await screen.findByText('Removed from the Public library.')).toBeVisible()
    await waitFor(() =>
      expect(screen.queryByRole('region', { name: 'In the Public library' })).toBeNull(),
    )
  })

  it('shows what its author wrote of an item on its page', async () => {
    const publicLibrary = createFakePublicLibrary({
      items: [
        {
          id: 'public-3',
          title: 'Evening',
          authorName: 'Bo',
          meta: { key: 'C', meter: '3/4', description: 'A waltz to end the day with.' },
          body: { title: 'Evening', ...MUSIC },
        },
      ],
    })
    await renderApp('/songs/public/public-3', { publicLibrary })
    const about = await screen.findByRole('region', { name: 'About' })
    expect(about).toHaveTextContent('A waltz to end the day with.')
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
    const dialog = await screen.findByRole('dialog', { name: 'Publish to the Public library' })
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
    expect(screen.getByText('1 pattern')).toBeVisible()
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
