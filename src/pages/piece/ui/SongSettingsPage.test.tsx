import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'

describe('a song’s Settings (R29 B9)', () => {
  it('has no Reset progress: a song’s progress is its Learned, in its page’s bar (R31-S)', async () => {
    await renderApp('/songs/bz5/settings')
    expect(await screen.findByRole('heading', { level: 1, name: 'Settings' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^Reset progress/ })).toBeNull()
  })
})

describe('Duplicate (R29 B9)', () => {
  it('makes, once asked, a copy of the song the learner’s own, and opens it', async () => {
    const user = userEvent.setup()
    const { piecesStore, router } = await renderApp('/songs/bz5/settings')
    const before = piecesStore.getState().songs.length
    await user.click(await screen.findByRole('button', { name: 'Duplicate' }))
    const asked = await screen.findByRole('alertdialog', { name: /Duplicate/ })
    await user.click(within(asked).getByRole('button', { name: 'Duplicate' }))
    await waitFor(() => expect(piecesStore.getState().songs).toHaveLength(before + 1))
    const copy = piecesStore.getState().songs.at(-1)
    expect(copy?.title).toMatch(/\(copy\)$/)
    await waitFor(() => expect(router.state.location.pathname).toBe(`/songs/${copy?.id}`))
  })
})
