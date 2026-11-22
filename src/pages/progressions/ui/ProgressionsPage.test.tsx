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
const escaped = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
/** A run of rows, named by its place and its count. */
const run = (name: string) =>
  screen.getByRole('region', { name: new RegExp(`^${escaped(name)}\\d+$`) })
/** The runs' names, without their counts. */
const runs = () =>
  screen.getAllByRole('heading', { level: 2 }).map((each) =>
    [...(each.querySelector('button')?.childNodes ?? [])]
      .filter((node) => node.nodeType === Node.TEXT_NODE)
      .map((node) => node.textContent)
      .join(''),
  )
const SAD = { id: 'mine-1', name: 'Sunday loop', line: 'vi-IV-I-V', minor: false }

describe('Practice → Progressions, the library (R30-4)', () => {
  it('opens on the library: each style a run of rows, each its numerals and its key, no tabs (R34)', async () => {
    await renderApp('/practice/progressions')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Progressions' }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('radiogroup', { name: 'Progressions' })).not.toBeInTheDocument()
    expect(runs().slice(0, 3)).toEqual(['Pop', 'Rock', 'Jazz'])
    const cadence = within(run('Jazz')).getByRole('link', { name: /^Jazz cadence/ })
    expect(cadence).toHaveAttribute('href', '/practice/progressions/jazz-cadence')
    expect(cadence).toHaveTextContent('ii – V – I')
    expect(cadence).toHaveTextContent('Major')
    expect(screen.getAllByRole('link', { name: /^Jazz cadence/ })).toHaveLength(1)
  })

  it('narrows to one style from Sort and filter, said as a chip that takes it off', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/progressions')
    await user.click(await screen.findByRole('button', { name: 'Sort and filter' }))
    const style = await screen.findByRole('region', { name: 'Style' })
    await user.click(within(style).getByRole('button', { name: 'Jazz' }))
    await waitFor(() => expect(router.state.location.search).toMatchObject({ place: 'jazz' }))
    await user.click(screen.getByRole('button', { name: /^Show / }))
    await waitFor(() => expect(runs()).toEqual(['Jazz']))
    await user.click(screen.getByRole('button', { name: 'Remove Jazz' }))
    await waitFor(() => expect(runs()).toContain('Pop'))
  })

  it('makes a progression a favourite from its More, first under Favourites, kept', async () => {
    const user = userEvent.setup()
    const { practiceLibraryStore } = await renderApp('/practice/progressions')
    await user.click(await screen.findByRole('button', { name: 'More for Jazz cadence' }))
    await user.click(await screen.findByRole('menuitem', { name: 'Add to Favourites' }))
    await waitFor(() => expect(runs()[0]).toBe('Favourites'))
    const favourites = run('Favourites')
    expect(within(favourites).getByRole('link', { name: /^Jazz cadence/ })).toBeInTheDocument()
    expect(practiceLibraryStore.getState().favourites.progressions).toEqual(['jazz-cadence'])
  })

  it('lists the learner’s own under Mine, last, each opening its page', async () => {
    await renderApp('/practice/progressions', {
      storage: kept({ progressions: [SAD], nextOwn: 2 }),
    })
    await screen.findByRole('heading', { level: 1, name: 'Progressions' })
    expect(runs().at(-1)).toBe('Mine')
    expect(
      within(run('Mine')).getByRole('link', {
        name: /^Sunday loop/,
      }),
    ).toHaveAttribute('href', '/practice/progressions/mine-1')
  })

  it('keeps a new progression typed from the floating New, and opens its page', async () => {
    const user = userEvent.setup()
    const { router, practiceLibraryStore } = await renderApp('/practice/progressions')
    await screen.findByRole('heading', { level: 1, name: 'Progressions' })
    await user.click(screen.getByRole('button', { name: 'New' }))
    await user.click(await screen.findByRole('button', { name: 'New progression' }))
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
      await screen.findByRole('heading', { level: 2, name: 'Sunday loop' }),
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

  it('shows a table of Name, Numerals and Key on a laptop, each style its fold', async () => {
    stubMatchMedia({ dark: true })
    await renderApp('/practice/progressions')
    const table = await screen.findByRole('table', { name: 'The library' })
    const [head] = within(table).getAllByRole('rowgroup')
    expect(
      within(head ?? table)
        .getAllByRole('columnheader')
        .map((cell) => cell.textContent),
    ).toEqual(['Name', 'Numerals', 'Key', 'Actions'])
    expect(within(table).getByRole('button', { name: /^Jazz\s*\d+$/ })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
  })
})

describe('A progression’s own page (R30-4)', () => {
  it('is made a favourite from the ♡ in its bar', async () => {
    const user = userEvent.setup()
    const { practiceLibraryStore } = await renderApp('/practice/progressions/axis')
    await user.click(await screen.findByRole('button', { name: 'Add to Favourites' }))
    expect(practiceLibraryStore.getState().favourites.progressions).toEqual(['axis'])
  })

  it('opens the Chord player on its chords', async () => {
    await renderApp('/practice/progressions/axis?key=G')
    const row = await screen.findByRole('link', { name: 'Open in the Chord player' })
    expect(row).toHaveAttribute('href', '/practice/chord-player?p=I-V-vi-IV&key=G')
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

  it('keeps its own line changed on its page, and deletes it at once, with Undo', async () => {
    const user = userEvent.setup()
    const { router, practiceLibraryStore } = await renderApp('/practice/progressions/mine-1', {
      storage: kept({ progressions: [SAD], nextOwn: 2 }),
    })
    const field = await screen.findByRole('textbox', { name: 'Numerals or chords' })
    await user.clear(field)
    await user.type(field, 'I IV')
    await waitFor(() => expect(practiceLibraryStore.getState().progressions[0]?.line).toBe('I-IV'))
    // Its More's one action stands in the bar itself.
    await user.click(screen.getByRole('button', { name: 'Delete' }))
    await waitFor(() =>
      expect(router.state.location.href).toBe('/practice/progressions?place=mine'),
    )
    expect(practiceLibraryStore.getState().progressions).toEqual([])
    expect(await screen.findByText('“Sunday loop” deleted')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Undo' }))
    expect(practiceLibraryStore.getState().progressions).toHaveLength(1)
  })

  it('is not found for a progression there is not', async () => {
    await renderApp('/practice/progressions/mine-9')
    expect(await screen.findByRole('link', { name: 'Go to Progressions' })).toBeInTheDocument()
  })
})
