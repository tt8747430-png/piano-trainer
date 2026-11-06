import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { LESSONS } from '@/entities/lesson'

/** Opens the Tools from the screen's bar. */
async function openTools(user: ReturnType<typeof userEvent.setup>) {
  await user.click(await screen.findByRole('button', { name: 'Tools' }))
  return screen.findByRole('dialog', { name: 'Tools' })
}

describe('the Tools over any screen (R29 B11, R32)', () => {
  it('opens from a lesson and each explorer, every tool in it, none a way out to Practice', async () => {
    const user = userEvent.setup()
    const screens = [
      `/lessons/${LESSONS[0]!.id}`,
      '/practice/chords',
      '/practice/scales',
      '/practice/intervals',
      '/practice/chord-player',
    ]
    for (const path of screens) {
      const { unmount } = await renderApp(path)
      const tools = await openTools(user)
      expect(within(tools).getByRole('group', { name: 'Metronome' }), path).toBeInTheDocument()
      expect(within(tools).getByRole('group', { name: 'Tuner' }), path).toBeInTheDocument()
      expect(within(tools).getByRole('link', { name: /^Chord finder/ })).toHaveAttribute(
        'href',
        '/practice/chord-finder',
      )
      expect(within(tools).getByRole('link', { name: /^Circle of fifths/ })).toHaveAttribute(
        'href',
        '/practice/circle-of-fifths',
      )
      expect(within(tools).queryByRole('button', { name: 'All tools' })).toBeNull()
      unmount()
    }
  })

  it('its metronome shows the bar’s beats, the one sounding marked, as the Metronome’s', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/practice/chords')
    const tools = await openTools(user)
    const beats = within(tools).getByRole('list', { name: 'Beats' })
    expect(within(beats).getAllByRole('button')).toHaveLength(4)
    await user.click(within(tools).getByRole('button', { name: 'Start metronome' }))
    act(() => audio.setNow(0.2))
    await waitFor(() =>
      expect(within(beats).getAllByRole('button')[0]).toHaveAttribute('aria-current', 'true'),
    )
  })

  it('the page under it does not change, and the metronome keeps time with it closed', async () => {
    const user = userEvent.setup()
    const { router, audio } = await renderApp('/practice/chords?root=D')
    await screen.findByRole('heading', { level: 1, name: 'Chords' })
    const before = router.state.location.href
    const tools = await openTools(user)
    const metronome = within(tools).getByRole('group', { name: 'Metronome' })
    expect(metronome).toHaveTextContent('120 BPM')
    await user.click(within(metronome).getByRole('button', { name: 'Start metronome' }))
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Tools' })).toBeNull())
    expect(router.state.location.href).toBe(before)
    expect(screen.getByRole('heading', { level: 1, name: 'Chords' })).toBeInTheDocument()
    const played = audio.played.length
    act(() => audio.setNow(2))
    await waitFor(() => expect(audio.played.length).toBeGreaterThan(played))
  })

  it('turns the Tuner on in place, its readout under its switch (R32)', async () => {
    const user = userEvent.setup()
    await renderApp(`/lessons/${LESSONS[0]!.id}`)
    const tools = await openTools(user)
    const tuner = within(tools).getByRole('group', { name: 'Tuner' })
    expect(tuner).toHaveTextContent('Off')
    await user.click(within(tuner).getByRole('switch', { name: 'Tuner' }))
    expect(tuner).toHaveTextContent('Listening · A4 = 440 Hz')
    expect(await within(tuner).findByRole('alert')).toHaveTextContent(
      'The microphone is not available',
    )
  })

  it('opens the Metronome’s own page from it', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/scales')
    await user.click(within(await openTools(user)).getByRole('link', { name: /Open Metronome/ }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/practice/metronome'))
  })
})
