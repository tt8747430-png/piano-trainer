import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'

describe('Practice → Tuner (R29 B11)', () => {
  it('listens on its own page, and says so where there is no microphone', async () => {
    await renderApp('/practice/tuner')
    await screen.findByRole('heading', { level: 1, name: 'Tuner' })
    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('No microphone')
    expect(alert).toHaveTextContent('Allow the microphone in the browser to use the tuner.')
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument()
  })

  it('sets its reference pitch in place, a stepper under the readout (R32)', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/practice/tuner')
    await screen.findByRole('heading', { level: 1, name: 'Tuner' })
    await user.click(screen.getByRole('button', { name: 'Higher A4' }))
    await user.click(screen.getByRole('button', { name: 'Higher A4' }))
    const pitch = screen.getAllByRole('group', { name: 'Reference pitch' }).at(-1)
    expect(pitch).toHaveTextContent('442 Hz')
    expect(settingsStore.getState().tuner.a4).toBe(442)
  })
})
