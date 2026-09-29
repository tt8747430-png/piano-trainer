import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'

describe('A progression in the Player', () => {
  it('plays numerals in a key as sheet music, titled by them', async () => {
    await renderApp('/play/progression?p=ii-V-I&key=Bb')
    expect(await screen.findByRole('heading', { name: 'ii–V–I in B♭ major' })).toBeInTheDocument()
    expect(await screen.findByRole('button', { name: 'Bar 1: Cm' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Bar 3: B♭' })).toBeInTheDocument()
  })

  it('changes the chord size and the key in the Setup sheet', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/play/progression?p=ii-V-I&key=Bb')
    await user.click(await screen.findByRole('button', { name: 'Setup' }))
    await user.click(await screen.findByRole('button', { name: '7ths' }))
    expect(router.state.location.search).toMatchObject({ chordSize: 'sevenths' })
    expect(
      await screen.findByRole('button', { name: 'Bar 1: Cm7', hidden: true }),
    ).toBeInTheDocument()
    await user.click(screen.getByRole('combobox', { name: 'Key' }))
    await user.click(await screen.findByRole('option', { name: 'G major' }))
    expect(router.state.location.search).toMatchObject({ key: 'G', p: 'ii-V-I' })
  })

  it('opens the default progression for a line it cannot read', async () => {
    await renderApp('/play/progression?p=Q')
    expect(await screen.findByRole('heading', { name: 'I–V–vi–IV in C major' })).toBeInTheDocument()
  })

  it('closes to the Progressions tool on the same numerals and key when opened directly', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/play/progression?p=ii-V-I&key=Bb')
    await user.click(await screen.findByRole('button', { name: 'Close' }))
    expect(router.state.location.pathname).toBe('/learn/progressions')
    expect(router.state.location.search).toMatchObject({ p: 'ii-V-I', key: 'Bb' })
  })
})
