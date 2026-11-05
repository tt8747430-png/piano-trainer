import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'

const PARTS = [
  'Organise your library',
  'Play a song',
  'Learn a song',
  'Edit a score',
  'Play a MIDI keyboard',
  'Keep time',
]

describe('Settings › Support › User guide', () => {
  it('is reached from Settings’ Support, its parts in steps', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/settings')
    const help = await screen.findByRole('region', { name: 'Support' })
    await user.click(within(help).getByRole('link', { name: /User guide/ }))
    expect(await screen.findByRole('heading', { level: 1, name: 'User guide' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/settings/how-to-use')
    expect(
      screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent),
    ).toEqual(PARTS)
    const keepTime = screen.getByRole('region', { name: 'Keep time' })
    expect(within(keepTime).getAllByRole('listitem')).toHaveLength(3)
    expect(keepTime).toHaveTextContent('Space starts and stops it')
  })

  it('folds a part away, and keeps it folded', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/settings/how-to-use')
    const fold = await screen.findByRole('button', { name: 'Play a song' })
    expect(fold).toHaveAttribute('aria-expanded', 'true')
    await user.click(fold)
    expect(fold).toHaveAttribute('aria-expanded', 'false')
    expect(settingsStore.getState().foldedSections).toContain('howToUse.player')
  })

  it('reads in Russian', async () => {
    await renderApp('/settings/how-to-use', { locale: 'ru' })
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Руководство' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Метроном' })).toBeInTheDocument()
  })
})
