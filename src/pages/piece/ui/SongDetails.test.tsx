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

describe('a song’s Details in its Settings (R29 1.2)', () => {
  it('writes an own song’s title, who wrote it and what is said of it on Details, saved', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/songs/my-1/settings', { storage: withSong() })
    await user.click(await screen.findByRole('button', { name: 'Details' }))
    const title = screen.getByRole('textbox', { name: 'Title' })
    await user.clear(title)
    await user.type(title, 'Evening')
    await user.type(screen.getByRole('textbox', { name: 'Composer' }), 'Ana')
    await user.type(screen.getByRole('textbox', { name: 'About the song' }), 'A lullaby')
    expect(piecesStore.getState().songs[0]).toMatchObject({
      title: 'Evening',
      // Credits is its score's composer: one place, printed under its title too.
      header: { composer: 'Ana' },
      note: { en: 'A lullaby', ru: 'A lullaby' },
    })
    await user.click(screen.getByRole('button', { name: 'Back' }))
    expect(await screen.findByText('Evening')).toBeInTheDocument()
  })

  it('gives a learner no Details on one of the app’s songs: nothing there is theirs to write', async () => {
    await renderApp(`/songs/${SONG.id}/settings`, { auth: await signedInAs('learner') })
    await screen.findByRole('heading', { level: 1 })
    expect(screen.queryByRole('button', { name: 'Details' })).not.toBeInTheDocument()
  })

  it('writes an editor’s changes into the song’s draft from Details, said unpublished on Settings', async () => {
    const user = userEvent.setup()
    const content = createFakeContentEditing({
      items: [{ kind: 'piece', id: SONG.id, body: pieceRecordBody(SONG), meta: {} }],
    })
    await renderApp(`/songs/${SONG.id}/settings`, {
      auth: await signedInAs('editor'),
      contentEditing: content,
    })
    await user.click(await screen.findByRole('button', { name: 'Details' }))
    const words = await screen.findByRole('textbox', { name: 'Lyricist' })
    await user.clear(words)
    await user.type(words, 'Someone')
    await waitFor(
      async () => {
        const draft = await content.draft('piece', SONG.id)
        expect(draft.ok && draft.value?.body).toMatchObject({
          header: expect.objectContaining({ lyricist: 'Someone' }),
        })
      },
      { timeout: 4000 },
    )
    await user.click(screen.getByRole('button', { name: 'Back' }))
    expect(await screen.findByText('Not published')).toBeInTheDocument()
  })
})
