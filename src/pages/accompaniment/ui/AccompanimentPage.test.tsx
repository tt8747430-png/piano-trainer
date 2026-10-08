import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'
import { PATTERNS_STORAGE_KEY } from '@/entities/pattern'
import { createMemoryStorage } from '@/shared/lib'

const saved = (state: object) => {
  const storage = createMemoryStorage()
  storage.setItem(
    PATTERNS_STORAGE_KEY,
    JSON.stringify({
      state: { favourites: [], hidden: [], own: [], nextOwn: 1, ...state },
      version: 1,
    }),
  )
  return storage
}
const tabs = () =>
  within(screen.getByRole('navigation', { name: 'Accompaniment' })).getAllByRole('link')
const shelf = (name: string) => screen.getByRole('region', { name })
const shelves = () => screen.getAllByRole('heading', { level: 2 }).map((each) => each.textContent)
const rows = (name: string) =>
  within(shelf(name))
    .getAllByRole('link')
    .map((link) => link.getAttribute('href'))

describe('Practice → Accompaniment', () => {
  it('opens from Practice on Called to Play: its ways, its techniques and its studies', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice')
    await user.click(await screen.findByRole('link', { name: /^Accompaniment / }))
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Accompaniment' }),
    ).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/practice/accompaniment')
    expect(tabs().map((tab) => [tab.textContent, tab.getAttribute('aria-current')])).toEqual([
      ['Called to Play', 'page'],
      ['Боброва', null],
      ['Styles', null],
      ['Yours', null],
    ])
    expect(shelves()).toEqual(['The 5 ways (lesson 3)', 'Right-hand techniques', 'Studies'])
    expect(
      within(shelf('The 5 ways (lesson 3)')).getByRole('link', {
        name: /^1 · Bass \+ chords The chord on every beat over a held octave bass\.$/,
      }),
    ).toHaveAttribute('href', '/practice/patterns/M1')
    expect(rows('Studies')).toEqual(
      ['ex3', 'exm1', 'exm2', 'exm3', 'ex5', 'ex6', 'ex7', 'ex8', 'ex9'].map(
        (id) => `/practice/studies/${id}`,
      ),
    )
  })

  it('lists on Боброва her seven types and the hymns they are practised on, each on Songs', async () => {
    await renderApp('/practice/accompaniment?show=seven-types')
    await screen.findByRole('heading', { level: 1, name: 'Accompaniment' })
    expect(screen.getByRole('link', { name: 'Боброва' })).toHaveAttribute('aria-current', 'page')
    expect(shelves()).toEqual(['The 7 types of accompaniment', 'Hymns'])
    expect(rows('The 7 types of accompaniment')).toHaveLength(8)
    expect(rows('Hymns')).toEqual(['/songs/otche', '/songs/ode', '/songs/silent', '/songs/amazing'])
  })

  it('lists the rhythm styles on Styles, each pattern with its idea', async () => {
    await renderApp('/practice/accompaniment?show=styles')
    await screen.findByRole('heading', { level: 1, name: 'Accompaniment' })
    expect(shelves()).toEqual(['Rhythm styles'])
    expect(
      within(shelf('Rhythm styles')).getByRole('link', {
        name: /^Ballad arpeggio A gentle arpeggio over the root and 5th\.$/,
      }),
    ).toHaveAttribute('href', '/practice/patterns/ballad')
  })

  it('lists on Yours what the learner starred, made and hid, and leaves the hidden out of its group', async () => {
    const user = userEvent.setup()
    await renderApp('/practice/accompaniment?show=yours', {
      storage: saved({
        favourites: ['ballad'],
        hidden: ['funk'],
        own: [{ id: 'my-1', name: 'Sunday', rh: 'jaz', lh: 'walk' }],
        nextOwn: 2,
      }),
    })
    await screen.findByRole('heading', { level: 1, name: 'Accompaniment' })
    expect(shelves()).toEqual(['Favourites', 'Your patterns', 'Hidden'])
    expect(rows('Favourites')).toEqual(['/practice/patterns/ballad'])
    expect(within(shelf('Your patterns')).getByRole('link', { name: /^Sunday/ })).toHaveAttribute(
      'href',
      '/practice/patterns/my-1',
    )
    expect(within(shelf('Hidden')).getByRole('link', { name: /^Funk/ })).toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: 'Styles' }))
    const styles = await screen.findByRole('region', { name: 'Rhythm styles' })
    expect(within(styles).getByRole('link', { name: /^Ballad arpeggio/ })).toBeInTheDocument()
    expect(within(styles).queryByRole('link', { name: /^Funk/ })).toBeNull()
  })

  it('says on Yours what is kept there, before the learner keeps anything', async () => {
    await renderApp('/practice/accompaniment?show=yours')
    await screen.findByRole('heading', { level: 1, name: 'Accompaniment' })
    expect(screen.getByText('Patterns you star, make or hide are kept here.')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument()
  })

  it('changes page from a tab, without a new step of history', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/accompaniment')
    await screen.findByRole('heading', { level: 1, name: 'Accompaniment' })
    const before = router.history.length
    await user.click(screen.getByRole('link', { name: 'Боброва' }))
    expect(await screen.findByRole('region', { name: 'Hymns' })).toBeInTheDocument()
    expect(router.state.location.href).toBe('/practice/accompaniment?show=seven-types')
    expect(router.history.length).toBe(before)
  })

  it('opens from Practice on the page it was left on', async () => {
    const user = userEvent.setup()
    await renderApp('/practice/accompaniment?show=seven-types')
    await screen.findByRole('region', { name: 'Hymns' })
    const nav = screen.getByRole('navigation', { name: 'Main navigation' })
    await user.click(within(nav).getByRole('link', { name: 'Practice' }))
    await user.click(await screen.findByRole('link', { name: /^Accompaniment / }))
    expect(await screen.findByRole('region', { name: 'Hymns' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Боброва' })).toHaveAttribute('aria-current', 'page')
  })

  it('opens on its first page for a page the URL names that it does not have', async () => {
    await renderApp('/practice/accompaniment?show=psalms')
    expect(await screen.findByRole('region', { name: 'Studies' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Called to Play' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('makes a new pattern from its bar', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/accompaniment')
    await user.click(await screen.findByRole('link', { name: 'New pattern' }))
    expect(
      await screen.findByRole('heading', { level: 1, name: 'New pattern' }),
    ).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/practice/patterns/new')
  })

  it.each(['called-to-play', 'seven-types', 'styles', 'yours'])(
    'reads in Russian on %s, with nothing left in English',
    async (show) => {
      await renderApp(`/practice/accompaniment?show=${show}`, { locale: 'ru' })
      expect(
        await screen.findByRole('heading', { level: 1, name: 'Аккомпанемент' }),
      ).toBeInTheDocument()
      expect(
        within(screen.getByRole('navigation', { name: 'Аккомпанемент' }))
          .getAllByRole('link')
          .map((tab) => tab.textContent),
      ).toEqual(['Called to Play', 'Боброва', 'Стили', 'Свои'])
      expect(untranslated(document.body)).toEqual([])
    },
  )
})
