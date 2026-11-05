import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { LESSONS } from '@/entities/lesson'

/** Opens the Tools sheet from the screen's bar. */
async function openTools(user: ReturnType<typeof userEvent.setup>) {
  await user.click(await screen.findByRole('button', { name: 'Tools' }))
  return screen.findByRole('dialog', { name: 'Tools' })
}

describe('the Tools sheet over any screen (R29 B11)', () => {
  it('opens from a lesson and each explorer', async () => {
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
      const sheet = await openTools(user)
      const quick = within(sheet).getByRole('region', { name: 'Quick tools' })
      expect(within(quick).getByRole('group', { name: 'Metronome' }), path).toBeInTheDocument()
      // A take is the score editor's to record, never a quick tool.
      expect(within(quick).queryByRole('group', { name: 'Recorder' }), path).toBeNull()
      expect(within(quick).getByRole('button', { name: 'Tuner' }), path).toBeInTheDocument()
      // The quick tools and the way to them all.
      expect(within(sheet).getByRole('button', { name: 'All tools' })).toBeInTheDocument()
      unmount()
    }
  })

  it('its metronome shows the bar’s beats, the one sounding marked, as the Metronome’s', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/practice/chords')
    const sheet = await openTools(user)
    const beats = within(sheet).getByRole('list', { name: 'Beats' })
    expect(within(beats).getAllByRole('button')).toHaveLength(4)
    await user.click(within(sheet).getByRole('button', { name: 'Start metronome' }))
    act(() => audio.setNow(0.2))
    await waitFor(() =>
      expect(within(beats).getAllByRole('button')[0]).toHaveAttribute('aria-current', 'true'),
    )
  })

  it('the page under it does not change', async () => {
    const user = userEvent.setup()
    const { router, audio } = await renderApp('/practice/chords?root=D')
    await screen.findByRole('heading', { level: 1, name: 'Chords' })
    const before = router.state.location.href
    const sheet = await openTools(user)
    const metronome = within(sheet).getByRole('group', { name: 'Metronome' })
    expect(metronome).toHaveTextContent('120 BPM')
    await user.click(within(metronome).getByRole('button', { name: 'Start metronome' }))
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Tools' })).toBeNull())
    expect(router.state.location.href).toBe(before)
    expect(screen.getByRole('heading', { level: 1, name: 'Chords' })).toBeInTheDocument()
    // It keeps time with the sheet closed.
    const played = audio.played.length
    act(() => audio.setNow(2))
    await waitFor(() => expect(audio.played.length).toBeGreaterThan(played))
  })

  it('opens the Tuner and All tools from a lesson', async () => {
    const user = userEvent.setup()
    await renderApp(`/lessons/${LESSONS[0]!.id}`)
    await user.click(within(await openTools(user)).getByRole('button', { name: 'Tuner' }))
    expect(await screen.findByRole('dialog', { name: 'Tuner' })).toBeInTheDocument()
    await user.keyboard('{Escape}')
    await user.click(within(await openTools(user)).getByRole('button', { name: 'All tools' }))
    expect(await screen.findByRole('region', { name: 'Tools' })).toBeInTheDocument()
  })
})
