import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderWithSettings } from '@/app/testing/render-with-settings'
import { BUILT_IN_PATTERNS } from '@/entities/pattern'
import { pieceById, type Piece } from '@/entities/piece'
import { arrangePiece, ownChoice } from '@/features/practice'
import { SongInfo } from './SongInfo'

/** Daisy fields, its recording tuned as `tuning` says. */
function daisies(tuning?: number): Piece {
  const piece = pieceById('romashki')
  if (!piece?.recording) throw new Error('Daisy fields has a recording')
  return { ...piece, recording: { ...piece.recording, ...(tuning ? { tuning } : {}) } }
}

function showInfo(piece: Piece) {
  const performance = arrangePiece(piece, ownChoice(piece), BUILT_IN_PATTERNS)
  renderWithSettings(
    <SongInfo piece={piece} performance={performance} open onOpenChange={() => {}} />,
  )
  return screen.getByRole('dialog', { name: 'Song information' })
}

/** The tuning's card: what it says, and its ⓘ where it has one. */
const tuningIn = (sheet: HTMLElement) => {
  const term = within(sheet)
    .getAllByRole('term')
    .find((each) => each.textContent === 'Tuning')
  if (!term?.nextElementSibling) throw new Error('Song information says its tuning')
  return term.nextElementSibling as HTMLElement
}

describe('Song information’s tuning (ADR 0107)', () => {
  it('says the recording is at the standard A 440 Hz, and nothing more', () => {
    const tuning = tuningIn(showInfo(daisies()))
    expect(tuning).toHaveTextContent(/^A 440 Hz$/)
    expect(within(tuning).queryByRole('button')).toBeNull()
  })

  it('says the A a recording is tuned to where it is not 440, and why that matters in its ⓘ', async () => {
    const user = userEvent.setup()
    const tuning = tuningIn(showInfo(daisies(443)))
    expect(tuning).toHaveTextContent(/^A 443 Hz$/)
    await user.click(within(tuning).getByRole('button', { name: 'About Tuning' }))
    expect(await screen.findByRole('dialog', { name: 'Tuning' })).toHaveTextContent(
      'The recording is tuned to A 443 Hz, not the standard 440 Hz.',
    )
  })
})
