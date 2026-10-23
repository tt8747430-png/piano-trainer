import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { PIECES_STORAGE_KEY } from '@/entities/piece'
import { createProgressStore } from '@/entities/progress'
import { recordAnswer } from '@/features/record-answer'
import { createMemoryStorage } from '@/shared/lib'
import { scaleSkill } from '@/shared/lib/music'

describe('Check', () => {
  it('checks each of a piece’s seven chords once, with a progress bar', async () => {
    await renderApp('/check?of=piece:bz5')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Check: Still, my soul, be still' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '7')
  })

  it('closes on Escape, as the Player does, and lists it among the shortcuts', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/songs/bz5')
    await screen.findByRole('heading', { level: 1 })
    await act(() => router.navigate({ to: '/check', search: { of: 'piece:bz5' } }))
    await screen.findByRole('progressbar')
    await user.keyboard('?')
    const sheet = await screen.findByRole('dialog')
    expect(within(sheet).getByText('Close the check')).toBeInTheDocument()
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await user.keyboard('{Escape}')
    await waitFor(() => expect(router.state.location.pathname).toBe('/songs/bz5'))
  })

  it('asks a scale the learner already knows once', async () => {
    const storage = createMemoryStorage()
    const progressStore = createProgressStore({ storage })
    for (let i = 0; i < 4; i++)
      recordAnswer(progressStore, { skill: scaleSkill('blues'), correct: true }, new Date())
    await renderApp('/check?of=scale:blues', { storage })
    expect(await screen.findByRole('progressbar')).toHaveAttribute('aria-valuemax', '1')
  })

  it('shows the score and each skill’s rating at the end', async () => {
    const user = userEvent.setup()
    await renderApp('/check?of=scale:blues')
    for (let i = 0; i < 4; i++) {
      const keyboard = await screen.findByRole('group', { name: 'Keyboard' })
      await user.click(within(keyboard).getByRole('button', { name: 'C4' }))
      await user.click(screen.getByRole('button', { name: 'Check' }))
      await user.click(screen.getByRole('button', { name: i < 3 ? 'Next' : 'Results' }))
    }
    expect(await screen.findByText('0 of 4')).toBeInTheDocument()
    // The score takes the focus from the Results that ended the check, so a screen reader reads it.
    expect(screen.getByText('0 of 4')).toHaveFocus()
    expect(screen.getAllByRole('button', { name: 'Done' })).toHaveLength(1)
    expect(screen.getByRole('link', { name: 'Open in Scales' })).toBeInTheDocument()
  })

  it('says when the check marked its step learned', async () => {
    const user = userEvent.setup()
    const { progressStore } = await renderApp('/check?of=scale:blues')
    await screen.findByRole('progressbar')
    act(() => {
      for (let i = 0; i < 4; i++)
        recordAnswer(progressStore, { skill: scaleSkill('blues'), correct: true }, new Date())
    })
    // Finish the check (answers wrong or right do not matter for the line: the step is now learned).
    while (!screen.queryByText(/is now marked learned/)) {
      const keyboard = await screen.findByRole('group', { name: 'Keyboard' })
      await user.click(within(keyboard).getByRole('button', { name: 'C4' }))
      await user.click(screen.getByRole('button', { name: 'Check' }))
      await user.click(screen.getByRole('button', { name: /^(Next|Results)$/ }))
    }
    expect(screen.getByText('Minor blues is now marked learned.')).toBeInTheDocument()
  })

  describe('the learner’s own music', () => {
    const MUSIC = {
      key: 'G',
      meter: '3/4',
      tempo: 80,
      pattern: 'r2',
      sections: [{ kind: 'verse', lines: ['Em Bm C G'] }],
    }
    const saved = (state: object) => {
      const storage = createMemoryStorage()
      storage.setItem(PIECES_STORAGE_KEY, JSON.stringify({ state, version: 2 }))
      return storage
    }

    it('checks an own song’s chords', async () => {
      const song = { id: 'my-1', title: 'Morning', ...MUSIC }
      await renderApp('/check?of=piece:my-1', { storage: saved({ songs: [song], nextSong: 2 }) })
      expect(
        await screen.findByRole('heading', { level: 1, name: 'Check: Morning' }),
      ).toBeInTheDocument()
      expect(screen.getByText('Build Em')).toBeInTheDocument()
    })

    it('checks the chords of the learner’s version of a song, not the original’s', async () => {
      await renderApp('/check?of=piece:amazing', {
        storage: saved({ versions: { amazing: MUSIC } }),
      })
      await screen.findByRole('progressbar')
      expect(screen.getByText('Build Em')).toBeInTheDocument()
    })
  })

  it.each(['/check?of=piece:gone', '/check', '/check?of=nothing'])(
    'shows not found for a check of nothing: %s',
    async (path) => {
      await renderApp(path)
      expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
    },
  )
})
