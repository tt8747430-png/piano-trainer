import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'

describe('Walk the chords in the Player', () => {
  it('walks a scale’s chords as sheet music, titled by its scale', async () => {
    await renderApp('/play/walk?root=D&kind=dorian')
    expect(
      await screen.findByRole('heading', { name: 'Walk the chords in D Dorian' }),
    ).toBeInTheDocument()
    expect(await screen.findByRole('button', { name: 'Bar 1: Dm' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Bar 8: Dm' })).toBeInTheDocument()
  })

  it('plays and stops', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/play/walk')
    await user.click(await screen.findByRole('button', { name: 'Play' }))
    expect(audio.played).toHaveLength(1)
    await user.click(screen.getByRole('button', { name: 'Stop' }))
    expect(audio.stops).toBeGreaterThan(0)
  })

  it('changes the root, the chord size and the pattern in the Setup sheet', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/play/walk?root=D&kind=dorian')
    await user.click(await screen.findByRole('button', { name: 'Setup' }))
    await user.click(await screen.findByRole('radio', { name: '7ths' }))
    expect(router.state.location.search).toMatchObject({ chordSize: 'sevenths' })
    // The sheet is modal: the sheet music behind it is hidden from the accessibility tree.
    expect(
      await screen.findByRole('button', { name: 'Bar 1: Dm7', hidden: true }),
    ).toBeInTheDocument()
    await user.click(screen.getByRole('combobox', { name: 'Root' }))
    await user.click(await screen.findByRole('option', { name: 'E' }))
    expect(router.state.location.search).toMatchObject({ root: 'E', kind: 'dorian' })
  })

  it('closes to the scale’s Chords view when opened directly', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/play/walk?root=D&kind=dorian')
    await user.click(await screen.findByRole('button', { name: 'Close' }))
    expect(router.state.location.pathname).toBe('/practice/scales')
    expect(router.state.location.search).toMatchObject({
      root: 'D',
      kind: 'dorian',
      show: 'chords',
    })
  })
})
