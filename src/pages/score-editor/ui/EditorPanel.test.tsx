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
            staves: [{ name: 'Voice', notes: 'G4/4' }],
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
    expect(await screen.findByRole('list', { name: 'Instruments' })).toHaveTextContent('Piano')
    await user.click(within(tabs).getByRole('radio', { name: 'Layout' }))
    await waitFor(() => expect(router.state.location.search).toMatchObject({ panel: 'layout' }))
    expect(screen.getByRole('radiogroup', { name: 'Orientation' })).toBeInTheDocument()
    // Notation, the first, is written as none.
    await user.click(within(tabs).getByRole('radio', { name: 'Notation' }))
    await waitFor(() => expect(router.state.location.search).not.toHaveProperty('panel'))
    expect(screen.getByRole('region', { name: 'Modes' })).toBeInTheDocument()
  })
})

describe('the editor’s Instruments (A40)', () => {
  it('solo, the eye, New instrument and Delete, the staves in the URL as the Player’s', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/edit/my-1', { storage: withSong() })
    const kinds = await screen.findByRole('toolbar', { name: 'Kinds of tools' })
    await user.click(within(kinds).getByRole('button', { name: 'Modes' }))
    const tabs = await screen.findByRole('radiogroup', { name: 'Editor panel' })
    await user.click(within(tabs).getByRole('radio', { name: 'Instruments' }))
    const list = await screen.findByRole('list', { name: 'Instruments' })
    expect(
      within(list)
        .getAllByRole('listitem')
        .map((item) => item.textContent),
    ).toEqual([expect.stringContaining('Voice'), expect.stringContaining('Piano')])
    await user.click(screen.getByRole('button', { name: 'Hide Voice' }))
    await waitFor(() => expect(router.state.location.search).toMatchObject({ staves: 't01s0' }))
    await user.click(screen.getByRole('button', { name: 'Solo Piano' }))
    await waitFor(() => expect(router.state.location.search).toMatchObject({ staves: 't00s0' }))
    expect(screen.getByRole('switch', { name: 'Play all' })).not.toBeChecked()
    await user.click(screen.getByRole('switch', { name: 'Play all' }))
    await waitFor(() => expect(router.state.location.search).toMatchObject({ staves: 't01s0' }))
    // New instrument: a tenor's staff under the voice.
    await user.click(screen.getByRole('button', { name: 'New instrument' }))
    await user.click(await screen.findByRole('menuitem', { name: 'Tenor' }))
    expect(await within(list).findByText('Tenor')).toBeInTheDocument()
    // Delete, asked first; the eye's choice goes with its staff.
    await user.click(screen.getByRole('button', { name: 'More for Voice' }))
    await user.click(await screen.findByRole('menuitem', { name: 'Delete…' }))
    const asked = await screen.findByRole('alertdialog', { name: 'Delete Voice?' })
    await user.click(within(asked).getByRole('button', { name: 'Delete' }))
    await waitFor(() => expect(within(list).queryByText('Voice')).toBeNull())
    expect(router.state.location.search).not.toHaveProperty('staves')
  })
})
