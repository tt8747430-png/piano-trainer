import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'
import { recordExercised } from '@/features/record-practised'
import { stubMatchMedia } from '@/shared/test/match-media'

describe('Practice → Exercises, the library on a phone (R30-4)', () => {
  it('lists the drills of no other page by book, technique first', async () => {
    await renderApp('/practice/exercises')
    expect(await screen.findByRole('heading', { level: 1, name: 'Exercises' })).toBeInTheDocument()
    expect(
      screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent),
    ).toEqual(['Finger technique', 'Barry Harris', 'Piano With Jonny'])
  })

  it('marks an exercise’s level, says what it trains and opens its page', async () => {
    await renderApp('/practice/exercises')
    const harris = await screen.findByRole('region', { name: 'Barry Harris' })
    const row = within(harris).getByRole('link', { name: /^Drop-2 7ths \S/ })
    expect(row).toHaveAttribute('href', '/practice/exercises/drop-two')
    expect(within(row).getByRole('img', { name: 'Professional' })).toBeInTheDocument()
  })

  it('ticks an exercise played through today (A41)', async () => {
    const { progressStore } = await renderApp('/practice/exercises')
    const harris = await screen.findByRole('region', { name: 'Barry Harris' })
    const row = within(harris).getByRole('link', { name: /^Drop-2 7ths \S/ })
    expect(within(row).queryByText('Completed today')).not.toBeInTheDocument()
    act(() => recordExercised(progressStore, 'drop-two', new Date()))
    expect(within(row).getByText('Completed today')).toBeInTheDocument()
  })

  it('leaves a scale’s and a chord’s exercises to their own pages', async () => {
    await renderApp('/practice/exercises')
    await screen.findByRole('region', { name: 'Finger technique' })
    for (const name of [/^Scale /, /^In 3rds /, /^Arpeggio /])
      expect(screen.queryByRole('link', { name })).not.toBeInTheDocument()
  })

  it('makes an exercise a favourite from its More, listed first under Favourites, and kept', async () => {
    const user = userEvent.setup()
    const { practiceLibraryStore } = await renderApp('/practice/exercises')
    expect(screen.queryByRole('region', { name: 'Favourites' })).not.toBeInTheDocument()
    await user.click(await screen.findByRole('button', { name: 'More for Hanon' }))
    await user.click(await screen.findByRole('menuitem', { name: 'Add to favourites' }))
    const favourites = await screen.findByRole('region', { name: 'Favourites' })
    expect(within(favourites).getByRole('link', { name: /^Hanon / })).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 2 })[0]).toHaveTextContent('Favourites')
    expect(practiceLibraryStore.getState().favourites.exercises).toEqual(['hanon'])
  })

  it('searches, and says when nothing matches, with Clear', async () => {
    const user = userEvent.setup()
    await renderApp('/practice/exercises?q=drop')
    await screen.findByRole('link', { name: /^Drop-2 7ths / })
    expect(screen.queryByRole('link', { name: /^Hanon / })).not.toBeInTheDocument()
    await user.clear(screen.getByRole('searchbox', { name: 'Search exercises' }))
    await user.type(screen.getByRole('searchbox', { name: 'Search exercises' }), 'zzz')
    expect(await screen.findByText('No exercises match “zzz”.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Clear' }))
    expect(await screen.findByRole('link', { name: /^Hanon / })).toBeInTheDocument()
  })

  it('keeps one level from its Filter, said as a chip that takes it off', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/exercises')
    await user.click(await screen.findByRole('button', { name: 'Filters' }))
    await user.click(await screen.findByRole('button', { name: 'Beginner' }))
    await waitFor(() => expect(router.state.location.search).toMatchObject({ stage: 'beginner' }))
    await user.click(screen.getByRole('button', { name: /^Show / }))
    await waitFor(() =>
      expect(screen.queryByRole('link', { name: /^Drop-2 7ths / })).not.toBeInTheDocument(),
    )
    expect(screen.getByRole('link', { name: /^Five-finger position / })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Remove Level: Beginner' }))
    expect(await screen.findByRole('link', { name: /^Drop-2 7ths / })).toBeInTheDocument()
  })

  it('sorts by name from the sort joined to its search', async () => {
    await renderApp('/practice/exercises?sort=name')
    const harris = await screen.findByRole('region', { name: 'Barry Harris' })
    const names = within(harris)
      .getAllByRole('link')
      .map((link) => link.querySelector('.line-clamp-2')?.textContent)
    expect(names).toEqual([...names].sort((a, b) => (a ?? '').localeCompare(b ?? '')))
  })

  it('reads in Russian, with nothing left in English', async () => {
    await renderApp('/practice/exercises', { locale: 'ru' })
    expect(await screen.findByRole('region', { name: 'Техника пальцев' })).toBeInTheDocument()
    expect(untranslated(document.body)).toEqual([])
  })
})

describe('Practice → Exercises on a laptop: the tree and the table (R30-4)', () => {
  it('shows the tree of its books beside a table of every exercise, All current', async () => {
    stubMatchMedia({ dark: true })
    await renderApp('/practice/exercises')
    const tree = await screen.findByRole('navigation', { name: 'Exercises by book' })
    expect(within(tree).getByRole('button', { name: /^All\s*\d+$/ })).toHaveAttribute(
      'aria-current',
      'page',
    )
    // A place of none shows no count.
    expect(within(tree).getByRole('button', { name: 'Favourites' })).toBeInTheDocument()
    const table = screen.getByRole('table', { name: 'The library' })
    expect(within(table).getAllByRole('rowheader').length).toBeGreaterThan(10)
    expect(
      within(table)
        .getAllByRole('columnheader')
        .map((cell) => cell.textContent),
    ).toEqual(['Name', 'Book', 'Level', 'Actions'])
  })

  it('opens a book from the tree, its rows alone', async () => {
    const user = userEvent.setup()
    stubMatchMedia({ dark: true })
    const { router } = await renderApp('/practice/exercises')
    const tree = await screen.findByRole('navigation', { name: 'Exercises by book' })
    await user.click(within(tree).getByRole('button', { name: /^Barry Harris/ }))
    await waitFor(() =>
      expect(router.state.location.search).toMatchObject({ place: 'barryHarris' }),
    )
    expect(within(screen.getByRole('table')).getAllByRole('rowheader')).toHaveLength(5)
  })

  it('says Favourites is empty until one is made, with the way back to All', async () => {
    const user = userEvent.setup()
    stubMatchMedia({ dark: true })
    await renderApp('/practice/exercises?place=favourites')
    expect(await screen.findByText('No favourites yet')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'All exercises' }))
    expect(await screen.findByRole('table')).toBeInTheDocument()
  })

  it('sorts by a column’s heading, and back to the books’ order', async () => {
    const user = userEvent.setup()
    stubMatchMedia({ dark: true })
    const { router } = await renderApp('/practice/exercises')
    await user.click(await screen.findByRole('button', { name: 'Level' }))
    await waitFor(() => expect(router.state.location.search).toMatchObject({ sort: 'level' }))
    const first = within(screen.getByRole('table')).getAllByRole('rowheader')[0]
    expect(first?.closest('tr')).toContainElement(
      screen.getAllByRole('img', { name: 'Beginner' })[0] ?? null,
    )
    await user.click(screen.getByRole('button', { name: 'Level' }))
    await waitFor(() => expect(router.state.location.search).not.toHaveProperty('sort'))
  })
})
