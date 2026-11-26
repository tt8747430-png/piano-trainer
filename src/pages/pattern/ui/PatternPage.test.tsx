import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { PATTERNS_STORAGE_KEY } from '@/entities/pattern'
import { deleteOwnPattern } from '@/features/manage-patterns'
import { createFakeAuth } from '@/shared/api/auth'
import { createFakePublicLibrary } from '@/shared/api/public-library'
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
  it('explains it: its name and book, its idea under its bar, where to practise it and where it is used', async () => {
    await renderApp('/practice/accompaniment/patterns/M1')
    expect(
      await screen.findByRole('heading', { level: 2, name: '1 · Bass + chords' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: 'Pattern' })).toBeInTheDocument()
    expect(screen.getByText('Called to Play')).toBeInTheDocument()
    expect(
      screen.getByText(
        'The right hand plays the chord on every beat over an octave held in the left.',
      ),
    ).toBeInTheDocument()
    // Round and round in C, then through the keys.
    expect(
      screen.getByRole('heading', { level: 3, name: 'Practise in the Player' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /^Chromatically, rising/ })).toHaveAttribute(
      'href',
      '/play/progression?pattern=M1&walk=semitones-up',
    )
    const used = screen.getByRole('heading', { level: 3, name: 'Used in' }).closest('section')
    expect(
      within(used ?? document.body).getByRole('link', { name: /^How Great Thou Art/ }),
    ).toHaveAttribute('href', '/songs/hgta')
  })

  it('plays over a bar of C major, or a song it is used in, from Play over', async () => {
    const user = userEvent.setup()
    await renderApp('/practice/accompaniment/patterns/M1')
    await user.click(await screen.findByRole('button', { name: 'Play over' }))
    const overs = await screen.findAllByRole('menuitemcheckbox')
    expect(overs.map((each) => each.textContent)).toEqual([
      'A bar of C major',
      'How Great Thou Art',
      'The Name of Jesus Is So Sweet',
      'What a Friend We Have in Jesus',
      'All Glory to God in This World',
    ])
    expect(screen.getByRole('menuitemcheckbox', { name: 'A bar of C major' })).toBeChecked()
  })

  it('plays its bar of C on the keys, and stops', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/practice/accompaniment/patterns/M1')
    await user.click(await screen.findByRole('button', { name: 'Play' }))
    expect(audio.played).toHaveLength(1)
    expect(screen.getByRole('button', { name: 'Stop' })).toBeInTheDocument()
  })

  it('plays a tune pattern over a song with a tune, and opens it there in the Player', async () => {
    await renderApp('/practice/accompaniment/patterns/r5')
    const practise = (
      await screen.findByRole('heading', { level: 3, name: 'Practise in the Player' })
    ).closest('section')
    // Its song's row, which plays the tune with the pattern under it.
    expect(within(practise ?? document.body).getByRole('link')).toHaveAttribute(
      'href',
      '/play/posylaet?pattern=r5',
    )
  })

  it('stars it, hides it from the Player and shows it again', async () => {
    const user = userEvent.setup()
    const { patternsStore } = await renderApp('/practice/accompaniment/patterns/ballad')
    const star = await screen.findByRole('button', { name: 'Favourite' })
    await user.click(star)
    expect(star).toHaveAttribute('aria-pressed', 'true')
    expect(patternsStore.getState().favourites).toEqual(['ballad'])
    await user.click(screen.getByRole('button', { name: 'More' }))
    await user.click(await screen.findByRole('menuitem', { name: 'Hide from the Player' }))
    expect(patternsStore.getState().hidden).toEqual(['ballad'])
    expect(
      screen.getByText(
        'Hidden from the Player’s list and from its book. You can still find it under Hidden.',
      ),
    ).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'More' }))
    await user.click(await screen.findByRole('menuitem', { name: 'Show in the Player' }))
    expect(patternsStore.getState().hidden).toEqual([])
  })

  it('opens the progression Player with it', async () => {
    await renderApp('/practice/accompaniment/patterns/ballad')
    expect(await screen.findByRole('link', { name: /^In C major/ })).toHaveAttribute(
      'href',
      '/play/progression?pattern=ballad',
    )
  })

  it('shows the learner’s own, with Edit, Publish and Delete in More, deleted at once with Undo', async () => {
    const user = userEvent.setup()
    const { router, patternsStore } = await renderApp('/practice/accompaniment/patterns/my-1', {
      storage: withOwn(),
    })
    expect(await screen.findByRole('heading', { level: 2, name: 'Sunday' })).toBeInTheDocument()
    expect(screen.getByText('Your pattern')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'More' }))
    const more = await screen.findByRole('menu', { name: 'More' })
    expect(
      within(more)
        .getAllByRole('menuitem')
        .map((action) => action.textContent),
    ).toEqual(['Edit', 'Publish…', 'Delete'])
    await user.click(within(more).getByRole('menuitem', { name: 'Delete' }))
    await waitFor(() =>
      expect(router.state.location.href).toBe('/practice/accompaniment?place=mine'),
    )
    expect(patternsStore.getState()).toMatchObject({ own: [], favourites: [] })
    expect(await screen.findByText('“Sunday” deleted')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Undo' }))
    expect(patternsStore.getState().own).toHaveLength(1)
  })

  it.each([
    ['M1', '/practice/accompaniment?place=called-to-play'],
    ['r1', '/practice/accompaniment?place=seven-types'],
    ['ballad', '/practice/accompaniment?place=styles'],
  ])('goes back from %s, opened directly, to its page of Accompaniment', async (ref, page) => {
    const user = userEvent.setup()
    const { router } = await renderApp(`/practice/accompaniment/patterns/${ref}`)
    await user.click(await screen.findByRole('button', { name: 'Back' }))
    await waitFor(() => expect(router.state.location.href).toBe(page))
  })

  it('goes back from a hidden pattern, opened directly, to Hidden, which lists it', async () => {
    const user = userEvent.setup()
    const storage = createMemoryStorage()
    storage.setItem(
      PATTERNS_STORAGE_KEY,
      JSON.stringify({
        state: { favourites: [], hidden: ['ballad'], own: [], nextOwn: 1 },
        version: 1,
      }),
    )
    const { router } = await renderApp('/practice/accompaniment/patterns/ballad', { storage })
    await user.click(await screen.findByRole('button', { name: 'Back' }))
    await waitFor(() =>
      expect(router.state.location.href).toBe('/practice/accompaniment?place=hidden'),
    )
  })

  it('is not found once another tab deletes it, with the way back to Accompaniment', async () => {
    const { patternsStore } = await renderApp('/practice/accompaniment/patterns/my-1', {
      storage: withOwn(),
    })
    await screen.findByRole('heading', { level: 2, name: 'Sunday' })
    act(() => deleteOwnPattern(patternsStore, 'my-1'))
    expect(await screen.findByRole('heading', { level: 1, name: /not found/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Go to Accompaniment' })).toHaveAttribute(
      'href',
      '/practice/accompaniment',
    )
  })

  it('is not found for a pattern the book does not hold', async () => {
    await renderApp('/practice/accompaniment/patterns/my-9')
    expect(await screen.findByRole('heading', { level: 1, name: /not found/i })).toBeInTheDocument()
  })
})

