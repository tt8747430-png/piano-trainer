import { act, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'
import { PIECES_STORAGE_KEY, PIECES_VERSION } from '@/entities/piece'
import type { MusicView } from '@/entities/settings'
import { setScoreView } from '@/features/set-preference'
import { createMemoryStorage } from '@/shared/lib'

type User = ReturnType<typeof userEvent.setup>

/** A piece in the Player with a view of the music saved, chosen once it is open. */
async function savedAs(music: MusicView, path: string, options?: Parameters<typeof renderApp>[1]) {
  const opened = await renderApp(path, options)
  await screen.findByRole('heading', { level: 1 })
  act(() => setScoreView(opened.settingsStore, { music }))
  return opened
}

/** The music's own part of the screen, under the View's parts named as its views are. */
function musicArea(): HTMLElement {
  const area = document.querySelector<HTMLElement>('[data-area="sheet"]')
  if (!area) throw new Error('the music’s area')
  return area
}

/** The device's storage holding one own song, `my-1`, its bars of no chord symbol and its tune. */
function withSongOfNoChords(): Storage {
  const storage = createMemoryStorage()
  const song = {
    id: 'my-1',
    title: 'Morning',
    added: '2026-11-01T09:00:00.000Z',
    key: 'G',
    meter: '4/4',
    tempo: 90,
    pattern: 'r1',
    sections: [{ kind: 'verse', lines: ['_ _'] }],
    hands: { rh: 'B4/4 | D5/4', lh: 'r/4 | r/4' },
  }
  storage.setItem(
    PIECES_STORAGE_KEY,
    JSON.stringify({ state: { songs: [song], nextSong: 2 }, version: PIECES_VERSION }),
  )
  return storage
}

/** The bar's views as a pill (its canvas, PlayerDesk): Sheet · Diagrams · Grid · Lyrics. */
const viewPill = (name = 'Show the music as') =>
  within(screen.getByRole('banner')).getByRole('radiogroup', { name })

/** Opens the bar's views as a menu, the phone's, named by the view shown. */
async function openViewMenu(user: User, shown: string) {
  await user.click(await screen.findByRole('button', { name: `View: ${shown}` }))
  return screen.findByRole('menu')
}

/** Opens the Player's Settings › Score view: the view shown's own. */
async function openDisplay(user: User, settings = 'Player settings', display = 'Score view') {
  await user.click(await screen.findByRole('button', { name: settings }))
  const sheet = await screen.findByRole('dialog', { name: settings })
  await user.click(within(sheet).getByRole('button', { name: new RegExp(`^${display}`) }))
  return screen.findByRole('dialog', { name: display })
}

/** The page's groups, top down, by name. */
const groupsOf = (page: HTMLElement) =>
  within(page)
    .getAllByRole('region')
    .map((group) => group.getAttribute('aria-label'))

/** A segmented choice's segments, by name, in order. */
const segmentsOf = (choice: HTMLElement) =>
  within(choice)
    .getAllByRole('radio')
    .map((segment) => segment.getAttribute('aria-label') ?? segment.textContent)

/** The switch rows in a part of the page (R43: an on or off is a switch row) are these, in order. */
function switchesAre(part: HTMLElement, ...names: string[]) {
  const all = within(part).getAllByRole('switch')
  expect(all).toHaveLength(names.length)
  names.forEach((name, place) =>
    expect(within(part).getByRole('switch', { name })).toBe(all[place]),
  )
}

describe('the bar’s views (ADR 0108, R31-P)', () => {
  it('stands in the bar as a pill of the views, the one shown picked', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/play/silent')
    await screen.findByRole('heading', { level: 1 })
    const pill = viewPill()
    expect(segmentsOf(pill)).toEqual(['Sheet', 'Diagrams', 'Grid', 'Lyrics'])
    expect(within(pill).getByRole('radio', { name: 'Sheet' })).toBeChecked()
    await user.click(within(pill).getByRole('radio', { name: 'Diagrams' }))
    expect(settingsStore.getState().scoreView.music).toBe('diagrams')
    expect(within(musicArea()).getByRole('region', { name: 'Diagrams' })).toBeInTheDocument()
  })

  it('opens the views as a menu on a phone, named by the view shown, closed once one is picked', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/play/silent')
    const menu = await openViewMenu(user, 'Sheet')
    const items = within(menu).getAllByRole('menuitemradio')
    expect(items.map((item) => item.textContent)).toEqual(['Sheet', 'Diagrams', 'Grid', 'Lyrics'])
    expect(within(menu).getByRole('menuitemradio', { name: 'Sheet' })).toBeChecked()
    await user.click(within(menu).getByRole('menuitemradio', { name: 'Grid' }))
    expect(settingsStore.getState().scoreView.music).toBe('grid')
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'View: Grid' })).toBeInTheDocument()
  })
})

