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

describe('Card style (R29 B9)', () => {
  it('the preview follows each change, and Apply keeps it for the folder', async () => {
    const user = userEvent.setup()
    const { libraryStore } = await renderApp('/songs/folders/folder-1/card-style', {
      storage: sunday(),
    })
    expect(await screen.findByRole('heading', { level: 1, name: 'Card style' })).toBeInTheDocument()
    const list = within(preview()).getByRole('list')
    expect(list).toHaveAttribute('data-density', 'comfortable')
    await user.click(screen.getByRole('radio', { name: /Large/ }))
    expect(list).toHaveAttribute('data-density', 'large')
    await user.click(screen.getByRole('button', { name: 'Soft' }))
    expect(list).toHaveAttribute('data-layout', BLOCK_PRESETS.soft.layout)
    expect(list.style.getPropertyValue('--block-radius')).toBe('var(--block-radius-4)')
    // Seen, never saved, until Apply.
    expect(libraryStore.getState().cardLooks).toEqual({})
    await user.click(screen.getByRole('button', { name: 'Apply' }))
    expect(libraryStore.getState().cardLooks['folder-1']?.density).toBe('large')
    expect(libraryStore.getState().cardLooks['folder-2']).toBeUndefined()
  })

  it('applies to the folder and its subfolder', async () => {
    const user = userEvent.setup()
    const { libraryStore } = await renderApp('/songs/folders/folder-1/card-style', {
      storage: sunday(),
    })
    await user.click(await screen.findByRole('radio', { name: 'This folder and its subfolder' }))
    await user.click(screen.getByRole('button', { name: 'Apply' }))
    expect(Object.keys(libraryStore.getState().cardLooks).sort()).toEqual(['folder-1', 'folder-2'])
  })

  it('Apply to every folder asks first', async () => {
    const user = userEvent.setup()
    const { libraryStore } = await renderApp('/songs/folders/folder-1/card-style', {
      storage: sunday(),
    })
    await user.click(await screen.findByRole('radio', { name: /^Every folder/ }))
    await user.click(screen.getByRole('button', { name: 'Apply' }))
    await confirmAsked(user, 'Apply', 'Apply to every folder?')
    const looks = Object.keys(libraryStore.getState().cardLooks)
    expect(looks).toEqual(expect.arrayContaining(['folder-1', 'folder-2', 'home']))
  })

  it('Reset restores the default', async () => {
    const user = userEvent.setup()
    const { libraryStore } = await renderApp('/songs/folders/folder-1/card-style', {
      storage: sunday(),
    })
    const density = await screen.findByRole('radiogroup', { name: 'Density' })
    await user.click(within(density).getByRole('radio', { name: /Compact/ }))
    await user.click(screen.getByRole('button', { name: 'Apply' }))
    await user.click(screen.getByRole('button', { name: 'Reset' }))
    expect(libraryStore.getState().cardLooks).toEqual({})
    expect(within(density).getByRole('radio', { name: /Comfortable/ })).toBeChecked()
    expect(DEFAULT_CARD_LOOK.density).toBe('comfortable')
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
