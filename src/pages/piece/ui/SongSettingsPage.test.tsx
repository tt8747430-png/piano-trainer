import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'

describe('a song’s Settings (R29 B9)', () => {
  it('resets the song’s progress after asking, its music left alone', async () => {
    const user = userEvent.setup()
    const { progressStore } = await renderApp('/songs/bz5/settings')
    act(() =>
      progressStore.setState({
        learned: { ...progressStore.getState().learned, 'piece:bz5': '2026-11-01T00:00:00.000Z' },
      }),
    )
    await user.click(await screen.findByRole('button', { name: 'Reset progress' }))
    const asked = await screen.findByRole('alertdialog', { name: 'Reset this song’s progress?' })
    await user.click(await within(asked).findByRole('button', { name: 'Reset' }))
    await waitFor(() => expect(progressStore.getState().learned['piece:bz5']).toBeUndefined())
  })
})
