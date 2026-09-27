import { cleanup, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderWithSettings } from '@/app/testing/render-with-settings'
import { PATTERNS } from '@/entities/pattern'
import { melodyOf, PIECES, pieceById, type Piece } from '@/entities/piece'
import { ownChoice } from '@/features/practice'
import { PlayerSetup } from './PlayerSetup'

function piece(id: string) {
  const found = pieceById(id)
  if (!found) throw new Error(id)
  return found
}
const bz5 = piece('bz5')
const withMelody = PIECES.find((p) => melodyOf(p) !== undefined)
if (!withMelody) throw new Error('no piece has a melody')

function renderSetup(shown: Piece = bz5) {
  const onChange = vi.fn()
  const { settingsStore } = renderWithSettings(
    <PlayerSetup
      open
      onOpenChange={() => {}}
      piece={shown}
      choice={ownChoice(shown)}
      onChange={onChange}
    >
      <p>How it plays</p>
    </PlayerSetup>,
  )
  return { onChange, settingsStore }
}

describe('PlayerSetup', () => {
  it('names the key it is played in on the key’s pop-up', () => {
    renderSetup()
    expect(screen.getByRole('combobox', { name: 'Key' })).toHaveTextContent('G major')
  })

  it('changes the key, and leaves the tempo and hands to the Player', async () => {
    const user = userEvent.setup()
    const { onChange } = renderSetup()
    await user.click(screen.getByRole('combobox', { name: 'Key' }))
    await user.click(await screen.findByRole('option', { name: 'A major' }))
    expect(onChange).toHaveBeenCalledWith({ key: 'A' })
    expect(screen.queryByRole('slider', { hidden: true })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Left hand' })).not.toBeInTheDocument()
  })

  it('shows how the piece plays under its own choices', () => {
    renderSetup()
    expect(screen.getByText('How it plays')).toBeInTheDocument()
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

  it('shows Melody only for a piece with one, and saves it in settings', async () => {
    renderSetup()
    expect(screen.queryByRole('switch', { name: 'Melody' })).not.toBeInTheDocument()
    cleanup()
    const user = userEvent.setup()
    const { settingsStore } = renderSetup(withMelody)
    await user.click(screen.getByRole('switch', { name: 'Melody' }))
    expect(settingsStore.getState().practice.melody).toBe(true)
  })
})
