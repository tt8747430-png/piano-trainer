import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'
import { createFakePublicLibrary, type PublicCategory } from '@/shared/api/public-library'

const MUSIC = {
  key: 'G',
  meter: '3/4',
  tempo: 80,
  pattern: 'r2',
  sections: [{ kind: 'verse', lines: ['Em D C G'] }],
}

interface Item {
  readonly title: string
  readonly category?: PublicCategory
  readonly stars?: readonly number[]
}

/** Explore with what others published, each item its category and ratings. */
const explore = (...items: readonly (string | Item)[]) =>
  createFakePublicLibrary({
    author: () => ({ id: 'bo', name: 'Bo' }),
    items: items.map((item, i) => {
      const { title, category, stars } = typeof item === 'string' ? { title: item } : item
      return {
        id: `public-${i + 1}`,
        title,
        authorName: 'Bo',
        meta: { key: 'G', meter: '3/4' },
        ...(category ? { category } : {}),
        ...(stars ? { stars } : {}),
        body: { title, ...MUSIC },
      }
    }),
  })

const titlesIn = (list: HTMLElement) =>
  within(list)
    .getAllByRole('link')
    .map((card) => within(card).getByText(/\w/, { selector: '.font-display' }).textContent)

afterEach(() => vi.restoreAllMocks())

describe('Explore', () => {
  it('shelves the newest, the most saved and the top rated, each a card with its author and stars', async () => {
    const publicLibrary = explore('One', { title: 'Two', stars: [5, 4, 4] }, 'Three', {
      title: 'Four',
      stars: [5],
    })
    await publicLibrary.save('public-1')
    await renderApp('/songs?view=explore', { publicLibrary })
    const newest = await screen.findByRole('region', { name: 'New' })
    expect(titlesIn(within(newest).getByRole('list'))).toEqual(['Four', 'Three', 'Two', 'One'])
    expect(
      titlesIn(within(screen.getByRole('region', { name: 'Most saved' })).getByRole('list')),
    ).toEqual(['One'])
    const rated = screen.getByRole('region', { name: 'Top rated' })
    const card = within(rated).getByRole('link', { name: /Two/ })
    // Its author named as their profile is public; the stars over three ratings, said in words.
    expect(card).toHaveTextContent('Bo')
    expect(card).toHaveTextContent('Rated 4.3 out of 5')
    // Under three ratings, no average.
    expect(within(newest).getByRole('link', { name: /Four/ })).not.toHaveTextContent('Rated')
  })

  it('names an author whose profile is private a Piano Trainer learner', async () => {
    const publicLibrary = createFakePublicLibrary({
      items: [
        { id: 'p-1', title: 'Quiet', authorName: '', meta: {}, body: { title: 'Quiet', ...MUSIC } },
      ],
    })
    await renderApp('/songs?view=explore', { publicLibrary })
    const newest = await screen.findByRole('region', { name: 'New' })
    expect(within(newest).getByRole('link', { name: /Quiet/ })).toHaveTextContent(
      'Piano Trainer learner',
    )
  })

  it('chips filter by category', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/songs?view=explore', {
      publicLibrary: explore(
        { title: 'Minuet', category: 'classical' },
        { title: 'Ballad', category: 'pop' },
      ),
    })
    await screen.findByRole('region', { name: 'New' })
    await user.click(screen.getByRole('radio', { name: 'Classical' }))
    await waitFor(() => expect(router.state.location.search).toMatchObject({ cat: 'classical' }))
    await waitFor(() =>
      expect(
        titlesIn(within(screen.getByRole('region', { name: 'New' })).getByRole('list')),
      ).toEqual(['Minuet']),
    )
  })

  it('Patterns shows patterns', async () => {
    const user = userEvent.setup()
    const publicLibrary = createFakePublicLibrary({
      items: [
        {
          id: 's-1',
          title: 'A song',
          authorName: 'Bo',
          meta: {},
          body: { title: 'A song', ...MUSIC },
        },
        {
          id: 'p-1',
          kind: 'pattern',
          title: 'Waltz of mine',
          authorName: 'Bo',
          meta: { rh: 'b1', lh: 'r' },
          body: { name: 'Waltz of mine', rh: 'b1', lh: 'r' },
        },
      ],
    })
    await renderApp('/songs?view=explore', { publicLibrary })
    await screen.findByRole('link', { name: /A song/ })
    await user.click(screen.getByRole('radio', { name: 'Patterns' }))
    expect(await screen.findByRole('link', { name: /Waltz of mine/ })).toBeVisible()
    await waitFor(() => expect(screen.queryByRole('link', { name: /A song/ })).toBeNull())
  })

  it('See all opens the shelf, a grid in its order, and the way back to the shelves', async () => {
    const user = userEvent.setup()
    const publicLibrary = explore('Quiet', 'Loved')
    await publicLibrary.save('public-1')
    const { router } = await renderApp('/songs?view=explore', { publicLibrary })
    const saved = await screen.findByRole('region', { name: 'Most saved' })
    const before = router.history.length
    await user.click(within(saved).getByRole('button', { name: 'See all' }))
    await waitFor(() => expect(router.state.location.search).toMatchObject({ shelf: 'saved' }))
    expect(router.history.length).toBe(before)
    const grid = await screen.findByRole('list', { name: 'Explore' })
    expect(titlesIn(grid)).toEqual(['Quiet', 'Loved'])
    expect(screen.getByRole('combobox', { name: /^Sort/ })).toHaveTextContent('Most saved')
    await user.click(screen.getByRole('button', { name: 'All shelves' }))
    expect(await screen.findByRole('region', { name: 'New' })).toBeVisible()
  })

  it('offline says when online', async () => {
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false)
    await renderApp('/songs?view=explore', {
      publicLibrary: createFakePublicLibrary({ online: () => false }),
    })
    expect(await screen.findByText('Explore is available when online.')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Try again' })).toBeVisible()
  })

  it('a search with no match offers Clear', async () => {
    const user = userEvent.setup()
    await renderApp('/songs?view=explore', { publicLibrary: explore('Morning', 'Evening') })
    await user.type(
      await screen.findByRole('searchbox', { name: 'Search songs and patterns' }),
      'zzz',
    )
    expect(await screen.findByText('No songs match “zzz”.')).toBeVisible()
    await user.click(screen.getByRole('button', { name: 'Clear' }))
    expect(await screen.findByRole('region', { name: 'New' })).toBeVisible()
  })

  it('shows grey cards while asked, and says when nothing is published yet', async () => {
    const waiting = createFakePublicLibrary()
    const { unmount } = await renderApp('/songs?view=explore', {
      publicLibrary: { ...waiting, browse: () => new Promise(() => {}) },
    })
    expect(await screen.findByRole('status')).toHaveTextContent('Loading Explore…')
    unmount()
    await renderApp('/songs?view=explore', { publicLibrary: createFakePublicLibrary() })
    expect(await screen.findByText('Nothing published yet.')).toBeVisible()
  })

  it('reads in Russian', async () => {
    await renderApp('/songs?view=explore', { locale: 'ru', publicLibrary: explore('Morning') })
    await screen.findByRole('region', { name: 'Новое' })
    expect(untranslated(document.body)).toEqual([])
  })
})
