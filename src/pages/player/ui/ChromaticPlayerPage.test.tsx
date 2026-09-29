import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { PATTERNS } from '@/entities/pattern'

describe('The chromatic walk in the Player', () => {
  it('walks the chosen chords root by root as sheet music, titled by them', async () => {
    await renderApp('/play/chromatic?chords=m9.maj9&root=G')
    expect(
      await screen.findByRole('heading', { name: 'Chromatic walk: Gm9 · GMaj9' }),
    ).toBeInTheDocument()
    expect(await screen.findByRole('button', { name: 'Bar 1: Gm9' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Bar 3: G#m9' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Bar 4: A♭Maj9' })).toBeInTheDocument()
  })

  it('plays and stops', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/play/chromatic')
    await user.click(await screen.findByRole('button', { name: 'Play' }))
    expect(audio.played).toHaveLength(1)
    await user.click(screen.getByRole('button', { name: 'Stop' }))
    expect(audio.stops).toBeGreaterThan(0)
  })

  it('ignores a loop past the end of a shorter walk, and still plays', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/play/chromatic?loop=20-24')
    expect(await screen.findByRole('button', { name: 'Bar 13: C' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Play' }))
    expect(audio.played).toHaveLength(1)
  })

  it('checks chord types in the Setup sheet, never unchecking the last', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/play/chromatic?chords=m9&root=G')
    await user.click(await screen.findByRole('button', { name: 'Setup' }))
    await user.click(await screen.findByRole('combobox', { name: 'Chord types' }))
    await user.click(await screen.findByRole('option', { name: 'Dominant 9th' }))
    expect(router.state.location.search).toMatchObject({ chords: 'm9.n9' })
    await user.click(screen.getByRole('option', { name: 'Minor 9th' }))
    expect(router.state.location.search).toMatchObject({ chords: 'n9' })
    await user.click(screen.getByRole('option', { name: 'Dominant 9th' }))
    expect(router.state.location.search).toMatchObject({ chords: 'n9' })
    expect(screen.getByRole('option', { name: 'Dominant 9th' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
  })

  it('changes the direction and the root in the Setup sheet', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/play/chromatic?chords=maj9&root=G')
    await user.click(await screen.findByRole('button', { name: 'Setup' }))
    await user.click(await screen.findByRole('button', { name: 'Up and down' }))
    expect(router.state.location.search).toMatchObject({ direction: 'both' })
    await user.click(screen.getByRole('combobox', { name: 'Root' }))
    await user.click(await screen.findByRole('option', { name: 'A♭' }))
    expect(router.state.location.search).toMatchObject({ root: 'Ab' })
  })

  it('closes the Chord flow: a chromatic walk has no key', async () => {
    const user = userEvent.setup()
    await renderApp('/play/chromatic')
    await user.click(await screen.findByRole('button', { name: 'Setup' }))
    await user.click(await screen.findByRole('button', { name: /^Pattern/ }))
    expect(
      screen.getByRole('button', { name: (name) => name.includes(PATTERNS.flow.name.en) }),
    ).toBeDisabled()
  })

  it('closes to Practice when opened directly', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/play/chromatic')
    await user.click(await screen.findByRole('button', { name: 'Close' }))
    expect(router.state.location.pathname).toBe('/practice')
  })
})
