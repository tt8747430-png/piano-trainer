import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'
import { recordAnswer } from '@/features/record-answer'
import { recordRun } from '@/features/record-run'
import { createMemoryStorage } from '@/shared/lib'

const hrefs = (region: HTMLElement) =>
  within(region)
    .getAllByRole('link')
    .map((link) => link.getAttribute('href'))

describe('Practice', () => {
  it('opens on Chords, one topic of six, each a tab', async () => {
    await renderApp('/practice')
    expect(await screen.findByRole('heading', { level: 1, name: 'Practice' })).toBeInTheDocument()
    const tabs = within(screen.getByRole('tablist', { name: 'Topics' })).getAllByRole('tab')
    expect(tabs.map((tab) => tab.textContent)).toEqual([
      'Chords',
      'Scales and keys',
      'Ear and reading',
      'Progressions',
      'Accompaniment',
      'Technique',
    ])
    expect(screen.getByRole('tab', { name: 'Chords' })).toHaveAttribute('aria-selected', 'true')
  })

  it('shows a topic’s pages to explore, its trainers, then what it plays', async () => {
    await renderApp('/practice')
    expect(hrefs(await screen.findByRole('region', { name: 'Explore' }))).toEqual([
      '/practice/chords',
      '/practice/chord-finder',
      '/practice/tensions',
    ])
    expect(hrefs(screen.getByRole('region', { name: 'Quiz' }))).toEqual([
      '/practice/trainers/build-chord',
      '/practice/trainers/name-chord',
      '/practice/trainers/chord-role',
      '/practice/trainers/chords-by-ear',
    ])
    expect(
      within(screen.getByRole('region', { name: 'Chords in a scale' })).getByRole('link', {
        name: /^Chords by semitones /,
      }),
    ).toHaveAttribute('href', '/play/chromatic')
    expect(screen.getByRole('region', { name: 'Arpeggios' })).toBeInTheDocument()
  })

  it('changes topic from its tab, in the URL, and shows only that topic', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice')
    await user.click(await screen.findByRole('tab', { name: 'Scales and keys' }))
    await waitFor(() => expect(router.state.location.search).toEqual({ topic: 'scales' }))
    expect(hrefs(await screen.findByRole('region', { name: 'Explore' }))).toEqual([
      '/practice/scales',
    ])
    expect(screen.queryByRole('link', { name: 'Chord finder' })).not.toBeInTheDocument()
    expect(
      within(screen.getByRole('region', { name: 'Scale exercises' })).getByRole('link', {
        name: /^Scale /,
      }),
    ).toHaveAttribute('href', '/play/exercise/scale')
  })

  it('lists the studies under Accompaniment and the progressions under Progressions, each opening on Practice', async () => {
    await renderApp('/practice?topic=accompaniment')
    const studies = await screen.findByRole('region', { name: 'Studies' })
    expect(hrefs(studies)[0]).toMatch(/^\/practice\/studies\//)
    expect(hrefs(screen.getByRole('region', { name: 'Explore' }))).toEqual(['/practice/patterns'])
  })

  it('opens a progression through the keys in the progression Player', async () => {
    await renderApp('/practice?topic=progressions')
    const through = await screen.findByRole('region', { name: 'Through the keys' })
    expect(
      within(through).getByRole('link', { name: /^ii–V–I through the keys / }),
    ).toHaveAttribute('href', '/play/progression?p=ii7-V7-IMaj7&walk=fifths')
    expect(hrefs(screen.getByRole('region', { name: 'Progressions' }))[0]).toMatch(
      /^\/practice\/progressions\//,
    )
  })

  it('marks an exercise’s level and says what it trains', async () => {
    await renderApp('/practice?topic=technique')
    const harris = await screen.findByRole('region', { name: 'Barry Harris' })
    const row = within(harris).getByRole('link', { name: /^Drop-2 7ths \S/ })
    expect(row).toHaveAttribute('href', '/play/exercise/drop-two')
    expect(within(row).getByRole('img', { name: 'Level 4' })).toBeInTheDocument()
  })

  it('says how many runs a trainer has, over all its levels', async () => {
    const { progressStore } = await renderApp('/practice?topic=ear')
    await screen.findByRole('region', { name: 'Quiz' })
    act(() => {
      recordRun(progressStore, 'reading-notes:anchors', { accuracy: 90, streak: 9 })
      recordRun(progressStore, 'reading-notes:treble', { accuracy: 70, streak: 3 })
    })
    expect(screen.getByRole('link', { name: 'Reading notes Runs: 2' })).toBeInTheDocument()
  })

  it('keeps My gaps in its bar, saying how many skills it holds to check', async () => {
    const { progressStore } = await renderApp('/practice')
    const gaps = await screen.findByRole('link', { name: 'My gaps' })
    expect(gaps).toHaveAttribute('href', '/practice/trainers/gaps')
    act(() => recordAnswer(progressStore, { skill: 'chord:m7', correct: false }, new Date()))
    expect(screen.getByRole('link', { name: 'My gaps To check: 1' })).toBeInTheDocument()
  })

  it('comes back on the topic it was left on', async () => {
    const user = userEvent.setup()
    const storage = createMemoryStorage()
    const first = await renderApp('/practice', { storage })
    await user.click(await screen.findByRole('tab', { name: 'Technique' }))
    await waitFor(() => expect(first.router.state.location.search).toEqual({ topic: 'technique' }))
    first.unmount()
    const { router } = await renderApp('/songs', { storage })
    const nav = await screen.findByRole('navigation', { name: 'Main navigation' })
    await user.click(within(nav).getByRole('link', { name: 'Practice' }))
    await waitFor(() => expect(router.state.location.search).toEqual({ topic: 'technique' }))
  })

  it('reads in Russian, with nothing left in English', async () => {
    await renderApp('/practice?topic=scales', { locale: 'ru' })
    expect(await screen.findByRole('tab', { name: 'Гаммы и тональности' })).toBeInTheDocument()
    expect(untranslated(document.body)).toEqual([])
  })
})
