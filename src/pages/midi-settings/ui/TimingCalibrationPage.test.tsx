import { act, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { PLAY_DELAY } from '@/shared/api/audio'
import { midi as key } from '@/shared/lib/music'

const BEAT = 60 / 80

describe('Settings › Connect a piano › Calibrate timing (R34)', () => {
  it('is greyed until a keyboard is connected, as its line says', async () => {
    await renderApp('/settings/connect-piano/timing')
    expect(await screen.findByRole('button', { name: 'Start' })).toBeDisabled()
    expect(screen.getByText('Connect a MIDI keyboard to measure its timing.')).toBeInTheDocument()
  })

  it('measures the piano’s lateness from taps with the clicks, keeps it, and shows it on Connect a piano', async () => {
    const user = userEvent.setup()
    const { audio, midi, settingsStore, router } = await renderApp('/settings/connect-piano/timing')
    await act(() => midi.connect())
    const start = await screen.findByRole('button', { name: 'Start' })
    await waitFor(() => expect(start).toBeEnabled())
    await user.click(start)
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Count in: 1'))
    // Each of the sixteen clicks after the count-in tapped 40 ms late.
    for (let click = 0; click < 16; click++) {
      act(() => {
        audio.setNow(PLAY_DELAY + (4 + click) * BEAT + 0.04)
        midi.press(key(60))
        midi.release(key(60))
      })
    }
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Click 16 of 16'))
    act(() => audio.setNow(PLAY_DELAY + 20.5 * BEAT))
    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent(
        'Your piano is heard 40 ms late. Your takes now allow for it.',
      ),
    )
    expect(settingsStore.getState().midi.latency).toBe(40)
    expect(screen.getByRole('button', { name: 'Measure again' })).toBeEnabled()
    await act(() => router.navigate({ to: '/settings/connect-piano' }))
    expect(await screen.findByRole('link', { name: /Calibrate timing\s*40 ms/ })).toHaveAttribute(
      'href',
      '/settings/connect-piano/timing',
    )
  })

  it('says so where too few taps came with a click, keeping what it had', async () => {
    const user = userEvent.setup()
    const { audio, midi, settingsStore } = await renderApp('/settings/connect-piano/timing')
    await act(() => midi.connect())
    await user.click(await screen.findByRole('button', { name: 'Start' }))
    act(() => audio.setNow(PLAY_DELAY + 20.5 * BEAT))
    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent('Too few taps came with a click.'),
    )
    expect(settingsStore.getState().midi.latency).toBe(0)
  })
})
