import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { PATTERNS_STORAGE_KEY } from '@/entities/pattern'
import { createMemoryStorage } from '@/shared/lib'

const saved = (state: object) => {
  const storage = createMemoryStorage()
  storage.setItem(
    PATTERNS_STORAGE_KEY,
    JSON.stringify({
      state: { favourites: [], hidden: [], own: [], nextOwn: 1, ...state },
      version: 1,
    }),
  )
  return storage
}
const shelf = (name: string) => screen.getByRole('region', { name })

describe('Learn → Patterns', () => {
  it('is a reference in Learn, listing the groups, each pattern with its idea', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/learn')
    await user.click(await screen.findByRole('link', { name: /^Patterns/ }))
    expect(await screen.findByRole('heading', { level: 1, name: 'Patterns' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/learn/patterns')
    expect(
      within(shelf('Rhythm styles')).getByRole('link', {
        name: /^Ballad arpeggio A gentle arpeggio over the root and 5th\.$/,
      }),
    ).toHaveAttribute('href', '/learn/patterns/ballad')
    expect(screen.queryByRole('region', { name: 'Favourites' })).not.toBeInTheDocument()
  })

  it('lists the learner’s favourites and own first, and the hidden at the end', async () => {
    await renderApp('/learn/patterns', {
      storage: saved({
        favourites: ['ballad'],
        hidden: ['funk'],
        own: [{ id: 'my-1', name: 'Sunday', rh: 'jaz', lh: 'walk' }],
        nextOwn: 2,
      }),
    })
    await screen.findByRole('heading', { level: 1, name: 'Patterns' })
    const names = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)
    expect(names[0]).toBe('Favourites')
    expect(names[1]).toBe('Your patterns')
    expect(names.at(-1)).toBe('Hidden')
    expect(within(shelf('Your patterns')).getByRole('link', { name: /^Sunday/ })).toHaveAttribute(
      'href',
      '/learn/patterns/my-1',
    )
    expect(within(shelf('Hidden')).getByRole('link', { name: /^Funk/ })).toBeInTheDocument()
    expect(within(shelf('Rhythm styles')).queryByRole('link', { name: /^Funk/ })).toBeNull()
  })

  it('makes a new pattern from its bar', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/learn/patterns')
    await user.click(await screen.findByRole('link', { name: 'New pattern' }))
    expect(
      await screen.findByRole('heading', { level: 1, name: 'New pattern' }),
    ).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/learn/patterns/new')
  })
})
