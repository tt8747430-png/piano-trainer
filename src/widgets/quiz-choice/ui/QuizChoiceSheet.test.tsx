import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderWithSettings } from '@/app/testing/render-with-settings'
import { QuizChoiceSheet } from './QuizChoiceSheet'

describe('QuizChoiceSheet', () => {
  it('saves the chosen families and scales on Apply', async () => {
    const user = userEvent.setup()
    const { settingsStore } = renderWithSettings(<QuizChoiceSheet mode="build-chord" />)
    await user.click(screen.getByRole('button', { name: 'Chords and scales' }))
    await user.click(screen.getByRole('switch', { name: 'Triads' }))
    await user.click(screen.getByRole('button', { name: 'Apply' }))
    expect(settingsStore.getState().quiz.families).toEqual(['tri', 'sev', 'nin'])
  })

  it('cannot apply without anything for the current mode to ask', async () => {
    const user = userEvent.setup()
    renderWithSettings(<QuizChoiceSheet mode="build-chord" />)
    await user.click(screen.getByRole('button', { name: 'Chords and scales' }))
    await user.click(screen.getByRole('button', { name: 'Clear all' }))
    expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled()
  })

  it('lets a chord quiz apply with no scales chosen, keeping the saved scales', async () => {
    const user = userEvent.setup()
    const { settingsStore } = renderWithSettings(<QuizChoiceSheet mode="name-chord" />)
    const scales = settingsStore.getState().quiz.scales
    await user.click(screen.getByRole('button', { name: 'Chords and scales' }))
    for (const name of ['Major', 'Natural minor', 'Harmonic minor']) {
      await user.click(screen.getByRole('switch', { name }))
    }
    await user.click(screen.getByRole('button', { name: 'Apply' }))
    expect(settingsStore.getState().quiz.scales).toEqual(scales)
  })
})
