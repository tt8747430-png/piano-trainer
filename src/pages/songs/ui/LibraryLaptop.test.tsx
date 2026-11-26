import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { stubMatchMedia } from '@/shared/test/match-media'

const songsIn = (table: HTMLElement) =>
  within(table)
    .getAllByRole('row')
    .slice(1)
    .map((row) => within(row).getAllByRole('cell')[0]?.textContent ?? '')

describe('Songs on a laptop: the table (R72, the AllSongsLaptop and FolderLaptop boards)', () => {
  // Every media query matches: the laptop's width among them.
  beforeEach(() => void stubMatchMedia({ dark: true }))

  it('lists every song in one table, the folders’ too', async () => {
    await renderApp('/songs/all')
    const table = await screen.findByRole('table', { name: 'Songs' })
    // Amazing Grace is a hymn.
    expect(within(table).getByRole('link', { name: 'Amazing Grace' })).toBeInTheDocument()
    expect(
      within(table)
        .getAllByRole('columnheader')
        .map((head) => head.textContent),
    ).toEqual(['Title', 'Composer and key', 'Progress', 'Last played'])
  })

  it('lists a folder’s songs under its name', async () => {
    await renderApp('/songs/folders/hymns')
    expect(await screen.findByRole('heading', { level: 1, name: 'Hymns' })).toBeInTheDocument()
    const table = screen.getByRole('table', { name: 'Songs' })
    expect(songsIn(table)).toContain('Amazing Grace')
    expect(songsIn(table)).toHaveLength(5)
  })

  it('sorts from its fourth column’s heading, and the sort is kept', async () => {
    const user = userEvent.setup()
    const { libraryStore } = await renderApp('/songs/folders/hymns')
    const table = await screen.findByRole('table', { name: 'Songs' })
    await user.click(within(table).getByRole('button', { name: 'Sort by: Last played' }))
    await user.click(await screen.findByRole('menuitemradio', { name: 'Title' }))
    await waitFor(() => expect(libraryStore.getState().sort).toBe('title'))
    const names = songsIn(screen.getByRole('table', { name: 'Songs' }))
    expect(names).toEqual(names.toSorted((a, b) => a.localeCompare(b, 'en')))
  })

  it('keeps the phone’s list, with no table, below the laptop’s width', async () => {
    stubMatchMedia({ dark: false })
    await renderApp('/songs/folders/hymns')
    await screen.findByRole('heading', { level: 1, name: 'Hymns' })
    expect(screen.queryByRole('table')).toBeNull()
  })
})
