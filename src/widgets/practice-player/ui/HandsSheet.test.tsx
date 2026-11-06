import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderWithSettings } from '@/app/testing/render-with-settings'
import { HandsSheet } from './HandsSheet'

const sheet = (props: Partial<Parameters<typeof HandsSheet>[0]> = {}) => (
  <HandsSheet open onOpenChange={vi.fn()} hands="both" onHands={vi.fn()} {...props} />
)

describe('HandsSheet', () => {
  it('asks which hands the learner plays, in the keys’ order, the chosen one checked (R36)', () => {
    renderWithSettings(sheet({ hands: 'rh' }))
    expect(screen.getByRole('dialog', { name: 'Which hands do you play?' })).toBeInTheDocument()
    expect(screen.getAllByRole('radio').map((radio) => radio.textContent)).toEqual([
      'Left',
      'Both',
      'Right',
    ])
    expect(screen.getByRole('radio', { name: 'Right' })).toBeChecked()
  })

  it('chooses a hand', async () => {
    const user = userEvent.setup()
    const onHands = vi.fn()
    renderWithSettings(sheet({ onHands }))
    await user.click(screen.getByRole('radio', { name: 'Left' }))
    expect(onHands).toHaveBeenCalledWith('lh')
  })

  it('offers Hear the other hand once one hand is chosen', async () => {
    const user = userEvent.setup()
    const { settingsStore } = renderWithSettings(sheet({ hands: 'lh' }))
    await user.click(screen.getByRole('switch', { name: 'Hear the other hand' }))
    expect(settingsStore.getState().otherHand.play).toBe(false)
  })

  it('has no other hand to hear where both are played', () => {
    renderWithSettings(sheet({ hands: 'both' }))
    expect(screen.queryByRole('switch', { name: 'Hear the other hand' })).not.toBeInTheDocument()
  })
})
