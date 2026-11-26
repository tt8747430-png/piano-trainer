import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
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
      state: {
        songs: [{ id: 'my-1', title: 'Morning', added: '2026-11-01T09:00:00.000Z', ...MUSIC }],
        nextSong: 2,
      },
      version: PIECES_VERSION,
    }),
  )
  return storage
}

afterEach(() => vi.restoreAllMocks())

/** The song's Settings window, from its page's More. */
async function openSettings(user: ReturnType<typeof userEvent.setup>) {
  await user.click(await screen.findByRole('button', { name: 'More' }))
  await user.click(await screen.findByRole('menuitem', { name: 'Settings' }))
  return screen.findByRole('dialog', { name: 'Settings' })
}

describe('publishing an own song', () => {
  it('publishes it from a page of its Settings window: a description long enough, its row previewed', async () => {
    const user = userEvent.setup()
    const publicLibrary = createFakePublicLibrary({ author: () => ({ id: 'ana', name: 'Ana' }) })
    await renderApp('/songs/my-1', {
      storage: ownSong(),
      publicLibrary,
      auth: await signedIn(),
    })
    const row = within(await openSettings(user)).getByRole('button', { name: /^Publish…/ })
    expect(row).toHaveTextContent('Not published')
    await user.click(row)
    expect(await screen.findByRole('heading', { name: 'Publish' })).toBeInTheDocument()
    expect(document.body).toHaveTextContent('The Terms of Use apply.')
    // Its row as others will see it: its title, by whom, its key and time.
    expect(screen.getByRole('region', { name: 'As others will see it' })).toHaveTextContent(
      /Morning.*Ana/,
    )
    const publish = screen.getByRole('button', { name: 'Publish' })
    expect(publish).toBeDisabled()
    const description = screen.getByRole('textbox', { name: 'Description' })
    await user.type(description, 'A slow song')
    expect(document.body).toHaveTextContent('9 more characters to go')
    expect(publish).toBeDisabled()
    await user.type(description, ' for the morning')
    // The rights are confirmed each time (D3): Publish waits for the tick.
    expect(publish).toBeDisabled()
    await user.click(
      screen.getByRole('checkbox', { name: /I confirm that the title and composer/ }),
    )
    expect(publish).toBeEnabled()
    await user.click(publish)
    expect(await screen.findByText('Published to the Public library.')).toBeVisible()
    const found = await publicLibrary.browse({ kind: 'song', sort: 'new', query: '' })
    expect(found).toMatchObject({
      ok: true,
      value: [{ title: 'Morning', meta: { description: 'A slow song for the morning' } }],
    })
    // The page says where it stands (Noji's): in the library with its saves, Copy link, View in
    // library; a new version only once something changed; Unpublish apart.
    expect(await screen.findByText('In the Public library')).toBeVisible()
    expect(document.body).toHaveTextContent('Not saved yet')
    expect(screen.getByRole('button', { name: 'Copy link' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'View in library' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Publish new version' })).toBeNull()
    // Unpublish asks first.
    await user.click(screen.getByRole('button', { name: 'Unpublish' }))
    const asked = await screen.findByRole('alertdialog', { name: 'Unpublish it?' })
    await user.click(within(asked).getByRole('button', { name: 'Unpublish' }))
    expect(await screen.findByText('Removed from the Public library.')).toBeVisible()
    await waitFor(() => expect(screen.queryByText('In the Public library')).toBeNull())
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
    const about = await screen.findByRole('region', { name: 'About this song' })
    expect(about).toHaveTextContent('A waltz to end the day with.')
  })

  it('asks a learner signed out to sign in first', async () => {
    const user = userEvent.setup()
    await renderApp('/songs/my-1', { storage: ownSong() })
    await user.click(within(await openSettings(user)).getByRole('button', { name: /^Publish…/ }))
    expect(await screen.findByRole('link', { name: 'Sign in' })).toHaveAttribute(
      'href',
      '/account/sign-in',
    )
  })
})
