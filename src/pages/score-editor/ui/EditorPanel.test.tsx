import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { openGear } from '@/app/testing/editor-gear'
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

describe('the editor’s palette (R31-E)', () => {
  it('shows the category chosen in the strip, and opens on it the next time', async () => {
    const user = userEvent.setup()
    const storage = withSong()
    const first = await renderApp('/edit/my-1', { storage })
    // The Notes first: Notation's tools in the folded row.
    const kinds = await screen.findByRole('toolbar', { name: 'Palette categories' })
    expect(within(kinds).getByRole('button', { name: 'Note' })).toHaveAttribute(
      'aria-current',
      'true',
    )
    expect(
      within(screen.getByRole('region', { name: 'Note' })).getByRole('button', {
        name: 'Add note',
      }),
    ).toBeInTheDocument()
    await user.click(within(kinds).getByRole('button', { name: 'Dynamics' }))
    expect(await screen.findByRole('region', { name: 'Dynamics' })).toBeInTheDocument()
    expect(screen.queryByRole('region', { name: 'Note' })).not.toBeInTheDocument()
    // No tabs of Instruments or Layout: they are the gear's Settings.
    expect(screen.queryByRole('radiogroup', { name: 'Editor panel' })).not.toBeInTheDocument()
    expect(first.settingsStore.getState().paletteCategory).toBe('dynamics')
    first.unmount()
    await renderApp('/edit/my-1', { storage })
    expect(await screen.findByRole('region', { name: 'Dynamics' })).toBeInTheDocument()
  })

  it('unfolds to every tool of the category as titled grids, and folds again', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/edit/my-1', { storage: withSong() })
    await user.click(await screen.findByRole('button', { name: 'Expand palette' }))
    const notes = await screen.findByRole('region', { name: 'Note' })
    expect(within(notes).getByRole('group', { name: 'Input mode' })).toBeInTheDocument()
    expect(within(notes).getByRole('heading', { name: 'Notation' })).toBeInTheDocument()
    expect(settingsStore.getState().paletteFolded).toBe(false)
    await user.click(screen.getByRole('button', { name: 'Collapse palette' }))
    await waitFor(() =>
      expect(screen.queryByRole('group', { name: 'Input mode' })).not.toBeInTheDocument(),
    )
    expect(settingsStore.getState().paletteFolded).toBe(true)
  })
})

describe('the editor’s Instruments (A40)', () => {
  it('solo, the eye, New instrument and Delete, the staves in the URL as the Player’s', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/edit/my-1', { storage: withSong() })
    await openGear(user, /^Instruments/)
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
