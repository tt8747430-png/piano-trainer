import { act, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { midi, parseNoteName, pitchClassOf } from '@/shared/lib/music'

describe('Player', () => {
  it('opens a song with its setup summary and records it as practised', async () => {
    const { progressStore } = await renderApp('/play/bz5')
    expect(
      await screen.findByRole('button', { name: /G · 72 BPM · Both hands/ }),
    ).toBeInTheDocument()
    expect(progressStore.getState().practised.bz5).toBeDefined()
    expect(screen.getByRole('button', { name: 'Listen' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('reads a stale URL as the piece’s own setup', async () => {
    await renderApp('/play/bz5?key=H&tempo=999&mode=dance')
    expect(
      await screen.findByRole('button', { name: /G · 72 BPM · Both hands/ }),
    ).toBeInTheDocument()
  })

  it('steps through beat by beat, sounding each', async () => {
    const user = userEvent.setup()
    const { router, audio } = await renderApp('/play/bz5')
    await user.click(await screen.findByRole('button', { name: 'Step' }))
    expect(router.state.location.search).toMatchObject({ mode: 'step' })
    await user.click(screen.getByRole('button', { name: 'Next' }))
    expect(audio.played.length).toBeGreaterThan(0)
  })

  it('plays a pass in Listen and stops it', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/play/bz5')
    await user.click(await screen.findByRole('button', { name: 'Play' }))
    expect(audio.played).toHaveLength(1)
    await user.click(screen.getByRole('button', { name: 'Stop' }))
    expect(audio.stops).toBeGreaterThan(0)
  })

  it('waits for the notes in Wait mode, says a wrong key and takes the right ones from MIDI', async () => {
    const user = userEvent.setup()
    // The song's pattern opens with the left hand alone, so the left hand has notes to play at once.
    const { midi: midiKeyboard } = await renderApp('/play/bz5?mode=wait&hands=lh')
    const prompt = await screen.findByText(/^Play /)
    const notes = prompt.textContent?.replace(/^Play /, '').split(' ') ?? []
    const keyboard = screen.getByRole('group', { name: 'Keyboard' })
    // C sharp is outside G major's first chord (G B D).
    await user.click(within(keyboard).getByRole('button', { name: 'C sharp 4' }))
    expect(await screen.findByText(/^Not C#/)).toBeInTheDocument()
    act(() => {
      for (const name of notes) {
        const spelled = parseNoteName(name)
        if (!spelled) throw new Error(name)
        midiKeyboard.press(midi(60 + pitchClassOf(spelled)))
      }
    })
    expect(await screen.findByText('Right')).toBeInTheDocument()
  })

  it('changes the key through the Setup sheet, and back to the piece’s own', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/play/bz5')
    await user.click(await screen.findByRole('button', { name: /G · 72 BPM/ }))
    await user.click(await screen.findByRole('button', { name: 'A' }))
    expect(router.state.location.search).toMatchObject({ key: 'A' })
    // The summary sits behind the open sheet, out of the accessibility tree until it closes.
    expect(
      await screen.findByRole('button', { name: /A · 72 BPM/, hidden: true }),
    ).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'G' }))
    expect(router.state.location.search).not.toHaveProperty('key')
  })
})
