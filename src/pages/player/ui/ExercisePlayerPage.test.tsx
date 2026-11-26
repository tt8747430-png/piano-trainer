import { screen, waitFor, within } from '@testing-library/react'
import userEvent, { type UserEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { menuOptions, pickMenu, pickerValue } from '@/shared/test/pickers'

/** The run's Setup, open over it as it opens. */
const setupSheet = () => screen.findByRole('dialog', { name: 'Setup' })

/** Start in the Setup: the run plays, the Setup closed. */
async function start(user: UserEvent) {
  await user.click(within(await setupSheet()).getByRole('button', { name: 'Start' }))
}

/** The run's floating Setup · Play · Tempo. */
const transport = () => screen.getByRole('toolbar', { name: 'Setup, play and tempo' })

describe('An exercise, a run of its own (the run boards)', () => {
  it('plays its rule as sheet music, titled by the exercise and what it is played on', async () => {
    const user = userEvent.setup()
    await renderApp('/play/exercise/scale?root=D&kind=dorian')
    await start(user)
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Scale: D Dorian' }),
    ).toBeInTheDocument()
    const sheet = screen.getByRole('region', { name: 'Sheet music' })
    expect(within(sheet).getByRole('button', { name: 'Bar 1: Dm' })).toBeInTheDocument()
    // Its key's place in the round Next key walks from C, by fifths: C G D.
    expect(screen.getByRole('meter', { name: 'Key 3 of 12' })).toBeInTheDocument()
  })

  it('titles an arpeggio by its chord as the sheets print it', async () => {
    const user = userEvent.setup()
    await renderApp('/play/exercise/arpeggio?root=E&quality=m7')
    await start(user)
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Arpeggio: Em7' }),
    ).toBeInTheDocument()
  })

  it('titles a sharp’s arpeggio by its sign', async () => {
    const user = userEvent.setup()
    await renderApp('/play/exercise/arpeggio?root=C%23&quality=m7')
    await start(user)
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Arpeggio: C♯m7' }),
    ).toBeInTheDocument()
  })

  it('plays and stops', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/play/exercise/hanon')
    await start(user)
    expect(audio.played).toHaveLength(1)
    await user.click(within(transport()).getByRole('button', { name: 'Stop' }))
    expect(audio.stops).toBeGreaterThan(0)
  })

  it('offers Next key after a pass, a fifth up, leaving the tempo to that key’s own', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/play/exercise/five-finger?tempo=100')
    await start(user)
    expect(screen.queryByRole('button', { name: 'Next key' })).not.toBeInTheDocument()
    await user.click(within(transport()).getByRole('button', { name: 'Stop' }))
    await user.click(screen.getByRole('button', { name: 'Next key' }))
    await waitFor(() => expect(router.state.location.search).toMatchObject({ root: 'G' }))
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Five-finger position: G major' }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Next key' })).not.toBeInTheDocument()
    // No tempo carried over: the new key opens at the tempo it reached (its own in `tempos`).
    expect(router.state.location.search).not.toHaveProperty('tempo')
  })

  it('prints no chord symbol and no staff name on an exercise’s score', async () => {
    const user = userEvent.setup()
    await renderApp('/play/exercise/five-finger')
    await start(user)
    await screen.findByRole('heading', { level: 1, name: 'Five-finger position: C major' })
    expect(screen.getByRole('region', { name: 'Sheet music' })).not.toHaveTextContent(/\bPiano\b/)
  })

  it('offers only the choices its rule takes in its Setup, and writes them to the URL', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/play/exercise/sixth-diminished-chords')
    const setup = await setupSheet()
    expect(within(setup).queryByRole('radiogroup', { name: 'Octaves' })).not.toBeInTheDocument()
    await user.click(within(setup).getByRole('radio', { name: 'Drop 2' }))
    await waitFor(() => expect(router.state.location.search).toMatchObject({ voicing: 'drop2' }))
    await user.click(within(setup).getByRole('radio', { name: 'Minor' }))
    await waitFor(() => expect(router.state.location.search).toMatchObject({ tonality: 'minor' }))
    await user.click(within(setup).getByRole('radio', { name: 'Close' }))
    await waitFor(() => expect(router.state.location.search).not.toHaveProperty('voicing'))
  })

  it('names its mode in its Setup, and offers no scale, chord or start where it has none', async () => {
    await renderApp('/play/exercise/sixth-diminished')
    const setup = await setupSheet()
    expect(within(setup).getByRole('radiogroup', { name: 'Major or minor' })).toBeInTheDocument()
    expect(within(setup).getByText('Major or minor')).toBeVisible()
    expect(within(setup).queryByRole('combobox')).not.toBeInTheDocument()
  })

  it('starts a scale on another note, fingered from the thumb', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/play/exercise/scale')
    const setup = await setupSheet()
    await user.click(within(setup).getByRole('combobox', { name: /^Start on/ }))
    await user.click(await screen.findByRole('option', { name: /^E/ }))
    await waitFor(() => expect(router.state.location.search).toMatchObject({ start: 2 }))
    expect(within(setup).getByRole('radio', { name: 'From the thumb' })).toBeChecked()
  })

  it('sets up a scale’s practice: hands, each hand’s start octave, metronome and a rest between loops', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/play/exercise/scale')
    const setup = await setupSheet()
    expect(pickerValue('Right hand starts on')).toBe('C4')
    // Two octaves from C7 run past the top C: not offered.
    expect(await menuOptions(user, 'Right hand starts on')).not.toContain('C7')
    await pickMenu(user, 'Right hand starts on', 'C5')
    await waitFor(() => expect(router.state.location.search).toMatchObject({ rhOctave: 5 }))
    expect(pickerValue('Left hand starts on')).toBe('C2')
    await user.click(within(setup).getByRole('radio', { name: 'Right' }))
    await waitFor(() => expect(router.state.location.search).toMatchObject({ hands: 'rh' }))
    expect(
      within(setup).queryByRole('button', { name: /^Left hand starts on/ }),
    ).not.toBeInTheDocument()
    const rest = within(setup).getByRole('radiogroup', { name: 'Ticks between loops' })
    await user.click(within(rest).getByRole('radio', { name: '2' }))
    await waitFor(() => expect(router.state.location.search).toMatchObject({ rest: 2 }))
    await user.click(within(setup).getByRole('switch', { name: 'Metronome' }))
    expect(within(setup).getByRole('switch', { name: 'Metronome' })).toBeChecked()
  })

  it('swings an exercise that is its own swing, and leaves it out of the URL', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/play/exercise/two-five-one-scale')
    await user.click(within(await setupSheet()).getByRole('button', { name: 'Close' }))
    await user.click(screen.getByRole('button', { name: 'Player settings' }))
    const swing = await screen.findByRole('radiogroup', { name: 'Swing' })
    expect(within(swing).getByRole('radio', { name: 'Medium' })).toBeChecked()
    await user.click(within(swing).getByRole('radio', { name: 'Straight' }))
    await waitFor(() => expect(router.state.location.search).toMatchObject({ swing: 'straight' }))
    await user.click(within(swing).getByRole('radio', { name: 'Medium' }))
    await waitFor(() => expect(router.state.location.search).not.toHaveProperty('swing'))
  })

  it('comes back with its swing as it was left, started again from its page', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/exercises/from-third')
    await user.click(await screen.findByRole('link', { name: 'Start' }))
    await user.click(within(await setupSheet()).getByRole('button', { name: 'Close' }))
    await user.click(screen.getByRole('button', { name: 'Player settings' }))
    await user.click(await screen.findByRole('radio', { name: 'Light' }))
    await user.keyboard('{Escape}')
    await user.click(within(screen.getByRole('banner')).getByRole('button', { name: 'Close' }))
    await user.click(await screen.findByRole('link', { name: 'Start' }))
    await setupSheet()
    expect(router.state.location.pathname).toBe('/play/exercise/from-third')
    expect(router.state.location.search).toHaveProperty('swing')
  })

  it('is not found for an exercise there is not', async () => {
    await renderApp('/play/exercise/scales-in-tenths')
    expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
  })
})
