import { screen, waitFor, within } from '@testing-library/react'
import userEvent, { type UserEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { BUILT_IN_PATTERNS } from '@/entities/pattern'

/** The run's Setup, open over it as it opens. */
const setupSheet = () => screen.findByRole('dialog', { name: 'Setup' })

/** Start in the Setup: the run plays, the Setup closed. */
async function start(user: UserEvent) {
  await user.click(within(await setupSheet()).getByRole('button', { name: 'Start' }))
}

describe('The chromatic walk, a run of its own (the run boards)', () => {
  it('titles a walk by its chords as the sheets print them', async () => {
    const user = userEvent.setup()
    await renderApp('/play/chromatic?chords=min.m7&root=F%23')
    await start(user)
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Chromatically: F♯m · F♯m7' }),
    ).toBeInTheDocument()
  })

  it('walks the chosen chords root by root, saying where it stands', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/play/chromatic?chords=m9.maj9&root=G')
    await start(user)
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Chromatically: Gm9 · Gmaj9' }),
    ).toBeInTheDocument()
    expect(audio.played).toHaveLength(1)
    // From G up the twelve keys to G again, each root's two chords.
    expect(screen.getByRole('meter', { name: 'Key 1 of 13' })).toBeInTheDocument()
  })

  it('plays and stops from its floating Play', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/play/chromatic')
    await start(user)
    expect(audio.played).toHaveLength(1)
    const transport = screen.getByRole('toolbar', { name: 'Setup, play and tempo' })
    await user.click(within(transport).getByRole('button', { name: 'Stop' }))
    expect(audio.stops).toBeGreaterThan(0)
  })

  it('ignores a loop past the end of a shorter walk, and still plays', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/play/chromatic?loop=20-24')
    await start(user)
    expect(audio.played).toHaveLength(1)
  })

  it('checks chord types in its Setup, never unchecking the last', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/play/chromatic?chords=m9&root=G')
    const setup = await setupSheet()
    await user.click(within(setup).getByRole('combobox', { name: 'Chord types' }))
    await user.click(await screen.findByRole('option', { name: '9 · Dominant 9th' }))
    await waitFor(() => expect(router.state.location.search).toMatchObject({ chords: 'm9.n9' }))
    await user.click(screen.getByRole('option', { name: 'm9 · Minor 9th' }))
    await waitFor(() => expect(router.state.location.search).toMatchObject({ chords: 'n9' }))
    await user.click(screen.getByRole('option', { name: '9 · Dominant 9th' }))
    expect(router.state.location.search).toMatchObject({ chords: 'n9' })
    expect(screen.getByRole('option', { name: '9 · Dominant 9th' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
  })

  it('names each chord type in its Setup by its suffix as the sheets print it', async () => {
    const user = userEvent.setup()
    await renderApp('/play/chromatic?chords=m9&root=G')
    const setup = await setupSheet()
    await user.click(within(setup).getByRole('combobox', { name: 'Chord types' }))
    expect(await screen.findByRole('option', { name: '7♯9 · 7th sharp 9' })).toBeInTheDocument()
  })

  it('changes the direction and the root in its Setup', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/play/chromatic?chords=maj9&root=G')
    const setup = await setupSheet()
    await user.click(within(setup).getByRole('radio', { name: 'Up and down' }))
    await waitFor(() => expect(router.state.location.search).toMatchObject({ direction: 'both' }))
    const roots = within(setup).getByRole('radiogroup', { name: 'Root' })
    await user.click(within(roots).getByRole('radio', { name: 'A♭' }))
    await waitFor(() => expect(router.state.location.search).toMatchObject({ root: 'Ab' }))
  })

  it('closes the Chord flow in its gear: a chromatic walk has no key', async () => {
    const user = userEvent.setup()
    await renderApp('/play/chromatic')
    await start(user)
    await user.click(screen.getByRole('button', { name: 'Player settings' }))
    await user.click(await screen.findByRole('button', { name: /^Pattern/ }))
    const flow = screen.getByRole('button', {
      name: (name) => name.startsWith(BUILT_IN_PATTERNS.require('flow').name.en),
    })
    expect(flow).toBeDisabled()
    expect(flow).toHaveTextContent('Needs a key')
  })

  it('closes to Practice when opened directly', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/play/chromatic')
    await start(user)
    await user.click(within(screen.getByRole('banner')).getByRole('button', { name: 'Close' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/practice'))
  })
})
