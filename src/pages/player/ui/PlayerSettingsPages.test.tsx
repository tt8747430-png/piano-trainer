import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { setMetronome, setPlayback } from '@/features/set-preference'

/** Opens the Player's gear at one of its pages, by its row's name (R32: the gear is their home). */
async function openPage(user: ReturnType<typeof userEvent.setup>, row: RegExp) {
  await user.click(await screen.findByRole('button', { name: 'Player settings' }))
  const sheet = await screen.findByRole('dialog', { name: 'Player settings' })
  await user.click(within(sheet).getByRole('button', { name: row }))
  return screen.findByRole('dialog')
}

describe('the Player’s settings, its gear their one home (B7, R32)', () => {
  it('sets how the Player always plays: the count-in, and the other hand’s look', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/play/bz5')
    const playback = await openPage(user, /^Playback/)
    await user.click(within(playback).getByRole('radio', { name: 'Silent' }))
    await user.click(within(playback).getByRole('button', { name: 'Back' }))
    // The hands' own page (R36): how the hand not practised shows.
    await user.click(
      within(await screen.findByRole('dialog')).getByRole('button', { name: /^Hands/ }),
    )
    const hands = await screen.findByRole('dialog')
    await user.click(within(hands).getByRole('radio', { name: 'Hide' }))
    expect(settingsStore.getState().playback).toMatchObject({ countdown: 'visual' })
    expect(settingsStore.getState().otherHand).toEqual({ look: 'hide', play: true })
  })

  it('links to the Metronome, whose sound and beats the Player’s click plays', async () => {
    const user = userEvent.setup()
    await renderApp('/play/bz5')
    const playback = await openPage(user, /^Playback/)
    expect(
      within(playback).getByRole('link', { name: 'Metronome sound and beats' }),
    ).toHaveAttribute('href', '/practice/metronome')
  })
})

describe('the Player as its settings say (B7, A27)', () => {
  it('pedals a song written without pedal marks with each chord (R37: no setting)', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/play/bz5')
    await user.click(await screen.findByRole('button', { name: 'Play' }))
    const pedals = audio.played
      .flatMap((pass) => pass.sounds)
      .filter((sound) => sound.kind === 'pedal')
    expect(pedals.length).toBeGreaterThan(0)
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
    await renderApp('/play/bz5')
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
