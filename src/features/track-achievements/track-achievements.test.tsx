import { act, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { localDay } from '@/entities/progress'

describe('keeping achievements', () => {
  it('writes the day a milestone is reached, and tells of it once', async () => {
    const { progressStore, notificationsStore } = await renderApp('/profile')
    await screen.findByRole('heading', { level: 1, name: 'Profile' })
    act(() => progressStore.setState({ learned: { 'piece:bz5': '2026-11-04' } }))
    await waitFor(() =>
      expect(progressStore.getState().earned).toEqual({
        'repertoire:1': localDay(new Date()),
        'first-song': localDay(new Date()),
      }),
    )
    expect(notificationsStore.getState().notices.map((notice) => notice.id)).toEqual([
      'milestone:first-song',
      'tier:repertoire:1',
    ])
    // The same figures again: nothing new.
    act(() => progressStore.setState({ tempos: { scale: 90 } }))
    expect(notificationsStore.getState().notices).toHaveLength(2)
  })
})
