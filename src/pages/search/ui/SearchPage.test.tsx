import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { LIBRARY_STORAGE_KEY, LIBRARY_VERSION } from '@/entities/library'
import { createMemoryStorage } from '@/shared/lib'
import { untranslated } from '@/app/testing/untranslated'

const headings = () =>
  within(screen.getByRole('main'))
    .getAllByRole('heading', { level: 2 })
    .map((heading) => heading.textContent)

/** The link of a group's row that starts with a name, and where it leads. */
const hrefOf = (group: string, name: RegExp) =>
  within(screen.getByRole('region', { name: group }))
    .getByRole('link', { name })
    .getAttribute('href')

describe('Search', () => {
  it('is the whole index with no query: every kind of thing under its heading', async () => {
    await renderApp('/search')
    expect(await screen.findByRole('heading', { level: 1, name: 'Search' })).toBeInTheDocument()
    expect(headings()).toEqual([
      'Practice',
      'Songs',
      // The collections, folders of the library from the start (ADR 0106).
      'Folders',
      'Lessons',
      'Courses',
      'Chords',
      'Scales',
      'Progressions',
      'Patterns',
      'Exercises',
      'Quiz',
    ])
  })

  it('shows a group’s first eight, the nearest, and the rest on Show all', async () => {
    const user = userEvent.setup()
    await renderApp('/search?q=C')
    const songs = await screen.findByRole('region', { name: 'Songs' })
    expect(within(songs).getAllByRole('link')).toHaveLength(8)
    const all = within(songs).getByRole('button', { name: /^Show all \d+$/ })
    const count = Number(all.textContent?.match(/\d+/)?.[0])
    await user.click(all)
    expect(within(songs).getAllByRole('link')).toHaveLength(count)
    expect(within(songs).queryByRole('button', { name: /^Show all/ })).not.toBeInTheDocument()
    // The chord typed leads: C itself, before anything only holding a C.
    expect(headings()[0]).toBe('Chords')
  })

  it('opens each kind of thing where it lives', async () => {
    const user = userEvent.setup()
    await renderApp('/search')
    await screen.findByRole('heading', { level: 1, name: 'Search' })
    for (const more of screen.getAllByRole('button', { name: /^Show all/ })) await user.click(more)
    expect(hrefOf('Practice', /^Chord finder/)).toBe('/practice/chord-finder')
    expect(hrefOf('Songs', /^Still, my soul, be still/)).toBe('/songs/bz5')
    expect(hrefOf('Lessons', /^How to read chord symbols/)).toBe('/lessons/reading-chord-symbols')
    expect(hrefOf('Courses', /^Introduction to the Piano/)).toBe(
      '/courses/introduction-to-the-piano',
    )
    expect(hrefOf('Courses', /^Chord pulse/)).toBe('/courses/gorshkov/chord-pulse')
    expect(hrefOf('Chords', /^Minor 7th/)).toMatch(/^\/practice\/chords\?/)
    expect(hrefOf('Scales', /^Dorian/)).toBe('/practice/scales?kind=dorian')
    expect(hrefOf('Progressions', /^Let It Be/)).toBe('/practice/progressions?p=I-V-vi-IV-I-V-IV-I')
    expect(hrefOf('Patterns', /^1 · Bass \+ chords/)).toBe('/practice/accompaniment/patterns/M1')
    expect(hrefOf('Exercises', /^Hanon/)).toBe('/play/exercise/hanon')
    expect(hrefOf('Quiz', /^Scale building/)).toBe('/practice/quiz/build-scale')
  })

  it('opens a trainer and an exercise as they were left, like their own pages’ rows', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/quiz/reading-notes?level=treble')
    await screen.findByRole('heading', { level: 1, name: 'Note reading' })
    await act(() => router.navigate({ to: '/search', search: { q: 'note reading' } }))
    await user.click(await screen.findByRole('link', { name: /^Note reading/ }))
    expect(router.state.location.pathname).toBe('/practice/quiz/reading-notes')
    expect(router.state.location.search).toEqual({ level: 'treble' })
  })

  it('finds what is typed, by kind, and keeps it in the URL', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/search')
    await user.type(await screen.findByRole('searchbox', { name: 'Search' }), 'dorian')
    await waitFor(() => expect(router.state.location.search).toEqual({ q: 'dorian' }))
    await waitFor(() => expect(headings()).toEqual(['Scales']))
    expect(hrefOf('Scales', /^Dorian/)).toBe('/practice/scales?kind=dorian')
  })

  it('reads a chord symbol typed as the chord, and leads with it, printed as the sheets print it', async () => {
    await renderApp('/search?q=F%23m7b5')
    const chords = await screen.findByRole('region', { name: 'Chords' })
    const [first] = within(chords).getAllByRole('link')
    expect(first).toHaveTextContent('F♯m7♭5')
    expect(first).toHaveTextContent('Half-diminished 7th')
    expect(first?.getAttribute('href')).toMatch(/^\/practice\/chords\?root=F%23&/)
    expect(headings()[0]).toBe('Chords')
  })

  it('finds a chord by its symbol typed in ASCII, and prints the one found', async () => {
    await renderApp('/search?q=C7%239')
    const chords = await screen.findByRole('region', { name: 'Chords' })
    expect(within(chords).getByRole('link', { name: /^7th sharp 9 C7♯9/ })).toBeInTheDocument()
  })

  it('prints a line of chords typed as the sheets print it', async () => {
    await renderApp('/search?q=C%23m+F%23m+B7+E')
    const progressions = await screen.findByRole('region', { name: 'Progressions' })
    const [first] = within(progressions).getAllByRole('link')
    expect(first).toHaveTextContent('C♯m F♯m B7 E')
  })

  it('reads a line of chords typed as a song’s, and leads with it on Progressions', async () => {
    await renderApp('/search?q=Dm7+Gm9+Asus4+Dm7')
    const progressions = await screen.findByRole('region', { name: 'Progressions' })
    const [first] = within(progressions).getAllByRole('link')
    expect(first).toHaveTextContent('Dm7 Gm9 Asus4 Dm7')
    expect(first).toHaveTextContent('Progressions · D minor')
    expect(first?.getAttribute('href')).toBe('/practice/progressions?key=Dm&p=i7-iv9-Vsus4-i7')
    expect(headings()[0]).toBe('Progressions')
  })

  it('finds a lesson by its title in the other language', async () => {
    await renderApp('/search?q=Трезвучия')
    const lessons = await screen.findByRole('region', { name: 'Lessons' })
    expect(within(lessons).getByRole('link', { name: /^Triads/ })).toBeInTheDocument()
  })

  it('says so when nothing is found', async () => {
    await renderApp('/search?q=zzzz')
    expect(await screen.findByText('Nothing found.')).toBeInTheDocument()
    expect(within(screen.getByRole('main')).queryByRole('heading', { level: 2 })).toBeNull()
  })

  it('is reached from the sidebar and from the Path’s bar', async () => {
    await renderApp('/')
    const nav = await screen.findByRole('navigation', { name: 'Main navigation' })
    expect(within(nav).getByRole('link', { name: 'Search' })).toHaveAttribute('href', '/search')
    expect(within(screen.getByRole('main')).getByRole('link', { name: 'Search' })).toHaveAttribute(
      'href',
      '/search',
    )
  })

  it('opens from anywhere on the platform’s modifier with K', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/songs')
    await screen.findByRole('heading', { level: 1, name: 'Songs' })
    await user.keyboard('{Control>}k{/Control}')
    await waitFor(() => expect(router.state.location.pathname).toBe('/search'))
  })

  it('finds a folder of the library by its name, its songs counted, opening its page (ADR 0106)', async () => {
    const storage = createMemoryStorage()
    storage.setItem(
      LIBRARY_STORAGE_KEY,
      JSON.stringify({
        state: {
          folders: [
            {
              id: 'folder-1',
              name: 'Sunday service',
              picture: 'church',
              paint: 'grass',
              songs: ['bz5', 'silent'],
            },
          ],
        },
        version: LIBRARY_VERSION,
      }),
    )
    await renderApp('/search?q=sunday', { storage })
    const folders = await screen.findByRole('region', { name: 'Folders' })
    const row = within(folders).getByRole('link', { name: /Sunday service/ })
    expect(row).toHaveAttribute('href', '/songs/folders/folder-1')
    expect(row).toHaveTextContent('2 songs')
  })

  it('says a song the learner archived is archived, its row still opening its page', async () => {
    const storage = createMemoryStorage()
    storage.setItem(
      LIBRARY_STORAGE_KEY,
      JSON.stringify({
        state: {
          archive: [{ kind: 'song', id: 'bz5', from: { folder: 'bozhe-spasibo', index: 4 } }],
        },
        version: LIBRARY_VERSION,
      }),
    )
    await renderApp('/search?q=still my soul', { storage })
    const songs = await screen.findByRole('region', { name: 'Songs' })
    const row = within(songs).getByRole('link', { name: /Still, my soul/ })
    expect(row).toHaveAttribute('href', '/songs/bz5')
    expect(row).toHaveTextContent('Archived')
  })

  it('reads in Russian, with nothing left in English', async () => {
    await renderApp('/search?q=дорийск', { locale: 'ru' })
    expect(await screen.findByRole('heading', { level: 1, name: 'Поиск' })).toBeInTheDocument()
    expect(await screen.findByRole('region', { name: 'Гаммы' })).toBeInTheDocument()
    expect(untranslated(document.body)).toEqual([])
  })
})
