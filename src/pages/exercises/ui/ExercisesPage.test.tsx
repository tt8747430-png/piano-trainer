import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'
import { recordExercised } from '@/features/record-practised'
import { stubMatchMedia } from '@/shared/test/match-media'

/** A source's fold on a phone, named by its source and its count. */
const fold = (name: string) => screen.findByRole('region', { name: new RegExp(`^${name}`) })

describe('Practice → an exercises shelf on a phone (R30-4)', () => {
  it('is titled by its shelf, its sources folded in their order', async () => {
    await renderApp('/practice/exercises')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Finger technique' }),
    ).toBeInTheDocument()
    const virtuoso = await fold('The Virtuoso Pianist')
    const fiveFinger = screen.getByRole('region', { name: /^Five-finger position/ })
    expect(
      virtuoso.compareDocumentPosition(fiveFinger) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
  })

  it('shelves the jazz vocabulary apart, Barry Harris before Piano With Jonny', async () => {
    await renderApp('/practice/exercises?book=jazz')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Jazz vocabulary' }),
    ).toBeInTheDocument()
    const harris = await fold('Barry Harris')
    const jonny = screen.getByRole('region', { name: /^Piano With Jonny/ })
    expect(harris.compareDocumentPosition(jonny) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(screen.queryByRole('link', { name: /Hanon/ })).not.toBeInTheDocument()
  })

  it('marks an exercise’s level, says what it trains and opens its page', async () => {
    await renderApp('/practice/exercises?book=jazz')
    const harris = await fold('Barry Harris')
    const row = within(harris).getByRole('link', { name: /Drop-2 7ths/ })
    expect(row).toHaveAttribute('href', '/practice/exercises/drop-two')
    expect(row).toHaveTextContent('The key’s 7th chords up and down')
    expect(row).toHaveTextContent('Level 4')
  })

  it('ticks an exercise played through today (A41)', async () => {
    const { progressStore } = await renderApp('/practice/exercises?book=jazz')
    const harris = await fold('Barry Harris')
    const row = within(harris).getByRole('link', { name: /Drop-2 7ths/ })
    expect(within(row).queryByText('Completed today')).not.toBeInTheDocument()
    act(() => recordExercised(progressStore, 'drop-two', new Date()))
    expect(within(row).getByText('Completed today')).toBeInTheDocument()
  })

  it('leaves a scale’s and a chord’s exercises to their own pages', async () => {
    await renderApp('/practice/exercises')
    await fold('The Virtuoso Pianist')
    for (const name of [/Scale /, /In 3rds/, /Arpeggio /])
      expect(screen.queryByRole('link', { name })).not.toBeInTheDocument()
  })

  it('makes an exercise a favourite from its heart, listed first under Favourites, and kept', async () => {
    const user = userEvent.setup()
    const { practiceLibraryStore } = await renderApp('/practice/exercises')
    await fold('The Virtuoso Pianist')
    expect(screen.queryByRole('region', { name: /^Favourites/ })).not.toBeInTheDocument()
    const hanon = screen.getByRole('link', { name: /Hanon/ }).closest('li')
    if (!hanon) throw new Error('Hanon’s row')
    await user.click(within(hanon).getByRole('button', { name: 'Add to Favourites' }))
    const favourites = await fold('Favourites')
    expect(within(favourites).getByRole('link', { name: /Hanon/ })).toBeInTheDocument()
    expect(screen.getAllByRole('region')[0]).toBe(favourites)
    expect(practiceLibraryStore.getState().favourites.exercises).toEqual(['hanon'])
  })

  it('makes a favourite from its More too', async () => {
    const user = userEvent.setup()
    const { practiceLibraryStore } = await renderApp('/practice/exercises')
    await user.click(await screen.findByRole('button', { name: 'More for Hanon' }))
    await user.click(await screen.findByRole('menuitem', { name: 'Add to Favourites' }))
    expect(await fold('Favourites')).toBeInTheDocument()
    expect(practiceLibraryStore.getState().favourites.exercises).toEqual(['hanon'])
  })

  it('searches, and says when nothing matches, with Clear search', async () => {
    const user = userEvent.setup()
    await renderApp('/practice/exercises?book=jazz&q=drop')
    await screen.findByRole('link', { name: /Drop-2 7ths/ })
    expect(screen.queryByRole('link', { name: /2-5-1 scale/ })).not.toBeInTheDocument()
    const search = screen.getByRole('searchbox', { name: 'Search exercises' })
    await user.clear(search)
    await user.type(search, 'zzz')
    expect(await screen.findByText('No exercises match “zzz”.')).toBeInTheDocument()
    // The empty state's own Clear search, beside the box's ×.
    await user.click(screen.getByText('Clear search', { selector: 'button' }))
    expect(await screen.findByRole('link', { name: /2-5-1 scale/ })).toBeInTheDocument()
  })

  it('keeps one level from Sort and filter, said as a chip that takes it off', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/exercises?book=jazz')
    await user.click(await screen.findByRole('button', { name: 'Sort and filter' }))
    await user.click(await screen.findByRole('button', { name: /^Beginner/ }))
    await waitFor(() => expect(router.state.location.search).toMatchObject({ stage: 'beginner' }))
    await user.click(screen.getByRole('button', { name: /^Show / }))
    await waitFor(() =>
      expect(screen.queryByRole('link', { name: /Drop-2 7ths/ })).not.toBeInTheDocument(),
    )
    expect(screen.getByRole('link', { name: /2-5-1 scale/ })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Remove Level: Beginner' }))
    expect(await screen.findByRole('link', { name: /Drop-2 7ths/ })).toBeInTheDocument()
  })

  it('sorts by name from Sort and filter', async () => {
    await renderApp('/practice/exercises?book=jazz&sort=name')
    const harris = await fold('Barry Harris')
    const names = within(harris)
      .getAllByRole('link')
      .map((link) => link.querySelector('.line-clamp-2, [class*="truncate"]')?.textContent ?? '')
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)))
  })

  it('reads in Russian, with nothing left in English', async () => {
    await renderApp('/practice/exercises', { locale: 'ru' })
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Техника пальцев' }),
    ).toBeInTheDocument()
    expect(untranslated(document.body)).toEqual([])
  })
})

