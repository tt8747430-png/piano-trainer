import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderWithSettings } from '@/app/testing/render-with-settings'
import { HandsSheet } from './HandsSheet'

const sheet = (props: Partial<Parameters<typeof HandsSheet>[0]> = {}) => (
  <HandsSheet open onOpenChange={vi.fn()} hands="both" onHands={vi.fn()} {...props} />
)

describe('HandsSheet, the Parts sheet (loop round 24)', () => {
  it('has a card for each hand, the right first, each switched on where it is played', () => {
    renderWithSettings(sheet({ hands: 'rh' }))
    expect(screen.getByRole('dialog', { name: 'Parts' })).toBeInTheDocument()
    expect(screen.getAllByRole('group').map((group) => group.getAttribute('aria-label'))).toEqual([
      'Right hand',
      'Left hand',
    ])
    expect(screen.getByRole('switch', { name: 'Right hand: you play it' })).toBeChecked()
    expect(screen.getByRole('switch', { name: 'Left hand: you play it' })).not.toBeChecked()
  })

  it('switches a hand off, and switching the last one off turns the other on', async () => {
    const user = userEvent.setup()
    const onHands = vi.fn()
    renderWithSettings(sheet({ onHands }))
    await user.click(screen.getByRole('switch', { name: 'Left hand: you play it' }))
    expect(onHands).toHaveBeenLastCalledWith('rh')
  })

  it('dims the staff of the hand not played, from its own card', async () => {
    const user = userEvent.setup()
    const { settingsStore } = renderWithSettings(sheet({ hands: 'rh' }))
    await user.click(screen.getByRole('switch', { name: 'Dim' }))
    expect(settingsStore.getState().otherHand.look).toBe('show')
  })

  it('sets each hand’s volume on its staff', () => {
    renderWithSettings(sheet())
    expect(screen.getAllByRole('slider')).toHaveLength(2)
  })
})
