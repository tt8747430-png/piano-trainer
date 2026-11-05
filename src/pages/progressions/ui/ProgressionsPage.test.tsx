import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'
import { PRACTICE_LIBRARY_STORAGE_KEY, PRACTICE_LIBRARY_VERSION } from '@/entities/practice-library'
import { createMemoryStorage } from '@/shared/lib'
import { stubMatchMedia } from '@/shared/test/match-media'

const kept = (state: object) => {
  const storage = createMemoryStorage()
  storage.setItem(
    PRACTICE_LIBRARY_STORAGE_KEY,
    JSON.stringify({
      state: {
        favourites: { exercises: [], progressions: [] },
        progressions: [],
        nextOwn: 1,
        ...state,
      },
      version: PRACTICE_LIBRARY_VERSION,
    }),
  )
  return storage
}
const SAD = { id: 'mine-1', name: 'Sunday loop', line: 'vi-IV-I-V', minor: false }

describe('Practice → Progressions, the library (R30-4)', () => {
  it('opens on the library: each style a run of rows, its numerals the line, no tabs', async () => {
    await renderApp('/practice/progressions')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Progressions' }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('radiogroup', { name: 'Progressions' })).not.toBeInTheDocument()
    const jazz = screen.getByRole('region', { name: 'Jazz' })
    expect(within(jazz).getByRole('link', { name: /^Jazz cadence ii–V–I/ })).toHaveAttribute(
      'href',
      '/practice/progressions/jazz-cadence',
    )
    expect(screen.getAllByRole('link', { name: /^Jazz cadence / })).toHaveLength(1)
  })

  it('narrows to one style from its Filter, the tree’s own place', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/progressions')
    await user.click(await screen.findByRole('button', { name: 'Filters' }))
    await user.click(await screen.findByRole('button', { name: 'Jazz' }))
    await waitFor(() => expect(router.state.location.search).toMatchObject({ place: 'jazz' }))
    await user.click(screen.getByRole('button', { name: /^Show / }))
    await waitFor(() =>
      expect(screen.queryByRole('region', { name: 'Pop' })).not.toBeInTheDocument(),
    )
  })

  it('makes a progression a favourite from its More, first under Favourites, kept', async () => {
    const user = userEvent.setup()
    const { practiceLibraryStore } = await renderApp('/practice/progressions')
    await user.click(await screen.findByRole('button', { name: 'More for Jazz cadence' }))
    await user.click(await screen.findByRole('menuitem', { name: 'Add to favourites' }))
    const favourites = await screen.findByRole('region', { name: 'Favourites' })
    expect(within(favourites).getByRole('link', { name: /^Jazz cadence/ })).toBeInTheDocument()
    expect(practiceLibraryStore.getState().favourites.progressions).toEqual(['jazz-cadence'])
  })

  it('lists the learner’s own under Mine, last, each opening its page', async () => {
    await renderApp('/practice/progressions', {
      storage: kept({ progressions: [SAD], nextOwn: 2 }),
    })
    await screen.findByRole('heading', { level: 1, name: 'Progressions' })
    const headings = screen.getAllByRole('heading', { level: 2 }).map((each) => each.textContent)
    expect(headings.at(-1)).toBe('Mine')
    expect(
      within(screen.getByRole('region', { name: 'Mine' })).getByRole('link', {
        name: /^Sunday loop/,
      }),
    ).toHaveAttribute('href', '/practice/progressions/mine-1')
  })

  it('keeps a new progression typed from the floating +, and opens its page', async () => {
    const user = userEvent.setup()
    const { router, practiceLibraryStore } = await renderApp('/practice/progressions')
    await screen.findByRole('heading', { level: 1, name: 'Progressions' })
    const floating = document.querySelector<HTMLElement>('[data-slot="floating-actions"]')
    await user.click(
      within(floating ?? document.body).getByRole('button', { name: 'New progression' }),
    )
    const sheet = await screen.findByRole('dialog', { name: 'New progression' })
    await user.type(within(sheet).getByRole('textbox', { name: 'Name' }), 'Sunday loop')
    const field = within(sheet).getByRole('textbox', { name: 'Numerals or chords' })
    await user.clear(field)
    await user.type(field, 'Am F C G')
    await user.click(within(sheet).getByRole('button', { name: 'Keep progression' }))
    await waitFor(() =>
      expect(router.state.location.pathname).toBe('/practice/progressions/mine-1'),
    )
    expect(practiceLibraryStore.getState().progressions).toEqual([
      { id: 'mine-1', name: 'Sunday loop', line: 'vi-IV-I-V', minor: false },
    ])
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Sunday loop' }),
    ).toBeInTheDocument()
  })

  it('says what Mine keeps before the learner keeps one', async () => {
    await renderApp('/practice/progressions?place=mine')
    expect(await screen.findByText('Progressions you keep are here.')).toBeInTheDocument()
  })

  it('reads in Russian, with nothing left in English', async () => {
    await renderApp('/practice/progressions', { locale: 'ru' })
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Последовательности' }),
    ).toBeInTheDocument()
    // A song's title is its own in both languages: Yesterday is Yesterday.
    expect(untranslated(document.body).filter((text) => text !== 'Yesterday')).toEqual([])
  })

  it('shows the styles in the tree on a laptop, and a table of Name, Style and Numerals', async () => {
    stubMatchMedia({ dark: true })
    await renderApp('/practice/progressions')
    const tree = await screen.findByRole('navigation', { name: 'Progressions by style' })
    expect(within(tree).getByRole('button', { name: /^Jazz\s*\d+$/ })).toBeInTheDocument()
    expect(
      within(screen.getByRole('table'))
        .getAllByRole('columnheader')
        .map((cell) => cell.textContent),
    ).toEqual(['Name', 'Style', 'Numerals', 'Actions'])
  })
})

