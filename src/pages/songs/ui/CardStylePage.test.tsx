import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { DEFAULT_CARD_LOOK, LIBRARY_STORAGE_KEY, LIBRARY_VERSION } from '@/entities/library'
import { createMemoryStorage } from '@/shared/lib'
import { BLOCK_PRESETS } from '@/shared/lib/style'
import { confirmAsked } from '@/shared/test/confirm'

/** The learner's folder Sunday, holding two hymns, with a folder Choir inside it. */
function sunday() {
  const storage = createMemoryStorage()
  storage.setItem(
    LIBRARY_STORAGE_KEY,
    JSON.stringify({
      state: {
        folders: [
          {
            id: 'folder-1',
            name: 'Sunday',
            picture: 'church',
            paint: 'sky',
            songs: ['silent', 'amazing'],
          },
          {
            id: 'folder-2',
            parent: 'folder-1',
            name: 'Choir',
            picture: 'mic',
            paint: 'sand',
            songs: [],
          },
        ],
        nextFolder: 3,
      },
      version: LIBRARY_VERSION,
    }),
  )
  return storage
}

const preview = () => screen.getByRole('region', { name: 'Preview' })

describe('Card style (R29 B9, R32-C)', () => {
  it('the pinned preview follows each change, and Apply keeps it for the folder', async () => {
    const user = userEvent.setup()
    const { libraryStore } = await renderApp('/songs/folders/folder-1/card-style', {
      storage: sunday(),
    })
    expect(await screen.findByRole('heading', { level: 1, name: 'Card style' })).toBeInTheDocument()
    const apply = screen.getByRole('button', { name: 'Apply' })
    // Nothing to keep until something changes.
    expect(apply).toBeDisabled()
    const list = within(preview()).getByRole('list')
    expect(list).toHaveAttribute('data-spacing', 'normal')
    await user.click(screen.getByRole('radio', { name: 'Spacious' }))
    expect(list).toHaveAttribute('data-spacing', 'roomy')
    // Presets first, each a radio; a change of one's own is Custom.
    const presets = screen.getByRole('radiogroup', { name: 'Presets' })
    await user.click(within(presets).getByRole('radio', { name: 'Soft' }))
    expect(list).toHaveAttribute('data-layout', BLOCK_PRESETS.soft.layout)
    expect(list.style.getPropertyValue('--block-radius')).toBe('var(--block-radius-4)')
    await user.click(screen.getByRole('radio', { name: 'Compact' }))
    expect(within(presets).getByRole('radio', { name: 'Custom' })).toBeChecked()
    // Seen, never saved, until Apply.
    expect(libraryStore.getState().cardLooks).toEqual({})
    await user.click(apply)
    expect(libraryStore.getState().cardLooks['folder-1']?.style.padding).toBe('compact')
    expect(libraryStore.getState().cardLooks['folder-2']).toBeUndefined()
    expect(screen.getByRole('status')).toHaveTextContent('Style applied to 1 place.')
  })

  it('shows the rows as a laptop draws them: List the table, in a card of the style', async () => {
    const user = userEvent.setup()
    await renderApp('/songs/folders/folder-1/card-style', { storage: sunday() })
    await user.click(await screen.findByRole('radio', { name: 'Laptop' }))
    // The app's own look is List: the table a laptop shows.
    expect(within(preview()).getByRole('table')).toBeInTheDocument()
    await user.click(screen.getByRole('radio', { name: 'Cards' }))
    expect(within(preview()).queryByRole('table')).toBeNull()
    expect(within(preview()).getByRole('list')).toHaveAttribute('data-layout', 'card')
  })

  it('applies to the folder and its subfolder from Apply to…', async () => {
    const user = userEvent.setup()
    const { libraryStore } = await renderApp('/songs/folders/folder-1/card-style', {
      storage: sunday(),
    })
    await user.click(await screen.findByRole('radio', { name: 'Spacious' }))
    await user.click(screen.getByRole('button', { name: 'Apply to…' }))
    await user.click(await screen.findByRole('menuitem', { name: 'This folder and its subfolder' }))
    expect(Object.keys(libraryStore.getState().cardLooks).sort()).toEqual(['folder-1', 'folder-2'])
  })

  it('Apply to all folders asks first', async () => {
    const user = userEvent.setup()
    const { libraryStore } = await renderApp('/songs/folders/folder-1/card-style', {
      storage: sunday(),
    })
    await user.click(await screen.findByRole('radio', { name: 'Spacious' }))
    await user.click(screen.getByRole('button', { name: 'Apply to…' }))
    await user.click(await screen.findByRole('menuitem', { name: /^All folders/ }))
    await confirmAsked(user, 'Apply', 'Apply to all folders?')
    const looks = Object.keys(libraryStore.getState().cardLooks)
    expect(looks).toEqual(expect.arrayContaining(['folder-1', 'folder-2', 'home']))
  })

  it('Reset to default, then Apply, gives the folder the app’s look again', async () => {
    const user = userEvent.setup()
    const { libraryStore } = await renderApp('/songs/folders/folder-1/card-style', {
      storage: sunday(),
    })
    await user.click(await screen.findByRole('radio', { name: 'Compact' }))
    await user.click(screen.getByRole('button', { name: 'Apply' }))
    const reset = screen.getByRole('button', { name: 'Reset to default' })
    await user.click(reset)
    expect(reset).toBeDisabled()
    expect(screen.getByRole('radio', { name: 'Standard' })).toBeChecked()
    await user.click(screen.getByRole('button', { name: 'Apply' }))
    expect(libraryStore.getState().cardLooks).toEqual({})
    expect(DEFAULT_CARD_LOOK.style.padding).toBe('normal')
  })

  it('a styled folder’s rows wear its look; what a card shows is the learner’s', async () => {
    const user = userEvent.setup()
    await renderApp('/songs/folders/folder-1/card-style', { storage: sunday() })
    await user.click(await screen.findByRole('switch', { name: 'Chords' }))
    await user.click(screen.getByRole('button', { name: 'Apply' }))
    await user.click(screen.getByRole('button', { name: /Back/ }))
    await user.click(await screen.findByRole('button', { name: /Back/ }))
    const rows = await screen.findAllByRole('list')
    expect(rows.some((list) => list.hasAttribute('data-card-look'))).toBe(true)
    expect(document.querySelector('[data-slot="row-chords"]')).toBeNull()
  })
})
