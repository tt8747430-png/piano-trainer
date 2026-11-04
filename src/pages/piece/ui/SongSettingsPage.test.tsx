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

describe('Appearance (R29 B9)', () => {
  it('gives the song a colour and picture its row wears, and Remove takes them off', async () => {
    const user = userEvent.setup()
    const { libraryStore } = await renderApp('/songs/bz5/settings')
    await user.click(await screen.findByRole('button', { name: 'Colour and picture' }))
    const sheet = await screen.findByRole('dialog', { name: 'Colour and picture' })
    await user.click(within(sheet).getByRole('radio', { name: 'Piano' }))
    await user.click(within(sheet).getByRole('radio', { name: 'Grass' }))
    await user.click(within(sheet).getByRole('button', { name: 'Save' }))
    expect(libraryStore.getState().songLooks['bz5']).toEqual({ picture: 'piano', paint: 'grass' })
    await user.click(screen.getByRole('button', { name: 'Colour and picture' }))
    const again = await screen.findByRole('dialog', { name: 'Colour and picture' })
    await user.click(within(again).getByRole('button', { name: 'Remove' }))
    expect(libraryStore.getState().songLooks['bz5']).toBeUndefined()
  })
})