describe('Practice → an exercises shelf on a laptop: the table (R30-4)', () => {
  it('shows a table of the shelf’s exercises under its place chips, All chosen', async () => {
    stubMatchMedia({ dark: true })
    await renderApp('/practice/exercises?book=jazz')
    const places = await screen.findByRole('radiogroup', { name: 'Show' })
    expect(within(places).getByRole('radio', { name: 'All' })).toBeChecked()
    const table = screen.getByRole('table', { name: 'The library' })
    expect(within(table).getAllByRole('rowheader')).toHaveLength(10)
    const [head] = within(table).getAllByRole('rowgroup')
    if (!head) throw new Error('the table’s head')
    expect(
      within(head)
        .getAllByRole('columnheader')
        .map((cell) => cell.textContent),
    ).toEqual(['Exercise', 'Focus', 'Level', 'Actions'])
  })

  it('opens one source, its rows alone, said as a chip that takes it off', async () => {
    const user = userEvent.setup()
    stubMatchMedia({ dark: true })
    const { router } = await renderApp('/practice/exercises?book=jazz&place=barryHarris')
    const table = await screen.findByRole('table')
    expect(within(table).getAllByRole('rowheader')).toHaveLength(5)
    await user.click(screen.getByRole('button', { name: 'Remove Barry Harris' }))
    await waitFor(() => expect(router.state.location.search).not.toHaveProperty('place'))
    expect(within(screen.getByRole('table')).getAllByRole('rowheader')).toHaveLength(10)
  })

  it('says Favourites is empty until one is made, with the way back to All', async () => {
    const user = userEvent.setup()
    stubMatchMedia({ dark: true })
    await renderApp('/practice/exercises?place=favourites')
    expect(await screen.findByText('No favourites yet')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'All exercises' }))
    expect(await screen.findByRole('table')).toBeInTheDocument()
  })

  it('sorts by level from Sort and filter, and back to the books’ order', async () => {
    const user = userEvent.setup()
    stubMatchMedia({ dark: true })
    const { router } = await renderApp('/practice/exercises?book=jazz')
    await user.click(await screen.findByRole('button', { name: 'Sort and filter' }))
    const sort = await screen.findByRole('region', { name: 'Sort by' })
    await user.click(within(sort).getByRole('button', { name: 'Level' }))
    await waitFor(() => expect(router.state.location.search).toMatchObject({ sort: 'level' }))
    // Each source's rows by level: Barry Harris's two Advanced before its three Professional.
    const levels = within(screen.getByRole('table'))
      .getAllByRole('rowheader')
      .slice(0, 5)
      .map((cell) => cell.closest('tr')?.textContent?.match(/Advanced|Professional/)?.[0])
    expect(levels).toEqual(['Advanced', 'Advanced', 'Professional', 'Professional', 'Professional'])
    await user.click(within(sort).getByRole('button', { name: 'Manual' }))
    await waitFor(() => expect(router.state.location.search).not.toHaveProperty('sort'))
  })
})
