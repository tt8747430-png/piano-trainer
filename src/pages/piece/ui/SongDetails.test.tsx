import { screen, waitFor } from '@testing-library/react'
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

describe('what a song says of itself, in its page’s Edit (R30 S5)', () => {
  it('writes an own song’s title and what is said of it, saved; who wrote it is the score’s', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/songs/my-1?edit=true', { storage: withSong() })
    const title = await screen.findByRole('textbox', { name: 'Title' })
    await user.clear(title)
    await user.type(title, 'Evening')
    await user.type(screen.getByRole('textbox', { name: 'About the song' }), 'A lullaby')
    expect(screen.queryByRole('textbox', { name: 'Composer' })).not.toBeInTheDocument()
    expect(piecesStore.getState().songs[0]).toMatchObject({
      title: 'Evening',
      note: { en: 'A lullaby', ru: 'A lullaby' },
    })
    await user.click(screen.getByRole('button', { name: 'Done' }))
    expect(await screen.findByRole('heading', { level: 1, name: 'Evening' })).toBeInTheDocument()
  })

  it('gives a learner no title or about to write on one of the app’s songs, only its details', async () => {
    await renderApp(`/songs/${SONG.id}?edit=true`, { auth: await signedInAs('learner') })
    expect(await screen.findByRole('textbox', { name: 'Add a tag' })).toBeInTheDocument()
    expect(screen.queryByRole('textbox', { name: 'Title' })).not.toBeInTheDocument()
  })

  it('writes an editor’s changes into the song’s draft, said unpublished on Settings', async () => {
    const user = userEvent.setup()
    const content = createFakeContentEditing({
      items: [{ kind: 'piece', id: SONG.id, body: pieceRecordBody(SONG), meta: {} }],
    })
    await renderApp(`/songs/${SONG.id}?edit=true`, {
      auth: await signedInAs('editor'),
      contentEditing: content,
    })
    const about = await screen.findByRole('textbox', { name: 'About the song' })
    await user.clear(about)
    await user.type(about, 'Sung at evening')
    await waitFor(
      async () => {
        const draft = await content.draft('piece', SONG.id)
        expect(draft.ok && draft.value?.body).toMatchObject({
          note: expect.objectContaining({ en: 'Sung at evening' }),
        })
      },
      { timeout: 4000 },
    )
    await user.click(screen.getByRole('button', { name: 'Done' }))
    await user.click(await screen.findByRole('link', { name: 'Settings' }))
    // Publish… says it changed since it was published (R29 B6).
    const row = await screen.findByRole('link', { name: /^Publish…/ })
    await waitFor(() => expect(row).toHaveTextContent('Changed since it was published'))
  })
})
