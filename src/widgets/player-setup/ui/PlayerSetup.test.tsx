import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderWithSettings } from '@/app/testing/render-with-settings'
import { PATTERNS } from '@/entities/pattern'
import { melodyOf, pieceById } from '@/entities/piece'
import { ownChoice } from '@/features/practice'
import { PlayerSetup } from './PlayerSetup'

function piece(id: string) {
  const found = pieceById(id)
  if (!found) throw new Error(id)
  return found
}
const bz5 = piece('bz5')

function renderSetup() {
  const onChange = vi.fn()
  const { settingsStore } = renderWithSettings(
    <PlayerSetup
      open
      onOpenChange={() => {}}
      piece={bz5}
      choice={ownChoice(bz5)}
      tempo={72}
      hands="both"
      onChange={onChange}
    />,
  )
  return { onChange, settingsStore }
}

describe('PlayerSetup', () => {
  it('changes the key, hands and tempo', async () => {
    const user = userEvent.setup()
    const { onChange } = renderSetup()
    await user.click(screen.getByRole('button', { name: 'A' }))
    expect(onChange).toHaveBeenCalledWith({ key: 'A' })
    await user.click(screen.getByRole('button', { name: 'Left hand' }))
    expect(onChange).toHaveBeenCalledWith({ hands: 'lh' })
    // Base UI shows the thumb once it has measured the track, which jsdom never lays out.
    screen.getByRole('slider', { hidden: true }).focus()
    await user.keyboard('{ArrowRight}')
    expect(onChange).toHaveBeenCalledWith({ tempo: 73 })
  })

  it('chooses a pattern from its group, and keeps melody patterns from a song without a melody', async () => {
    const user = userEvent.setup()
    const { onChange } = renderSetup()
    expect(melodyOf(bz5)).toBeUndefined()
    await user.click(screen.getByRole('button', { name: /^Pattern/ }))
    expect(screen.getByRole('button', { name: new RegExp(PATTERNS.r5.name.en) })).toBeDisabled()
    await user.click(screen.getByRole('button', { name: new RegExp(PATTERNS.ballad.name.en) }))
    expect(onChange).toHaveBeenCalledWith({ pattern: 'ballad' })
  })

  it('goes back to the pattern’s own figure', async () => {
    const user = userEvent.setup()
    const { onChange } = renderSetup()
    await user.click(screen.getByRole('button', { name: /^Right hand.*own/ }))
    await user.click(screen.getByRole('button', { name: /The pattern’s own/ }))
    expect(onChange).toHaveBeenCalledWith({ rh: undefined })
  })

  it('saves the switches in settings, and shows Melody only for a piece with one', async () => {
    const user = userEvent.setup()
    const { settingsStore } = renderSetup()
    await user.click(screen.getByRole('switch', { name: 'Metronome' }))
    expect(settingsStore.getState().practice.metronome).toBe(true)
    expect(screen.queryByRole('switch', { name: 'Melody' })).not.toBeInTheDocument()
  })
})