describe('while Diagrams plays (ADR 0108)', () => {
  // The score's bar, one surface holding its buttons (ADR 0115, R31-P).
  const bar = () => {
    const found = document.querySelector('header[data-area="bar"]')
    if (!found) throw new Error('bar')
    return found
  }

  it('steps the bar aside, the transport staying; a tap on the free room brings both, the next sends both aside', async () => {
    const user = userEvent.setup()
    await savedAs('diagrams', '/play/bz5')
    const transport = screen.getByRole('toolbar', { name: 'Playback' })
    const dock = transport.closest('[data-area="dock"]')
    expect(dock).toBeInTheDocument()
    await user.click(within(transport).getByRole('button', { name: 'Play' }))
    expect(bar()).toHaveAttribute('data-hidden')
    expect(bar()).toHaveAttribute('inert')
    expect(dock).not.toHaveAttribute('data-hidden')
    // A tap on the free room brings the bar back, and the next sends it aside with the transport.
    const title = screen.getByRole('heading', { level: 1 })
    await user.click(title)
    expect(bar()).not.toHaveAttribute('data-hidden')
    await user.click(title)
    expect(bar()).toHaveAttribute('data-hidden')
    expect(dock).toHaveAttribute('data-hidden')
    // Stopped (Space), everything is back.
    await user.keyboard(' ')
    expect(bar()).not.toHaveAttribute('data-hidden')
    expect(dock).not.toHaveAttribute('data-hidden')
  })

  it('keeps the bar in sight while another view plays', async () => {
    const user = userEvent.setup()
    await savedAs('grid', '/play/bz5')
    await user.click(screen.getByRole('button', { name: 'Play' }))
    expect(screen.getByRole('button', { name: 'Stop' })).toBeInTheDocument()
    expect(bar()).not.toHaveAttribute('data-hidden')
    await user.click(screen.getByRole('button', { name: 'Stop' }))
  })
})

describe('the views grey one the music cannot show (ADR 0108)', () => {
  it('greys Lyrics where the music has no words, saying why, and shows Diagrams in its place', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await savedAs('lyrics', '/play/bz5')
    expect(within(musicArea()).getByRole('region', { name: 'Diagrams' })).toBeInTheDocument()
    const pill = viewPill()
    const lyrics = within(pill).getByRole('radio', { name: 'Lyrics' })
    expect(lyrics).toHaveAttribute('data-disabled')
    expect(lyrics).toHaveAttribute('title', 'Needs words')
    expect(within(pill).getByRole('radio', { name: 'Diagrams' })).toBeChecked()
    // The phone's menu says it too.
    const menu = await openViewMenu(user, 'Diagrams')
    const item = within(menu).getByRole('menuitemradio', { name: 'Lyrics' })
    expect(item).toHaveAttribute('aria-disabled', 'true')
    expect(item).toHaveAttribute('title', 'Needs words')
    // The view saved stays, for the songs that have words.
    expect(settingsStore.getState().scoreView.music).toBe('lyrics')
  })

  it('greys the chord views where the music has no chord symbols, and shows its sheet music', async () => {
    const { settingsStore } = await savedAs('grid', '/play/my-1', {
      storage: withSongOfNoChords(),
    })
    expect(within(musicArea()).getByRole('region', { name: 'Sheet music' })).toBeInTheDocument()
    const pill = viewPill()
    for (const view of ['Lyrics', 'Diagrams', 'Grid']) {
      const segment = within(pill).getByRole('radio', { name: view })
      expect(segment).toHaveAttribute('data-disabled')
      expect(segment).toHaveAttribute('title', 'Needs chord symbols')
    }
    expect(within(pill).getByRole('radio', { name: 'Sheet' })).toBeChecked()
    expect(settingsStore.getState().scoreView.music).toBe('grid')
  })

  it('reads in Russian, its views and what a greyed one needs', async () => {
    await savedAs('lyrics', '/play/bz5', { locale: 'ru' })
    expect(screen.getByRole('button', { name: 'Вид: Схемы' })).toBeInTheDocument()
    const pill = within(screen.getByRole('banner')).getAllByRole('radiogroup')[1]
    if (!pill) throw new Error('the views’ pill')
    expect(within(pill).getByRole('radio', { name: 'Текст' })).toHaveAttribute(
      'title',
      'Нужен текст',
    )
    expect(untranslated(document.body)).toEqual([])
  })
})

