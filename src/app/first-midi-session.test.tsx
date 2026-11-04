import { act, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { midi } from '@/shared/lib/music'
import { renderApp } from './testing/render-app'

describe('the First MIDI session milestone (B1)', () => {
  it('is reached by a minute of playing on a connected piano, on any screen, once', async () => {
    let now = Date.parse('2026-11-04T10:00:00Z')
    vi.spyOn(Date, 'now').mockImplementation(() => now)
    const app = await renderApp('/practice', { webMidi: true })
    await screen.findByRole('heading', { level: 1 })
    act(() => app.midi.press(midi(60)))
    now += 30_000
    act(() => app.midi.press(midi(62)))
    expect(app.progressStore.getState().firsts.midi).toBeUndefined()
    now += 31_000
    act(() => app.midi.press(midi(64)))
    expect(app.progressStore.getState().firsts.midi).toBe('2026-11-04')
  })

  it('starts the minute again after a long pause', async () => {
    let now = Date.parse('2026-11-04T10:00:00Z')
    vi.spyOn(Date, 'now').mockImplementation(() => now)
    const app = await renderApp('/practice', { webMidi: true })
    await screen.findByRole('heading', { level: 1 })
    act(() => app.midi.press(midi(60)))
    now += 6 * 60_000
    act(() => app.midi.press(midi(62)))
    now += 30_000
    act(() => app.midi.press(midi(64)))
    expect(app.progressStore.getState().firsts.midi).toBeUndefined()
  })
})