describe('a pattern of the learner’s own in the Public library (ADR 0116)', () => {
  it('is published from its own page, as a song is, its figures with it; then unpublished', async () => {
    const user = userEvent.setup()
    const account = { email: 'ana@example.com', name: 'Ana', password: 'correct horse' }
    const auth = createFakeAuth({ accounts: [account] })
    await auth.signIn(account.email, account.password)
    const publicLibrary = createFakePublicLibrary({ author: () => ({ id: 'ana', name: 'Ana' }) })
    const { router } = await renderApp('/practice/accompaniment/patterns/my-1', {
      storage: withOwn(),
      auth,
      publicLibrary,
    })
    await user.click(await screen.findByRole('button', { name: 'More' }))
    await user.click(await screen.findByRole('menuitem', { name: 'Publish…' }))
    // A window over the pattern, with no address of its own.
    const window = await screen.findByRole('dialog', { name: 'Publish' })
    expect(router.state.location.pathname).toBe('/practice/accompaniment/patterns/my-1')
    await user.type(
      within(window).getByRole('textbox', { name: 'Description' }),
      'A walking bass under jazz chords',
    )
    await user.click(within(window).getByRole('checkbox', { name: /I confirm/ }))
    await user.click(within(window).getByRole('button', { name: 'Publish' }))
    expect(await screen.findByText('Published to the Public library.')).toBeInTheDocument()
    const listed = await publicLibrary.browse({ kind: 'pattern', sort: 'new', query: '' })
    expect(listed).toMatchObject({
      ok: true,
      value: [
        {
          kind: 'pattern',
          title: 'Sunday',
          meta: { rh: 'jaz', lh: 'walk', description: 'A walking bass under jazz chords' },
        },
      ],
    })
    await user.click(await screen.findByRole('button', { name: 'Unpublish' }))
    const asked = await screen.findByRole('alertdialog', { name: 'Unpublish it?' })
    await user.click(within(asked).getByRole('button', { name: 'Unpublish' }))
    await waitFor(async () =>
      expect(await publicLibrary.browse({ kind: 'pattern', sort: 'new', query: '' })).toEqual({
        ok: true,
        value: [],
      }),
    )
  })
})
