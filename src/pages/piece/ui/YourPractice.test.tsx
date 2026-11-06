import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { TAKES_STORAGE_KEY, TAKES_VERSION } from '@/entities/take'
import { createMemoryStorage } from '@/shared/lib'

/** A take of bz5's first bar at its tempo: one key struck at its downbeat, nothing after. */
function withTake(): Storage {
  const storage = createMemoryStorage()
  storage.setItem(
    TAKES_STORAGE_KEY,
    JSON.stringify({
      // A take's notes are saved as [key, at, held, velocity].
      state: {
        takes: [
          {
            id: 'take-1',
            pieceId: 'bz5',
            made: Date.UTC(2026, 10, 1, 9, 30),
            tempo: 72,
            meter: '4/4',
            fromBar: 1,
            length: 3333,
            bars: [0, 3333],
            notes: [[43, 0, 400, 80]],
            pedals: [],
          },
        ],
        nextTake: 2,
      },
      version: TAKES_VERSION,
    }),
  )
  return storage
}

describe('Your practice (R34)', () => {
  it('says the last and best take, the bars one by one, and the one next step', async () => {
    await renderApp('/songs/bz5', { storage: withTake() })
    const card = await screen.findByRole('region', { name: 'Your practice' })
    const meters = within(card).getAllByRole('meter')
    expect(meters.map((meter) => meter.getAttribute('aria-label'))).toEqual([
      'Last take',
      'Best take',
    ])
    expect(within(card).getByText('Bar 1: 0% right')).toBeInTheDocument()
    expect(within(card).getByText('Bar 2: not played')).toBeInTheDocument()
    const step = within(card).getByRole('link', { name: 'Loop bar 1 at 70% speed' })
    expect(step).toHaveAttribute('href', expect.stringContaining('loop=1-1'))
    expect(step).toHaveAttribute('href', expect.stringContaining('tempo=50'))
  })

  it('shows nothing before the song is first played', async () => {
    await renderApp('/songs/bz5')
    await screen.findByRole('heading', { level: 1 })
    expect(screen.queryByRole('region', { name: 'Your practice' })).not.toBeInTheDocument()
  })
})
