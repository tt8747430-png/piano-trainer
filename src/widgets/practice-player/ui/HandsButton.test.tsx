import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderWithSettings } from '@/app/testing/render-with-settings'
import { HandsButton } from './HandsButton'

describe('HandsButton', () => {
  it('says the hands, and chooses another', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    renderWithSettings(<HandsButton hands="both" onChange={onChange} />)
    await user.click(screen.getByRole('button', { name: 'Hands: Both hands' }))
    expect(await screen.findByRole('dialog', { name: 'Hands' })).toBeInTheDocument()
    await user.click(await screen.findByRole('option', { name: 'Left hand' }))
    expect(onChange).toHaveBeenCalledWith('lh')
  })

  it('turns Hear the other hand on and off, saved, beside the hands (R29)', async () => {
    const user = userEvent.setup()
    const { settingsStore } = renderWithSettings(<HandsButton hands="rh" onChange={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: 'Hands: Right hand' }))
    const hear = await screen.findByRole('switch', { name: 'Hear the other hand' })
    expect(hear).toBeChecked()
    await user.click(hear)
    expect(settingsStore.getState().otherHand.play).toBe(false)
  })
})
