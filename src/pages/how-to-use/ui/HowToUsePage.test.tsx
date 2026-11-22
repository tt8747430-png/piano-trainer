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
    // One part open at a time, the first to begin with; another opened closes it.
    const first = screen.getByRole('button', { name: 'Organise your library' })
    expect(first).toHaveAttribute('aria-expanded', 'true')
    const keepTime = screen.getByRole('button', { name: 'Keep time' })
    await user.click(keepTime)
    expect(keepTime).toHaveAttribute('aria-expanded', 'true')
    expect(first).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByText('Space starts and stops it; ↑ and ↓ change the tempo.')).toBeVisible()
  })

  it('folds the part open away', async () => {
    const user = userEvent.setup()
    await renderApp('/settings/how-to-use')
    const fold = await screen.findByRole('button', { name: 'Organise your library' })
    await user.click(fold)
    expect(fold).toHaveAttribute('aria-expanded', 'false')
    for (const part of PARTS)
      expect(screen.getByRole('button', { name: part })).toHaveAttribute('aria-expanded', 'false')
  })

  it('reads in Russian', async () => {
    await renderApp('/settings/how-to-use', { locale: 'ru' })
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Руководство' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Метроном' })).toBeInTheDocument()
  })
})
