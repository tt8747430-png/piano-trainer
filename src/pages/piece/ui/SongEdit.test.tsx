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

describe('a song’s page in Edit (round 28)', () => {
  it('writes an own song’s title, who wrote it and what is said of it, in place, saved', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/songs/my-1', { storage: withSong() })
    await user.click(await screen.findByRole('button', { name: 'Edit' }))
    const title = screen.getByRole('textbox', { name: 'Title' })
    await user.clear(title)
    await user.type(title, 'Evening')
    await user.type(screen.getByRole('textbox', { name: 'Music' }), 'Ana')
    await user.type(screen.getByRole('textbox', { name: 'About the song' }), 'A lullaby')
    expect(piecesStore.getState().songs[0]).toMatchObject({
      title: 'Evening',
      // Who wrote it is its score's composer: one place, printed under its title too.
      header: { composer: 'Ana' },
      note: { en: 'A lullaby', ru: 'A lullaby' },
    })
    expect(screen.getByRole('link', { name: /Edit the music/ })).toHaveAttribute(
      'href',
      '/edit/my-1',
    )
    await user.click(screen.getByRole('button', { name: 'Done' }))
    expect(await screen.findByRole('heading', { level: 1, name: 'Evening' })).toBeInTheDocument()
  })

  it('gives a learner Edit score on one of the app’s songs, their version of its score', async () => {
    await renderApp(`/songs/${SONG.id}`, { auth: await signedInAs('learner') })
    expect(await screen.findByRole('link', { name: 'Edit score' })).toHaveAttribute(
      'href',
      `/edit/${SONG.id}`,
    )
  })

  it('writes an editor’s changes into the song’s draft, said unpublished in the bar', async () => {
    const user = userEvent.setup()
    const content = createFakeContentEditing({
      items: [{ kind: 'piece', id: SONG.id, body: pieceRecordBody(SONG), meta: {} }],
    })
    await renderApp(`/songs/${SONG.id}`, {
      auth: await signedInAs('editor'),
      contentEditing: content,
    })
    await user.click(await screen.findByRole('button', { name: 'Edit' }))
    const words = await screen.findByRole('textbox', { name: 'Words' })
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
    expect(screen.getByText('Saved · not published')).toBeInTheDocument()
  })
})
