import { act, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { PATTERNS_STORAGE_KEY } from '@/entities/pattern'
import { deleteOwnPattern } from '@/features/manage-patterns'
import { createMemoryStorage } from '@/shared/lib'

const withOwn = () => {
  const storage = createMemoryStorage()
  storage.setItem(
    PATTERNS_STORAGE_KEY,
    JSON.stringify({
      state: {
        favourites: ['my-1'],
        hidden: [],
        own: [{ id: 'my-1', name: 'Sunday', rh: 'jaz', lh: 'walk' }],
        nextOwn: 2,
      },
      version: 1,
    }),
  )
  return storage
}

describe('A pattern’s page', () => {
  it('explains it: its idea, each hand’s figure, the source’s words and the music that plays it', async () => {
    await renderApp('/practice/patterns/M1')
    expect(
      await screen.findByRole('heading', { level: 1, name: '1 · Bass + chords' }),
    ).toBeInTheDocument()
    expect(screen.getByText('The chord on every beat over a held octave bass.')).toBeInTheDocument()
    expect(screen.getByText('Chord on every beat')).toBeInTheDocument()
    expect(screen.getByText('Octave, whole note')).toBeInTheDocument()
    expect(screen.getByText(/Left hand holds the bass in octaves/)).toBeInTheDocument()
    expect(screen.getByText('Over a bar of C major')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Used in' })).toBeInTheDocument()
  })

  it('plays its bar of C on the keys, and stops', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/practice/patterns/M1')
    await user.click(await screen.findByRole('button', { name: 'Play' }))
    expect(audio.played).toHaveLength(1)
    expect(screen.getByRole('button', { name: 'Stop' })).toBeInTheDocument()
  })

  it('plays a tune pattern over a song with a tune, and opens it there in the Player', async () => {
    await renderApp('/practice/patterns/r5')
    expect(await screen.findByText(/^Over the first line of /)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Practise in the Player' })).toHaveAttribute(
      'href',
      '/play/otche?pattern=r5',
    )
  })

  it('stars it, hides it from the Player and shows it again', async () => {
    const user = userEvent.setup()
    const { patternsStore } = await renderApp('/practice/patterns/ballad')
    const star = await screen.findByRole('button', { name: 'Favourite' })
    await user.click(star)
    expect(star).toHaveAttribute('aria-pressed', 'true')
    expect(patternsStore.getState().favourites).toEqual(['ballad'])
    await user.click(screen.getByRole('button', { name: 'Hide from the Player' }))
    expect(patternsStore.getState().hidden).toEqual(['ballad'])
    expect(screen.getByText('Hidden from the Player’s list of patterns.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Show in the Player' }))
    expect(patternsStore.getState().hidden).toEqual([])
  })

  it('opens the progression Player with it', async () => {
    await renderApp('/practice/patterns/ballad')
    expect(await screen.findByRole('link', { name: 'Practise in the Player' })).toHaveAttribute(
      'href',
      '/play/progression?pattern=ballad',
    )
  })

  it('shows the learner’s own, with Edit and Delete, and deletes it once asked', async () => {
    const user = userEvent.setup()
    const { router, patternsStore } = await renderApp('/practice/patterns/my-1', {
      storage: withOwn(),
    })
    expect(await screen.findByRole('heading', { level: 1, name: 'Sunday' })).toBeInTheDocument()
    expect(screen.getByText('Charleston · Walking the triad 1–3–5–3')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Edit' })).toHaveAttribute(
      'href',
      '/practice/patterns/my-1/edit',
    )
    expect(screen.queryByRole('button', { name: 'Hide from the Player' })).toBeNull()
    await user.click(screen.getByRole('button', { name: 'Delete' }))
    await user.click(await screen.findByRole('button', { name: 'Delete' }))
    await waitFor(() =>
      expect(router.state.location.href).toBe('/practice/accompaniment?show=yours'),
    )
    expect(patternsStore.getState()).toMatchObject({ own: [], favourites: [] })
  })

  it.each([
    ['M1', '/practice/accompaniment'],
    ['r1', '/practice/accompaniment?show=seven-types'],
    ['ballad', '/practice/accompaniment?show=styles'],
  ])('goes back from %s, opened directly, to its page of Accompaniment', async (ref, page) => {
    const user = userEvent.setup()
    const { router } = await renderApp(`/practice/patterns/${ref}`)
    await user.click(await screen.findByRole('button', { name: 'Back' }))
    await waitFor(() => expect(router.state.location.href).toBe(page))
  })

  it('is not found once another tab deletes it, with the way back to Accompaniment', async () => {
    const { patternsStore } = await renderApp('/practice/patterns/my-1', { storage: withOwn() })
    await screen.findByRole('heading', { level: 1, name: 'Sunday' })
    act(() => deleteOwnPattern(patternsStore, 'my-1'))
    expect(await screen.findByRole('heading', { level: 1, name: /not found/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Go to Accompaniment' })).toHaveAttribute(
      'href',
      '/practice/accompaniment',
    )
  })

  it('is not found for a pattern the book does not hold', async () => {
    await renderApp('/practice/patterns/my-9')
    expect(await screen.findByRole('heading', { level: 1, name: /not found/i })).toBeInTheDocument()
  })
})