describe('Settings › Score view, the view shown’s own (ADR 0108, R29)', () => {
  it('holds the sheet music’s own: its layout, then what it shows', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/play/silent')
    const page = await openDisplay(user)
    expect(groupsOf(page)).toEqual(['Sheet music'])
    const sheet = within(page).getByRole('region', { name: 'Sheet music' })
    expect(within(sheet).queryByRole('radiogroup', { name: 'Mode' })).not.toBeInTheDocument()
    switchesAre(
      within(sheet).getByRole('group', { name: 'Show' }),
      'Chord symbols',
      'Chord positions',
      'Lyrics',
      'Finger numbers',
      'Note names',
    )
    const layout = within(sheet).getByRole('radiogroup', { name: 'Layout' })
    expect(segmentsOf(layout)).toEqual(['Page view', 'Vertical scroll', 'Panorama'])
    expect(within(layout).getByRole('radio', { name: 'Vertical scroll' })).toBeChecked()
    await user.click(within(layout).getByRole('radio', { name: 'Panorama' }))
    expect(settingsStore.getState().scoreView.layout).toBe('panorama')
  })

  it('holds Diagrams’ own: its Mode, then its Lyrics, and nothing of the sheet music’s', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await savedAs('diagrams', '/play/silent')
    const page = await openDisplay(user)
    expect(groupsOf(page)).toEqual(['Diagrams'])
    const diagrams = within(page).getByRole('region', { name: 'Diagrams' })
    const mode = within(diagrams).getByRole('radiogroup', { name: 'Mode' })
    expect(segmentsOf(mode)).toEqual(['Animated', 'Summary'])
    expect(within(mode).getByRole('radio', { name: 'Animated' })).toBeChecked()
    switchesAre(diagrams, 'Lyrics')
    expect(within(page).queryByRole('radiogroup', { name: 'Layout' })).not.toBeInTheDocument()
    await user.click(within(mode).getByRole('radio', { name: 'Summary' }))
    expect(settingsStore.getState().scoreView.diagrams).toBe('summary')
    await user.click(within(diagrams).getByRole('button', { name: 'About Mode' }))
    expect(
      await screen.findByText(
        'Animated: the chord sounding and the next, moving with the music. Summary: the song’s chords all at once, the one sounding marked.',
      ),
    ).toBeInTheDocument()
  })

  it('holds Chords over lyrics’ own: its text size and its diagrams pinned', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await savedAs('lyrics', '/play/silent')
    const page = await openDisplay(user)
    expect(groupsOf(page)).toEqual(['Chords over lyrics'])
    const lyrics = within(page).getByRole('region', { name: 'Chords over lyrics' })
    switchesAre(lyrics, 'Diagrams pinned')
    await user.click(within(lyrics).getByRole('switch', { name: 'Diagrams pinned' }))
    expect(settingsStore.getState().scoreView.pinned).toBe(false)
    const size = within(lyrics).getByRole('group', { name: 'Text size' })
    expect(size).toHaveTextContent('100%')
    const larger = within(size).getByRole('button', { name: 'Larger text' })
    for (const step of [115, 130, 150]) {
      await user.click(larger)
      expect(settingsStore.getState().scoreView.textSize).toBe(step)
      expect(size).toHaveTextContent(`${step}%`)
    }
    expect(larger).toBeDisabled()
    const smaller = within(size).getByRole('button', { name: 'Smaller text' })
    for (let i = 0; i < 5; i++) await user.click(smaller)
    expect(settingsStore.getState().scoreView.textSize).toBe(80)
    expect(smaller).toBeDisabled()
    // The song's words take it, its chords with them.
    expect(document.querySelector('[data-line="0"]')?.parentElement).toHaveStyle({
      fontSize: '80%',
    })
  })

  it('holds the Grid’s own: its bars per row, and its Lyrics, the words under its beats', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await savedAs('grid', '/play/silent')
    const page = await openDisplay(user)
    const grid = within(page).getByRole('region', { name: 'Grid' })
    expect(within(grid).getByRole('radiogroup', { name: 'Bars per row' })).toBeInTheDocument()
    switchesAre(grid, 'Lyrics')
    // The music under the sheet, out of reach while it is open.
    const bar = (name: string | RegExp) =>
      within(musicArea()).getByRole('button', { name, hidden: true })
    expect(bar(/^Bar 1: C · Silent$/)).toBeInTheDocument()
    await user.click(within(grid).getByRole('switch', { name: 'Lyrics' }))
    expect(settingsStore.getState().scoreView.lyrics).toBe(false)
    expect(bar('Bar 1: C')).toBeInTheDocument()
  })

  it('greys the Lyrics of a song of no words, saying why', async () => {
    const { settingsStore } = await savedAs('grid', '/play/bz5')
    const page = await openDisplay(userEvent.setup())
    const lyrics = within(page).getByRole('switch', { name: 'Lyrics' })
    expect(lyrics).toHaveAttribute('aria-disabled', 'true')
    expect(lyrics).toHaveAccessibleDescription('The music has no words')
    act(() => setScoreView(settingsStore, { music: 'diagrams' }))
    expect(within(page).getByRole('switch', { name: 'Lyrics' })).toHaveAttribute(
      'aria-disabled',
      'true',
    )
  })

  it('reads in Russian', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await savedAs('lyrics', '/play/silent', { locale: 'ru' })
    const page = await openDisplay(user, 'Настройки плеера', 'Вид нот')
    expect(within(page).getByRole('group', { name: 'Размер текста' })).toBeInTheDocument()
    expect(untranslated(document.body)).toEqual([])
    act(() => setScoreView(settingsStore, { music: 'grid' }))
    expect(within(page).getByRole('switch', { name: 'Текст' })).toBeInTheDocument()
    act(() => setScoreView(settingsStore, { music: 'sheet' }))
    const layout = within(page).getByRole('radiogroup', { name: 'Расположение' })
    expect(segmentsOf(layout)).toEqual(['Страницы', 'Прокрутка вниз', 'Панорама'])
    expect(untranslated(document.body)).toEqual([])
  })
})
