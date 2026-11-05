import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import {
  isDegreePiece,
  isPiece,
  PIECES,
  PIECES_STORAGE_KEY,
  PIECES_VERSION,
  pieceRecordBody,
  type ChartPiece,
} from '@/entities/piece'
import { createFakeAuth, type AccountRole } from '@/shared/api/auth'
import { createFakeContentEditing } from '@/shared/api/content-editing'
import { createMemoryStorage } from '@/shared/lib'

const MUSIC = {
  key: 'G',
  meter: '3/4',
  tempo: 80,
  pattern: 'r2',
  sections: [{ kind: 'verse', lines: ['Em D C G'] }],
}

const withSong = () => {
  const storage = createMemoryStorage()
  const state = { songs: [{ id: 'my-1', title: 'Morning', ...MUSIC }], nextSong: 2 }
  storage.setItem(PIECES_STORAGE_KEY, JSON.stringify({ state, version: PIECES_VERSION }))
  return storage
}

/** A built-in song written as a chart: an editor writes what its page says. */
const SONG = PIECES.find(
  (piece): piece is ChartPiece =>
    isPiece(piece) && !isDegreePiece(piece) && piece.kind === 'song' && !piece.recording,
) as ChartPiece
const OWNER = { id: 'ed', email: 'ed@example.com', password: 'secret-pass', name: 'Ed' }

async function signedInAs(role: AccountRole) {
  const auth = createFakeAuth({ accounts: [{ ...OWNER, role }] })
  await auth.signIn(OWNER.email, OWNER.password)
  return auth
}

/** Opens a property's editor from the song's Details, a sheet on a phone. */
async function openProperty(user: ReturnType<typeof userEvent.setup>, name: string) {
  await user.click(await screen.findByRole('button', { name: new RegExp(`^${name}`) }))
  return screen.findByRole('dialog', { name })
}

describe('a song’s Details, edited where they stand (R32-C)', () => {
  it('writes an own song’s title and description from their properties', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/songs/my-1', { storage: withSong() })
    const title = within(await openProperty(user, 'Title')).getByRole('textbox', { name: 'Title' })
    await user.clear(title)
    await user.type(title, 'Evening{Enter}')
    const about = await openProperty(user, 'Description')
    await user.type(within(about).getByRole('textbox', { name: 'Description' }), 'A lullaby')
    await user.click(within(about).getByRole('button', { name: 'Done' }))
    expect(piecesStore.getState().songs[0]).toMatchObject({
      title: 'Evening',
      note: { en: 'A lullaby', ru: 'A lullaby' },
    })
    expect(await screen.findByRole('heading', { level: 1, name: 'Evening' })).toBeInTheDocument()
  })

  it('writes who wrote an own song as its score prints it, and an empty line takes it away', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/songs/my-1', { storage: withSong() })
    const composer = await openProperty(user, 'Composer')
    await user.type(
      within(composer).getByRole('textbox', { name: 'Composer' }),
      'Mary Smith{Enter}',
    )
    expect(piecesStore.getState().songs[0]?.header).toEqual({ composer: 'Mary Smith' })
    expect(screen.getByRole('button', { name: /^Composer/ })).toHaveTextContent('Mary Smith')
    const again = await openProperty(user, 'Composer')
    await user.clear(within(again).getByRole('textbox', { name: 'Composer' }))
    await user.click(within(again).getByRole('button', { name: 'Done' }))
    expect(piecesStore.getState().songs[0]?.header).toEqual({})
  })

  it('offers the library’s other tags as one is typed, and Create for a new one', async () => {
    const user = userEvent.setup()
    const storage = withSong()
    const { libraryStore } = await renderApp('/songs/my-1', { storage })
    libraryStore.setState({
      songDetails: { amazing: { level: null, genre: null, language: null, tags: ['sunday'] } },
    })
    const tags = await openProperty(user, 'Tags')
    await user.type(within(tags).getByRole('textbox', { name: 'Add a tag' }), 'sun')
    const offered = within(tags).getByRole('list', { name: 'Suggested tags' })
    expect(within(offered).getByRole('button', { name: 'Create “sun”' })).toBeInTheDocument()
    await user.click(within(offered).getByRole('button', { name: 'sunday' }))
    expect(libraryStore.getState().songDetails['my-1']?.tags).toEqual(['sunday'])
    await user.click(within(tags).getByRole('button', { name: 'Remove tag “sunday”' }))
    expect(libraryStore.getState().songDetails['my-1']).toBeUndefined()
  })

  it('gives a learner no title, description or credits to write on one of the app’s songs', async () => {
    await renderApp(`/songs/${SONG.id}`, { auth: await signedInAs('learner') })
    expect(await screen.findByRole('button', { name: /^Tags/ })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^Title/ })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^Composer/ })).not.toBeInTheDocument()
  })

  it('writes an editor’s changes into the song’s draft, said unpublished on Settings', async () => {
    const user = userEvent.setup()
    const content = createFakeContentEditing({
      items: [{ kind: 'piece', id: SONG.id, body: pieceRecordBody(SONG), meta: {} }],
    })
    await renderApp(`/songs/${SONG.id}`, {
      auth: await signedInAs('editor'),
      contentEditing: content,
    })
    const about = await openProperty(user, 'Description')
    const field = within(about).getByRole('textbox', { name: 'Description' })
    await user.clear(field)
    await user.type(field, 'Sung at evening')
    await user.click(within(about).getByRole('button', { name: 'Done' }))
    await waitFor(
      async () => {
        const draft = await content.draft('piece', SONG.id)
        expect(draft.ok && draft.value?.body).toMatchObject({
          note: expect.objectContaining({ en: 'Sung at evening' }),
        })
      },
      { timeout: 4000 },
    )
    await user.click(await screen.findByRole('link', { name: 'Settings' }))
    // Publish… says it changed since it was published (R29 B6).
    const row = await screen.findByRole('link', { name: /^Publish…/ })
    await waitFor(() => expect(row).toHaveTextContent('Has changes'))
  })
})
