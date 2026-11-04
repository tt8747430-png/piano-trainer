import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'

describe('Practice → Tuner (R29 B11)', () => {
  it('listens on its own page, and says so where there is no microphone', async () => {
    await renderApp('/practice/tuner')
    await screen.findByRole('heading', { level: 1, name: 'Tuner' })
    expect(await screen.findByRole('alert')).toHaveTextContent('The microphone is not available')
  })

  it('keeps its A4 on its Settings page, and the tuner reads against it', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/practice/tuner/settings')
    await screen.findByRole('heading', { level: 1, name: 'Tuner settings' })
    await user.click(screen.getByRole('button', { name: 'Higher A4' }))
    await user.click(screen.getByRole('button', { name: 'Higher A4' }))
    expect(screen.getByText('442 Hz')).toBeInTheDocument()
    expect(settingsStore.getState().tuner.a4).toBe(442)
  })
})
