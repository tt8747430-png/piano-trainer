import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { PIECES_STORAGE_KEY, PIECES_VERSION } from '@/entities/piece'
import { createMemoryStorage } from '@/shared/lib'

const withSong = () => {
  const storage = createMemoryStorage()
  storage.setItem(
    PIECES_STORAGE_KEY,
    JSON.stringify({
      state: {
        songs: [
          {
            id: 'my-1',
            title: 'Morning',
            key: 'G',
            meter: '4/4',
            tempo: 90,
            pattern: 'r1',
            sections: [{ kind: 'verse', lines: ['G G G G'] }],
          },
        ],
        nextSong: 2,
      },
      version: PIECES_VERSION,
    }),
  )
  return storage
}

describe('the editor’s panel (A40)', () => {
  it('three tabs, the URL holds the tab', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/edit/my-1', { storage: withSong() })
    // The phone's sheet, expanded from its bar of categories: the three tabs at its top.
    const kinds = await screen.findByRole('toolbar', { name: 'Kinds of tools' })
    await user.click(within(kinds).getByRole('button', { name: 'Modes' }))
    const tabs = await screen.findByRole('radiogroup', { name: 'Editor panel' })
    expect(
      within(tabs)
        .getAllByRole('radio')
        .map((tab) => tab.textContent),
    ).toEqual(['Notation', 'Instruments', 'Layout'])
    expect(within(tabs).getByRole('radio', { name: 'Notation' })).toBeChecked()
    await user.click(within(tabs).getByRole('radio', { name: 'Instruments' }))
    await waitFor(() =>
      expect(router.state.location.search).toMatchObject({ panel: 'instruments' }),
    )
    expect(await screen.findByRole('status', { name: 'Piano: 1' })).toBeInTheDocument()
    await user.click(within(tabs).getByRole('radio', { name: 'Layout' }))
    await waitFor(() => expect(router.state.location.search).toMatchObject({ panel: 'layout' }))
    expect(screen.getByRole('radiogroup', { name: 'Staff size' })).toBeInTheDocument()
    // Notation, the first, is written as none.
    await user.click(within(tabs).getByRole('radio', { name: 'Notation' }))
    await waitFor(() => expect(router.state.location.search).not.toHaveProperty('panel'))
    expect(screen.getByRole('region', { name: 'Modes' })).toBeInTheDocument()
  })
})
