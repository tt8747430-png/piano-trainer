import { act, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { setBar } from '@/features/set-preference'
import { TAKES_STORAGE_KEY, TAKES_VERSION, type Take } from '@/entities/take'
import { createMemoryStorage } from '@/shared/lib'
import { midi } from '@/shared/lib/music'

/** A take of bz5's first bar: one key struck at its downbeat, nothing after. */
const TAKE: Take = {
  id: 'take-1',
  pieceId: 'bz5',
  made: Date.UTC(2026, 10, 1, 9, 30),
  tempo: 72,
  meter: '4/4',
  fromBar: 1,
  length: 3333,
  bars: [0, 3333],
  notes: [{ midi: midi(43), at: 0, held: 400, velocity: 80 }],
  pedals: [],
}

function withTake(): Storage {
  const storage = createMemoryStorage()
  storage.setItem(
    TAKES_STORAGE_KEY,
    JSON.stringify({
      // A take's notes are saved as [key, at, held, velocity].
      state: { takes: [{ ...TAKE, notes: [[43, 0, 400, 80]] }], nextTake: 2 },
      version: TAKES_VERSION,
    }),
  )
  return storage
}

describe('the Player’s foot bar and Feedback (R29 B8)', () => {
  it('labels its five tools, a song’s Recordings and Feedback among them, the rest under More', async () => {
    await renderApp('/play/bz5')
    const foot = await screen.findByRole('toolbar', { name: 'Practice tools' })
    expect(
      within(foot)
        .getAllByRole('button')
        .map((tool) => tool.textContent),
    ).toEqual(['Recordings', 'Loop', 'Tempo', 'Feedback', 'Modes', 'More'])
    expect(within(foot).getByRole('button', { name: 'Feedback' })).toBeDisabled()
  })

  it('shows the last take’s feedback on the score and its summary, and hides it', async () => {
    const user = userEvent.setup()
    await renderApp('/play/bz5', { storage: withTake() })
    const feedback = await screen.findByRole('button', { name: 'Feedback' })
    await user.click(feedback)
    expect(feedback).toHaveAttribute('aria-pressed', 'true')
    const summary = await screen.findByText(/% right/)
    expect(summary).toHaveTextContent(/^\d+ ?% right( · \d+ (wrong|early|late))* · \d+ missed$/)
    expect(document.querySelector('[data-slot="note-verdicts"]')?.textContent).toContain('n-')
    await user.click(screen.getByRole('button', { name: 'Hide feedback' }))
    expect(feedback).toHaveAttribute('aria-pressed', 'false')
  })

  it('lists the song’s takes in My recordings, each opening its feedback', async () => {
    const user = userEvent.setup()
    await renderApp('/play/bz5', { storage: withTake() })
    await user.click(await screen.findByRole('button', { name: 'Recordings' }))
    const sheet = await screen.findByRole('dialog', { name: 'My recordings' })
    expect(within(sheet).getByRole('button', { name: 'Record' })).toBeDisabled()
    expect(within(sheet).getByText('Connect a piano to record a take.')).toBeInTheDocument()
    await user.click(within(sheet).getByRole('button', { name: /From bar 1/ }))
    expect(await screen.findByRole('button', { name: 'Hide feedback' })).toBeInTheDocument()
  })

  it('shows the chosen tools in order, the rest under More (R29 B10)', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/play/bz5')
    act(() => setBar(settingsStore, 'bar.player', ['tuner', 'loop', 'tempo', 'modes']))
    const foot = await screen.findByRole('toolbar', { name: 'Practice tools' })
    expect(
      within(foot)
        .getAllByRole('button')
        .map((tool) => tool.textContent),
    ).toEqual(['Tuner', 'Loop', 'Tempo', 'Modes', 'More'])
    await user.click(within(foot).getByRole('button', { name: 'More' }))
    const more = await screen.findByRole('dialog', { name: 'More' })
    expect(
      within(more)
        .getAllByRole('button')
        .map((tool) => tool.textContent),
    ).toEqual(['Recordings', 'Feedback', 'Metronome', 'Transpose', 'Version', 'Annotations'])
  })
})
