import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { setMetronome, setPlayback } from '@/features/set-preference'

describe('Settings › Player (B7)', () => {
  it('sets how the Player always plays: count-in, cursor, the other hand’s look, the pedal', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/settings/player')
    expect(await screen.findByRole('heading', { level: 1, name: 'Player' })).toBeInTheDocument()
    await user.click(screen.getByRole('radio', { name: 'Visual' }))
    await user.click(
      within(screen.getByRole('radiogroup', { name: 'Cursor' })).getByRole('radio', {
        name: 'Beats',
      }),
    )
    await user.click(screen.getByRole('radio', { name: 'Hide' }))
    await user.click(screen.getByRole('radio', { name: 'Automatic' }))
    expect(settingsStore.getState().playback).toMatchObject({
      countdown: 'visual',
      cursor: 'beats',
      pedal: 'automatic',
    })
    expect(settingsStore.getState().otherHand).toEqual({ look: 'hide', play: true })
  })

  it('links to the Metronome, whose sound and beats the Player’s click plays', async () => {
    await renderApp('/settings/player')
    expect(await screen.findByRole('link', { name: 'Metronome sound and beats' })).toHaveAttribute(
      'href',
      '/practice/metronome',
    )
  })
})

describe('the Player as its settings say (B7, A27)', () => {
  it('plays a pedal with each chord where the pedal is Automatic, none where Off', async () => {
    const user = userEvent.setup()
    const { audio, settingsStore } = await renderApp('/play/bz5')
    const pedals = (from = 0) =>
      audio.played
        .slice(from)
        .flatMap((pass) => pass.sounds)
        .filter((sound) => sound.kind === 'pedal')
    act(() => setPlayback(settingsStore, { pedal: 'automatic' }))
    await user.click(await screen.findByRole('button', { name: 'Play' }))
    expect(pedals().length).toBeGreaterThan(0)
    await user.click(screen.getByRole('button', { name: 'Stop' }))
    const before = audio.played.length
    act(() => setPlayback(settingsStore, { pedal: 'off' }))
    await user.click(screen.getByRole('button', { name: 'Play' }))
    expect(audio.played.length).toBeGreaterThan(before)
    expect(pedals(before)).toEqual([])
  })

  it('counts in on the screen alone, unheard, where the count-in is Visual', async () => {
    const user = userEvent.setup()
    const { audio, settingsStore } = await renderApp('/play/bz5')
    act(() => setPlayback(settingsStore, { countdown: 'visual' }))
    await user.click(await screen.findByRole('button', { name: 'Play' }))
    const sounds = audio.played[0]?.sounds ?? []
    expect(sounds.filter((sound) => sound.kind === 'click')).toEqual([])
    // The music waits the bar counted in.
    expect(sounds.find((sound) => sound.kind === 'note')?.at).toBeGreaterThan(0)
  })

  it('clicks in the Metronome’s sound, its squares set for the song’s meter (A35, A39)', async () => {
    const user = userEvent.setup()
    const { audio, settingsStore } = await renderApp('/play/bz5?click=true')
    act(() => setMetronome(settingsStore, { sound: 'drum' }))
    await user.click(await screen.findByRole('button', { name: 'Play' }))
    const voices = (audio.played[0]?.sounds ?? []).flatMap((sound) =>
      sound.kind === 'click' ? [sound.voice] : [],
    )
    expect(voices.slice(0, 2)).toEqual(['kick', 'hat'])
  })

  it('marks the pedal it plays under; the drawn pedal stays up while stopped (A27, R31-P)', async () => {
    const { settingsStore } = await renderApp('/play/bz5')
    act(() => setPlayback(settingsStore, { pedal: 'automatic' }))
    await waitFor(() =>
      expect(document.querySelector('style[data-slot="pedal-marks"]')?.textContent).toContain(
        '#ped-0',
      ),
    )
    // The score's pedal is down at the cursor, yet nothing plays: no pedal hangs.
    expect(screen.getByRole('button', { name: /^Sustain pedal/ })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })
})