describe('A progression’s own page (R30-4)', () => {
  it('is made a favourite from the ♡ in its bar', async () => {
    const user = userEvent.setup()
    const { practiceLibraryStore } = await renderApp('/practice/progressions/axis')
    await user.click(await screen.findByRole('button', { name: 'Add to favourites' }))
    expect(practiceLibraryStore.getState().favourites.progressions).toEqual(['axis'])
  })

  it('opens the Chord player on its chords', async () => {
    await renderApp('/practice/progressions/axis?key=G')
    const row = await screen.findByRole('link', { name: /^Play it in the Chord player/ })
    expect(row.getAttribute('href')).toMatch(/^\/practice\/chord-player\?/)
    expect(decodeURIComponent(row.getAttribute('href') ?? '')).toMatch(/key=G/)
  })

  it('keeps a line typed in Mine from its bar', async () => {
    const user = userEvent.setup()
    const { router, practiceLibraryStore } = await renderApp('/practice/progressions/line?p=I-I-IV')
    await user.click(await screen.findByRole('button', { name: 'Keep in Mine' }))
    const sheet = await screen.findByRole('dialog', { name: 'New progression' })
    await user.type(within(sheet).getByRole('textbox', { name: 'Name' }), 'Mine')
    await user.click(within(sheet).getByRole('button', { name: 'Keep progression' }))
    await waitFor(() =>
      expect(router.state.location.pathname).toBe('/practice/progressions/mine-1'),
    )
    expect(practiceLibraryStore.getState().progressions[0]).toMatchObject({ line: 'I-I-IV' })
  })

  it('keeps its own line changed on its page, and deletes it, asked first', async () => {
    const user = userEvent.setup()
    const { router, practiceLibraryStore } = await renderApp('/practice/progressions/mine-1', {
      storage: kept({ progressions: [SAD], nextOwn: 2 }),
    })
    const field = await screen.findByRole('textbox', { name: 'Numerals or chords' })
    await user.clear(field)
    await user.type(field, 'I IV')
    await waitFor(() => expect(practiceLibraryStore.getState().progressions[0]?.line).toBe('I-IV'))
    await user.click(screen.getByRole('button', { name: 'More' }))
    await user.click(await screen.findByRole('menuitem', { name: 'Delete' }))
    await user.click(await screen.findByRole('button', { name: 'Delete' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/practice/progressions'))
    expect(practiceLibraryStore.getState().progressions).toEqual([])
  })

  it('is not found for a progression there is not', async () => {
    await renderApp('/practice/progressions/mine-9')
    expect(await screen.findByRole('link', { name: 'Go to Progressions' })).toBeInTheDocument()
  })
})
