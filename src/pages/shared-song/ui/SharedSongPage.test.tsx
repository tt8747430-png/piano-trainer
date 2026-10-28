import { fireEvent, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'
import type { SharedSong } from '@/entities/piece'
import { songLinkData } from '@/features/share-song'

/** A song's link text, which a song this short always has. */
async function linkOf(song: Parameters<typeof songLinkData>[0]): Promise<string> {
  const data = await songLinkData(song)
  if (data === null) throw new Error('no link')
  return data
}

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
  it('shows the song its link holds, and adds it to the library only when asked', async () => {
    const user = userEvent.setup()
    const data = await linkOf(SONG)
    const { router, piecesStore } = await renderApp(`/songs/shared?song=${data}`)
    expect(await screen.findByRole('heading', { level: 1, name: 'Morning' })).toBeInTheDocument()
    expect(screen.getByText('G · 3/4 · 84 BPM')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^Bar 1: G$/ })).toBeInTheDocument()
    expect(piecesStore.getState().songs).toEqual([])
    await user.click(screen.getByRole('button', { name: 'Add to the library' }))
    expect(piecesStore.getState().songs.map((song) => song.title)).toEqual(['Morning'])
    await waitFor(() => expect(router.state.location.pathname).toBe('/songs/my-1'))
  })

  it('writes its key as the song page does, a flat as a flat', async () => {
    const data = await linkOf({ ...SONG, music: { ...SONG.music, key: 'Db' } })
    await renderApp(`/songs/shared?song=${data}`)
    expect(await screen.findByText('D♭ · 3/4 · 84 BPM')).toBeInTheDocument()
  })

  it('floats Add, and plays a tapped bar on its keys before it is added', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp(`/songs/shared?song=${await linkOf(SONG)}`)
    const add = await screen.findByRole('button', { name: 'Add to the library' })
    expect(add.closest('[data-slot="floating-actions"]')).not.toBeNull()
    expect(screen.getByRole('group', { name: 'Keyboard' })).toBeInTheDocument()
    const bar = screen.getByRole('button', { name: /^Bar 2: C$/ })
    await user.click(bar)
    expect(audio.played).toHaveLength(1)
    expect(bar).toHaveAttribute('aria-pressed', 'true')
  })

  it('names Add in words, by the library it adds to, with no line repeating it', async () => {
    await renderApp(`/songs/shared?song=${await linkOf(SONG)}`)
    expect(await screen.findByRole('button', { name: 'Add to the library' })).toHaveTextContent(
      'Add to the library',
    )
    expect(screen.queryByText(/Your songs/)).toBeNull()
  })

  it('adds the song once, however quickly Add is pressed again', async () => {
    const { router, piecesStore } = await renderApp(`/songs/shared?song=${await linkOf(SONG)}`)
    const add = await screen.findByRole('button', { name: 'Add to the library' })
    fireEvent.click(add)
    fireEvent.click(add)
    await waitFor(() => expect(router.state.location.pathname).toBe('/songs/my-1'))
    expect(piecesStore.getState().songs.map((song) => song.id)).toEqual(['my-1'])
  })

  it('says so when the link holds no song', async () => {
    await renderApp('/songs/shared?song=cut-short')
    expect(
      await screen.findByText('This link holds no song: it may be cut short.'),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'To Songs' })).toHaveAttribute('href', '/songs')
  })

  it('reads in Russian, with nothing left in English', async () => {
    await renderApp(`/songs/shared?song=${await linkOf(SONG)}`, { locale: 'ru' })
    await screen.findByRole('button', { name: 'Добавить в библиотеку' })
    expect(untranslated(document.body)).toEqual([])
  })
})
