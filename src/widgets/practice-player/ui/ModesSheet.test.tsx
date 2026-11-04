import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderWithSettings } from '@/app/testing/render-with-settings'
import { ModesSheet } from './ModesSheet'

const sheet = (props: Partial<Parameters<typeof ModesSheet>[0]> = {}) => (
  <ModesSheet
    open
    onOpenChange={vi.fn()}
    mode="listen"
    hands="both"
    onMode={vi.fn()}
    onHands={vi.fn()}
    {...props}
  />
)

describe('ModesSheet', () => {
  it('offers the four modes, each with its line, the chosen one checked', () => {
    renderWithSettings(sheet({ mode: 'wait' }))
    expect(screen.getByRole('dialog', { name: 'What would you like to do?' })).toBeInTheDocument()
    for (const name of ['Listen', 'Sight-read', 'Practice', 'Interpret'])
      expect(screen.getByRole('radio', { name: new RegExp(`^${name}`) })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /^Sight-read/ })).toBeChecked()
    expect(screen.getByText('The app plays; follow the score.')).toBeInTheDocument()
  })

  it('chooses a mode', async () => {
    const user = userEvent.setup()
    const onMode = vi.fn()
    renderWithSettings(sheet({ onMode }))
    await user.click(screen.getByRole('radio', { name: /^Interpret/ }))
    expect(onMode).toHaveBeenCalledWith('follow')
  })

  it('opens Practice’s hands inline, and Hear the other hand', async () => {
    const user = userEvent.setup()
    const onHands = vi.fn()
    const { settingsStore } = renderWithSettings(sheet({ mode: 'practice', hands: 'rh', onHands }))
    await user.click(screen.getByRole('radio', { name: 'Left' }))
    expect(onHands).toHaveBeenCalledWith('lh')
    await user.click(screen.getByRole('switch', { name: 'Hear the other hand' }))
    expect(settingsStore.getState().otherHand.play).toBe(false)
  })

  it('shows no hands outside Practice', () => {
    renderWithSettings(sheet({ mode: 'listen' }))
    expect(screen.queryByRole('radio', { name: 'Left' })).not.toBeInTheDocument()
  })

  it('says a mode that listens to the keys needs a piano, where none is there', () => {
    renderWithSettings(sheet({ piano: false }))
    expect(screen.getAllByText('Connect a piano or use Piano keys.')).toHaveLength(3)
  })
})
