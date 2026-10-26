import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'
import type { MusicView } from '@/entities/settings'
import { setScoreView } from '@/features/set-preference'

type User = ReturnType<typeof userEvent.setup>

/** The browser's print, caught: it is asked once the print render is whole. */
const catchPrint = () => {
  const print = vi.fn()
  vi.stubGlobal('print', print)
  return print
}

/** The Player open in a view of the music, More's Print chosen; the print render once printed. */
async function printed(user: User, path: string, music: MusicView, locale?: 'ru') {
  const print = catchPrint()
  const { settingsStore } = await renderApp(path, locale ? { locale } : undefined)
  await screen.findByRole('heading', { level: 1 })
  act(() => setScoreView(settingsStore, { music }))
  const more = locale ? 'Ещё' : 'More'
  await user.click(await screen.findByRole('button', { name: more }))
  await user.click(await screen.findByRole('button', { name: locale ? 'Печать' : 'Print' }))
  await waitFor(() => expect(print).toHaveBeenCalledTimes(1), { timeout: 10_000 })
  const render = document.querySelector<HTMLElement>('[data-slot="song-print"]')
  if (!render) throw new Error('no print render')
  return { render, print }
}

/** The last page's chords, each as its symbol is printed under its diagram. */
const diagramsIn = (render: HTMLElement) =>
  within(render)
    .getAllByRole('figure', { hidden: true })
    .map((figure) => figure.querySelector('figcaption')?.textContent)

describe('the Player’s Print (ADR 0107)', () => {
  it('prints the sheet music on its A4 pages, then a page of the song’s chord diagrams', async () => {
    const user = userEvent.setup()
    const { render } = await printed(user, '/play/bz5', 'sheet')
    expect(
      within(render).getByRole('heading', {
        level: 1,
        name: 'Still, my soul, be still',
        hidden: true,
      }),
    ).toBeInTheDocument()
    expect(render.querySelectorAll('[data-slot="sheet-page"]').length).toBeGreaterThan(0)
    // Every line engraved, its chord symbols over it.
    expect(render.querySelectorAll('[data-slot="score"] svg').length).toBeGreaterThan(1)
    expect(render).toHaveTextContent('Dsus4')
    expect(diagramsIn(render)).toEqual([
      'G',
      'C',
      'Em',
      'G/B',
      'C/E',
      'Dsus4',
      'D/F♯',
      'Am',
      'D7',
      'D',
    ])
  })

  it('prints the music transposed and simplified as the Player plays it', async () => {
    const user = userEvent.setup()
    const { render } = await printed(user, '/play/bz5?key=A&simple=true', 'grid')
    expect(diagramsIn(render)).toEqual(['A', 'D', 'F♯m', 'E', 'Bm'])
    expect(render).not.toHaveTextContent('/')
  })

  it('prints Chords over lyrics with its words, each section under its name', async () => {
    const user = userEvent.setup()
    const { render } = await printed(user, '/play/silent', 'lyrics')
    expect(
      within(render).getByRole('heading', { level: 1, name: 'Silent Night', hidden: true }),
    ).toBeInTheDocument()
    expect(within(render).getByRole('heading', { level: 2, name: 'Verse', hidden: true }))
    expect(render).toHaveTextContent(/Silent night, holy night,/)
    expect(render).toHaveTextContent(/All is calm,.*all is bright/)
    // A screen's controls print as words.
    expect(within(render).queryAllByRole('button', { hidden: true })).toEqual([])
    expect(diagramsIn(render)).toEqual(['C', 'G7', 'F'])
  })

  it('prints the Grid as the chart in beats, by section', async () => {
    const user = userEvent.setup()
    const { render } = await printed(user, '/play/bz5', 'grid')
    for (const heading of ['Verse', 'Chorus', 'Ending'])
      expect(
        within(render).getByRole('heading', { level: 2, name: heading, hidden: true }),
      ).toBeInTheDocument()
    expect(render).toHaveTextContent('Dsus4')
    expect(within(render).queryAllByRole('button', { hidden: true })).toEqual([])
  })

  it('prints Diagrams as the Grid does', async () => {
    const user = userEvent.setup()
    const { render } = await printed(user, '/play/bz5', 'diagrams')
    expect(
      within(render).getByRole('heading', { level: 2, name: 'Chorus', hidden: true }),
    ).toBeInTheDocument()
  })

  it('takes the print render away once the browser has printed', async () => {
    const user = userEvent.setup()
    await printed(user, '/play/bz5', 'grid')
    act(() => void window.dispatchEvent(new Event('afterprint')))
    expect(document.querySelector('[data-slot="song-print"]')).toBeNull()
  })

  it('reads in Russian', async () => {
    const user = userEvent.setup()
    const { render } = await printed(user, '/play/bz5', 'grid', 'ru')
    expect(untranslated(render)).toEqual([])
    expect(within(render).getByRole('heading', { level: 2, name: 'Аккорды', hidden: true }))
  })
})
