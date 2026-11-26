import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'
import { pickKey } from '@/shared/test/pickers'

describe('An exercise’s page', () => {
  it('opens from its shelf, says how to play it and Start opens the Player in G', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/exercises')
    const fiveFinger = await screen.findByRole('region', { name: /^Five-finger position/ })
    await user.click(within(fiveFinger).getByRole('link', { name: /Five-finger position/ }))
    expect(
      await screen.findByRole('heading', { level: 2, name: 'Five-finger position' }),
    ).toBeInTheDocument()
    // Its source and its shelf under its name.
    expect(screen.getByText('Five-finger position · Finger technique')).toBeInTheDocument()
    const how = screen.getByRole('heading', { level: 3, name: 'How to play' }).closest('section')
    expect(how).toHaveTextContent('One finger on each of the key’s first five notes')
    await pickKey(user, 'G major')
    expect(router.state.location.search).toMatchObject({ root: 'G' })
    const start = screen.getByRole('link', { name: 'Start' })
    expect(start.getAttribute('href')).toMatch(/^\/play\/exercise\/five-finger\?/)
    expect(start.getAttribute('href')).toContain('root=G')
    expect(start.getAttribute('href')).toContain('mode=wait')
    await user.click(start)
    expect(router.state.location.pathname).toBe('/play/exercise/five-finger')
    expect(router.state.location.search).toMatchObject({ root: 'G' })
  })

  it('chooses Hanon’s number, Next key’s order and a target tempo, and Start carries them (A41)', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/exercises/hanon')
    await screen.findByRole('heading', { level: 2, name: 'Hanon No. 1' })
    const number = screen.getByRole('group', { name: 'Number' })
    await user.click(within(number).getByRole('button', { name: 'Next' }))
    await user.click(within(number).getByRole('button', { name: 'Next' }))
    expect(router.state.location.search).toMatchObject({ hanon: 3 })
    expect(number).toHaveTextContent('No. 3')
    await user.click(screen.getByRole('radio', { name: 'Dotted' }))
    expect(router.state.location.search).toMatchObject({ rhythm: 'dotted' })
    await user.click(screen.getByRole('radio', { name: 'Chromatic' }))
    expect(router.state.location.search).toMatchObject({ order: 'chromatic' })
    await user.click(screen.getByRole('button', { name: 'Raise the target' }))
    const start = screen.getByRole('link', { name: 'Start' })
    expect(start.getAttribute('href')).toMatch(/target=\d+/)
    expect(start.getAttribute('href')).toContain('speedTraining=true')
    expect(start.getAttribute('href')).toContain('hanon=3')
    expect(start.getAttribute('href')).toContain('rhythm=dotted')
    expect(start.getAttribute('href')).toContain('order=chromatic')
  })

  it('is made a favourite from the ♡ in its bar, as its row’s More does (R30-4)', async () => {
    const user = userEvent.setup()
    const { practiceLibraryStore } = await renderApp('/practice/exercises/hanon')
    await user.click(await screen.findByRole('button', { name: 'Add to Favourites' }))
    expect(practiceLibraryStore.getState().favourites.exercises).toEqual(['hanon'])
    expect(screen.getByRole('button', { name: 'Remove from Favourites' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('a one-key exercise has no Key', async () => {
    await renderApp('/practice/exercises/rapid-switch')
    expect(
      await screen.findByRole('heading', { level: 2, name: 'Rapid switch' }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^Key:/ })).not.toBeInTheDocument()
    expect(screen.getByRole('radiogroup', { name: 'Hands' })).toBeInTheDocument()
  })

  it('an exercise for both hands has no Hands', async () => {
    await renderApp('/practice/exercises/drop-two')
    expect(
      await screen.findByRole('heading', { level: 2, name: 'Drop-2 7ths' }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('radiogroup', { name: 'Hands' })).not.toBeInTheDocument()
  })

  it('reads in Russian, with nothing left in English', async () => {
    await renderApp('/practice/exercises/hanon', { locale: 'ru' })
    expect(await screen.findByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(untranslated(document.body)).toEqual([])
  })
})
