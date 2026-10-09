import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithSettings } from '@/app/testing/render-with-settings'
import type { Take } from '@/entities/take'
import { createFakeAudio } from '@/shared/api/audio'
import { midi } from '@/shared/lib/music'
import { ServicesProvider } from '@/shared/lib/services'
import { TakeRoll } from './TakeRoll'

/** At 120 in 4/4: four bars of 2000 ms, recorded from bar 5. */
const TAKE: Take = {
  id: 'take-1',
  pieceId: 'bz1',
  made: 0,
  tempo: 120,
  meter: '4/4',
  fromBar: 5,
  length: 8000,
  notes: [
    { midi: midi(60), at: 0, held: 400, velocity: 80 },
    { midi: midi(64), at: 4500, held: 400, velocity: 80 },
  ],
  pedals: [],
}

function setUp(extra: { kept?: { first: number; last: number } } = {}) {
  const onPlayFrom = vi.fn()
  const wrap = (ui: ReactNode) => (
    <ServicesProvider services={{ audio: createFakeAudio(), midi: null }}>{ui}</ServicesProvider>
  )
  renderWithSettings(
    wrap(<TakeRoll take={TAKE} playing={null} onPlayFrom={onPlayFrom} {...extra} />),
  )
  return { onPlayFrom }
}

describe('TakeRoll', () => {
  it('draws the take as a picture of its notes and bars', () => {
    setUp()
    expect(screen.getByRole('img', { name: 'Notes: 2 · bars: 4' })).toBeInTheDocument()
  })

  it('plays from a bar tapped, each named by its number in the piece', async () => {
    const user = userEvent.setup()
    const { onPlayFrom } = setUp()
    expect(screen.getAllByRole('button').map((bar) => bar.getAttribute('aria-label'))).toEqual([
      'Play from bar 5',
      'Play from bar 6',
      'Play from bar 7',
      'Play from bar 8',
    ])
    await user.click(screen.getByRole('button', { name: 'Play from bar 7' }))
    expect(onPlayFrom).toHaveBeenCalledExactlyOnceWith(2)
  })

  it('dims the bars Keep bars would cut', () => {
    setUp({ kept: { first: 1, last: 2 } })
    const dimmed = (n: number) => screen.getByRole('button', { name: `Play from bar ${n}` })
    expect(dimmed(5)).toHaveAttribute('data-dimmed')
    expect(dimmed(6)).not.toHaveAttribute('data-dimmed')
    expect(dimmed(7)).not.toHaveAttribute('data-dimmed')
    expect(dimmed(8)).toHaveAttribute('data-dimmed')
  })
})
