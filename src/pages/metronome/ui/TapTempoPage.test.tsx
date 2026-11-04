import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderApp } from '@/app/testing/render-app'

describe('Practice → Tap tempo (R29 B11)', () => {
  it('taps set the tempo and Use in Metronome keeps it', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/practice/tap-tempo')
    await screen.findByRole('heading', { level: 1, name: 'Tap tempo' })
    expect(screen.getByText('Tap at least twice')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Use in Metronome' })).toBeDisabled()
    // Four taps 600 ms apart: 100 beats a minute.
    const now = vi.spyOn(performance, 'now')
    const pad = screen.getByRole('button', { name: 'Tap in time' })
    for (const at of [1000, 1600, 2200, 2800]) {
      now.mockReturnValue(at)
      await user.click(pad)
    }
    now.mockRestore()
    expect(screen.getByText('100 BPM')).toBeInTheDocument()
    expect(screen.getByText('Andante')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Use in Metronome' }))
    expect(await screen.findByRole('heading', { level: 1, name: 'Metronome' })).toBeInTheDocument()
    expect(settingsStore.getState().metronome.bpm).toBe(100)
    expect(screen.getByText('Tempo: 100 BPM')).toBeInTheDocument()
  })
})
