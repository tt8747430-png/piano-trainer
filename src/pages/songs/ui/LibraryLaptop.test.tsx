import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { stubMatchMedia } from '@/shared/test/match-media'

describe('Songs on a laptop: the tree and the table (R30 S2)', () => {
  // Every media query matches: the laptop's width among them.
  beforeEach(() => void stubMatchMedia({ dark: false }))

  it('shows the library’s tree beside every song, All songs current', async () => {
    stubMatchMedia({ dark: true })
    await renderApp('/songs')
    const tree = await screen.findByRole('navigation', { name: 'Library' })
    expect(within(tree).getByRole('link', { name: /^All songs/ })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(within(tree).getByRole('link', { name: /^Hymns/ })).not.toHaveAttribute('aria-current')
    const table = screen.getByRole('table', { name: 'Songs' })
    // Every song, the folders' too, in one list: Amazing Grace is a hymn.
    expect(within(table).getByRole('rowheader', { name: /Amazing Grace/ })).toBeInTheDocument()
  })

  it('marks the folder open in the tree, not All songs, and lists its songs', async () => {
    stubMatchMedia({ dark: true })
    await renderApp('/songs/folders/hymns')
    const tree = await screen.findByRole('navigation', { name: 'Library' })
    expect(within(tree).getByRole('link', { name: /^Hymns/ })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(within(tree).getByRole('link', { name: /^All songs/ })).not.toHaveAttribute(
      'aria-current',
    )
    const rows = within(screen.getByRole('table', { name: 'Songs' })).getAllByRole('rowheader')
    expect(rows.map((row) => row.textContent)).toContain('Amazing Grace')
  })

  it('sorts by a column’s heading, and back to the learner’s order', async () => {
    stubMatchMedia({ dark: true })
    const user = userEvent.setup()
    const { libraryStore } = await renderApp('/songs/folders/hymns')
    const table = await screen.findByRole('table', { name: 'Songs' })
    const title = within(table).getByRole('columnheader', { name: 'Title' })
    await user.click(within(title).getByRole('button', { name: 'Title' }))
    expect(libraryStore.getState().sort).toBe('name')
    expect(title).toHaveAttribute('aria-sort', 'ascending')
    const names = within(table)
      .getAllByRole('rowheader')
      .map((row) => row.querySelector('span')?.textContent ?? '')
    expect(names).toEqual(names.toSorted((a, b) => a.localeCompare(b, 'en')))
    await user.click(within(title).getByRole('button', { name: 'Title' }))
    await waitFor(() => expect(libraryStore.getState().sort).toBe('manual'))
  })

  it('keeps the phone’s list, with no tree, below the laptop’s width', async () => {
    await renderApp('/songs')
    await screen.findByRole('heading', { level: 1, name: 'Songs' })
    expect(screen.queryByRole('navigation', { name: 'Library' })).toBeNull()
    expect(screen.queryByRole('table')).toBeNull()
  })
})
