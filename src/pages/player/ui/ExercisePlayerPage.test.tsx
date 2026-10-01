import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'

describe('An exercise in the Player', () => {
  it('plays its rule as sheet music, titled by the exercise and what it is played on', async () => {
    await renderApp('/play/exercise/scale?root=D&kind=dorian')
    expect(await screen.findByRole('heading', { name: 'Scale: D Dorian' })).toBeInTheDocument()
    expect(await screen.findByRole('button', { name: 'Bar 1: Dm' })).toBeInTheDocument()
  })

  it('titles an arpeggio by its chord and a key’s exercise by its key', async () => {
    await renderApp('/play/exercise/arpeggio?root=E&quality=m7')
    expect(await screen.findByRole('heading', { name: 'Arpeggio: Em7' })).toBeInTheDocument()
  })

  it('plays and stops', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/play/exercise/hanon')
    await user.click(await screen.findByRole('button', { name: 'Play' }))
    expect(audio.played).toHaveLength(1)
    await user.click(screen.getByRole('button', { name: 'Stop' }))
    expect(audio.stops).toBeGreaterThan(0)
  })

  it('offers only the choices its rule takes, and writes them to the URL', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/play/exercise/sixth-diminished-chords')
    await user.click(await screen.findByRole('button', { name: 'Setup' }))
    expect(screen.queryByRole('radiogroup', { name: 'Octaves' })).not.toBeInTheDocument()
    await user.click(await screen.findByRole('radio', { name: 'Drop 2' }))
    expect(router.state.location.search).toMatchObject({ voicing: 'drop2' })
    await user.click(screen.getByRole('radio', { name: 'Minor' }))
    expect(router.state.location.search).toMatchObject({ tonality: 'minor' })
    await user.click(screen.getByRole('radio', { name: 'Close' }))
    expect(router.state.location.search).not.toHaveProperty('voicing')
  })

  it('starts a scale on another note, fingered from the thumb', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/play/exercise/scale')
    await user.click(await screen.findByRole('button', { name: 'Setup' }))
    await user.click(screen.getByRole('combobox', { name: /^Start on/ }))
    await user.click(await screen.findByRole('option', { name: /^E/ }))
    expect(router.state.location.search).toMatchObject({ start: 2 })
    expect(screen.getByRole('radio', { name: 'From the thumb' })).toBeChecked()
  })

  it('swings an exercise that is its own swing, and leaves it out of the URL', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/play/exercise/two-five-one-scale')
    await user.click(await screen.findByRole('button', { name: 'Setup' }))
    const swing = screen.getByRole('switch', { name: 'Swing' })
    expect(swing).toBeChecked()
    await user.click(swing)
    expect(router.state.location.search).toMatchObject({ swing: false })
    await user.click(swing)
    expect(router.state.location.search).not.toHaveProperty('swing')
  })

  it('comes back as it was left when opened plainly', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice')
    await user.click(await screen.findByRole('link', { name: 'Arpeggio Elementary' }))
    await screen.findByRole('heading', { name: 'Arpeggio: C' })
    await user.click(screen.getByRole('button', { name: 'Setup' }))
    await user.click(screen.getByRole('combobox', { name: /^Chord/ }))
    await user.click(await screen.findByRole('option', { name: /Minor 7th/ }))
    await user.keyboard('{Escape}')
    await user.click(screen.getByRole('button', { name: 'Close' }))
    await user.click(await screen.findByRole('link', { name: 'Arpeggio Elementary' }))
    expect(await screen.findByRole('heading', { name: 'Arpeggio: Cm7' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/play/exercise/arpeggio')
  })

  it('is not found for an exercise there is not', async () => {
    await renderApp('/play/exercise/scales-in-tenths')
    expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
  })
})
