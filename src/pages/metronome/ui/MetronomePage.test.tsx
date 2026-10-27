import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import type { ClickSound } from '@/shared/lib/schedule'
import { createMemoryStorage } from '@/shared/lib'

const saved = (storage: Storage) =>
  JSON.parse(storage.getItem('pt-settings') ?? 'null')?.state.metronome

/** Each beat played: its time and its sounds' voices, `!` where accented. */
const beatsPlayed = (played: readonly { sounds: readonly unknown[]; at: number }[]) =>
  played.map(({ at, sounds }) => ({
    at: Number(at.toFixed(3)),
    voices: (sounds as ClickSound[]).map(
      ({ voice, accent }) => `${voice ?? 'click'}${accent ? '!' : ''}`,
    ),
  }))

const tempo = () => screen.getByText(/^Tempo: \d+ BPM$/).textContent

async function open(storage = createMemoryStorage()) {
  const app = await renderApp('/practice/metronome', { storage })
  await screen.findByRole('heading', { level: 1, name: 'Metronome' })
  return { ...app, storage }
}

describe('Practice → Metronome', () => {
  it('is listed with the training on Practice', async () => {
    const user = userEvent.setup()
    await renderApp('/practice')
    const training = await screen.findByRole('region', { name: 'Training' })
    await user.click(within(training).getByRole('link', { name: /Metronome/ }))
    expect(await screen.findByRole('heading', { level: 1, name: 'Metronome' })).toBeInTheDocument()
  })

  it('steps the tempo by 10 and by 1, and saves it', async () => {
    const user = userEvent.setup()
    const { storage } = await open()
    expect(tempo()).toBe('Tempo: 120 BPM')
    await user.click(screen.getByRole('button', { name: 'Faster by 10' }))
    await user.click(screen.getByRole('button', { name: 'Slower by 1' }))
    expect(tempo()).toBe('Tempo: 129 BPM')
    expect(saved(storage)).toEqual({ bpm: 129, meter: '4/4', sound: 'click' })
  })

  it('plays on the audio clock ahead of time, the first beat of each bar accented', async () => {
    const user = userEvent.setup()
    const { audio } = await open()
    await user.click(screen.getByRole('button', { name: 'Start' }))
    // At 120 a beat is half a second: the beats within a second and a half are queued at once.
    await waitFor(() =>
      expect(beatsPlayed(audio.played)).toEqual([
        { at: 0.1, voices: ['click!'] },
        { at: 0.6, voices: ['click'] },
        { at: 1.1, voices: ['click'] },
      ]),
    )
    expect(screen.getByRole('button', { name: 'Stop' })).toBeInTheDocument()
  })

  it('shows the beat sounding, the first of four lit first', async () => {
    const user = userEvent.setup()
    const { audio } = await open()
    const beats = () => within(screen.getByRole('list', { name: 'Beats' })).getAllByRole('listitem')
    expect(beats()).toHaveLength(4)
    await user.click(screen.getByRole('button', { name: 'Start' }))
    act(() => audio.setNow(0.2))
    await waitFor(() => expect(beats()[0]).toHaveAttribute('aria-current', 'true'))
    act(() => audio.setNow(0.7))
    await waitFor(() => expect(beats()[1]).toHaveAttribute('aria-current', 'true'))
    expect(beats()[0]).not.toHaveAttribute('aria-current')
  })

  it('goes on at once from the beat heard when the tempo changes as it plays', async () => {
    const user = userEvent.setup()
    const { audio } = await open()
    await user.click(screen.getByRole('button', { name: 'Start' }))
    await waitFor(() => expect(audio.played).toHaveLength(3))
    act(() => audio.setNow(0.65))
    await user.click(screen.getByRole('button', { name: 'Slower by 10' }))
    // What was queued goes; at 110 the third beat comes 60/110 s after the second.
    expect(audio.stops).toBe(1)
    expect(beatsPlayed(audio.played.slice(3))[0]).toEqual({ at: 1.145, voices: ['click'] })
  })

  it('plays a drum beat in the time signature chosen, both saved', async () => {
    const user = userEvent.setup()
    const { audio, storage } = await open()
    await user.click(screen.getByRole('combobox', { name: 'Sound' }))
    await user.click(await screen.findByRole('option', { name: 'Drum beat' }))
    await user.click(screen.getByRole('combobox', { name: 'Time signature' }))
    await user.click(await screen.findByRole('option', { name: '3/4' }))
    expect(saved(storage)).toEqual({ bpm: 120, meter: '3/4', sound: 'drum' })
    expect(
      within(screen.getByRole('list', { name: 'Beats' })).getAllByRole('listitem'),
    ).toHaveLength(3)
    await user.click(screen.getByRole('button', { name: 'Start' }))
    await waitFor(() =>
      expect(beatsPlayed(audio.played).map(({ voices }) => voices)).toEqual([
        ['hat', 'kick!'],
        ['hat', 'snare'],
        ['hat', 'snare'],
      ]),
    )
  })

  it('starts and stops with Space, and changes the tempo with the arrows, by 10 with Shift', async () => {
    const user = userEvent.setup()
    const { audio } = await open()
    await user.keyboard('{ArrowUp}{ArrowUp}')
    await user.keyboard('{Shift>}{ArrowDown}{/Shift}')
    expect(tempo()).toBe('Tempo: 112 BPM')
    await user.keyboard(' ')
    expect(await screen.findByRole('button', { name: 'Stop' })).toBeInTheDocument()
    await user.keyboard(' ')
    expect(await screen.findByRole('button', { name: 'Start' })).toBeInTheDocument()
    expect(audio.stops).toBe(1)
  })

  it('takes the tempo of the last taps', async () => {
    const user = userEvent.setup()
    await open()
    const tap = screen.getByRole('button', { name: 'Tap tempo' })
    const now = vi.spyOn(performance, 'now')
    // A quarter of a second apart: 240 a minute.
    for (const time of [1000, 1250, 1500]) {
      now.mockReturnValue(time)
      await user.click(tap)
    }
    expect(tempo()).toBe('Tempo: 240 BPM')
  })

  it('opens in the tempo, sound and time signature saved', async () => {
    const storage = createMemoryStorage()
    storage.setItem(
      'pt-settings',
      JSON.stringify({
        version: 13,
        state: { metronome: { bpm: 66, meter: '6/8', sound: 'beep' } },
      }),
    )
    await open(storage)
    expect(tempo()).toBe('Tempo: 66 BPM')
    expect(screen.getByRole('combobox', { name: 'Sound' })).toHaveTextContent('Beeps')
    expect(
      within(screen.getByRole('list', { name: 'Beats' })).getAllByRole('listitem'),
    ).toHaveLength(6)
  })
})
