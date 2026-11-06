import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
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

type User = ReturnType<typeof userEvent.setup>

/** The foot's More, opened: its menu. */
async function openMore(user: User) {
  const foot = await screen.findByRole('toolbar', { name: 'Practice tools' })
  await user.click(within(foot).getByRole('button', { name: 'More' }))
  return screen.findByRole('menu')
}

describe('the Player’s foot bar and Feedback (R29 B8, R31-P)', () => {
  it('labels its tools, the song’s Recordings and Feedback under More, Feedback greyed until a take', async () => {
    const user = userEvent.setup()
    await renderApp('/play/bz5')
    const foot = await screen.findByRole('toolbar', { name: 'Practice tools' })
    expect(
      within(foot)
        .getAllByRole('button')
        .map((tool) => tool.getAttribute('aria-label') ?? tool.textContent),
    ).toEqual(['View: Sheet', 'Transpose: G major', 'Version: Original', 'Listen', 'More'])
    const menu = await openMore(user)
    const feedback = within(menu).getByRole('menuitem', { name: /How did I play\?/ })
    expect(feedback).toHaveAttribute('aria-disabled', 'true')
    expect(within(menu).getByRole('menuitem', { name: 'My recordings' })).toBeEnabled()
  })

  it('shows the last take’s feedback on the score and its summary, and hides it', async () => {
    const user = userEvent.setup()
    await renderApp('/play/bz5', { storage: withTake() })
    const menu = await openMore(user)
    await user.click(within(menu).getByRole('menuitem', { name: 'How did I play?' }))
    const summary = await screen.findByText(/% right/)
    // Each count after its verdict's shape, as the score marks it (R34).
    expect(summary).toHaveTextContent(
      /^●\d+ ?% right( · [×◂▸]\d+ (wrong|early|late))* · ○\d+ missed$/,
    )
    expect(document.querySelector('[data-slot="note-verdicts"]')?.textContent).toContain('n-')
    await user.click(screen.getByRole('button', { name: 'Hide feedback' }))
    expect(screen.queryByRole('button', { name: 'Hide feedback' })).not.toBeInTheDocument()
  })

  it('lists the song’s takes in My recordings, each opening its feedback', async () => {
    const user = userEvent.setup()
    await renderApp('/play/bz5', { storage: withTake() })
    const menu = await openMore(user)
    await user.click(within(menu).getByRole('menuitem', { name: 'My recordings' }))
    const sheet = await screen.findByRole('dialog', { name: 'My recordings' })
    expect(within(sheet).getByRole('button', { name: 'Record' })).toBeDisabled()
    expect(within(sheet).getByText('Connect a piano to record a take.')).toBeInTheDocument()
    await user.click(within(sheet).getByRole('button', { name: /From bar 1/ }))
    expect(await screen.findByRole('button', { name: 'Hide feedback' })).toBeInTheDocument()
  })

  it('keeps the foot’s tools in their order, the music’s acts under More in their parts', async () => {
    const user = userEvent.setup()
    await renderApp('/play/bz5')
    const menu = await openMore(user)
    expect(
      within(menu)
        .getAllByRole('menuitem')
        .map((tool) => tool.textContent?.replace('Record a take first', '')),
    ).toEqual([
      'Sections',
      'Song information',
      'My recordings',
      'How did I play?',
      'Annotations',
      'Print',
      'Tuner',
      'Share link',
      'Export…',
    ])
  })
})
