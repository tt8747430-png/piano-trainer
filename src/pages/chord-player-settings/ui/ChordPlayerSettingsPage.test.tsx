import { act, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { createMemoryStorage } from '@/shared/lib'

beforeEach(() => {
  vi.stubGlobal(
    'Worker',
    class {
      onmessage: (() => void) | null = null
      terminate() {}
    },
  )
  vi.stubGlobal('URL', Object.assign(URL, { createObjectURL: () => 'blob:', revokeObjectURL() {} }))
})

/** The sheet in hand saved as `text` in `style`, as a learner left it. */
function savedHand(text: string, style = 'pop-1') {
  const storage = createMemoryStorage()
  storage.setItem(
    'pt-chord-sheets',
    JSON.stringify({ version: 1, state: { scratch: { text, style, tempo: 100 } } }),
  )
  return storage
}

describe('the Chord player’s Settings', () => {
  it('draws Instruments, Playing and Music, one instrument always on', async () => {
    const user = userEvent.setup()
    const { chordSheetsStore } = await renderApp('/practice/chord-player/settings')
    await screen.findByRole('heading', { level: 1, name: 'Settings' })
    await user.click(screen.getByRole('switch', { name: 'Piano' }))
    await user.click(screen.getByRole('switch', { name: 'Bass' }))
    expect(screen.getByRole('switch', { name: 'Drums' })).toHaveAttribute('data-disabled')
    expect(chordSheetsStore.getState().scratch.settings).toMatchObject({
      piano: { on: false },
      bass: { on: false },
      drums: { on: true },
    })
  })
  it('turning Drums off silences the drums', async () => {
    const user = userEvent.setup()
    const { router, audio } = await renderApp('/practice/chord-player/settings', {
      storage: savedHand('C 4/4; verse: C G'),
    })
    await user.click(await screen.findByRole('switch', { name: 'Drums' }))
    await act(() => router.navigate({ to: '/practice/chord-player' }))
    await user.click(await screen.findByRole('button', { name: 'Play' }))
    const play = audio.played.find((each) => each.sounds.some((sound) => sound.kind === 'drum'))
    const drum = play?.sounds.find((sound) => sound.kind === 'drum')
    expect(drum && play?.gain?.(drum)).toBe(0)
  })
  it('Transpose +2 shows D major on the page, its chords moved', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/chord-player/settings', {
      storage: savedHand('C 4/4; verse: C G'),
    })
    await user.click(await screen.findByRole('button', { name: 'Up a semitone' }))
    await user.click(screen.getByRole('button', { name: 'Up a semitone' }))
    expect(screen.getByText('C major → D major')).toBeInTheDocument()
    await act(() => router.navigate({ to: '/practice/chord-player' }))
    expect(await screen.findByText('Key D major')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^D, 4 beats$/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^A, 4 beats$/ })).toBeInTheDocument()
  })
  it('Time signature 3/4 lays C(4) G(4) out as C(3) G(3), with Undo', async () => {
    const user = userEvent.setup()
    const { chordSheetsStore } = await renderApp('/practice/chord-player/settings', {
      storage: savedHand('C 4/4; verse: C G'),
    })
    await user.click(await screen.findByRole('button', { name: 'Time signature: 4/4' }))
    await user.click(await screen.findByRole('option', { name: '3/4' }))
    await waitFor(() => expect(chordSheetsStore.getState().scratch.text).toBe('C 3/4; verse: C G'))
    await user.click(await screen.findByRole('button', { name: 'Undo' }))
    await waitFor(() => expect(chordSheetsStore.getState().scratch.text).toBe('C 4/4; verse: C G'))
  })
  it('Hymn 1 draws no Bass or Drums row: it has none', async () => {
    await renderApp('/practice/chord-player/settings', {
      storage: savedHand('C 4/4; verse: C', 'hymn-1'),
    })
    expect(await screen.findByRole('switch', { name: 'Piano' })).toBeInTheDocument()
    expect(screen.queryByRole('switch', { name: 'Drums' })).toBeNull()
    expect(screen.queryByRole('switch', { name: 'Bass' })).toBeNull()
  })
})
