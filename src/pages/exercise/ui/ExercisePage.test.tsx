import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'

describe('An exercise’s page', () => {
  it('opens from Exercises, shows what it trains and Start opens the Player in G', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/exercises')
    const technique = await screen.findByRole('region', { name: 'Finger technique' })
    await user.click(within(technique).getByRole('link', { name: /^Five-finger position / }))
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Five-finger position' }),
    ).toBeInTheDocument()
    const trains = screen.getByRole('region', { name: 'What it trains' })
    expect(trains).toHaveTextContent('One finger on each of a key’s first five notes')
    const how = screen.getByRole('region', { name: 'How to play it' })
    // The fingering's picture: the right hand's first position, a finger on each key.
    expect(within(how).getByRole('img', { name: /^Right hand: C 1, D 2, E 3, F 4, G 5$/ }))
    await user.click(screen.getByRole('button', { name: 'Key: C major' }))
    const grid = await screen.findByRole('group', { name: 'Key' })
    await user.click(within(grid).getByRole('button', { name: 'G major / E minor' }))
    expect(router.state.location.search).toMatchObject({ root: 'G' })
    const start = screen.getByRole('link', { name: 'Start' })
    expect(start.getAttribute('href')).toMatch(/^\/play\/exercise\/five-finger\?/)
    expect(start.getAttribute('href')).toContain('root=G')
    await user.click(start)
    expect(router.state.location.pathname).toBe('/play/exercise/five-finger')
    expect(router.state.location.search).toMatchObject({ root: 'G' })
  })

  it('chooses Hanon’s number and Next key’s order, and Start carries both (A41)', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/exercises/hanon')
    await screen.findByRole('heading', { level: 1, name: 'Hanon No. 1' })
    await user.click(screen.getByRole('combobox', { name: 'Exercise' }))
    await user.click(await screen.findByRole('option', { name: /^No\. 3\b/ }))
    expect(router.state.location.search).toMatchObject({ hanon: 3 })
    await user.click(screen.getByRole('radio', { name: 'Chromatic' }))
    expect(router.state.location.search).toMatchObject({ order: 'chromatic' })
    const start = screen.getByRole('link', { name: 'Start' })
    expect(start.getAttribute('href')).toContain('hanon=3')
    expect(start.getAttribute('href')).toContain('order=chromatic')
  })

  it('a one-key exercise has no Key', async () => {
    await renderApp('/practice/exercises/rapid-switch')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Rapid switch' }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^Key:/ })).not.toBeInTheDocument()
    expect(screen.getByRole('radiogroup', { name: 'Hands' })).toBeInTheDocument()
  })

  it('an exercise for both hands has no Hands', async () => {
    await renderApp('/practice/exercises/drop-two')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Drop-2 7ths' }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('radiogroup', { name: 'Hands' })).not.toBeInTheDocument()
  })

  it('reads in Russian, with nothing left in English', async () => {
    await renderApp('/practice/exercises/hanon', { locale: 'ru' })
    expect(await screen.findByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(untranslated(document.body)).toEqual([])
  })
})
