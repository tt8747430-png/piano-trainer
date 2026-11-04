import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'

describe('a tool’s page (R29 B11)', () => {
  it('the gear opens the tool’s Settings', async () => {
    const user = userEvent.setup()
    await renderApp('/practice/tuner')
    await screen.findByRole('heading', { level: 1, name: 'Tuner' })
    await user.click(screen.getByRole('link', { name: 'Tuner settings' }))
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Tuner settings' }),
    ).toBeInTheDocument()
  })

  it('has its readout in the middle and its Start floating', async () => {
    await renderApp('/practice/metronome')
    await screen.findByRole('heading', { level: 1, name: 'Metronome' })
    expect(screen.getByRole('region', { name: 'Metronome' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Start' })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('link', { name: 'Metronome settings' })).toBeInTheDocument()
  })
})
