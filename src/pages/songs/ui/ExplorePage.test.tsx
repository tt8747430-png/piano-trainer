import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'
import { createFakePublicLibrary } from '@/shared/api/public-library'

const MUSIC = {
  key: 'G',
  meter: '3/4',
  tempo: 80,
  pattern: 'r2',
  sections: [{ kind: 'verse', lines: ['Em D C G'] }],
}

interface Item {
  readonly title: string
  readonly tags?: readonly string[]
  readonly stars?: readonly number[]
}

/** Explore with what others published, each item its tags and ratings. */
const explore = (...items: readonly (string | Item)[]) =>
  createFakePublicLibrary({
    author: () => ({ id: 'bo', name: 'Bo' }),
    items: items.map((item, i) => {
      const { title, tags, stars } = typeof item === 'string' ? { title: item } : item
      return {
        id: `public-${i + 1}`,
        title,
        authorName: 'Bo',
        meta: { key: 'G', meter: '3/4', ...(tags ? { tags } : {}) },
        ...(stars ? { stars } : {}),
        body: { title, ...MUSIC },
      }
    }),
  })

/** Explore's list on a phone: one card of rows, each a link with its opening chord and its title. */
const listed = () => screen.findByRole('list', { name: 'Explore' })

const titlesIn = (list: HTMLElement) =>
  within(list)
    .getAllByRole('link')
    .map((row) => row.querySelector('.line-clamp-2')?.textContent)

afterEach(() => vi.restoreAllMocks())

describe('Explore', () => {
  it('lists the newest first, each with who shared it and its saves, and sorts by saves or rating', async () => {
    const user = userEvent.setup()
    const publicLibrary = explore('One', { title: 'Two', stars: [5, 4, 4] }, 'Three', {
      title: 'Four',
      stars: [5],
    })
    await publicLibrary.save('public-1')
    const { router } = await renderApp('/songs?view=explore', { publicLibrary })
    const list = await listed()
    expect(titlesIn(list)).toEqual(['Four', 'Three', 'Two', 'One'])
    expect(document.body).toHaveTextContent('4 songs')
    // Who shared it, named as their profile is public, and its saves said in words.
    const one = within(list).getByRole('link', { name: /One/ })
    expect(one).toHaveTextContent('Bo')
    expect(one).toHaveTextContent('1 save')
    // The order, one menu: Newest, Most saved, Top rated (three ratings or more ahead).
    await user.click(screen.getByRole('button', { name: 'Sort: Newest' }))
    await user.click(await screen.findByRole('menuitemradio', { name: 'Most saved' }))
    await waitFor(() => expect(router.state.location.search).toMatchObject({ shelf: 'saved' }))
    await waitFor(async () => expect(titlesIn(await listed())[0]).toBe('One'))
    await user.click(screen.getByRole('button', { name: 'Sort: Most saved' }))
    await user.click(await screen.findByRole('menuitemradio', { name: 'Top rated' }))
    await waitFor(async () => expect(titlesIn(await listed())[0]).toBe('Two'))
  })

  it('names an author whose profile is private a Piano Trainer learner', async () => {
    const publicLibrary = createFakePublicLibrary({
      items: [
        { id: 'p-1', title: 'Quiet', authorName: '', meta: {}, body: { title: 'Quiet', ...MUSIC } },
      ],
    })
    await renderApp('/songs?view=explore', { publicLibrary })
    expect(within(await listed()).getByRole('link', { name: /Quiet/ })).toHaveTextContent(
      'Piano Trainer learner',
    )
  })

  it('chips filter by tag', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/songs?view=explore', {
      publicLibrary: explore(
        { title: 'Minuet', tags: ['Classical'] },
        { title: 'Ballad', tags: ['Pop'] },
      ),
    })
    await listed()
    await user.click(screen.getByRole('radio', { name: 'Classical' }))
    await waitFor(() => expect(router.state.location.search).toMatchObject({ cat: 'classical' }))
    await waitFor(async () => expect(titlesIn(await listed())).toEqual(['Minuet']))
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

  it('offline says when online, and offers My songs, which are all here', async () => {
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false)
    const user = userEvent.setup()
    const { router } = await renderApp('/songs?view=explore', {
      publicLibrary: createFakePublicLibrary({ online: () => false }),
    })
    expect(await screen.findByText('You’re offline')).toBeVisible()
    expect(screen.queryByRole('button', { name: 'Try again' })).toBeNull()
    await user.click(screen.getByRole('button', { name: 'My songs' }))
    expect(router.state.location.search).not.toMatchObject({ view: 'explore' })
  })

  it('a search with no match offers Clear', async () => {
    const user = userEvent.setup()
    await renderApp('/songs?view=explore', { publicLibrary: explore('Morning', 'Evening') })
    await user.type(
      await screen.findByRole('searchbox', { name: 'Search songs and people' }),
      'zzz',
    )
    expect(await screen.findByText('No songs match “zzz”.')).toBeVisible()
    await user.click(screen.getByRole('button', { name: 'Clear' }))
    expect(titlesIn(await listed())).toEqual(['Evening', 'Morning'])
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
    await screen.findByRole('list', { name: 'Обзор' })
    expect(untranslated(document.body)).toEqual([])
  })
})
