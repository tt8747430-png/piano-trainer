import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'
import type { SharedSong } from '@/entities/piece'
import { songLinkData } from '@/features/share-song'

const SONG: SharedSong = {
  title: 'Morning',
  music: {
    key: 'G',
    meter: '3/4',
    tempo: 84,
    pattern: 'r1',
    sections: [{ kind: 'verse', n: 1, lines: ['G C G D'] }],
  },
}

describe('A shared song', () => {
  it('shows the song its link holds, and adds it to Your songs only when asked', async () => {
    const user = userEvent.setup()
    const data = await songLinkData(SONG)
    const { router, piecesStore } = await renderApp(`/songs/shared?song=${data}`)
    expect(await screen.findByRole('heading', { level: 1, name: 'Morning' })).toBeInTheDocument()
    expect(screen.getByText('G · 3/4 · 84 BPM')).toBeInTheDocument()
    expect(screen.getByText('G C G D')).toBeInTheDocument()
    expect(piecesStore.getState().songs).toEqual([])
    await user.click(screen.getByRole('button', { name: 'Add to Your songs' }))
    expect(piecesStore.getState().songs.map((song) => song.title)).toEqual(['Morning'])
    await waitFor(() => expect(router.state.location.pathname).toBe('/songs/my-1'))
  })

  it('says so when the link holds no song', async () => {
    await renderApp('/songs/shared?song=cut-short')
    expect(
      await screen.findByText('This link holds no song: it may be cut short.'),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'To Songs' })).toHaveAttribute('href', '/songs')
  })

  it('reads in Russian, with nothing left in English', async () => {
    await renderApp(`/songs/shared?song=${await songLinkData(SONG)}`, { locale: 'ru' })
    await screen.findByRole('button', { name: 'Добавить к вашим песням' })
    expect(untranslated(document.body)).toEqual([])
  })
})
